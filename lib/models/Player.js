import mongoose, { Schema } from 'mongoose';

const PlayerSchema = new Schema({
    facebookId: { type: String, required: true, unique: true },
    name: { type: String, default: '' },
    image: { type: String, default: '' },
    experience: { type: Number, default: 0 },
    matchId: Schema.Types.ObjectId
});

PlayerSchema.statics = {
    findOrCreate(params) {
        const { facebookId } = params;
        return this.findOne({ facebookId })
            .then(player => {
                if (player) return player;
                return this.create(params)
                    .then(player => player);
            });
    },

    setReady(facebookId, isReady) {
        return this.findOne({ facebookId }).then(player => {
            player.isReady = isReady;
            return player.save();
        });
    }
};

PlayerSchema.methods = {
    update(params) {
        const { name, image, experience } = params;
        this.name = name;
        this.image = image;
        this.experience = experience;
        return this.save();
    },

    // level() {
    //     // TODO calculate level from experience
    //     return 99;
    // },

    // opponent() {
    //     return this.model('Match').findById(this.matchId)
    //         .then(match => match.playerIds.filter(id => id !== this._id)[0], err => err)
    //         .then(opponentId => this.model('Player').findById(opponentId), err => err);
    // },

    // opponentIsReady() {
    //     return this.opponent().then(opponent => opponent.isReady);
    // },

    // checkOpponentReadyState() {
    //     return this.opponentIsReady().then(ready => {
    //         if (ready) return ready;
    //         return setTimeout(this.checkOpponentReadyState(), searchGap);
    //     });
    // }

    // searchForOpponent() {
    //     this.isSearching = true;
    //     return this.save()
    //         .then(player => player.findOpponent(), err => err)
    //         .then(opponent => opponent, err => err);
    // },

    // findOpponent() {
    //     return this.model('Player')
    //         .where({ _id: { $ne: this._id }, isSearching: true })
    //         .then(players => {
    //             if (players.length) return players[0];
    //             return null;
    //         }, err => err);
    // }
};

export const Player = mongoose.model('Player', PlayerSchema);
