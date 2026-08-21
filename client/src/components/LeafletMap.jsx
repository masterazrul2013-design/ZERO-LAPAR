import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix default leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const merchantIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const dropoffIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 14);
  }, [center, map]);
  return null;
}

export default function LeafletMap({ merchants = [], dropoffPoints = [], onSelectMerchant }) {
  // Center around Tasek Gelugor, Penang (5.483, 100.496)
  const defaultCenter = [5.483, 100.496];

  return (
    <div className="w-full h-[450px] rounded-2xl overflow-hidden shadow-lg border border-slate-200 relative z-10">
      <MapContainer
        center={defaultCenter}
        zoom={14}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapRecenter center={defaultCenter} />

        {/* Merchant Markers */}
        {merchants.map((m) => (
          <Marker
            key={m.id}
            position={[m.lat || 5.483, m.lng || 100.496]}
            icon={merchantIcon}
          >
            <Popup>
              <div className="p-1 max-w-[200px]">
                <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded bg-emerald-100 text-emerald-800 mb-1">
                  {m.category}
                </span>
                <h4 className="font-bold text-slate-800 text-sm">{m.name}</h4>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">{m.address}</p>
                <div className="mt-2 text-xs font-medium text-emerald-600">
                  Rescued: {m.totalRescuedKg} kg food
                </div>
                {onSelectMerchant && (
                  <button
                    onClick={() => onSelectMerchant(m)}
                    className="mt-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-1 px-2 rounded-lg transition"
                  >
                    Lihat Makanan
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Drop-Off Points Markers */}
        {dropoffPoints.map((dp) => (
          <Marker
            key={dp.id}
            position={[dp.lat || 5.481, dp.lng || 100.494]}
            icon={dropoffIcon}
          >
            <Popup>
              <div className="p-1 max-w-[200px]">
                <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded bg-amber-100 text-amber-800 mb-1">
                  📍 Drop-Off Point
                </span>
                <h4 className="font-bold text-slate-800 text-sm">{dp.name}</h4>
                <p className="text-xs text-slate-600 font-medium mt-1">{dp.type}</p>
                <p className="text-xs text-slate-500 mt-1">{dp.address}</p>
                <div className="mt-2 text-xs text-slate-700 bg-amber-50 p-1.5 rounded border border-amber-200">
                  <div className="font-semibold text-amber-900">Kapasiti: {dp.currentOccupancy}/{dp.capacity} pax</div>
                  <div>Masa: {dp.operatingHours}</div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}