import mongoose, { Schema } from 'mongoose';

const RoundSchema = new Schema({
  playerOneWord: String,
  playerTwoWord: String,
  startTime: Number
});

export const Round = mongoose.model('Round', RoundSchema);
