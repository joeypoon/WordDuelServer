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
    totalExperience: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    socket: String
});

PlayerSchema.statics = {
    findOrCreate(params) {
        const { facebookId } = params;
        return this.findOne({ facebookId })
            .then(player => {
                console.log(player);
                if (player) return player;
                return this.create(params);
            });
    }
};

PlayerSchema.methods = {
    update(params) {
        const { name, image, experience, socket } = params;
        console.log(params.socket);
        if (name) this.name = name;
        if (image) this.image = image;
        if (experience) this.experience = experience;
        if (socket) this.socket = socket;
        return this.save();
    },

    addExperience(exp) {
        this.experience = this.experience + exp;
        this.totalExperience = this.totalExperience + exp;
        if (shouldLevel(this.lastExpReq, this.experience)) {
            this.level = this.level + 1;
            this.lastExpReq = this.requiredExp();
            this.experience = 0;
        }
        return this.save();
    },

    requiredExp() {
        const requiredExp = this.lastExpReq * baseExpReqMultiplier;
        return Math.trunc(requiredExp);
    },

    disconnect() {
        this.socket = null;
        return this.save();
    }
};

export const Player = mongoose.model('Player', PlayerSchema);
