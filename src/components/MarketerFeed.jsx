import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const MarketerFeed = () => {
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [minPrice, setMinPrice] = useState(2000);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        fetchBids();
    }, []);

    const fetchBids = async () => {
        try {
            if (!supabase) {
                throw new Error('Supabase client not initialized');
            }

            const { data, error } = await supabase
                .from('bids')
                .select('*')
                .eq('status', 'open')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setBids(data || []);
        } catch (err) {
            console.error('Error fetching bids:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClaim = async (bidId) => {
        setBids(currentBids => currentBids.filter(bid => bid.id !== bidId));
        setShowSuccessModal(true);

        try {
            const { error } = await supabase
                .from('bids')
                .update({ status: 'matched' })
                .eq('id', bidId);

            if (error) {
                throw error;
            }
        } catch (err) {
            console.error('Error claiming bid:', err);
            alert('שגיאה בעדכון הסטטוס. אנא רענן את העמוד.');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-200 max-w-md text-center">
                    <p className="font-bold mb-2 text-lg">שגיאה בטעינת הפיד</p>
                    <p className="mb-6">{error}</p>
                    <button
                        onClick={fetchBids}
                        className="px-6 py-2 bg-white border border-red-200 hover:bg-red-50 rounded-lg text-sm font-bold transition-colors"
                    >
                        נסה שוב
                    </button>
                </div>
            </div>
        );
    }

    const serviceNames = {
        'instagram': 'אינסטגרם אורגני',
        'ppc': 'קמפיין ממומן',
        'seo': 'קידום אורגני'
    };

    return (
        <div>
            {/* Feed Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">פיד הזדמנויות</h1>
                    <p className="text-slate-500">איתור פרויקטים מובילים בשוק</p>
                </div>

                <div className="flex items-center gap-4 bg-white p-2 rounded-xl shadow-sm border border-slate-200">
                    <div className="px-4 border-l border-slate-100">
                        <label className="block text-xs font-bold text-slate-400 mb-1">המינימום שלי (₪)</label>
                        <input
                            type="number"
                            value={minPrice}
                            onChange={(e) => setMinPrice(Number(e.target.value))}
                            className="w-32 font-bold text-indigo-900 focus:outline-none bg-transparent"
                            placeholder="0"
                        />
                    </div>
                    <div className="px-4 flex items-center gap-2">
                        <span className="flex h-3 w-3 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </span>
                        <span className="text-sm font-bold text-slate-600">
                            {bids.length} פעילים
                        </span>
                    </div>
                </div>
            </div>

            {/* Grid */}
            {bids.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-slate-100">
                    <div className="text-7xl mb-6 opacity-30">📭</div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">אין הצעות כרגע</h3>
                    <p className="text-slate-500">הפיד מתעדכן בזמן אמת. חזור בקרוב.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {bids.map((bid) => {
                        const budget = bid.budget || 0;
                        const isPerfectMatch = budget >= minPrice;
                        const isGapOpportunity = !isPerfectMatch && budget >= (minPrice * 0.85);
                        const isNoMatch = budget < (minPrice * 0.85);

                        return (
                            <div
                                key={bid.id}
                                className={`bg-white rounded-2xl border transition-all duration-300 flex flex-col group relative ${isNoMatch
                                    ? 'border-slate-100 opacity-60 grayscale hover:grayscale-0 hover:opacity-100'
                                    : 'border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-indigo-100'
                                    }`}
                            >
                                <div className="p-7 flex-1">
                                    {/* Top Badge Row */}
                                    <div className="flex justify-between items-start mb-6">
                                        {isPerfectMatch ? (
                                            <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-emerald-100">
                                                התאמה מושלמת
                                            </span>
                                        ) : isGapOpportunity ? (
                                            <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-amber-100">
                                                הזדמנות
                                            </span>
                                        ) : (
                                            <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-slate-200">
                                                תקציב נמוך
                                            </span>
                                        )}
                                        <span className="text-slate-400 text-xs font-medium bg-slate-50 px-2 py-1 rounded-md">
                                            {new Date(bid.created_at).toLocaleDateString('he-IL')}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div className="mb-6">
                                        <h3 className="text-xl font-bold text-slate-900 mb-1">
                                            {serviceNames[bid.service] || bid.service}
                                        </h3>
                                        <div className="flex items-baseline gap-1">
                                            <span className={`text-3xl font-extrabold ${isNoMatch ? 'text-slate-400' : 'text-slate-900'}`}>
                                                ₪{budget.toLocaleString()}
                                            </span>
                                            <span className="text-slate-400 text-sm font-medium">/חודש</span>
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="space-y-3 mb-8">
                                        <div className="flex items-center text-slate-600 text-sm font-medium">
                                            <div className="w-6 flex justify-center">
                                                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            היקף מאושר: {bid.scope_approved ? 'כן' : 'לא'}
                                        </div>
                                        <div className="flex items-center text-slate-600 text-sm font-medium">
                                            <div className="w-6 flex justify-center">
                                                <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                                </svg>
                                            </div>
                                            עבודה מרחוק / אונליין
                                        </div>
                                    </div>
                                </div>

                                {/* Action Footer */}
                                <div className="p-5 bg-slate-50 border-t border-slate-100 rounded-b-2xl">
                                    <button
                                        disabled={isNoMatch}
                                        onClick={() => handleClaim(bid.id)}
                                        className={`w-full py-3.5 rounded-xl font-bold transition-all shadow-md group flex items-center justify-center gap-2 ${isNoMatch
                                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                                            : isPerfectMatch
                                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
                                                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                                            }`}
                                    >
                                        <span>{isPerfectMatch ? 'קבל פרויקט מיידית' : 'הגש מועמדות'}</span>
                                        {!isNoMatch && (
                                            <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in font-['Heebo']">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center transform animate-bounce-subtle border border-white/20">
                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-3xl font-extrabold text-slate-900 mb-3">ברכות! 🎉</h3>
                        <p className="text-slate-500 mb-8 text-lg leading-relaxed">זכית בעסקה! פרטי ההתקשרות נשלחו למייל שלך.</p>
                        <button
                            onClick={() => setShowSuccessModal(false)}
                            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-200 transition-transform transform hover:-translate-y-1 active:translate-y-0"
                        >
                            חזרה לפיד
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MarketerFeed;
