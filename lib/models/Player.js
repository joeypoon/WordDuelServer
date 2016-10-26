import mongoose, { Schema } from 'mongoose';

const baseExpReq = 10;
const baseExpReqMultiplier = 1.1;

function shouldLevel(lastExpReq, experience) {
    return experience >= lastExpReq * baseExpReqMultiplier;
}

const PlayerSchema = new Schema({
    facebookId: { type: String, required: true, unique: true },
    name: { type: String, default: '' },
    image: { type: String, default: '' },
    lastExpReq: { type: Number, default: baseExpReq },
    experience: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
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

    levelUp() {
        this.level = this.level + 1;
        this.lastExpReq = this.lastExpReq * baseExpReqMultiplier;
        this.experience = 0;
    },

    addExperience(exp) {
        this.experience = this.experience + exp;
        if (shouldLevel(this.lastExpReq, this.experience))
            this.levelUp();
        return this.save();
    },

    expToLevel() {
        const requiredExp = this.lastExpReq * baseExpReqMultiplier;
        return requiredExp - this.experience;
    },

    disconnect() {
        this.socket = null;
        return this.save();
    }
};

export const Player = mongoose.model('Player', PlayerSchema);
