import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { Incident } from '../api/client';
import L from 'leaflet';

// Fix Leaflet Default Icon issue
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

L.Marker.prototype.options.icon = L.icon({
    iconRetinaUrl: iconRetina,
    iconUrl: iconUrl,
    shadowUrl: shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

interface LiveMapProps {
    incidents: Incident[];
}

export const LiveMap: React.FC<LiveMapProps> = ({ incidents }) => {
    // Default center (can be dynamic based on first incident)
    const center: [number, number] = [23.2599, 77.4126];

    return (
        <div className="w-full h-[400px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative z-0">
            <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                {incidents.map((incident) => {
                    if (incident.lat && incident.lon) {
                        return (
                            <Marker key={incident.id} position={[incident.lat, incident.lon]}>
                                <Popup className="text-black">
                                    <div className="p-2 min-w-[200px]">
                                        <div className="flex items-center gap-2 mb-2 font-bold uppercase text-xs">
                                            <span className={incident.urgency === 'CRITICAL' ? 'text-red-600' : 'text-yellow-600'}>
                                                {incident.urgency}
                                            </span>
                                        </div>
                                        <p className="text-sm font-medium">{incident.input_text}</p>
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    }
                    return null;
                })}
            </MapContainer>
        </div>
    );
};
