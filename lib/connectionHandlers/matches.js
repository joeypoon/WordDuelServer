import { Match } from '../models';
import { events } from '../constants';
import { io } from '../server';

export const matches = {
    matchEnd(data) {
        const { matchId } = data;
        Match.findById(matchId).then(match => match.end);
    }
}