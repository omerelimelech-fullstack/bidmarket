import React from 'react';

const PlaceholderPage = ({ title, icon }) => (
    <div className="p-10 animate-fade-in-up">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">{icon}</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">{title}</h2>
            <p className="text-slate-500 text-lg">
                דף זה נמצא בפיתוח. בקרוב תוכל לראות כאן את כל הנתונים שלך.
            </p>
        </div>
    </div>
);

export const ClientDashboard = () => <PlaceholderPage title="לוח בקרה (Client Dashboard)" icon="📊" />;
export const MySquad = () => <PlaceholderPage title="הצוות שלי (My Squad)" icon="👥" />;
export const Approvals = () => <PlaceholderPage title="אישורים (Approvals)" icon="✅" />;
export const Wallet = () => <PlaceholderPage title="ארנק וחשבוניות (Wallet)" icon="💳" />;
export const Workspace = () => <PlaceholderPage title="אזור עבודה (Workspace)" icon="💼" />;
export const Earnings = () => <PlaceholderPage title="רווחים (Earnings)" icon="💰" />;
export const Profile = () => <PlaceholderPage title="פרופיל (Profile)" icon="👤" />;
