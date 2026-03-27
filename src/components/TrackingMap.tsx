import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Bike, Home } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';

// Fix for default Leaflet icons in Next.js/React
const createCustomIcon = (IconComponent: React.ReactNode, color: string) => {
  const iconMarkup = renderToStaticMarkup(
    <div style={{ color }} className="bg-white p-2 rounded-full shadow-md border-2 border-white">
      {IconComponent}
    </div>
  );
  
  return L.divIcon({
    html: iconMarkup,
    className: 'custom-leaflet-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

const doctorIcon = createCustomIcon(<Bike size={24} />, '#2563eb');
const patientIcon = createCustomIcon(<Home size={24} />, '#ef4444');

interface TrackingMapProps {
  doctorCoords?: { lat: number; lng: number };
  patientCoords: { lat: number; lng: number };
}

// Componente para centrar el mapa cuando cambian las coordenadas
function RecenterMap({ coords }: { coords: { lat: number; lng: number } }) {
  const map = useMap();
  React.useEffect(() => {
    map.setView([coords.lat, coords.lng], map.getZoom());
  }, [coords, map]);
  return null;
}

export default function TrackingMap({ doctorCoords, patientCoords }: TrackingMapProps) {
  return (
    <div className="h-full w-full rounded-3xl overflow-hidden border border-slate-200 shadow-inner relative z-0">
      <MapContainer 
        center={[patientCoords.lat, patientCoords.lng]} 
        zoom={15} 
        scrollWheelZoom={false}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        
        {/* Marcador del Paciente */}
        <Marker position={[patientCoords.lat, patientCoords.lng]} icon={patientIcon}>
          <Popup>Tu ubicación</Popup>
        </Marker>

        {/* Marcador del Doctor */}
        {doctorCoords && (
          <>
            <Marker position={[doctorCoords.lat, doctorCoords.lng]} icon={doctorIcon}>
              <Popup>MotoDoctor en camino</Popup>
            </Marker>
            <RecenterMap coords={doctorCoords} />
          </>
        )}
      </MapContainer>
      
      {/* Overlay de gradiente para suavizar bordes */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_40px_rgba(0,0,0,0.05)]" />
    </div>
  );
}
