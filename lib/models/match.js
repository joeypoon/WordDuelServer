import mongoose, { Schema } from 'mongoose';

const MatchSchema = new Schema({
  playerOne: String,
  playerTwo: String,
  roundIds: { type: Array, default: [] },
});

MatchSchema.methods = {
  submitWord(playerId, word) {
    // TODO validate and add word to current round
    console.log(word);
  },
};

export const Match = mongoose.model('Match', MatchSchema);
