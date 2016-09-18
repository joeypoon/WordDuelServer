import { Word } from '../models/index';

export const validateWord = {
  // TODO: figure out how to handle plural words  (RegEx? <shudder>)
  post: (req, res) => {
    const word = req.params.word.toUpperCase();

    return Word.findOne({ word }, (err, validWord) => {
      if (err) {
        res.send(err);
      }

      let valid = true;

      if (!validWord) {
        valid = false;
      }

      res.json({ word, valid });
    });
  },
};
