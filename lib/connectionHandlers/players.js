import { Player, Match } from '../models';
import { events } from '../constants';

export const players = {
    login(socket, params) {
        params.socket = socket.id;
        Player.findOrCreate(params)
            .then(player => player.update(params), err => err)
            .then(player => socket.emit(events.players.login, player), err => err);
    },

    search(socket) {
        Player.findOne({ socket }).then(player => player.setSearching(true));
    },

    ready(socket) {
        Player.findOne({ socket }).then(player => player.setReady(true));
    },

    searchCancel(socket) {
        Player.findOne({ socket }).then(player => player.setSearching(false));
    }
}
