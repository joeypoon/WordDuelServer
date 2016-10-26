import {
    root,
    words,
    players,
    matches,
    scores
} from './connectionHandlers';
import { events } from './constants';

export function connectionHandler (socket) {
    // root
    socket.on(events.root.disconnect, () => root.disconnect(socket));

    // players
    socket.on(events.players.login, data => players.login(socket, data));
    socket.on(events.players.search, data => players.search(socket, data));
    socket.on(events.players.ready, data => players.ready(data));
    socket.on(events.search.cancel, data => players.searchCancel(data));

    // words
    socket.on(events.words.submit, data => words.submit(socket, data));

    // matches
    socket.on(events.matches.end, data => matches.matchEnd(data));

    // score
    socket.on(events.score.submit, data => scores.scoreSubmit(socket, data));
}