// logic to perform on interval
import { interval } from './constants';

function checkQueue() {

}

function checkIfReady() {

}

export function beginInterval() {
    setInterval(() => {
        checkQueue();
        checkIfReady();
    }, interval);
}
