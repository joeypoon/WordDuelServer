import { Player, Match } from '../models';
import { events } from '../constants';

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

    ready(socket, data) {
        Match.findById(data.matchId).then(match => match.setReady());
    },

    searchCancel(socket, data) {
        const { facebookId } = data;
        Match.cancelSearch(facebookId);
    }
}
