import { Match } from '../models';
import { events } from '../constants';

export const matches = {
    newGrid(socket) {
        socket.emit(events.matches.grid.new, Match.generateGrid());
    }
}