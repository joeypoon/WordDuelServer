import mongoose, { Schema } from 'mongoose';

const WordSchema = new Schema({
  word: String,
  definition: String,
});

WordSchema.statics = {
  isValid(word) {
    return !!this.find({ word });
  },
};

export const Word = mongoose.model('Word', WordSchema);
