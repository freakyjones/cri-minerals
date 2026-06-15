export interface MacroNode {
  id: string;
  lat: number;
  lng: number;
}

export const MACRO_NODES: Record<string, MacroNode> = {
  // Ports / Coastal Hubs
  Peru_Coast: { id: 'Peru_Coast', lat: -12.0, lng: -77.0 },
  Chile_Coast: { id: 'Chile_Coast', lat: -33.0, lng: -71.6 },
  DRC_Coast: { id: 'DRC_Coast', lat: -4.0, lng: 39.6 }, // Optimized north-east angle to clear Madagascar/Somalia
  China_Coast: { id: 'China_Coast', lat: 31.2, lng: 121.5 },
  Europe_Port: { id: 'Europe_Port', lat: 51.9, lng: 4.4 }, // Rotterdam
  US_West: { id: 'US_West', lat: 33.7, lng: -118.2 }, // LA
  Australia_Coast: { id: 'Australia_Coast', lat: -18.0, lng: 116.0 }, // Clear deep water north-west of Port Hedland
  Indonesia_Coast: { id: 'Indonesia_Coast', lat: -0.8, lng: 113.9 },

  // Chokepoints
  Panama: { id: 'Panama', lat: 9.1, lng: -79.6 },
  Suez: { id: 'Suez', lat: 29.9, lng: 32.5 },
  Cape_of_Good_Hope: { id: 'Cape_of_Good_Hope', lat: -35.3, lng: 20.0 },
  Malacca: { id: 'Malacca', lat: 2.5, lng: 101.5 }, // Aligned to the true center of the Malacca Strait waterway

  // Transit Hubs (Open Ocean Intersections)
  Sri_Lanka_Open_Water: { id: 'Sri_Lanka_Open_Water', lat: 5.0, lng: 80.0 },
  South_Indian_Ocean: { id: 'South_Indian_Ocean', lat: -30.0, lng: 80.0 },
  South_Australia: { id: 'South_Australia', lat: -45.0, lng: 130.0 },
  Southern_Straits_Bypass: { id: 'Southern_Straits_Bypass', lat: -7.5, lng: 105.0 }, // Aligned for clean Sunda Strait entry
  Java_Sea: { id: 'Java_Sea', lat: -1.0, lng: 108.0 },
  Makassar_Strait: { id: 'Makassar_Strait', lat: 0.0, lng: 118.5 },
  South_China_Sea: { id: 'South_China_Sea', lat: 15.0, lng: 115.0 },
  Pacific_South: { id: 'Pacific_South', lat: -30.0, lng: -100.0 },
  Pacific_Mid: { id: 'Pacific_Mid', lat: 0.0, lng: -150.0 },
  Pacific_West: { id: 'Pacific_West', lat: 10.0, lng: 140.0 },
  Atlantic_Mid: { id: 'Atlantic_Mid', lat: 0.0, lng: -30.0 },
  Mediterranean: { id: 'Mediterranean', lat: 35.0, lng: 18.0 }
};

// Define bi-directional edges with distances
export interface MacroEdge {
  targetId: string;
  distance: number;
}

const edges: Record<string, MacroEdge[]> = {};

function addEdge(n1: string, n2: string) {
  const node1 = MACRO_NODES[n1];
  const node2 = MACRO_NODES[n2];
  if (!node1 || !node2) return;
  
  // Approximate distance
  const dist = Math.sqrt(Math.pow(node1.lat - node2.lat, 2) + Math.pow(node1.lng - node2.lng, 2));
  
  if (!edges[n1]) edges[n1] = [];
  if (!edges[n2]) edges[n2] = [];
  
  edges[n1].push({ targetId: n2, distance: dist });
  edges[n2].push({ targetId: n1, distance: dist });
}

// Build the global subway map
// Americas
addEdge('Chile_Coast', 'Peru_Coast');
addEdge('Peru_Coast', 'Panama');
addEdge('Chile_Coast', 'Pacific_South');
addEdge('Pacific_South', 'Pacific_Mid');
addEdge('Pacific_Mid', 'US_West');
addEdge('Pacific_Mid', 'Pacific_West');
addEdge('Pacific_West', 'South_China_Sea');
addEdge('Pacific_West', 'China_Coast');

// Atlantic / Europe
addEdge('Panama', 'Atlantic_Mid');
addEdge('Chile_Coast', 'Atlantic_Mid'); // Via Magellan roughly
addEdge('Atlantic_Mid', 'Europe_Port');
addEdge('Atlantic_Mid', 'Cape_of_Good_Hope');

