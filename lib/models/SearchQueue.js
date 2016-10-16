import mongoose, { Schema } from 'mongoose';

const SearchQueueSchema = Schema.new({
    queue: { type: Array, default: [] }
});

export const SearchQueue = mongoose.model('SearchQueue', SearchQueueSchema);