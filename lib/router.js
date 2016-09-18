import express from 'express';
import {
  root,
  login,
  matches,
  players,
  validateWord,
} from './routes/index';

const router = express.Router();

router.use((req, res, next) => {
  // do logging
  console.log('Something is happening.');
  next(); // make sure we go to the next routes and don't stop here
});

router.route('/')
  .get(root.get);

router.route('/login')
  .post(login.post);

router.route('/players/:player_id')
  .get(players.get)
  .post(players.post);

router.route('/matches')
  .post(matches.post);

router.route('/validate-word/:word')
  .post(validateWord.post);

export default router;
