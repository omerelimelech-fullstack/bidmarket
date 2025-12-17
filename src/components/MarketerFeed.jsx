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
        // Optimistic update: remove from UI immediately
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
            // Optionally revert state here if needed, but for MVP we'll keep it simple
            alert('Error updating deal status. Please refresh.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 max-w-md text-center">
                    <p className="font-bold mb-2">Error Loading Feed</p>
                    <p>{error}</p>
                    <button
                        onClick={fetchBids}
                        className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg text-sm font-medium transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 relative">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Marketplace Feed</h1>
                        <p className="text-gray-500 mt-1">Find your next marketing opportunity</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <label className="block text-xs font-medium text-gray-500 mb-1">My Minimum Price (ILS)</label>
                            <input
                                type="number"
                                value={minPrice}
                                onChange={(e) => setMinPrice(Number(e.target.value))}
                                className="pl-3 pr-3 py-2 border rounded-lg w-40 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border text-sm font-medium text-gray-600 self-end h-[42px] flex items-center">
                            {bids.length} Active Opportunities
                        </div>
                    </div>
                </div>

                {bids.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className="text-6xl mb-4">📭</div>
                        <h3 className="text-xl font-bold text-gray-900">No Bids Yet</h3>
                        <p className="text-gray-500">Wait for clients to submit new requests.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {bids.map((bid) => {
                            const budget = bid.budget || 0;
                            const isPerfectMatch = budget >= minPrice;
                            const isGapOpportunity = !isPerfectMatch && budget >= (minPrice * 0.85);
                            const isNoMatch = budget < (minPrice * 0.85);

                            console.log(`Bid ${bid.id}: Budget=${budget} (${typeof budget}), Min=${minPrice} (${typeof minPrice}) -> Perfect=${isPerfectMatch}, Gap=${isGapOpportunity}`);

                            return (
                                <div
                                    key={bid.id || Math.random()}
                                    className={`bg-white rounded-xl shadow-sm border border-gray-100 transition-all duration-300 overflow-hidden flex flex-col ${isNoMatch ? 'opacity-50 grayscale hover:grayscale-0 hover:opacity-100' : 'hover:shadow-md'
                                        }`}
                                >
                                    <div className="p-6 flex-1">
                                        <div className="flex justify-between items-start mb-4">
                                            {isPerfectMatch ? (
                                                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center">
                                                    <span className="mr-1">★</span> Perfect Match
                                                </div>
                                            ) : isGapOpportunity ? (
                                                <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center">
                                                    <span className="mr-1">⚠</span> Gap Opportunity
                                                </div>
                                            ) : (
                                                <div className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                                                    Low Budget
                                                </div>
                                            )}

                                            <span className="text-gray-400 text-sm ml-auto">
                                                {new Date(bid.created_at).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-bold text-gray-900 mb-2 capitalize">
                                            {bid.service?.replace('_', ' ') || 'Marketing Service'}
                                        </h3>

                                        <div className="flex items-baseline mb-6">
                                            <span className={`text-2xl font-bold ${isNoMatch ? 'text-gray-500' : 'text-green-600'}`}>
                                                ₪{budget.toLocaleString()}
                                            </span>
                                            <span className="text-gray-400 text-sm ml-1">/month</span>
                                        </div>

                                        <div className="space-y-3 mb-6">
                                            <div className="flex items-center text-gray-600 text-sm">
                                                <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Scope Approved: {bid.scope_approved ? 'Yes' : 'No'}
                                            </div>
                                            <div className="flex items-center text-gray-600 text-sm">
                                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                Remote / Online
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-gray-50 border-t border-gray-100">
                                        <button
                                            disabled={isNoMatch}
                                            onClick={() => handleClaim(bid.id)}
                                            className={`w-full py-2.5 rounded-lg font-medium transition-colors shadow-lg flex items-center justify-center group ${isNoMatch
                                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                                                : 'bg-gray-900 hover:bg-gray-800 text-white shadow-gray-900/10'
                                                }`}
                                        >
                                            {isPerfectMatch ? 'Accept Now' : 'Claim Deal'}
                                            {!isNoMatch && (
                                                <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center transform animate-bounce-subtle">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Congratulations!</h3>
                        <p className="text-gray-600 mb-6">You won the deal. The contract has been sent.</p>
                        <button
                            onClick={() => setShowSuccessModal(false)}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-transform transform active:scale-95"
                        >
                            Awesome!
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MarketerFeed;
