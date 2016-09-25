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

    Player.find({ facebookId }, (err, player) => {
      if (err) return res.send(err);

      return player.searchForOpponent(res);
    });
  },
};
