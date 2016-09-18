import {
  DictionaryWord,
} from '../models/index';

const validateWord = {
  post: (req, res) => {
    const word = req.params.word.toUpperCase();

    return DictionaryWord.find({ word }, (err, validWord) => {
      if (err) {
        res.send(err);
      }

      console.log(err || validWord);
      res.json({ word });
    });
  },
};

export default validateWord;
