import mongoose from 'mongoose';
const DriverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  currentShiftHours: { type: Number, default: 0 },        // hours worked today
  past7DayHours: { type: [Number], default: [] }          // length 7, last item = yesterday
}, { timestamps: true });
export default mongoose.model('Driver', DriverSchema);
