import { Player, Match } from '../models';
import { events } from '../constants';
import { io } from '../server';

export const players = {
    onPLayerLogin(socket, params) {
        params.socket = socket.id;
        Player.findOrCreate(params)
            .then(player => player.update(params), err => err)
            .then(player => socket.emit(events.players.login, player), err => err);
    },

    onPlayerSearch(socket, data) {
        Match.findOpenOrCreate(data.facebookId, socket);
    },

    onPlayerReady(data) {
        const { socket } = data;
        io.to(socket).emit(events.players.ready);
    },

    onSearchCancel(data) {
        const { facebookId } = data;
        Match.cancelSearch(facebookId);
    },

    onScoreSubmit(socket, data) {
        Player.findOne({ socket: socket.id }).then(player => {
            if (player)
                player.addExperience(data.score).then(p => {
                    socket.emit(events.score.submit, p.experience)
                });
        });
    }
}
