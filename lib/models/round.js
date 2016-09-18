import mongoose, { Schema } from 'mongoose';

const RoundSchema = new Schema({
  matchId: String,
  words: Array,
});

export const Round = mongoose.model('Round', RoundSchema);
