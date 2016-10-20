import mongoose, { Schema } from 'mongoose';

const PlayerSchema = new Schema({
    facebookId: { type: String, required: true, unique: true },
    name: { type: String, default: '' },
    image: { type: String, default: '' },
    experience: { type: Number, default: 0 },
    matchId: Schema.Types.ObjectId
});

PlayerSchema.statics = {
    findOrCreate(params) {
        const { facebookId } = params;
        return this.findOne({ facebookId })
            .then(player => {
                if (player) return player;
                return this.create(params)
                    .then(player => player);
            });
    },

    setReady(facebookId, isReady) {
        return this.findOne({ facebookId }).then(player => {
            player.isReady = isReady;
            return player.save();
        });
    }
};

PlayerSchema.methods = {
    update(params) {
        const { name, image, experience } = params;
        this.name = name;
        this.image = image;
        this.experience = experience;
        return this.save();
    },

    addExperience(exp) {
        this.experience = this.experience + exp;
        return this.save();
    },

    level() {
        // TODO calculate level from experience
        return 99;
    }
};

export const Player = mongoose.model('Player', PlayerSchema);
