import { z } from 'zod';

export const simInputSchema = z.object({
  numDrivers: z.number().int().positive(),
  routeStartTime: z.string().regex(/^\d{2}:\d{2}$/),
  maxHoursPerDriver: z.number().int().positive()
});
