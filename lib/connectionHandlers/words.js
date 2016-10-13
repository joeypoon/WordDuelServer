import { define } from 'jp-dictionary';
import { EVENTS } from '../constants';

export const words = {
    validate(socket, word) {
        if (define(word)) {
            socket.emit(EVENTS.WORDS.VALIDATE, { isValid: true });
        } else {
            socket.emit(EVENTS.WORDS.VALIDATE, { isValid: false });
        }
    }
}