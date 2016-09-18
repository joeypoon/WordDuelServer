import {
  Player,
} from '../models/index';

const players = {
  get: (req, res) => {
    return Player.findById(req.params.player_id, (err, player) => {
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
      level: 1,
      image: 'add later',
      isSearching: false,
      currentMatch: 'add id',
    });

    return player.save((err) => {
      if (err) {
        res.send(err);
      }

      res.json({ id: player._id });
    });
  },
};

export default players;
