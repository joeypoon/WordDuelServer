import { Match } from '../models';
import { events } from '../constants';
import { io } from '../server';

export const matches = {
    gridNew(socket) {
        socket.emit(events.matches.grid.new, Match.generateGrid());
    },

    matchEnd(data) {
        const { matchId } = data;
        // const room = io.sockets.adapter.rooms[matchId];
        // room.forEach(socket => socket.leave(matchId));
    }
}