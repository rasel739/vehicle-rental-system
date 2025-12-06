import app from './app';
import config from './config';
import { pool } from './config/db';

pool
  .connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('Connection error', err));

app.listen(config.port, () => {
  console.log(`Vehicle rental system server is running port:${config.port}`);
});
