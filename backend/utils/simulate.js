// Implements company rules exactly as stated
// Late penalty: if actualTimeMin > (baseTimeMin + 10) => ₹50 penalty
// Fatigue: if yesterdayHours > 8 => speed decreases by 30% => time = base / 0.7
// High value bonus: value > 1000 AND on time => +10%
// Fuel: ₹5/km + (traffic High ? +₹2/km : 0)
// Profit per order = value + bonus - penalties - fuel
export function runSimulation({ drivers, orders, routesMap, inputs }) {
  const { numDrivers, routeStartTime, maxHoursPerDriver } = inputs;

  // choose first N drivers (could sort by least hours etc.)
  const selectedDrivers = drivers.slice(0, numDrivers).map(d => {
    const yesterday = d.past7DayHours?.length ? d.past7DayHours[d.past7DayHours.length - 1] : 0;
    const fatigued = yesterday > 8;
    return { id: d._id.toString(), name: d.name, assignedMin: 0, fatigued };
  });

  if (selectedDrivers.length === 0) {
    return { error: 'No drivers available' };
  }

  // sort orders by deliveryTimestamp (oldest first)
  const sortedOrders = [...orders].sort((a, b) =>
    new Date(a.deliveryTimestamp) - new Date(b.deliveryTimestamp)
  );

  let totals = { totalProfit: 0, onTime: 0, late: 0, fuelCost: 0, penalties: 0, bonuses: 0 };
  const perTrafficFuel = { Low: 0, Medium: 0, High: 0 };

  // simple round-robin: always pick driver with least assigned time who has capacity left
  for (const order of sortedOrders) {
    selectedDrivers.sort((a, b) => a.assignedMin - b.assignedMin);
    const candidate = selectedDrivers.find(d => d.assignedMin < maxHoursPerDriver * 60);
    if (!candidate) break; // no capacity; unassigned orders ignored in this MVP

    const route = routesMap.get(order.route.toString());
    const base = route.baseTimeMin;
    const actualTimeMin = candidate.fatigued ? Math.ceil(base / 0.7) : base;

    const onTime = actualTimeMin <= (base + 10);
    const penalty = onTime ? 0 : 50;
    const bonus = (order.value_rs > 1000 && onTime) ? order.value_rs * 0.10 : 0;

    // fuel
    const surcharge = route.trafficLevel === 'High' ? 2 : 0;
    const fuel = (5 + surcharge) * route.distanceKm;

    const profit = order.value_rs + bonus - penalty - fuel;

    candidate.assignedMin += actualTimeMin;

    // accumulate
    if (onTime) totals.onTime++; else totals.late++;
    totals.fuelCost += fuel;
    totals.penalties += penalty;
    totals.bonuses += bonus;
    totals.totalProfit += profit;
    perTrafficFuel[route.trafficLevel] += fuel;
  }

  const totalDeliveries = totals.onTime + totals.late;
  const efficiencyScore = totalDeliveries ? (totals.onTime / totalDeliveries) * 100 : 0;

  return {
    totals: { ...totals, efficiencyScore: Math.round(efficiencyScore * 100) / 100 },
    breakdown: {
      onTimeVsLate: { onTime: totals.onTime, late: totals.late },
      fuelCostByTraffic: perTrafficFuel,
      routeStartTime
    }
  };
}
