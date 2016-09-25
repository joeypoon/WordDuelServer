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
  players: { type: Array, default: [] },
  lastTimestamp: Number,
  currentGrid: Array,
});

MatchSchema.methods = {
  submitWord(playerId, word) {
    // TODO validate and add word to current round
    console.log(word);
  },

  generateGrid() {
    grid = [];
    while (grid.length < gridSize)
      grid.push(getRandomLetter());
    this.currentGrid = grid;
  },
};

export const Match = mongoose.model('Match', MatchSchema);
