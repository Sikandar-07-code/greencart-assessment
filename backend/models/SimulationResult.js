import mongoose from 'mongoose';
const SimulationResultSchema = new mongoose.Schema({
  inputs: {
    numDrivers: Number,
    routeStartTime: String,   // "HH:MM"
    maxHoursPerDriver: Number
  },
  totals: {
    totalProfit: Number,
    onTime: Number,
    late: Number,
    efficiencyScore: Number,
    fuelCost: Number,
    penalties: Number,
    bonuses: Number
  },
  breakdown: Object // any charts data you return
}, { timestamps: true });
export default mongoose.model('SimulationResult', SimulationResultSchema);
