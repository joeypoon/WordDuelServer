import { Player } from '../models/index';

export const players = {
  get: (req, res) => {
    const playerId = req.params.player_id;

    return Player.findById(playerId, (err, player) => {
      if (err) {
        res.send(err);
      }

      res.json(player);
    });
  },
  post: (req, res) => {
    // naive players post
    const player = new Player({
      name: 'Martin',
      experience: 1,
      image: 'add later',
      isSearching: false,
    });

    return player.save((err) => {
      if (err) {
        res.send(err);
      }

      res.json({ id: player._id });
    });
  },
};
