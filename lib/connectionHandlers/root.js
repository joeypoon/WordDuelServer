import { Player } from '../models';

export const root = {
    disconnect(socket) {
        Player.findOne({ socket: socket.id }).then(player => player.disconnect());
        console.log(socket.id, "disconnected");
    }
};