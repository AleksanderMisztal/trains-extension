import express from 'express';
import cors from 'cors';
import users from './routes/users.js';
import games from './routes/games.js';

const app = express();
const port = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());
app.use((req, _res, next) => {
  console.log('request', req.body);
  next();
});
app.use('/api/games', games);
app.use('/api/users', users);

app.get('/api/hello', (_req, res) => {
  res.send('Hello my friend');
});

app.listen(port, () => console.log(`Listening on port ${port}...`));
