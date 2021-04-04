import config from 'config';
import express from 'express';
import cors from 'cors';
import users from './routes/users.js';
import games from './routes/games.js';

if (!config.get('jwtPrivateKey')) console.log('private key not found');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/games', games);
app.use('/api/users', users);

app.get('/api/hello', (req, res) => {
  res.send('Hello my friend');
});

app.listen(port, () => console.log(`Listening on port ${port}...`));
