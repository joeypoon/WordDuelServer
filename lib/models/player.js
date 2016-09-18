import mongoose, { Schema } from 'mongoose';

const PlayerSchema = new Schema({
  name: { type: String, default: '' },
  experience: { type: Number, default: 0 },
  image: { type: String, default: '' },
  isSearching: { type: Boolean, default: false },
  isReady: { type: Boolean, default: false },
});

PlayerSchema.methods.level = function () {
  // TODO calculate level from experience
  return 99;
};

export const Player = mongoose.model('Player', PlayerSchema);
