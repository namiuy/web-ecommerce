/**
 * LeafletMap — mapa dinámico con react-leaflet + tiles CARTO Positron (light_all).
 * Positron es claro, neutro y minimalista (gris/blanco, sin tonos beige), combina
 * con el fondo claro del sitio (#F7F7F7) y es 100% gratis SIN API key ni registro.
 * Enfoca UNA sucursal por vez (zoom cercano); al cambiar la sucursal seleccionada
 * el mapa se anima hacia ese punto. Cargado con dynamic + ssr:false desde
 * sucursales.tsx porque Leaflet usa window.
 */
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

type Position = { lat: number; lng: number };

// Pin oscuro con punto central amarillo (#d7fc00) — contrasta sobre el mapa CLARO.
// divIcon para no depender de los assets PNG de Leaflet.
const createAccentIcon = () =>
  L.divIcon({
    className: '',
    html: `
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="40" viewBox="0 0 30 40">
        <ellipse cx="15" cy="38" rx="6" ry="2.5" fill="rgba(0,0,0,0.25)" />
        <path d="M15 1C8.096 1 2.5 6.596 2.5 13.5c0 9 12.5 25 12.5 25S27.5 22.5 27.5 13.5C27.5 6.596 21.904 1 15 1z"
              fill="#1a1a1a" stroke="#000" stroke-width="1"/>
        <circle cx="15" cy="13.5" r="5" fill="#d7fc00"/>
      </svg>`,
    iconSize: [30, 40],
    iconAnchor: [15, 40],
  });

// Re-centra el mapa (animado) cuando cambia la sucursal enfocada
const RecenterMap = ({ center, zoom }: { center: Position; zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lng], zoom, { animate: true });
  }, [center.lat, center.lng, zoom, map]);
  return null;
};

type LeafletMapProps = {
  // Sucursal enfocada — el mapa muestra SOLO este punto, con zoom cercano.
  center: Position;
  zoom?: number;
  height?: string;
};

export const LeafletMap = ({ center, zoom = 16, height = '100%' }: LeafletMapProps) => {
  const accentIcon = createAccentIcon();

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={zoom}
      style={{ height, width: '100%' }}
      scrollWheelZoom={false}
    >
      {/* CARTO Positron (light_all) — claro, neutro, sin beige; gratis y sin API key. */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        maxZoom={20}
      />
      <RecenterMap center={center} zoom={zoom} />
      {/* Un solo marcador: la sucursal enfocada (no se muestran todas a la vez) */}
      <Marker position={[center.lat, center.lng]} icon={accentIcon} />
    </MapContainer>
  );
};
