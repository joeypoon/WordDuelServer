import { define } from 'jp-dictionary';
import { events } from '../constants';
import { io } from '../server';
import { Match } from '../models';

export const words = {
    validate(socket, data) {
        const { word } = data;
        if (word === '' || define(word))
            return socket.emit(events.words.validate, { isValid: true, word });
        socket.emit(events.words.validate, { isValid: false });
    },

    submit(socket, data) {
        const { matchId, word } = data;
        Match.findById(matchId).then(match => {
            if (match) match.submitWord(word);
        });
    }
}