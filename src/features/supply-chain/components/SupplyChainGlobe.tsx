/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState, useMemo } from 'react';
import Globe from 'react-globe.gl';
import { Mineral } from '../../minerals/schema/mineralSchema';
import { getCoordinates } from '../../../lib/coordinates';

interface SupplyChainGlobeProps {
  mineral: Mineral;
}

export default function SupplyChainGlobe({ mineral }: SupplyChainGlobeProps) {
  const globeEl = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    updateDimensions();
    
    // Initial delay to ensure parent has rendered sizes properly
    const timer = setTimeout(updateDimensions, 100);
    
    window.addEventListener('resize', updateDimensions);
    return () => {
      window.removeEventListener('resize', updateDimensions);
      clearTimeout(timer);
    }
  }, []);

  const { arcs, points } = useMemo(() => {
    if (!mineral.production.length || !mineral.refining.length) return { arcs: [], points: [] };

    const topRefiner = [...mineral.refining].sort((a, b) => b.share - a.share)[0];
    const destinationCoords = getCoordinates(topRefiner.country);

    if (!destinationCoords) return { arcs: [], points: [] };

    const arcsData: any[] = [];
    const pointsData: any[] = [];

    // Add refiner point
    pointsData.push({
      lat: destinationCoords[0],
      lng: destinationCoords[1],
      size: Math.max(0.5, (topRefiner.share / 100) * 1.5),
      color: '#ffffff',
      label: `<b>${topRefiner.country}</b><br/>Primary Refining Hub<br/>${topRefiner.share}% Market Share`
    });

    const topProducers = [...mineral.production]
      .sort((a, b) => b.share - a.share)
      .slice(0, 10)
      .filter(p => p.country !== topRefiner.country);

    topProducers.forEach(producer => {
      const originCoords = getCoordinates(producer.country);
      if (!originCoords) return;

      // Add producer point
      pointsData.push({
        lat: originCoords[0],
        lng: originCoords[1],
        size: Math.max(0.2, (producer.share / 100) * 1.5),
        color: mineral.color,
        label: `<b>${producer.country}</b><br/>Extraction Source<br/>${producer.share}% Global Production`
      });

      arcsData.push({
        startLat: originCoords[0],
        startLng: originCoords[1],
        endLat: destinationCoords[0],
        endLng: destinationCoords[1],
        color: mineral.color,
        stroke: Math.max(0.5, (producer.share / 100) * 3), // Make lines thicker
        altitude: 0.15 + Math.max(0.05, (producer.share / 100) * 0.4)
      });
    });

    console.log('Globe Data Calculated:', { arcs: arcsData.length, points: pointsData.length });
    return { arcs: arcsData, points: pointsData };
  }, [mineral]);

  useEffect(() => {
    if (globeEl.current && points.length > 0) {
      const controls = globeEl.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.8;

      // Focus on the main refinery with a cinematic swoop
      const refiner = points[0];
      if (refiner) {
        globeEl.current.pointOfView({ lat: refiner.lat, lng: refiner.lng, altitude: 2.2 }, 2500);
      }
    }
  }, [mineral, points]); // Re-run cinematic swoop when mineral changes

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full relative cursor-move bg-[radial-gradient(circle_at_center,#0B0E14_0%,#000000_100%)]"
    >
      {dimensions.width > 0 && (
        <Globe
          ref={globeEl}
          width={dimensions.width}
          height={dimensions.height}
          globeImageUrl="/img/earth-dark.jpg"
          bumpImageUrl="/img/earth-topology.png"
          backgroundColor="rgba(0,0,0,0)"
          arcsData={arcs}
          arcColor={(d: any) => [d.color, '#ffffff']} // Use gradient
          arcDashLength={0.6}
          arcDashGap={0.1}
          arcDashAnimateTime={2000}
          arcStroke="stroke"
          arcAltitude="altitude"
          pointsData={points}
          pointColor="color"
          pointAltitude={0.05} // Raise points slightly
          pointRadius={(d: any) => d.size * 2} // Double the radius to make them more visible
          pointsMerge={false}
          pointLabel="label"
          ringsData={points}
          ringColor="color"
          ringMaxRadius={(d: any) => d.size * 5}
          ringPropagationSpeed={1.2}
          ringRepeatPeriod={800}
          atmosphereColor={mineral.color}
          atmosphereAltitude={0.25}
        />
      )}
    </div>
  );
}
