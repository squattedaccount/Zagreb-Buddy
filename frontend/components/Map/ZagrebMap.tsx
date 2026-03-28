'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Itinerary } from '@/lib/types';
import 'leaflet/dist/leaflet.css';

function createNumberedIcon(n: number) {
  return L.divIcon({
    className: '',
    html: `<div style="
      background: #059669;
      color: white;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: bold;
      border: 2px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.4);
    ">${n}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

function FitBounds({ itinerary }: { itinerary: Itinerary }) {
  const map = useMap();

  useEffect(() => {
    if (itinerary.places.length > 0) {
      const bounds = L.latLngBounds(
        itinerary.places.map((p) => [p.lat, p.lng] as [number, number])
      );
      map.fitBounds(bounds, { padding: [30, 30], maxZoom: 15 });
    }
  }, [itinerary, map]);

  return null;
}

interface ZagrebMapProps {
  itinerary: Itinerary;
}

export function ZagrebMap({ itinerary }: ZagrebMapProps) {
  const center: [number, number] = [45.813, 15.977];

  return (
    <MapContainer
      center={center}
      zoom={14}
      className="w-full h-full"
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
      />
      <FitBounds itinerary={itinerary} />
      {itinerary.places.map((place, i) => (
        <Marker
          key={place.id}
          position={[place.lat, place.lng]}
          icon={createNumberedIcon(i + 1)}
        >
          <Popup>
            <div className="text-sm">
              <strong>{place.name}</strong>
              <br />
              {place.one_liner}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
