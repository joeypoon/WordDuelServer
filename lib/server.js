import express from 'express';
import { Server } from 'http';
import socketio from 'socket.io';
import mongoose from 'mongoose';

import router from './router.js';

const app = express();
const server = Server(app);
const port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log(`Listening on ${ port }`)
});
const url = process.env.MONGODB_URI || 'mongodb://127.0.0.1/word_duel';

export const io = socketio(server);

mongoose.Promise = global.Promise;
mongoose.connect(url);

io.on('connection', function(socket) {
    console.log('Client connected');
    socket.on('disconnect', () => console.log('Client disconnected'));
})

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// app.use('/api', router);

// const port = process.env.PORT || 3000; // set our port

// app.listen(port);

// console.log(`Listening on port ${ port }`);