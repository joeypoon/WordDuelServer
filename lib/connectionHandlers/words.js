import { define } from 'jp-dictionary';
import { events } from '../constants';
import { io } from '../server';
import { Match } from '../models';

export const words = {
    validate(socket, data) {
        const { word } = data;

        if (word === '' || define(word))
            return socket.emit(events.words.validate, { isValid: true });
        socket.emit(events.words.validate, { isValid: false });

        const opponentSocket = data.socket;
        if (opponentSocket)
            io.to(socket).emit(events.words.submit, { word });
    }
}