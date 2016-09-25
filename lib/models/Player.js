import mongoose, { Schema } from 'mongoose';

const PlayerSchema = new Schema({
  name: { type: String, default: '' },
  image: { type: String, default: '' },
  experience: { type: Number, default: 0 },
  isSearching: { type: Boolean, default: false },
  isReady: { type: Boolean, default: false },
  lastWord: { type: String, default: '' },
});

PlayerSchema.methods = {
  level() {
    // TODO calculate level from experience
    return 99;
  },

  searchForOpponent() {
    this.isSearching = true;
    let opponent = null;
    let timeoutCount = 0;
    while (!opponent && timeoutCount < 5 ) {
      setTimeout(() => {
        opponent = this.model('Player').find({
          _id: { $ne: this._id },
          isSearching: true,
        });
        timeoutCount++;
      }, 1000);
    }
    this.isSearching = false;
    opponent.isSearching = false;
    return opponent;
  },
};

export const Player = mongoose.model('Player', PlayerSchema);
