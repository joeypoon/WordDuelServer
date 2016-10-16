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
    playerFacebookIds: [String],
    round: { type: Number, default: 1 },
    currentGrid: [String],
    open: { type: Boolean, default: true }
});

MatchSchema.statics = {
    startMatch(players) {
        const playerIds = players.map(player => player._id);
        const match = this.create({ playerIds });
        match.then(m => players.forEach(player => player.setMatch(m._id)));
        return match;
    },

    generateGrid() {
        const grid = [];
        while (grid.length < gridSize) {
            grid.push(getRandomLetter());
        }
        return grid;
    },

    findOpenOrCreate(facebookId, socket) {
        return this.searchForOpen()
            .then(matches => {
                if (matches.length) {
                    return this.enterNextOpenMatch(matches, facebookId, socket);
                } else {
                    return this.create({ playerFacebookIds: [ facebookId ] });
                }
            });
    },

    searchForOpen() {
        return this.where({ open: true });
    },

    enterNextOpenMatch(matches, facebookId, socket) {
        for (let match of matches) {
            if (!match.isFull())
                return match.joinMatch(facebookId, socket);
        }
    }
};

MatchSchema.methods = {
    isFull() {
        return this.playerFacebookIds.length >= 2;
    },

    joinMatch(facebookId, socket) {
        this.playerFacebookIds = this.playerFacebookIds.concat(facebookId);
        if (this.isFull()) this.open = false;
        this.save().then(match => {
            const playersPromise = this.getPlayers();
            socket.join(match._id);
            if (this.isFull())
                playersPromise.then(players => {
                    io.to(match._id).emit(events.players.found, { players });
                });
        });
    },

    getPlayers() {
        return this.model('Player')
            .find({ facebookId: { $in: this.playerFacebookIds } });
    },

    endMatch() {
        this.playerIds.forEach(id => {
            this.model('Player').findById(id)
                .then(player => player.removeMatch());
        });
    },

    startRound() {
        return this.createGrid();
    },

    createGrid() {
        this.currentGrid = this.model('Match').generateGrid();
        return this.save();
    }
};

export const Match = mongoose.model('Match', MatchSchema);
