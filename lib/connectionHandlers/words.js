import { define } from 'owlbot-dictionary';

import { events } from '../constants';
import { io } from '../server';
import { Word } from '../models';

function emitToOpponent(opponentSocket, word) {
    if (opponentSocket)
        io.to(opponentSocket).emit(events.words.submit, { word });
}

function emitValid(socket, word, data) {
    socket.emit(events.words.validate, { isValid: true });
    emitToOpponent(data.socket, word);
}

function emitInvalid(socket) {
    socket.emit(events.words.validate, { isValid: false });
}

export function onWordSubmit(socket, data) {
    const { word } = data;

    if (word === '') return emitValid(socket, word, data);

    Word.define(word).then(w => {
        if (w) return emitValid(socket, word, data);
        emitInvalid(socket);
    });
}
