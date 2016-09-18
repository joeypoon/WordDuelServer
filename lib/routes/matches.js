import { Match } from '../models/index';

export const matches = {
  post: (req, res) => {
    const match = new Match();

    return match.save((err) => {
      if (err) {
        res.send(err);
      }

      res.json({ id: match._id });
    });
  },
};
