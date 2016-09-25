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
  next();
});

router.route('/')
  .get(root.get);

router.route('/login')
  .post(login.post);

router.route('/players')
  .post(players.post);

router.route('/players/:player_id')
  .get(players.get)
  .put(players.put);

router.route('/matches')
  .post(matches.post);

router.route('/validate-word/:word')
  .post(validateWord.post);

export default router;
