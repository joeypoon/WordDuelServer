import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import router from './router.js';

const app = express();
const url = 'mongodb://127.0.0.1/word_duel';

mongoose.Promise = global.Promise;
mongoose.connect(url);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', router);

const port = process.env.PORT || 3000; // set our port

app.listen(port);

console.log(`Listening on port ${ port }`);