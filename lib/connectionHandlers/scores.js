import { Player } from '../models';
import { events } from '../constants';

export const scores = {
    scoreSubmit(socket, score) {
        Player.addExperience(score)
            .then(player => socket.emit(events.score.submit, player.experience));
    }
}