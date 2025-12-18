import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    PlusCircle,
    Users,
    CheckSquare,
    CreditCard,
    Zap,
    Briefcase,
    DollarSign,
    User,
    LogOut,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

import { supabase } from '../supabaseClient';

const Sidebar = ({ userRole }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const clientLinks = [
        { to: '/client-dashboard', label: 'לוח בקרה', icon: LayoutDashboard },
        { to: '/wizard', label: 'פרויקט חדש', icon: PlusCircle },
        { to: '/my-marketers', label: 'הצוות שלי', icon: Users },
        { to: '/approvals', label: 'אישורים', icon: CheckSquare },
        { to: '/wallet', label: 'ארנק וחשבוניות', icon: CreditCard },
    ];

    const marketerLinks = [
        { to: '/marketer-feed', label: 'פיד הזדמנויות', icon: Zap },
        { to: '/workspace', label: 'אזור עבודה', icon: Briefcase },
        { to: '/earnings', label: 'רווחים', icon: DollarSign },
        { to: '/profile', label: 'פרופיל', icon: User },
    ];

    const links = userRole === 'client' ? clientLinks : userRole === 'marketer' ? marketerLinks : [];

    const handleLogout = () => {
        console.log("Sidebar performing smart logout...");

        // 1. Backup the critical data we want to KEEP
        const projects = localStorage.getItem('my_projects');
        const proposals = localStorage.getItem('proposals');

        // 2. Clear EVERYTHING (this ensures the Supabase session token is destroyed)
        localStorage.clear();
        sessionStorage.clear();

        // 3. Restore the data immediately
        if (projects) localStorage.setItem('my_projects', projects);
        if (proposals) localStorage.setItem('proposals', proposals);

        // 4. Fire and forget - Sign out from server (optional)
        supabase.auth.signOut();

        // 5. Force reload to Login page
        window.location.href = '/';
    };

    return (
        <div
            className={`bg-slate-900 text-white h-screen sticky top-0 flex flex-col z-50 shadow-2xl transition-all duration-300 border-l border-slate-800 ${isCollapsed ? 'w-20' : 'w-64'
                }`}
        >
            {/* Brand Header */}
            <div className={`p-4 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} border-b border-slate-800 h-20`}>
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-8 h-8 min-w-[2rem] bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <span className={`text-xl font-bold tracking-tight whitespace-nowrap transition-opacity duration-300 ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'
                        }`}>
                        Flex-Bid
                    </span>
                </div>

                {/* Toggle Button (Hidden if collapsed usually, but user wants it visible to open) */}
                {/* Actually, if collapsed, we need the button to open it. Best to place it absolute or just in list? */}
                {/* User asked for a "small button at the top-right (or next to logo)". */}
                {/* If collapsed, where is it? If brand is centered, button might clutter. */}
                {/* Let's put the button nearby the logo, always visible. */}
                {!isCollapsed && (
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Collapse Toggle for Collapsed State (Centered) */}
            {isCollapsed && (
                <div className="flex justify-center py-2 border-b border-slate-800">
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Navigation Menu */}
            <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto overflow-x-hidden custom-scrollbar">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        title={isCollapsed ? link.label : ''}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative ${isActive
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            } ${isCollapsed ? 'justify-center' : ''}`
                        }
                    >
                        <link.icon className={`w-5 h-5 min-w-[1.25rem] transition-transform duration-300 ${isCollapsed ? 'scale-110' : ''}`} />

                        <span className={`font-medium text-sm whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'
                            }`}>
                            {link.label}
                        </span>

                        {/* Tooltip for collapsed state */}
                        {isCollapsed && (
                            <div className="absolute right-full mr-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-xl border border-slate-700">
                                {link.label}
                            </div>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Footer / Sign Out */}
            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={handleLogout}
                    title={isCollapsed ? "התנתק" : ''}
                    className={`flex items-center gap-3 px-3 py-3 w-full text-slate-400 hover:bg-slate-800 hover:text-red-400 rounded-lg transition-colors group cursor-pointer ${isCollapsed ? 'justify-center' : ''
                        }`}
                >
                    <LogOut className="w-5 h-5 min-w-[1.25rem] group-hover:text-red-400 transition-colors" />
                    <span className={`font-medium text-sm whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'
                        }`}>
                        התנתק
                    </span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
