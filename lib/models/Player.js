import mongoose, { Schema } from 'mongoose';
import { Match } from './index';

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
      opponent = this.model('Player').find({
        _id: { $ne: this._id },
        isSearching: true,
      });

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

  setReadyAndWaitForOpponent(params, res) {
    const { opponentId, matchId } = params;

    this.isReady = true;
    this.save();

    let opponent = null;
    let timeoutCount = 0;

    const checkIfOpponentIsReady = () => {
      opponent = this.model('Player').find({
        facebookId: opponentId,
        isReady: true,
      });

      timeoutCount++;
    };

    // TODO add env file to set timers
    while (!opponent && timeoutCount < 10) {
      setTimeout(checkIfOpponentIsReady(), 1000);
    }

    this.isReady = false;
    this.save();

    if (opponent) {
      opponent.isReady = false;
      opponent.save();

      if (matchId) {
        Match.findById(matchId, (err, match) => {
          if (match.round < 10) {
            return match.updateRoundAndTime(res);
          }

          // TODO get words using id not [0]
          return res.json({
            message: 'The match is over.',
            playerOneWords: match.players[0].words,
            playerTwoWords: match.players[1].words,
            player: this,
            opponent,
          });
        });
      } else {
        const newMatch = new Match({
          players: [
            {
              playerId: this.facebookId,
              words: [],
            },
            {
              playerId: opponent.facebookId,
              words: [],
            },
          ],
          timestamp: Date.now(),
        });

        return newMatch.save((err, match) => {
          if (err) return res.send(err);

          return res.json({
            matchId: match._id,
            round: match.round,
            timestamp: match.timestamp,
          });
        });
      }
    }

    return res.json({ message: 'Your opponent never readied.' });
  },
};

export const Player = mongoose.model('Player', PlayerSchema);
