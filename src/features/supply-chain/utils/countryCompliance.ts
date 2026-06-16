export type ComplianceStatus = 'FEOC' | 'FTA' | 'NEUTRAL';

// Foreign Entities of Concern
const FEOC_COUNTRIES = ['China', 'Russia', 'Iran', 'North Korea'];

// US Free Trade Agreement / Critical Minerals Agreement countries
const FTA_COUNTRIES = [
  'Australia', 
  'Canada', 
  'Chile', 
  'South Korea', 
  'Japan', 
  'Mexico', 
  'Peru', 
  'Morocco', 
  'Singapore', 
  'Colombia', 
  'Israel', 
  'Panama'
];

export const getCountryComplianceStatus = (countryName: string): ComplianceStatus => {
  // Simple substring matches to catch variations (e.g., "Mainland China")
  const normalized = countryName.toLowerCase();
  
  if (FEOC_COUNTRIES.some(c => normalized.includes(c.toLowerCase()))) return 'FEOC';
  if (FTA_COUNTRIES.some(c => normalized.includes(c.toLowerCase()))) return 'FTA';
  
  return 'NEUTRAL';
};

export const getCountryComplianceTags = (countryName: string): string[] => {
  const normalized = countryName.toLowerCase();
  const tags: string[] = [];

  if (normalized.includes('russia')) {
    tags.push('Sanctioned Entity', 'High ESG Risk', 'Conflict Region');
  } else if (normalized.includes('china')) {
    tags.push('State-Backed Enterprise Risk', 'Labor Concerns', 'Geopolitical Competitor');
  } else if (normalized.includes('iran') || normalized.includes('north korea')) {
    tags.push('Sanctioned Entity', 'Extreme ESG Risk');
  } else if (normalized.includes('congo') || normalized.includes('drc')) {
    tags.push('High ESG Risk', 'Child Labor Concerns', 'Political Instability');
  } else if (FTA_COUNTRIES.some(c => normalized.includes(c.toLowerCase()))) {
    tags.push('Free Trade Agreement (FTA)');
    if (normalized.includes('australia') || normalized.includes('canada') || normalized.includes('japan') || normalized.includes('south korea')) {
       tags.push('High ESG Standards');
    }
  }

  return tags;
};
