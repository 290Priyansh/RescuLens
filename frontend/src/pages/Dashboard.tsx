import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import type { Incident } from '../api/client';
import { IncidentCard } from '../components/IncidentCard';
import { LiveMap } from '../components/LiveMap';
import { Layout } from '../components/layout/Layout';
import { Activity, RefreshCw } from 'lucide-react';

export const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchIncidents = async () => {
        try {
            const data = await api.getIncidents();
            // Sort by creation time desc
            setIncidents(data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
        } catch (error) {
            console.error("Failed to fetch incidents", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIncidents();
        const interval = setInterval(fetchIncidents, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, []);

    return (
        <Layout>
            <div className="flex justify-between items-end mb-8">
                <div>
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">Live Incident Dashboard</h2>
                        <p className="text-slate-400">Real-time emergency triage and dispatch monitoring</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={async () => {
                                setLoading(true);
                                await api.simulateIncidents(3);
                                await fetchIncidents();
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white transition-colors font-medium shadow-lg shadow-indigo-900/20"
                        >
                            <Activity className="w-4 h-4" />
                            Simulate Emergency
                        </button>
                        <button
                            onClick={() => fetchIncidents()}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors border border-slate-700"
                        >
                            <RefreshCw className={`w - 4 h - 4 ${loading ? 'animate-spin' : ''} `} />
                            Refresh
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {incidents.slice(0, 8).map((incident) => (
                    <IncidentCard key={incident.id} incident={incident} onClick={(id) => navigate(`/incidents/${id}`)} />
                ))}

                {incidents.length === 0 && !loading && (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/50">
                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Activity className="w-8 h-8 text-slate-500" />
                        </div>
                        <h3 className="text-xl font-medium text-slate-300">No Active Incidents</h3>
                        <p className="text-slate-500 max-w-sm mx-auto mt-2">
                            New emergency calls affecting the monitored area will appear here automatically.
                        </p>
                    </div>
                )}
            </div>


            <div className="mt-8">
                <h3 className="text-xl font-bold text-white mb-4">Geospatial Awareness</h3>
                <LiveMap incidents={incidents} />
            </div>
        </Layout >
    );
};
