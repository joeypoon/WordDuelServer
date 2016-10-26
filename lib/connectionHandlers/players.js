import { Player, Match } from '../models';
import { events } from '../constants';
import { io } from '../server';

export function onPlayerLogin(socket, params) {
    params.socket = socket.id;
    Player.findOrCreate(params)
        .then(player => player.update(params), err => err);
}

export function onPlayerSearch(socket, data) {
    Match.findOpenOrCreate(data.facebookId, socket);
}

export function onPlayerReady(data) {
    const { socket } = data;
    if (socket)
        io.to(socket).emit(events.players.ready);
}

export function onPlayerSearchCancel(data) {
    const { facebookId } = data;
    Match.cancelSearch(facebookId);
}

export function onScoreSubmit(socket, data) {
    Player.findOne({ socket: socket.id }).then(player => {
        if (player)
            player.addExperience(data.score).then(p => {
                const params = {
                    expToLevel: p.expToLevel(),
                    level: p.level
                };
                socket.emit(events.score.submit, params);
            });
    });
}