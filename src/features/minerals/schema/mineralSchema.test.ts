import { describe, it, expect } from 'vitest';
import { mineralSchema, mineralsArraySchema } from './mineralSchema';
import mineralsData from "../../../data/minerals.json";

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
    ],
    substitutability: "LOW",
    recyclingRate: 5,
    recyclingSources: ["USGS 2024", "IEA 2023", "EU CRM Report 2023"]
  };

  it('validates correct mineral data', () => {
    const result = mineralSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('fails if required fields are missing', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  // Phase 5: New intelligence field tests
  it('fails if substitutability is not a valid enum', () => {
    const invalidData = { ...validData, substitutability: "EXTREME" };
    const result = mineralSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('fails if recyclingRate is below 0', () => {
    const invalidData = { ...validData, recyclingRate: -5 };
    const result = mineralSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('fails if recyclingRate exceeds 100', () => {
    const invalidData = { ...validData, recyclingRate: 150 };
    const result = mineralSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('fails if recyclingSources is empty', () => {
    const invalidData = { ...validData, recyclingSources: [] };
    const result = mineralSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('validates with esgRisks present', () => {
    const dataWithEsg = {
      ...validData,
      esgRisks: [{
        country: "DRC",
        category: "HUMAN_RIGHTS",
        severity: "CRITICAL",
        summary: "Child labor in cobalt mines."
      }]
    };
    const result = mineralSchema.safeParse(dataWithEsg);
    expect(result.success).toBe(true);
  });

  it('validates without esgRisks (optional field)', () => {
    const result = mineralSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('fails if esgRisks has invalid category', () => {
    const invalidData = {
      ...validData,
      esgRisks: [{
        country: "DRC",
        category: "INVALID_CATEGORY",
        severity: "HIGH",
        summary: "Test"
      }]
    };
    const result = mineralSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  // Timeline tests
  it('validates with timeline present', () => {
    const dataWithTimeline = {
      ...validData,
      timeline: [{
        year: 2023,
        event: "Chile announces lithium nationalization",
        impact: "State control over 35% of global reserves"
      }]
    };
    const result = mineralSchema.safeParse(dataWithTimeline);
    expect(result.success).toBe(true);
  });

  it('validates without timeline (optional field)', () => {
    const result = mineralSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('fails if timeline event has non-integer year', () => {
    const invalidData = {
      ...validData,
      timeline: [{
        year: "twenty-twenty",
        event: "Test",
        impact: "Test"
      }]
    };
    const result = mineralSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('fails if timeline event is missing required fields', () => {
    const invalidData = {
      ...validData,
      timeline: [{
        year: 2023
        // missing event and impact
      }]
    };
    const result = mineralSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  // Category enum tests
  it('validates defense category', () => {
    const defenseMineral = { ...validData, category: 'defense' };
    const result = mineralSchema.safeParse(defenseMineral);
    expect(result.success).toBe(true);
  });

  it('validates industrial category', () => {
    const industrialMineral = { ...validData, category: 'industrial' };
    const result = mineralSchema.safeParse(industrialMineral);
    expect(result.success).toBe(true);
  });

  it('fails if category is not a valid enum value', () => {
    const invalidData = { ...validData, category: 'unknown-category' };
    const result = mineralSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('validates the full minerals.json dataset', () => {
    const result = mineralsArraySchema.safeParse(mineralsData);
    expect(result.success).toBe(true);
  });
});
