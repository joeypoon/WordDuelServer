import mongoose, { Schema } from 'mongoose';
import * as OBD from 'owlbot-dictionary';

import { Definition, DefinitionSchema } from './Definition';

const WordSchema = new Schema({
    word: { type: String, required: true, unique: true },
    definitions: [ DefinitionSchema ]
});

WordSchema.statics = {
    define(word) {
        return this.findOne({ word }).then(w => {
            if (w) return w;
            return this.defineOrCreate(word);
        });
    },

    defineOrCreate(word) {
        return OBD.define(word).then(definitions => {
            if (definitions.length) {
                const defs = definitions.map(definition => {
                    return Definition.fromJSON(definition);
                });
                return this.create({ word, definitions: defs });
            } else {
                return null;
            }
        });
    }
};

export const Word = mongoose.model('Word', WordSchema);