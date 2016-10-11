import express from 'express';
import { Server } from 'http';
import socketio from 'socket.io';
import mongoose from 'mongoose';

import router from './router.js';
import {
    root
} from './connectionHandlers';

const app = express();
const server = Server(app);
const port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log(`Listening on ${ port }`)
});
const url = process.env.MONGODB_URI || 'mongodb://127.0.0.1/word_duel';

mongoose.Promise = global.Promise;
mongoose.connect(url);

export const io = socketio(server);

io.on('connection', function(socket) {
    root.connection(socket);
    socket.on('disconnect', () => root.disconnect(socket));
})