import express from 'express';
import {
  Player,
  Match,
} from './models/index';

const router = express.Router();

router.route('/login')
  .post((req, res) => {
    // TODO hit FB API
    console.log(req);
  });

router.route('/players/:player_id')
    .get((req, res) => {
      Player.findById(req.params.player_id, (err, player) => {
        if (err) {
          res.send(err);
        }

        res.json(player);
      });
    });

router.route('/matches')
    .post((req, res) => {
      const match = new Match();

      match.save((err) => {
        if (err) {
          res.send(err);
        }

        res.json({ id: match._id });
      });
    });

router.use((req, res, next) => {
  // do logging
  console.log('Something is happening.');
  next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:3000/api)
router.get('/', (req, res) => {
  res.json({ message: 'hooray! welcome to our api!' });
});

// more routes for our API will happen here

export default router;
