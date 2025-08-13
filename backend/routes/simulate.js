import express from 'express';
import { z } from 'zod';
import { auth } from '../middleware/auth.js';
import { simInputSchema } from '../utils/validators.js';
import Driver from '../models/Driver.js';
import Order from '../models/Order.js';
import RouteM from '../models/Route.js';
import SimulationResult from '../models/SimulationResult.js';
import { runSimulation } from '../utils/simulate.js';

const router = express.Router();
router.use(auth);

router.post('/', async (req, res) => {
  try {
    const parsed = simInputSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() });
    }
    const inputs = parsed.data;

    const drivers = await Driver.find().lean();
    const orders = await Order.find().lean();
    const routes = await RouteM.find().lean();
    const routesMap = new Map(routes.map(r => [r._id.toString(), r]));

    if (inputs.numDrivers > drivers.length) {
      return res.status(400).json({ error: 'numDrivers exceeds available drivers' });
    }

    const result = runSimulation({ drivers, orders, routesMap, inputs });
    if (result.error) return res.status(400).json({ error: result.error });

    const saved = await SimulationResult.create({ inputs, ...result });

    res.json({ ...result, id: saved._id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/history', async (_req, res) => {
  const items = await SimulationResult.find().sort({ createdAt: -1 }).limit(20).lean();
  res.json(items);
});

export default router;
