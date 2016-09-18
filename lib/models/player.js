import mongoose, { Schema } from 'mongoose';

const PlayerSchema = new Schema({
    name: String,
    experience: Number,
    image: String,
    isSearching: Boolean
});

PlayerSchema.methods.level = function () {
    // TODO calculate level from experience
    return 99;
}

export const Player = mongoose.model('Player', PlayerSchema);