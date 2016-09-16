import mongoose, { Schema } from 'mongoose';

const MatchSchema = new Schema({
    isOver: { type: String, default: false }
});

export const Match = mongoose.model('Match', MatchSchema);