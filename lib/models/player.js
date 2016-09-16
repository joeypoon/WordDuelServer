import { Schema } from 'mongoose';

const PlayerSchema = new Schema({
    name: String
});

export const = mongoose.model('Player', PlayerSchema);