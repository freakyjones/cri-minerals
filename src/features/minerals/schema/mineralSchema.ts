import { z } from 'zod';

export const mineralSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  symbol: z.string(),
  atomicNumber: z.number().int().nonnegative(),
  category: z.string(),
  tagline: z.string(),
  riskScore: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  color: z.string().regex(/^#[0-9a-fA-F]{3,6}$/, { message: "Must be a valid hex color" }),
  useCases: z.array(z.object({
    label: z.string(),
    share: z.number().min(0).max(100)
  })),
  reserves: z.array(z.object({
    country: z.string(),
    share: z.number().min(0).max(100),
    amount_mt: z.number().optional()
  })),
  production: z.array(z.object({
    country: z.string(),
    share: z.number().min(0).max(100),
    amount_mt: z.number().optional()
  })),
  refining: z.array(z.object({
    country: z.string(),
    share: z.number().min(0).max(100)
  })),
  chokePoints: z.array(z.object({
    title: z.string(),
    severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
    description: z.string(),
    affectedCountries: z.array(z.string())
  })),
  dataSources: z.array(z.object({
    label: z.string(),
    url: z.string().url()
  })),
  substitutability: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  substituteMineral: z.string().optional(),
  recyclingRate: z.number().min(0).max(100),
  recyclingSources: z.array(z.string()).min(1),
  esgRisks: z.array(z.object({
    country: z.string(),
    category: z.enum(['HUMAN_RIGHTS', 'ENVIRONMENT', 'GOVERNANCE', 'CONFLICT']),
    severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
    summary: z.string()
  })).optional()
});

export const mineralsArraySchema = z.array(mineralSchema);

export type Mineral = z.infer<typeof mineralSchema>;
