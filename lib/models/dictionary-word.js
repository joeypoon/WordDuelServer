import mongoose, { Schema } from 'mongoose';

const DictionaryWordSchema = new Schema({
  word: String,
  definition: String,
});

export const DictionaryWord = mongoose.model('DictionaryWord', DictionaryWordSchema);
