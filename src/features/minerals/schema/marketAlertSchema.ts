import { z } from 'zod';

export const marketAlertSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().min(1),
  severity: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']),
  status: z.enum(['DRAFT', 'PUBLISHED']),
  created_at: z.string().datetime({ offset: true }).or(z.string()),
  blast_radius: z.object({
    lat: z.number(),
    lng: z.number(),
    radius: z.number()
  }).nullable().optional(),
  disruption_multiplier: z.number().nullable().optional(),
  affected_minerals: z.array(z.string()).nullable().optional()
});

export type MarketAlert = z.infer<typeof marketAlertSchema>;
