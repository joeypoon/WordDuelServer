import { define } from 'jp-dictionary';
import { events } from '../constants';
import { io } from '../server';
import { Match } from '../models';

export function onWordSubmit(socket, data) {
    const { word } = data;

    if (word === '' || define(word)) {
        socket.emit(events.words.validate, { isValid: true });
    } else {
        socket.emit(events.words.validate, { isValid: false });
    }

    const opponentSocket = data.socket;
    if (opponentSocket)
        io.to(socket).emit(events.words.submit, { word });
}