import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import type { Incident } from '../api/client';
import { Layout } from '../components/layout/Layout';
import { ArrowLeft, Clock, Activity, MapPin, Stethoscope, BrainCircuit } from 'lucide-react';
import { clsx } from 'clsx';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
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


export const IncidentDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [incident, setIncident] = useState<Incident | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        const fetchIncident = async () => {
            try {
                const data = await api.getIncident(id);
                setIncident(data);
            } catch (error) {
                console.error("Failed to fetch incident", error);
            } finally {
                setLoading(false);
            }
        };
        fetchIncident();
    }, [id]);

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-full">
                    <Activity className="w-8 h-8 text-indigo-500 animate-spin" />
                </div>
            </Layout>
        );
    }

    if (!incident) {
        return (
            <Layout>
                <div className="text-center py-20">
                    <h2 className="text-2xl font-bold text-white">Incident Not Found</h2>
                    <button onClick={() => navigate('/')} className="mt-4 text-indigo-400 hover:underline">
                        Return to Dashboard
                    </button>
                </div>
            </Layout>
        );
    }

    const isCritical = incident.urgency === 'CRITICAL';

    return (
        <Layout>
            <div className="max-w-5xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Feed
                </button>

                {/* Header Section */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className={clsx(
                                'px-3 py-1 rounded-full text-sm font-bold tracking-wider uppercase border',
                                isCritical
                                    ? 'bg-red-500/10 text-red-500 border-red-500/20'
                                    : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                            )}>
                                {incident.urgency}
                            </span>
                            <span className="text-slate-500 flex items-center gap-1 text-sm">
                                <Clock className="w-4 h-4" />
                                {new Date(incident.created_at).toLocaleString()}
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">{incident.input_text}</h1>
                        <p className="text-slate-400">Incident ID: {incident.id}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Info Column */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* NLP Analysis */}
                        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                <Stethoscope className="w-5 h-5 text-indigo-400" />
                                Medical Analysis
                            </h2>
                            <div className="flex flex-wrap gap-2 mb-6">
                                {incident.symptoms.map((symptom, idx) => (
                                    <span key={idx} className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-sm border border-slate-700">
                                        {symptom}
                                    </span>
                                ))}
                            </div>

                            <div className="space-y-3">
                                {incident.reasoning.map((reason, idx) => (
                                    <div key={idx} className="flex gap-3 bg-slate-800/30 p-4 rounded-xl border border-slate-800/50">
                                        <BrainCircuit className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                                        <p className="text-slate-300 text-sm">{reason}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Audit Log */}
                        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">Audit Trail</h2>
                            <div className="space-y-4">
                                {incident.audit_log.map((log, idx) => (
                                    <div key={idx} className="flex gap-4 relative">
                                        <div className="w-px bg-slate-800 absolute left-2.5 top-8 bottom-0" />
                                        <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 shrink-0 z-10" />
                                        <div>
                                            <p className="text-slate-300 font-medium">{log.event}</p>
                                            <p className="text-slate-500 text-xs">{new Date(log.timestamp).toLocaleTimeString()}</p>
                                            <pre className="text-xs text-slate-500 mt-1 font-mono overflow-x-auto">
                                                {JSON.stringify(log.details, null, 2)}
                                            </pre>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Column */}
                    <div className="space-y-6">
                        {/* Map Preview */}
                        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-1 overflow-hidden h-64">
                            {incident.lat && incident.lon ? (
                                <MapContainer center={[incident.lat, incident.lon]} zoom={14} style={{ height: '100%', width: '100%' }} zoomControl={false} dragging={false}>
                                    <TileLayer
                                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                    />
                                    <Marker position={[incident.lat, incident.lon]} />
                                </MapContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                                    <MapPin className="w-6 h-6 mb-2 mx-auto opacity-50" />
                                    No location data
                                </div>
                            )}
                        </div>

                        {/* Action Panel */}
                        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Dispatch Actions</h3>
                            <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium mb-3 transition-colors">
                                Confirm Dispatch
                            </button>
                            <button className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-colors border border-slate-700">
                                Request Manual Review
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};
