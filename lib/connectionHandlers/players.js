import { Player, Match } from '../models';
import { events } from '../constants';
import { io } from '../server';

export function onPlayerLogin(socket, params) {
    params.socket = socket.id;
    Player.findOrCreate(params)
        .then(player => player.update(params), err => err)
        .then(player => {
            const params = {
                level: player.level
            };
            socket.emit(events.players.login, params);
        }, err => err);
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

export function onPlayerScore(socket, data) {
    Player.findOne({ socket: socket.id }).then(player => {
        if (player)
            player.addExperience(data.score).then(p => {
                const params = {
                    requiredExp: p.requiredExp(),
                    experience: p.experience,
                    level: p.level
                };
                socket.emit(events.players.experience, params);
            });
    });
}

export function onPlayerRanking(socket, data) {
    // TODO return players near self
    const players = Player.where({}).sort({ totalExperience: -1 }).limit(100);
    socket.emit(events.players.ranking, { players });
}

export function onPlayerTimeout(data) {
    const { opponentSocket } = data;
    if (opponentSocket)
        io.to(opponentSocket).emit(events.words.submit, { word: 'Timed out.' });
}

export function onPlayerFindActiveFriends(socket, data) {
    const { facebookIds } = data;
    Player.find({ facebookId: { $in: facebookIds } })
        .then(friends => {
            if (!friends.length) return [];
            return friends.filter(f => f.socket);
        }).then(friends => {
            socket.emit(events.players.findActiveFriends, { friends });
        });
}

export function onPlayerChallengeFriend(socket, data) {
    const { friendFacebookId, player } = data;
    if (friendFacebookId)
        Player.findOne({ facebookId: friendFacebookId })
            .then(friend => {
                io.to(friend.socket)
                    .emit(events.players.challengeRequest, { player });
            });
}

export function onChallengeResponse(socket, data) {
    const { response, facebookId, opponentSocket } = data;
    if (response) {
        Match.create({ challenge: true })
            .then(match => match.joinMatch(facebookId, socket));
        return;
    }
    io.to(opponentSocket).emit(events.players.challengeResponse, { response });
}