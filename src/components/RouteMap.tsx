import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Stop } from '../types';

interface RouteMapProps {
  geometry: [number, number][];
  stops: Stop[];
}

// Fix for default marker icons in Leaflet with Vite
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom marker icons
const createIcon = (emoji: string, size: number = 32) => {
  return L.divIcon({
    html: `<div class="flex items-center justify-center w-8 h-8 text-lg">${emoji}</div>`,
    className: 'custom-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

const stopMarkers: Record<string, string> = {
  start: '🟢',
  pickup: '📦',
  dropoff: '🏁',
  fuel: '⛽',
  break: '☕',
  rest: '🛏️',
  pre_trip: '📋',
  end: '✅',
};

// Component to fit bounds
function FitBounds({ geometry }: { geometry: [number, number][] }) {
  const map = useMap();
  
  useEffect(() => {
    if (geometry.length > 0) {
      const bounds = L.latLngBounds(geometry.map(([lat, lng]) => [lat, lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [geometry, map]);
  
  return null;
}

export function RouteMap({ geometry, stops }: RouteMapProps) {
  const mapRef = useRef<L.Map>(null);

  // Calculate center from geometry
  const center: [number, number] = geometry.length > 0
    ? [
        geometry.reduce((sum, [lat]) => sum + lat, 0) / geometry.length,
        geometry.reduce((sum, [, lng]) => sum + lng, 0) / geometry.length,
      ]
    : [39.8283, -98.5795]; // Center of US

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="h-[600px] relative">
      <MapContainer
        ref={mapRef}
        center={center}
        zoom={5}
        className="h-full w-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        <FitBounds geometry={geometry} />
        
        {/* Glow effect line */}
        <Polyline
          positions={geometry}
          pathOptions={{
            color: '#2dd4bf',
            weight: 14,
            opacity: 0.15,
            lineCap: 'round',
            lineJoin: 'round',
          }}
        />
        
        {/* Route line */}
        <Polyline
          positions={geometry}
          pathOptions={{
            color: '#2dd4bf',
            weight: 4,
            opacity: 0.9,
            lineCap: 'round',
            lineJoin: 'round',
          }}
        />
        
        {/* Stop markers */}
        {stops.map((stop) => (
          <Marker
            key={stop.id}
            position={[stop.coordinates.lat, stop.coordinates.lng]}
            icon={createIcon(stopMarkers[stop.type] || '📍')}
          >
            <Popup>
              <div className="min-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{stopMarkers[stop.type] || '📍'}</span>
                  <div>
                    <h3 className="font-semibold text-white">{stop.type.replace('_', ' ').toUpperCase()}</h3>
                    <p className="text-xs text-spotter-text-muted">Day {stop.day}</p>
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="text-spotter-text-secondary"><strong className="text-white">Location:</strong> {stop.location}</p>
                  <p className="text-spotter-text-secondary"><strong className="text-white">Arrival:</strong> {formatTime(stop.arrival_time)}</p>
                  <p className="text-spotter-text-secondary"><strong className="text-white">Duration:</strong> {stop.duration_minutes} min</p>
                  <p className="text-spotter-text-secondary"><strong className="text-white">Miles:</strong> {stop.cumulative_miles.toLocaleString()}</p>
                  {stop.notes && <p className="text-spotter-text-muted text-xs mt-2">{stop.notes}</p>}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 spotter-card p-4 z-[1000]">
        <h4 className="text-xs font-semibold text-spotter-text-muted uppercase tracking-wider mb-2">Legend</h4>
        <div className="grid grid-cols-3 gap-x-4 gap-y-1 text-xs text-spotter-text-secondary">
          <span>🟢 Start</span>
          <span>📦 Pickup</span>
          <span>🏁 Dropoff</span>
          <span>⛽ Fuel</span>
          <span>☕ Break</span>
          <span>🛏️ Rest</span>
        </div>
      </div>
    </div>
  );
}
