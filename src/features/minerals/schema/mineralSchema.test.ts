import { describe, it, expect } from 'vitest';
import { mineralSchema } from './mineralSchema';

describe('mineralSchema', () => {
  const validData = {
    id: "lithium",
    slug: "lithium",
    name: "Lithium",
    symbol: "Li",
    atomicNumber: 3,
    category: "battery-metal",
    tagline: "The backbone of the EV revolution",
    riskScore: "HIGH",
    color: "#a78bfa",
    useCases: [
      { label: "EV Batteries", share: 74 }
    ],
    reserves: [
      { country: "Chile", share: 35 }
    ],
    production: [
      { country: "Australia", share: 47 }
    ],
    refining: [
      { country: "China", share: 65 }
    ],
    chokePoints: [
      {
        title: "Chinese Refining Dominance",
        severity: "CRITICAL",
        description: "65% of global lithium refining capacity sits in China.",
        affectedCountries: ["USA"]
      }
    ],
    dataSources: [
      { label: "USGS", url: "https://www.usgs.gov" }
    ]
  };

  it('validates correct mineral data', () => {
    const result = mineralSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('fails if required fields are missing', () => {
    const { name, ...invalidData } = validData;
    const result = mineralSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('fails if color is not a valid hex string', () => {
    const invalidData = { ...validData, color: "blue" };
    const result = mineralSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Must be a valid hex color");
    }
  });

  it('fails if share is greater than 100', () => {
    const invalidData = { 
      ...validData, 
      reserves: [{ country: "Chile", share: 150 }] 
    };
    const result = mineralSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
