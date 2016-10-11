export const root = {
    connection(socket) {
        console.log(socket.id, "connected");
    },

    disconnect(socket) {
        console.log(socket.id, "disconnected");
    }
};