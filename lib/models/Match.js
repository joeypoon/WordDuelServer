import mongoose, { Schema } from 'mongoose';

import { events } from '../constants';
import { io } from '../server';

const alphabet = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g',
    'h', 'i', 'j', 'k', 'l', 'm', 'n',
    'o', 'p', 'q', 'r', 's', 't', 'u',
    'v', 'w', 'x', 'y', 'z',
];

const gridSize = 20;

function getRandomLetter() {
    return alphabet[Math.floor(Math.random() * alphabet.length)];
}

const MatchSchema = new Schema({
    currentGrid: [String],
    state: { type: String, default: 'searching' }
});

MatchSchema.statics = {
    generateGrid() {
        const grid = [];
        while (grid.length < gridSize) {
            grid.push(getRandomLetter());
        }
        return grid;
    },

    findOpenOrCreate(facebookId, socket) {
        return this.searchForOpen(facebookId)
            .then(matches => {
                if (matches.length) {
                    return this.enterNextOpenMatch(matches, facebookId, socket);
                } else {
                    return this.create({ playerFacebookIds: [ facebookId ] })
                        .then(match => socket.join(match._id));
                }
            });
    },

    searchForOpen(facebookId) {
        return this.where({ state: 'searching' });
    },

    enterNextOpenMatch(matches, facebookId, socket) {
        for (let match of matches) {
            if (!match.isFull())
                return match.joinMatch(facebookId, socket);
        }
    },

    cancelSearch(facebookId) {
        return this.where({ state: 'searching', playerFacebookIds: { $in: [facebookId] } })
            .then(matches => matches.forEach(match => match.leave(facebookId)));
    },

    playerDisconnect(facebookId) {
        return this.where({ state: { $ne: 'ended' }, playerFacebookIds: { $in: [facebookId] } })
            .then(matches => {
                matches.forEach(match => {
                    if (match) return match.disconnect();
                });
            });
    }
};

MatchSchema.methods = {
    isFull() {
        return this.playerFacebookIds.length >= 2;
    },

    joinMatch(facebookId, socket) {
        this.playerFacebookIds = this.playerFacebookIds.concat(facebookId);
        if (this.isFull()) this.state = 'ready';
        this.save().then(match => {
            const playersPromise = this.getPlayers();
            const matchId = match._id;
            socket.join(matchId);
            if (this.isFull())
                playersPromise.then(players => {
                    io.to(matchId).emit(events.players.found, { matchId, players });
                });
        });
    },

    getPlayers() {
        return this.model('Player')
            .find({ facebookId: { $in: this.playerFacebookIds } });
    },

    setReady() {
        this.readyCount = this.readyCount + 1;
        if (this.readyCount > 1) this.startRound();
        return this.save();
    },

    resetReady() {
        this.readyCount = 0;
        return this.save();
    },

    startRound() {
        const promises = [
            this.resetReady(),
            this.playState(),
            this.createGrid()
        ];
        Promise.all(promises).then(() => {
            const grid = this.currentGrid;
            io.to(this._id).emit(events.matches.grid.new, grid);
            // io.to(this._id).emit(events.players.ready);
        });
    },

    playState() {
        this.state = 'playing';
        return this.save();
    },

    createGrid() {
        this.currentGrid = this.model('Match').generateGrid();
        return this.save();
    },

    leave(facebookId) {
        this.playerFacebookIds = this.playerFacebookIds.filter(fbId => fbId !== facebookId);
        return this.save();
    },

    end() {
        this.state = 'ended';
        return this.save();
    },

    disconnect() {
        io.to(this._id).emit(events.matches.disconnect);
        return this.end();
    },

    submitWord(word) {
        this.words = this.words.concat(word);
        return this.save().then(match => {
            if (match.words.length > 1) {
                io.to(match._id).emit(events.words.submit, match.words);
                return match.resetWords();
            }
        });
    },

    resetWords() {
        this.words = [];
        return this.save();
    }
};

export const Match = mongoose.model('Match', MatchSchema);
