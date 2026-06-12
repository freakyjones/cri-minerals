declare module 'arc' {
  export class GreatCircle {
    constructor(start: { x: number; y: number }, end: { x: number; y: number });
    Arc(points: number): {
      geometries: { coords: [number, number][] }[];
    };
  }
}
