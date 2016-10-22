import { Player, Match } from '../models';

export const root = {
    disconnect(socket) {
        Player.findOne({ socket: socket.id }).then(player => {
            player.disconnect();
            Match.playerDisconnect(player.facebookId);
        });
        console.log(socket.id, "disconnected");
    }
};