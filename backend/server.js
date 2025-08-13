import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/error.js';
import authRoutes from './routes/auth.js';
import driverRoutes from './routes/drivers.js';
import routeRoutes from './routes/routes.js';
import orderRoutes from './routes/orders.js';
import simulateRoutes from './routes/simulate.js';
import User from './models/User.js';
import bcrypt from 'bcrypt';

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (_req, res) => res.send('GreenCart API up'));
app.use('/api/auth', authRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/simulate', simulateRoutes);
app.use(errorHandler);

const start = async () => {
  await connectDB();

  // seed admin user if missing
  const existing = await User.findOne({ email: process.env.ADMIN_EMAIL });
  if (!existing) {
    const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    await User.create({ email: process.env.ADMIN_EMAIL, passwordHash: hash });
    console.log('👤 Admin user seeded');
  }

  app.listen(process.env.PORT, () =>
    console.log(`🚀 Server running on port ${process.env.PORT}`)
  );
};
start();
