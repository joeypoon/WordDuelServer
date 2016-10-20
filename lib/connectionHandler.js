import {
    root,
    words,
    players,
    matches
} from './connectionHandlers';
import { events } from './constants';

export function connectionHandler (socket) {
    // root
    socket.on(events.root.disconnect, () => root.disconnect(socket));

    // players
    socket.on(events.players.login, data => players.login(socket, data));
    socket.on(events.players.search, data => players.search(socket, data));
    socket.on(events.players.ready, data => players.ready(socket, data));

    // words
    socket.on(events.words.validate, data => words.validate(socket, data));

    // matches
    socket.on(events.matches.grid.new, () => matches.gridNew(socket));
    socket.on(events.matches.end, data => matches.matchEnd(data));

    // score
    socket.on(events.score.submit, data => scores.scoreSubmit(socket, data));
}