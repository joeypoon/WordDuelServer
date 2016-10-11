import {
    root
} from './connectionHandlers';

export function connectionHandler (socket) {
    socket.on('disconnect', () => root.disconnect(socket));
}