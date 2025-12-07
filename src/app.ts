import express, { Application, urlencoded } from 'express';
import dbSchema from './config/db';

const app: Application = express();

dbSchema();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

export default app;
