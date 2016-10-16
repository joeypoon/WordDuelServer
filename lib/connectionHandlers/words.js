import { define } from 'jp-dictionary';
import { events } from '../constants';

export const words = {
    validate(socket, word) {
        if (define(word)) {
            socket.emit(events.words.validate, { isValid: true });
        } else {
            socket.emit(events.words.validate, { isValid: false });
        }
    }
}