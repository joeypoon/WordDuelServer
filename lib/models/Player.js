import mongoose, { Schema } from 'mongoose';

const PlayerSchema = new Schema({
    facebookId: { type: String, required: true, unique: true },
    name: { type: String, default: '' },
    image: { type: String, default: '' },
    experience: { type: Number, default: 0 },
    socket: String
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
    }
};

PlayerSchema.methods = {
    update(params) {
        const { name, image, experience, socket } = params;
        this.name = name;
        this.image = image;
        this.experience = experience;
        this.socket = socket;
        return this.save();
    },

    addExperience(exp) {
        this.experience = this.experience + exp;
        return this.save();
    },

    level() {
        // TODO calculate level from experience
        return 99;
    },

    disconnect() {
        this.socket = null;
        return this.save();
    }
};

export const Player = mongoose.model('Player', PlayerSchema);
