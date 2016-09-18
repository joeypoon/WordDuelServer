import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import router from './routes.js';

const app = express();
const url = 'mongodb://127.0.0.1/word_duel';
mongoose.connect(url);

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 3000; // set our port

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================

app.listen(port);
console.log('Magic happens on port ' + port);
