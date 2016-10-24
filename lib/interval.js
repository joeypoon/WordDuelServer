// logic to perform on interval
import { interval } from './constants';
import { Match, Player } from './models';

function checkQueue() {
    Player.where({ isSearching: true }).then(players => {
        let queue = [...players];
        while (queue.length > 1) {
            const players = queue.splice(0, 2);
            Match.startNew(players);
        }
    });
}

function checkIfReady() {

}

export function beginInterval() {
    setInterval(() => {
        checkQueue();
        checkIfReady();
    }, interval);
}
