import React from 'react';
import { Calendar, CheckCircle, Clock, Zap } from 'lucide-react';

const Step3TheBid = ({ budget, setBudget, timeline, setTimeline, selectedProduct, selectedPackage }) => {

    const timelines = [
        { id: 'urgent', label: 'דחוף (ASAP)', icon: Zap, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' },
        { id: 'month', label: 'תוך חודש', icon: Clock, color: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-200' },
        { id: 'flexible', label: 'גמיש', icon: Calendar, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    ];

    // Helper to format package name (basic -> בסיסי)
    const packageLabels = {
        basic: 'בסיסי (Basic)',
        advanced: 'מתקדם (Advanced)',
        pro: 'מקצועי (Pro)'
    };

    // Helper to format product ID to Title (Quick mapping logic, ideal would be from shared config)
    const getProductTitle = (id) => {
        // Fallback title formatting
        return id ? id.replace('_', ' ').toUpperCase() : 'מוצר נבחר';
    };

    return (
        <div className="animate-fade-in text-right space-y-8" dir="rtl">

            {/* 1. Project Summary Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex justify-between items-center shadow-sm">
                <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">סיכום בחירה</h3>
                    <div className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <span>{getProductTitle(selectedProduct)}</span>
                        <span className="text-slate-300">|</span>
                        <span className="text-indigo-600">{packageLabels[selectedPackage] || selectedPackage}</span>
                    </div>
                </div>
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-slate-100 shadow-sm">
                    <CheckCircle className="w-6 h-6 text-indigo-600" />
                </div>
            </div>

            {/* 2. Budget Definition */}
            <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">תקציב מקסימלי לפרויקט</h2>
                <div className="bg-white border-2 border-slate-100 rounded-2xl p-8 shadow-sm">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex-1">
                            <label className="block text-sm font-bold text-slate-500 mb-2">סכום בשקלים (₪)</label>
                            <input
                                type="number"
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                                className="w-full text-4xl font-bold text-slate-900 bg-transparent border-b-2 border-slate-200 focus:border-indigo-600 focus:outline-none transition-colors pb-2 placeholder-slate-200"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    {/* Visual Slider */}
                    <input
                        type="range"
                        min="500"
                        max="20000"
                        step="100"
                        value={budget || 0}
                        onChange={(e) => setBudget(e.target.value)}
                        className="w-full h-3 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <div className="flex justify-between mt-3 text-xs font-medium text-slate-400">
                        <span>₪500</span>
                        <span>₪10,000</span>
                        <span>₪20,000+</span>
                    </div>
                </div>
            </div>

            {/* 3. Timeline / Urgency */}
            <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">מתי להתחיל?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {timelines.map((option) => (
                        <div
                            key={option.id}
                            onClick={() => setTimeline(option.id)}
                            className={`cursor-pointer relative p-6 rounded-xl border-2 transition-all duration-200 ${timeline === option.id
                                    ? `bg-white ${option.border} ring-2 ring-indigo-500/20 shadow-lg scale-[1.02]`
                                    : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                                }`}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 ${option.bg} ${option.color}`}>
                                <option.icon className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-lg text-slate-900">{option.label}</h3>

                            {timeline === option.id && (
                                <div className="absolute top-4 left-4 text-indigo-600">
                                    <CheckCircle className="w-5 h-5 fill-indigo-100" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default Step3TheBid;
