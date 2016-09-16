import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import {
    Player
} from './models/index';

let app = express();
const url = 'mongodb://127.0.0.1/word_duel';
mongoose.connect(url);

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 3000;        // set our port

// ROUTES FOR OUR API
// =============================================================================
const router = express.Router();              // get an instance of the express Router

router.route('/players/:player_id')
    .get((req, res) => {
        // TODO get from FB API
        Player.findById(req.params.player_id, (err, player) => {
            if (err)
                res.send(err);
            res.json(player);
        });
    });

router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:3000/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);