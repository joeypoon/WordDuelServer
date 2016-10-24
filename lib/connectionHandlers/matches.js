import { Match } from '../models';
import { events } from '../constants';
import { io } from '../server';

export const matches = {
    gridNew(socket) {
        socket.emit(events.matches.grid.new, Match.generateGrid());
    },

    matchEnd(data) {
        const { matchId } = data;
        Match.findById(matchId).then(match => match.end);
    },

    onMatchJoin(socket, data) {
        const { matchId } = data;
        socket.join(matchId);
    }
}