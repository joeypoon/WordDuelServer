import { define } from 'jp-dictionary';
import { events } from '../constants';
import { io } from '../server';

export const words = {
    validate(socket, data) {
        const { word } = data;
        if (word === '' || define(word))
            return socket.emit(events.words.validate, { isValid: true, word });
        socket.emit(events.words.validate, { isValid: false });
    },

    submit(socket, data) {
        const { matchId, facebookId, word } = data;
        io.to(matchId).emit(events.words.submit, { facebookId, word });
    }
}