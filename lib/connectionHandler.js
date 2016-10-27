import * as connectionHandlers from './connectionHandlers';
import { events } from './constants';

export function connectionHandler(socket) {
    // root
    socket.on(events.root.disconnect, () => connectionHandlers.disconnect(socket));

    // players
    socket.on(events.players.login, data => connectionHandlers.onPlayerLogin(socket, data));
    socket.on(events.players.search, data => connectionHandlers.onPlayerSearch(socket, data));
    socket.on(events.players.ready, data => connectionHandlers.onPlayerReady(data));
    socket.on(events.players.score, data => connectionHandlers.onPlayerScore(socket, data));
    socket.on(events.players.cancel, data => connectionHandlers.onPlayerSearchCancel(data));
    socket.on(events.players.ranking, data => connectionHandlers.onPlayerRanking(socket, data));
    socket.on(events.players.timeout, data => connectionHandlers.onPlayerTimeout(data));

    // words
    socket.on(events.words.submit, data => connectionHandlers.onWordSubmit(socket, data));

    // matches
    socket.on(events.matches.end, data => connectionHandlers.onMatchEnd(data));
    socket.on(events.matches.disconnect, data => connectionHandlers.onMatchDisconnect(data));
}
