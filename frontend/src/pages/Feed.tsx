import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import type { Incident } from '../api/client';
import { Layout } from '../components/layout/Layout';
import { useNavigate } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { clsx } from 'clsx';

export const Feed: React.FC = () => {
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchIncidents = async () => {
        try {
            const data = await api.getIncidents();
            setIncidents(data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
        } catch (error) {
            console.error("Failed to fetch incidents", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIncidents();
        const interval = setInterval(fetchIncidents, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Layout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Live Incident Feed</h2>
                    <p className="text-slate-400">All incoming emergency calls and triage status</p>
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search incidents..."
                            className="bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 w-64"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors text-sm font-medium">
                        <Filter className="w-4 h-4" />
                        Filter
                    </button>
                </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-900/80 border-b border-slate-700">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Incident</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Time</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Symptoms</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {incidents.map((incident) => (
                            <tr key={incident.id} onClick={() => navigate(`/incidents/${incident.id}`)} className="hover:bg-slate-800/40 transition-colors cursor-pointer group">
                                <td className="px-6 py-4">
                                    <span className={clsx(
                                        'px-2.5 py-1 rounded-md text-xs font-bold tracking-wider uppercase border',
                                        incident.urgency === 'CRITICAL'
                                            ? 'bg-red-500/10 text-red-500 border-red-500/20'
                                            : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                    )}>
                                        {incident.urgency}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-slate-200 font-medium line-clamp-1">{incident.input_text}</p>
                                    <p className="text-xs text-slate-500 font-mono mt-0.5">{incident.id.slice(0, 8)}</p>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-400">
                                    {new Date(incident.created_at).toLocaleTimeString()}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-1">
                                        {incident.symptoms.slice(0, 2).map((s, i) => (
                                            <span key={i} className="text-xs px-2 py-0.5 bg-slate-800 rounded text-slate-400 border border-slate-700">
                                                {s}
                                            </span>
                                        ))}
                                        {incident.symptoms.length > 2 && (
                                            <span className="text-xs px-1 py-0.5 text-slate-500">+{incident.symptoms.length - 2}</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-indigo-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                        View Details &rarr;
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {incidents.length === 0 && !loading && (
                            <tr>
                                <td colSpan={5} className="px-6 py-20 text-center text-slate-500">
                                    No incidents found. Run a simulation to start.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
};
