import { Player } from '../models';
import { events } from '../constants';

export const scores = {
    scoreSubmit(socket, data) {
        console.log(data);
        Player.findOne({ socket: socket.id }).then(player => {
            if (player)
                player.addExperience(data.score).then(p => {
                    socket.emit(events.score.submit, p.experience)
                });
        });
    }
}