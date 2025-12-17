import React from 'react';

const Step3TheBid = ({ budget, setBudget }) => {
    const budgetNum = Number(budget);
    const isBudgetTooLow = budget !== '' && budgetNum < 1000;
    const isMatchLikely = budgetNum >= 1000;

    return (
        <div className="animate-fade-in-up">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">הצעת תקציב חודשי</h2>
            <p className="text-slate-500 mb-10 max-w-2xl">קבע את התקציב שלך לשירות זה. תקציב ריאלי ימשוך ספקים איכותיים יותר.</p>

            <div className="max-w-md mx-auto">
                <label className="block text-sm font-bold text-slate-700 mb-2">תקציב בשקלים חדשים (₪)</label>
                <div className="relative">
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <span className="text-slate-400 font-bold text-lg">₪</span>
                    </div>
                    <input
                        type="number"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className={`block w-full pr-10 pl-4 py-4 text-xl font-bold bg-slate-50 border rounded-xl focus:outline-none transition-all placeholder-slate-300 ${isBudgetTooLow
                            ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100 text-red-900'
                            : isMatchLikely
                                ? 'border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 text-emerald-900'
                                : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 text-slate-900'
                            }`}
                        placeholder="0.00"
                    />
                </div>

                {/* Feedback / Validation Messages */}
                <div className="mt-6 min-h-[60px]">
                    {isBudgetTooLow && (
                        <div className="flex items-start text-red-700 bg-red-50 p-4 rounded-xl border border-red-100 animate-shake">
                            <svg className="w-6 h-6 ml-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <div>
                                <span className="block font-bold">התקציב נמוך מדי</span>
                                <span className="text-sm opacity-80">קשה למצוא מומחים בתקציב זה. מומלץ מינימום 1,000 ₪.</span>
                            </div>
                        </div>
                    )}

                    {isMatchLikely && (
                        <div className="flex items-start text-emerald-800 bg-emerald-50 p-4 rounded-xl border border-emerald-100 animate-pulse-subtle">
                            <svg className="w-6 h-6 ml-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <span className="block font-bold">תקציב מצוין!</span>
                                <span className="text-sm opacity-80">יש סבירות גבוהה להתאמה עם משווקים מובילים.</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Step3TheBid;
