import mongoose, { Schema } from 'mongoose';

const PlayerSchema = new Schema({
  facebookId: { type: String, required: true, unique: true },
  name: { type: String, default: '' },
  image: { type: String, default: '' },
  experience: { type: Number, default: 0 },
  isSearching: { type: Boolean, default: false },
  isReady: { type: Boolean, default: false },
});

PlayerSchema.methods = {
  level() {
    // TODO calculate level from experience
    return 99;
  },

  searchForOpponent(res) {
    // TODO handle db save errors?
    this.isSearching = true;
    this.save();

    let opponent = null;
    let timeoutCount = 0;

    const findOpponent = () => {
      opponent = this.model('Player').find(
        {
          _id: { $ne: this._id },
          isSearching: true,
        },
        {
          facebookId: 0,
        }
      );

      timeoutCount++;
    };

    // TODO add env file to set timers
    while (!opponent && timeoutCount < 30) {
      setTimeout(findOpponent(), 1000);
    }

    this.isSearching = false;
    this.save();

    if (opponent) {
      opponent.isSearching = false;
      opponent.save();

      return res.json({ opponent });
    }

    return res.json({ message: 'Unable to find an opponent.' });
  },
};

export const Player = mongoose.model('Player', PlayerSchema);
