import { Match } from '../models';
import { events } from '../constants';
import { io } from '../server';

export const matches = {
    onMatchEnd(data) {
        const { matchId } = data;
        Match.findById(matchId).then(match => match.end);
    }
}