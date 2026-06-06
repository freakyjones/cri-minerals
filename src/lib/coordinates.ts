export const COUNTRY_COORDINATES: Record<string, [number, number]> = {
  // South America
  'Chile': [-35.6751, -71.5430],
  'Argentina': [-38.4161, -63.6167],
  'Brazil': [-14.2350, -51.9253],
  'Peru': [-9.1900, -75.0152],

  // North America
  'USA': [37.0902, -95.7129],
  'Canada': [56.1304, -106.3468],

  // Africa
  'DRC': [-4.0383, 21.7587], // Democratic Republic of the Congo
  'South Africa': [-30.5595, 22.9375],
  'Mozambique': [-18.6657, 35.5296],
  'Madagascar': [-18.7669, 46.8691],
  'Gabon': [-0.8037, 11.6094],

  // Asia
  'China': [35.8617, 104.1954],
  'Indonesia': [-0.7893, 113.9213],
  'Philippines': [12.8797, 121.7740],
  'Japan': [36.2048, 138.2529],
  'South Korea': [35.9078, 127.7669],
  'Vietnam': [14.0583, 108.2772],
  'Malaysia': [4.2105, 101.9758],
  'Turkey': [38.9637, 35.2433],

  // Europe & Eurasia
  'Russia': [61.5240, 105.3188],
  'Finland': [61.9241, 25.7482],

  // Oceania
  'Australia': [-25.2744, 133.7751],

  // General/Fallbacks
  'Other': [0, 0], // Equator
  'Global': [0, 0],
  'Abundant': [0, 0],
  'Uncertain (Zinc Byproduct)': [0, 0],
  'Uncertain (Bauxite Byproduct)': [0, 0]
};

export const getCoordinates = (countryName: string): [number, number] => {
  return COUNTRY_COORDINATES[countryName] || [0, 0];
};