// Africa / Indian Ocean
addEdge('Europe_Port', 'Mediterranean');
addEdge('Mediterranean', 'Suez');
addEdge('Suez', 'Sri_Lanka_Open_Water');
addEdge('DRC_Coast', 'Sri_Lanka_Open_Water');
addEdge('DRC_Coast', 'Cape_of_Good_Hope'); // Connect East African ports to the southern European loop
addEdge('Cape_of_Good_Hope', 'South_Indian_Ocean');
addEdge('Sri_Lanka_Open_Water', 'South_Indian_Ocean');
addEdge('Sri_Lanka_Open_Water', 'Malacca');
addEdge('Sri_Lanka_Open_Water', 'Southern_Straits_Bypass'); // Bypasses Malacca directly into Sunda Strait corridor

// Asia / Australia
addEdge('Malacca', 'South_China_Sea');
addEdge('South_Indian_Ocean', 'Southern_Straits_Bypass');
addEdge('Southern_Straits_Bypass', 'Java_Sea');
addEdge('Java_Sea', 'South_China_Sea');
addEdge('South_Indian_Ocean', 'South_Australia');
addEdge('South_Indian_Ocean', 'Australia_Coast'); // Safe oceanic passage for Australian critical minerals
addEdge('South_Australia', 'Pacific_West');
addEdge('Australia_Coast', 'Makassar_Strait');
addEdge('Makassar_Strait', 'South_China_Sea');
addEdge('Indonesia_Coast', 'South_China_Sea');
addEdge('South_China_Sea', 'China_Coast');

export const MACRO_EDGES = edges;

// Dijkstra Algorithm for Macro-Graph
export function findMacroPath(startNodeId: string, endNodeId: string, disabledNodes: string[] = []): string[] {
  if (!MACRO_NODES[startNodeId] || !MACRO_NODES[endNodeId]) return [];

  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const unvisited = new Set<string>();

  Object.keys(MACRO_NODES).forEach(nodeId => {
    distances[nodeId] = Infinity;
    previous[nodeId] = null;
    if (!disabledNodes.includes(nodeId)) {
      unvisited.add(nodeId);
    }
  });

  distances[startNodeId] = 0;

  while (unvisited.size > 0) {
    let closestNode: string | null = null;
    let minDistance = Infinity;

    unvisited.forEach(nodeId => {
      if (distances[nodeId] < minDistance) {
        closestNode = nodeId;
        minDistance = distances[nodeId];
      }
    });

    if (!closestNode || minDistance === Infinity) break;
    if (closestNode === endNodeId) break;

    unvisited.delete(closestNode);

    const neighbors = MACRO_EDGES[closestNode] || [];
    for (const neighbor of neighbors) {
      if (!unvisited.has(neighbor.targetId)) continue;
      
      const alt = distances[closestNode] + neighbor.distance;
      if (alt < distances[neighbor.targetId]) {
        distances[neighbor.targetId] = alt;
        previous[neighbor.targetId] = closestNode;
      }
    }
  }

  const path: string[] = [];
  let current: string | null = endNodeId;
  while (current) {
    path.unshift(current);
    current = previous[current];
  }

  if (path.length > 0 && path[0] === startNodeId) {
    return path;
  }
  return [];
}

// Smooth an array of raw coordinates
export function smoothRawPath(rawCoords: [number, number][]): [number, number][] {
  if (rawCoords.length < 2) return rawCoords;
  
  const points: [number, number][] = [];
  for (let i = 0; i < rawCoords.length - 1; i++) {
    const p1 = rawCoords[i];
    const p2 = rawCoords[i+1];
    
    const midLat = (p1[0] + p2[0]) / 2;
    const midLng = (p1[1] + p2[1]) / 2;
    const cpLat = midLat + (p2[1] - p1[1]) * 0.2; 
    const cpLng = midLng + (p1[0] - p2[0]) * 0.2;

    const segments = 20;
    for (let j = 0; j <= segments; j++) {
      const t = j / segments;
      const lat = (1 - t) * (1 - t) * p1[0] + 2 * (1 - t) * t * cpLat + t * t * p2[0];
      const lng = (1 - t) * (1 - t) * p1[1] + 2 * (1 - t) * t * cpLng + t * t * p2[1];
      points.push([lat, lng]);
    }
  }
  return points;
}

// Helper to snap a dynamic geographic coordinate to the nearest MacroNode
export function getClosestMacroNode(lat: number, lng: number, allowedNodes?: string[]): string | null {
  let closestId: string | null = null;
  let minDistance = Infinity;

  Object.values(MACRO_NODES).forEach(node => {
    if (allowedNodes && !allowedNodes.includes(node.id)) return;
    
    // Normalize longitude difference to handle international date line if needed
    let lngDiff = Math.abs(node.lng - lng);
    if (lngDiff > 180) lngDiff = 360 - lngDiff;
    
    const dist = Math.sqrt(Math.pow(node.lat - lat, 2) + Math.pow(lngDiff, 2));
    if (dist < minDistance) {
      minDistance = dist;
      closestId = node.id;
    }
  });

  return closestId;
}
