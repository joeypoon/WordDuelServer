import mongoose, { Schema } from 'mongoose';

export const DefinitionSchema = new Schema({
    type: String,
    definition: String,
    example: String
});

DefinitionSchema.statics = {
    fromJSON(json) {
        return new Definition({
            type: json.type,
            definition: json.defenition,
            example: json.example
        });;
    }
};

export const Definition = mongoose.model('Definition', DefinitionSchema);