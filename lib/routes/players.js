import { Player } from '../models/index';

export const players = {
  post: (req, res) => {
    const { facebookId, name, image } = req.body;

    Player.findOne({ facebookId }, (err, player) => {
      if (err) res.send(err);

      if (player) res.json(player);

      Player.create({ facebookId, name, image })
        .then(newPlayer => res.json(newPlayer),
          err => res.send(err));
    });
  },

  getOpponent: (req, res) => {
    const { facebookId, isSearch, isReadyCheck } = req.body;

    if (isSearch) {
      Player.findOne({ facebookId })
        .then(player => player.searchForOpponent(), err => res.send(err))
        .then(opponent => res.json(opponent), err => res.send(err));
    }

  //   if (isReadyCheck) {
  //     Player.find({ facebookId }, (err, player) => {
  //       if (err) return res.send(err);

  //       return player.searchForOpponent(req.body, res);
  //     });
  //   }

  //   return res.status(400).send('Please specify a valid player operation.');
  },
};
