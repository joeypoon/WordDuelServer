import { Player } from '../models/index';

export const players = {
  post: (req, res) => {
    const facebookId = req.params.playerId;
    const { name, image } = req.body;

    Player.find({ facebookId }, (err, player) => {
      if (err) return res.send(err);

      if (player) {
        return res.json({ player });
      }

      const newPlayer = new Player({
        facebookId,
        name,
        image,
      });

      return newPlayer.save((error) => {
        if (error) return res.send(error);

        return res.json({ player: newPlayer });
      });
    });
  },

  put: (req, res) => {
    const facebookId = req.params.playerId;
    const { isSearch, isReadyCheck } = req.body;

    if (isSearch) {
      Player.find({ facebookId }, (err, player) => {
        if (err) return res.send(err);

        return player.searchForOpponent(res);
      });
    }

    if (isReadyCheck) {
      Player.find({ facebookId }, (err, player) => {
        if (err) return res.send(err);

        return player.searchForOpponent(req.body, res);
      });
    }

    return res.json({ message: 'Please specify a valid player operation.' });
  },
};
