import mongoose from 'mongoose';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import Driver from '../models/Driver.js';
import RouteM from '../models/Route.js';
import Order from '../models/Order.js';

// Fix: Explicitly load .env from backend root
dotenv.config({ path: path.resolve('../.env') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const p = (f) => path.join(__dirname, f);

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { dbName: 'greencart' });
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      Driver.deleteMany(),
      RouteM.deleteMany(),
      Order.deleteMany()
    ]);

    // Load JSON files
    const drivers = JSON.parse(readFileSync(p('drivers.json')));
    const routes = JSON.parse(readFileSync(p('routes.json')));
    const ordersRaw = JSON.parse(readFileSync(p('orders.json')));

    // Insert routes and map routeId → _id
    const routesDocs = await RouteM.insertMany(routes);
    const routeIdMap = Object.fromEntries(
      routesDocs.map(r => [r.routeId, r._id])
    );

    // Replace routeId in orders with MongoDB _id
    const orders = ordersRaw.map(o => ({
      orderId: o.orderId,
      value_rs: o.value_rs,
      route: routeIdMap[o.routeId],
      deliveryTimestamp: o.deliveryTimestamp
    }));

    // Insert data
    await Driver.insertMany(drivers);
    await Order.insertMany(orders);

    console.log('🌱 Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding data:', err);
    process.exit(1);
  }
};

run();
