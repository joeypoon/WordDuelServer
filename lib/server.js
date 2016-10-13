import express from 'express';
import { Server } from 'http';
import socketio from 'socket.io';
import mongoose from 'mongoose';

import { connectionHandler } from './connectionHandler';
import { EVENTS } from './constants';

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

io.on(EVENTS.CONNECTION, function(socket) {
    console.log(socket.id, "connected");
    connectionHandler(socket);
});