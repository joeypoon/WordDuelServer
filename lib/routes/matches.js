import {
  Match,
} from '../models/index';

const matches = {
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

export default matches;
