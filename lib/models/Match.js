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

// player object:
// {
//   facebookId: String,
//   words: Array,
// }

const MatchSchema = new Schema({
  players: { type: Array, default: [] },
  round: { type: Number, default: 1 },
  timestamp: Number,
  currentGrid: Array,
});

MatchSchema.methods = {
  generateGrid() {
    const grid = [];

    while (grid.length < gridSize) {
      grid.push(getRandomLetter());
    }

    this.currentGrid = grid;
  },

  updateRoundAndTime(res) {
    this.round += 1;
    this.timestamp = Date.now();

    this.save((err) => {
      if (err) return res.send(err);

      return res.json({
        matchId: this._id,
        round: this.round,
        timestamp: this.timestamp,
      });
    });
  },

  submitWord(playerId, word) {
    // TODO validate and add word to current round
    console.log(word);
  },
};

export const Match = mongoose.model('Match', MatchSchema);
