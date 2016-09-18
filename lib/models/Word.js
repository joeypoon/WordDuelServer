import mongoose, { Schema } from 'mongoose';

const WordSchema = new Schema({
  word: String,
  definition: String,
});

export const Word = mongoose.model('Word', WordSchema);
