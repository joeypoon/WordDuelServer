import mongoose, { Schema } from 'mongoose';

import { events } from '../constants';
import { io } from '../server';

const MatchSchema = new Schema({
    playerFacebookIds: [String],
    state: { type: String, default: 'searching' },
    challenge: { type: Boolean, default: false }
});

MatchSchema.statics = {
    findOpenOrCreate(facebookId, socket) {
        return this.searchForOpen()
            .then(matches => {
                if (matches.length) {
                    return this.enterNextOpenMatch(matches, facebookId, socket);
                } else {
                    return this.create({ playerFacebookIds: [ facebookId ] })
                        .then(match => socket.join(match._id));
                }
            });
    },

    searchForOpen() {
        return this.where({ state: 'searching', challenge: false });
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

    startRound() {
        this.playState();
    },

    playState() {
        this.state = 'playing';
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
    }
};

export const Match = mongoose.model('Match', MatchSchema);
