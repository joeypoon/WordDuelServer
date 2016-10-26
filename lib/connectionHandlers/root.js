import { Player, Match } from '../models';

export function disconnect(socket) {
    Player.findOne({ socket: socket.id }).then(player => {
        if (player) {
            player.disconnect();
            Match.playerDisconnect(player.facebookId);
        }
    });
    console.log(socket.id, "disconnected");
}