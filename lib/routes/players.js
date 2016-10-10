import {
  Player,
  Match
} from '../models/index';

function opponentFoundParams(opponent, matchId) {
  return {
    name: opponent.name,
    image: opponent.image,
    matchId
  };
}

export const players = {
  post(req, res) {
    const { facebookId, name, image } = req.body;

    Player.findOne({ facebookId }, (err, player) => {
      if (err) res.send(err);

      if (player) res.json(player);

      Player.create({ facebookId, name, image })
        .then(newPlayer => res.json(newPlayer),
          err => res.send(err));
    });
  },

  getOpponent(req, res) {
    const { facebookId, isSearch } = req.body;
    Player.findOne({ facebookId })
      .then(player => {
        if (player.matchId) {
          player.opponent().then(opponent => {
            res.json(opponentFoundParams(opponent, player.matchId));
          }, err => res.send(err));
        } else {
          player.searchForOpponent()
            .then(opponent => {
              if (opponent) {
                Match.startMatch([player, opponent])
                  .then(match => {
                    res.json(opponentFoundParams(opponent, match._id));
                  }, err => res.send(err));
              } else {
                res.send("No opponent found.")
              }
            }, err => res.send(err));
        }
      }, err => res.send(err));
  },

  ready(req, res) {
    const { facebookId } = req.body;
    Player.setReady(facebookId, true)
      .then(player => player.checkOpponentReadyState()
        .then(ready => res.json({ isReady: ready })
        , err => res.send(err))
      , err => res.send(err));
  },
};
