import {
    root,
    words
} from './connectionHandlers';
import {
    DISCONNECT,
    VALIDATE_WORD
 } from './constants';

export function connectionHandler (socket) {
    socket.on(DISCONNECT, () => root.disconnect(socket));
    socket.on(VALIDATE_WORD, data => words.validate(socket, data.word));
}