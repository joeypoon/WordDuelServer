import mongoose, { Schema } from 'mongoose';

const searchGap = 10000; // 10 seconds

const PlayerSchema = new Schema({
  facebookId: { type: String, required: true, unique: true },
  name: { type: String, default: '' },
  image: { type: String, default: '' },
  experience: { type: Number, default: 0 },
  isSearching: { type: Boolean, default: false },
  isReady: { type: Boolean, default: false },
  matchId: Schema.Types.ObjectId,
  opponentId: Schema.Types.ObjectId
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
    const { name, image } = params;
    this.name = name;
    this.image = image;
    return this.save();
  },

  level() {
    // TODO calculate level from experience
    return 99;
  },

  opponent() {
    return this.model('Match').findById(this.matchId)
      .then(match => match.playerIds.filter(id => id !== this._id)[0], err => err)
      .then(opponentId => this.model('Player').findById(opponentId), err => err);
  },

  opponentIsReady() {
    return this.opponent().then(opponent => opponent.isReady);
  },

  checkOpponentReadyState() {
    return this.opponentIsReady().then(ready => {
      if (ready) return ready;
      return setTimeout(this.checkOpponentReadyState(), searchGap);
    });
  },

  searchForOpponent() {
    this.isSearching = true;
    return this.save()
      .then(player => player.findOpponent(), err => err)
      .then(opponent => opponent, err => err);
  },

  findOpponent() {
    return this.model('Player')
      .where({ _id: { $ne: this._id }, isSearching: true })
      .then(players => {
        if (players.length) return players[0];
        return null;
      }, err => err);
  },

  setMatch(matchId) {
    this.matchId = matchId;
    this.isSearching = false;
    this.isReady = false;
    this.save();
  },

  removeMatch() {
    this.matchId = null;
    this.save();
  },

  // setReadyAndWaitForOpponent(params, res) {
  //   const { opponentId, matchId } = params;

  //   this.isReady = true;
  //   this.save();

  //   let opponent = null;
  //   let timeoutCount = 0;

  //   const checkIfOpponentIsReady = () => {
  //     opponent = this.model('Player').find({
  //       facebookId: opponentId,
  //       isReady: true,
  //     });

  //     timeoutCount++;
  //   };

  //   // TODO add env file to set timers
  //   while (!opponent && timeoutCount < 10) {
  //     setTimeout(checkIfOpponentIsReady(), 1000);
  //   }

  //   this.isReady = false;
  //   this.save();

  //   if (opponent) {
  //     opponent.isReady = false;
  //     opponent.save();

  //     if (matchId) {
  //       Match.findById(matchId, (err, match) => {
  //         if (match.round < 10) {
  //           return match.updateRoundAndTime(res);
  //         }

  //         // TODO get words using id not [0]
  //         return res.json({
  //           message: 'The match is over.',
  //           playerOneWords: match.players[0].words,
  //           playerTwoWords: match.players[1].words,
  //           player: this,
  //           opponent,
  //         });
  //       });
  //     } else {
  //       const newMatch = new Match({
  //         players: [
  //           {
  //             playerId: this.facebookId,
  //             words: [],
  //           },
  //           {
  //             playerId: opponent.facebookId,
  //             words: [],
  //           },
  //         ],
  //         timestamp: Date.now(),
  //       });

  //       return newMatch.save((err, match) => {
  //         if (err) return res.send(err);

  //         return res.json({
  //           matchId: match._id,
  //           round: match.round,
  //           timestamp: match.timestamp,
  //         });
  //       });
  //     }
  //   }

  //   return res.json({ message: 'Your opponent never readied.' });
  // },
};

export const Player = mongoose.model('Player', PlayerSchema);
