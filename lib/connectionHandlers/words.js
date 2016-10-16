import { define } from 'jp-dictionary';
import { events } from '../constants';

export const words = {
    validate(socket, word) {
        if (word === '')
            return socket.emit(events.words.validate, { isValid: true });
        if (define(word))
            return socket.emit(events.words.validate, { isValid: true });
        socket.emit(events.words.validate, { isValid: false });
    }
}