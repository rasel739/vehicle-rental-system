import express, { Application, Request, Response } from 'express';
import dbSchema from './config/db';
import { AuthRoutes } from './app/modules/auth/auth.route';
import { VehicleRoutes } from './app/modules/vehicle/vehicle.route';
import { UserRoutes } from './app/modules/user/user.route';

const app: Application = express();

dbSchema();
app.use(express.json());

app.use('/api/v1/auth', AuthRoutes);
app.use('/api/v1/vehicles', VehicleRoutes);
app.use('/api/v1/users', UserRoutes);

app.get('/', (_, res) => {
  res.send('Welcome to our Vehicle Rental System');
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found',
    path: req.path,
  });
});

export default app;
