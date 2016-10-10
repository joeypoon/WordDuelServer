import mongoose, { Schema } from 'mongoose';

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
  playerIds: [Schema.Types.ObjectId],
  round: { type: Number, default: 1 },
  timestamp: Number,
  currentGrid: [String],
});

MatchSchema.statics = {
  startMatch(players) {
    const playerIds = players.map(player => player._id);
    const match = this.create({ playerIds });
    match.then(m => players.forEach(player => player.setMatch(m._id)));
    return match;
  }
};

MatchSchema.methods = {
  endMatch() {
    this.playerIds.forEach(id => {
      this.model('Player').findById(id)
        .then(player => player.removeMatch());
    });
  },

  startRound() {
    return this.generateGrid();
  },

  generateGrid() {
    const grid = [];

    while (grid.length < gridSize) {
      grid.push(getRandomLetter());
    }

    this.currentGrid = grid;
    return this.save();
  },

  // updateRoundAndTime(res) {
  //   this.round += 1;
  //   this.timestamp = Date.now();

  //   this.save((err) => {
  //     if (err) return res.send(err);

  //     return res.json({
  //       matchId: this._id,
  //       round: this.round,
  //       timestamp: this.timestamp,
  //     });
  //   });
  // },

  // submitWord(playerId, word) {
  //   // TODO validate and add word to current round
  //   console.log(word);
  // },
};

export const Match = mongoose.model('Match', MatchSchema);
