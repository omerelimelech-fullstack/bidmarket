import React from 'react';
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
    LogOut
} from 'lucide-react';

const Sidebar = ({ userRole, onSignOut }) => {

    const clientLinks = [
        { to: '/client-dashboard', label: 'לוח בקרה', icon: LayoutDashboard },
        { to: '/wizard', label: 'פרויקט חדש', icon: PlusCircle },
        { to: '/my-marketers', label: 'הצוות שלי', icon: Users },
        { to: '/approvals', label: 'אישורים', icon: CheckSquare },
        { to: '/wallet', label: 'ארנק וחשבוניות', icon: CreditCard },
    ];

    const marketerLinks = [
        { to: '/feed', label: 'פיד הזדמנויות', icon: Zap },
        { to: '/workspace', label: 'אזור עבודה', icon: Briefcase },
        { to: '/earnings', label: 'רווחים', icon: DollarSign },
        { to: '/profile', label: 'פרופיל', icon: User },
    ];

    const links = userRole === 'client' ? clientLinks : userRole === 'marketer' ? marketerLinks : [];

    return (
        <div className="w-64 bg-slate-900 text-white h-screen fixed top-0 right-0 flex flex-col z-50 shadow-2xl overflow-y-auto border-l border-slate-800">
            {/* Brand Header */}
            <div className="p-6 flex items-center gap-3 border-b border-slate-800">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <span className="text-xl font-bold tracking-tight">Flex-Bid</span>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 py-6 px-3 space-y-1">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${isActive
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`
                        }
                    >
                        <link.icon className="w-5 h-5" />
                        <span className="font-medium text-sm">{link.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Footer / Sign Out */}
            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={onSignOut}
                    className="flex items-center gap-3 px-3 py-3 w-full text-slate-400 hover:bg-slate-800 hover:text-red-400 rounded-lg transition-colors group"
                >
                    <LogOut className="w-5 h-5 group-hover:text-red-400 transition-colors" />
                    <span className="font-medium text-sm">התנתק</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
