import { Match } from '../models';
import { events } from '../constants';
import { io } from '../server';

export function onMatchEnd(data) {
    const { matchId } = data;
    Match.findById(matchId).then(match => {
        if (match) match.end;
    });
}

export function onMatchDisconnect(data) {
    const { socket, matchId } = data;
    if (socket) {
        io.to(socket).emit(events.matches.disconnect);
    }
    Match.findById(matchId).then(match => {
        if (match) match.end();
    });
}