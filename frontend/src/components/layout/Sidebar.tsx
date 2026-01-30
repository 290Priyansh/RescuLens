import React from 'react';
import { LayoutDashboard, Radio, Map, Settings, Activity } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Radio, label: 'Live Feed', path: '/feed' },
    { icon: Map, label: 'Map', path: '/map' },
    { icon: Activity, label: 'Analytics', path: '/analytics' },
    { icon: Settings, label: 'Settings', path: '/settings' },
];

export const Sidebar: React.FC = () => {
    const location = useLocation();

    return (
        <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0">
            <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <Activity className="text-white w-5 h-5" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    RescuLens
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={clsx(
                                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group',
                                isActive
                                    ? 'bg-indigo-600/10 text-indigo-400 shadow-lg shadow-indigo-900/20'
                                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'
                            )}
                        >
                            <item.icon
                                className={clsx(
                                    'w-5 h-5 transition-colors',
                                    isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'
                                )}
                            />
                            <span className="font-medium">{item.label}</span>
                            {isActive && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <div className="bg-slate-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                            System Online
                        </span>
                    </div>
                    <p className="text-xs text-slate-500">Connected to HQ Dispatch</p>
                </div>
            </div>
        </aside>
    );
};
