if (process.env.NODE_ENV === 'development') require('dotenv').config();
import express from 'express';
import { Server } from 'http';
import socketio from 'socket.io';
import mongoose from 'mongoose';
import sioRedis from 'socket.io-redis';
import redis from 'redis'

import { connectionHandler } from './connectionHandler';
import { events } from './constants';


const app = express();
const server = Server(app);
const port = process.env.PORT || 9004;

server.listen(port, function () {
  console.log(`Listening on ${ port }`)
});
const url = process.env.MONGODB_URI || 'mongodb://127.0.0.1/word_duel';

mongoose.Promise = global.Promise;
mongoose.connect(url);

export const io = socketio(server);
io.adapter(sioRedis(process.env.REDISCLOUD_URL));

export const redisClient = redis.createClient(process.env.REDISCLOUD_URL);

io.on(events.root.connection, function(socket) {
    console.log(socket.id, "connected");
    connectionHandler(socket);
});