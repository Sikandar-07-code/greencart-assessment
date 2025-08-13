import mongoose from 'mongoose';
const OrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  value_rs: { type: Number, required: true },
  route: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
  deliveryTimestamp: { type: Date, required: true } // scheduled delivery time
}, { timestamps: true });
export default mongoose.model('Order', OrderSchema);
