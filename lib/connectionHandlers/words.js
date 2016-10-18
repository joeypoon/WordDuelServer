import { define } from 'jp-dictionary';
import { events } from '../constants';
import { io } from '../server';

export const words = {
    validate(socket, data) {
        const { word, matchId, facebookId } = data;
        if (word === '' || define(word)) {
            if (matchId && facebookId) io.to(matchId).emit(events.words.submit, { facebookId, word });
            return socket.emit(events.words.validate, { isValid: true });
        }
        socket.emit(events.words.validate, { isValid: false });
    }
}