import { Player } from '../models';
import { events } from '../constants';

export const players = {
    login(socket, params) {
        Player.findOrCreate(params)
            .then(player => player.update(params), err => err)
            .then(player => socket.emit(events.players.login, player), err => err);
    },

    search(socket, player) {
    },

    ready(socket, player) {
    }
}