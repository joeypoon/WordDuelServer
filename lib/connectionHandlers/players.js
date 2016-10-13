import { Player } from '../models';
import { EVENTS } from '../constants';

export const players = {
    login(socket, params) {
        Player.findOrCreate(params)
            .then(player => player.update(params), err => err)
            .then(player => socket.emit(EVENTS.PLAYERS.LOGIN, player), err => err);
    },

    search(socket, player) {
    },

    ready(socket, player) {
    }
}