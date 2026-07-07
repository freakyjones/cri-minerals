import { logger } from '../utils/logger';

export const COUNTRY_COORDINATES: Record<string, [number, number]> = {
  // South America
  'Chile': [-35.6751, -71.5430],
  'Argentina': [-38.4161, -63.6167],
  'Brazil': [-14.2350, -51.9253],
  'Peru': [-9.1900, -75.0152],
  'Bolivia': [-16.2902, -63.5887],

  // North America
  'USA': [37.0902, -95.7129],
  'Canada': [56.1304, -106.3468],

  // Africa
  'DRC': [-4.0383, 21.7587],
  'South Africa': [-30.5595, 22.9375],
  'Mozambique': [-18.6657, 35.5296],
  'Madagascar': [-18.7669, 46.8691],
  'Gabon': [-0.8037, 11.6094],
  'Zimbabwe': [-19.0154, 29.1549],
  'Rwanda': [-1.9403, 29.8739],
  'Nigeria': [9.0820, 8.6753],
  'Ethiopia': [9.1450, 40.4897],

  // Asia
  'China': [35.8617, 104.1954],
  'Indonesia': [-0.7893, 113.9213],
  'Philippines': [12.8797, 121.7740],
  'Japan': [36.2048, 138.2529],
  'South Korea': [35.9078, 127.7669],
  'Vietnam': [14.0583, 108.2772],
  'Malaysia': [4.2105, 101.9758],
  'Turkey': [38.9637, 35.2433],
  'India': [20.5937, 78.9629],
  'Kazakhstan': [48.0196, 66.9237],
  'Tajikistan': [38.8610, 71.2761],
  'Myanmar': [21.9162, 95.9560],

  // Europe & Eurasia
  'Russia': [61.5240, 105.3188],
  'Finland': [61.9241, 25.7482],
  'Austria': [47.5162, 14.5501],
  'Belgium': [50.5039, 4.4699],
  'Bulgaria': [42.7339, 25.4858],
  'UK': [55.3781, -3.4360],
  'Norway': [60.4720, 8.4689],

  // Oceania
  'Australia': [-25.2744, 133.7751],

  // General/Fallbacks
  'Other': [0, 0],
  'Global': [0, 0],
  'Abundant': [0, 0],
  'Uncertain (Zinc Byproduct)': [0, 0],
  'Uncertain (Bauxite Byproduct)': [0, 0],
  'Byproduct (Not Quantifiable)': [0, 0],
  'Not Quantifiable (USGS)': [0, 0],
  'USA (Spor Mountain)': [39.7500, -112.6500],
  'EV Manufacturers': [0, 0],
  'NATO': [0, 0]
};

export const getCoordinates = (countryName: string): [number, number] => {
  const coords = COUNTRY_COORDINATES[countryName];
  if (!coords && import.meta.env.DEV) {
    // Dev-only warning — stripped from production builds by Vite.
    logger.warn(`Missing mapping for country: "${countryName}". Marker will render at [0,0].`, { countryName });
  }
  return coords || [0, 0];
};

