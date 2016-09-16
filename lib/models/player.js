import mongoose, { Schema } from 'mongoose';

const PlayerSchema = new Schema({
    name: String,
    level: Number,
    image: String
});

export const Player = mongoose.model('Player', PlayerSchema);