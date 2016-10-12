import { define } from 'jp-dictionary';
import { VALIDATE_WORD } from '../constants';

export const words = {
    validate(socket, word) {
        if (define(word)) {
            socket.emit(VALIDATE_WORD, { isValid: true });
        } else {
            socket.emit(VALIDATE_WORD, { isValid: false });
        }
    }
}