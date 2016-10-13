import {
    root,
    words,
    players
} from './connectionHandlers';
import { EVENTS } from './constants';

export function connectionHandler (socket) {
    socket.on(EVENTS.DISCONNECT, () => root.disconnect(socket));
    socket.on(EVENTS.WORDS.VALIDATE, data => words.validate(socket, data.word));
    socket.on(EVENTS.PLAYERS.LOGIN, data => players.login(socket, data.player));
    socket.on(EVENTS.PLAYERS.SEARCH, data => players.search(socket, data.player));
    socket.on(EVENTS.PLAYERS.READY, data => players.ready(socket, data.player));
}