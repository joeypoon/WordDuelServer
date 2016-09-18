import mongoose, { Schema } from 'mongoose';

const MatchSchema = new Schema({
    players: Array,
    isOver: { type: String, default: false }
});

export const Match = mongoose.model('Match', MatchSchema);