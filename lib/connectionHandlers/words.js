import { define } from 'jp-dictionary';
import { events } from '../constants';
import { io } from '../server';

function emitToOpponent(opponentSocket, word) {
    if (opponentSocket)
        io.to(opponentSocket).emit(events.words.submit, { word });
}

export function onWordSubmit(socket, data) {
    const { word } = data;

    if (word === '' || define(word)) {
        socket.emit(events.words.validate, { isValid: true });
        emitToOpponent(data.socket, word);
    } else {
        socket.emit(events.words.validate, { isValid: false });
    }
}