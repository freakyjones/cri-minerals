import { z } from 'zod';

export const marketAlertSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().min(1),
  severity: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']),
  status: z.enum(['DRAFT', 'PUBLISHED']),
  created_at: z.string().datetime({ offset: true }).or(z.string()),
});

export type MarketAlert = z.infer<typeof marketAlertSchema>;
