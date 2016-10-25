import { Player, Match } from '../models';
import { events } from '../constants';
import { io } from '../server';

export const players = {
    login(socket, params) {
        params.socket = socket.id;
        Player.findOrCreate(params)
            .then(player => player.update(params), err => err)
            .then(player => socket.emit(events.players.login, player), err => err);
    },

    search(socket, data) {
        Match.findOpenOrCreate(data.facebookId, socket);
    },

    ready(data) {
        const { socket } = data;
        io.to(socket).emit(events.players.ready);
    },

    searchCancel(data) {
        const { facebookId } = data;
        Match.cancelSearch(facebookId);
    }
}
