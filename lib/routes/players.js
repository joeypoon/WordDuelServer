import { Player } from '../models/index';

export const players = {
  get: (req, res) => {
    const playerId = req.params.player_id;

    return Player.findById(playerId, (err, player) => {
      if (err)
        res.send(err);
      res.json(player);
    });
  },

  post: (req, res) => {
    const player = new Player({
      name: req.name,
      image: req.image,
    });

    return player.save((err) => {
      if (err) {
        res.send(err);
      }

      res.json({ id: player._id });
    });
  },

  put: (req, res) => {
    const playerId = req.params.player_id;
    const player = Player.findById(playerId, (err, player) => {
      if (err)
        res.send(err);
      res.json({ opponent: player.searchForOpponent() });
    });
  },
};
