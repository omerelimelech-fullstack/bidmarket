import React from 'react';

const Step3TheBid = ({ budget, setBudget }) => {
    const budgetNum = Number(budget);
    const isBudgetTooLow = budget !== '' && budgetNum < 1000;
    const isMatchLikely = budgetNum >= 1000;

    return (
        <div className="animate-fade-in-up">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">The Bid</h2>
            <p className="text-gray-500 mb-8">Set your monthly budget for this service.</p>

            <div className="max-w-md mx-auto">
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Budget (ILS)</label>
                <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">₪</span>
                    </div>
                    <input
                        type="number"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className={`block w-full pl-7 pr-12 py-3 sm:text-lg border-2 rounded-lg focus:ring-4 focus:outline-none transition-colors ${isBudgetTooLow
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-100 text-red-900'
                                : isMatchLikely
                                    ? 'border-green-300 focus:border-green-500 focus:ring-green-100 text-green-900'
                                    : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
                            }`}
                        placeholder="0.00"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">ILS</span>
                    </div>
                </div>

                {/* Feedback / Validation Messages */}
                <div className="mt-4 min-h-[60px]">
                    {isBudgetTooLow && (
                        <div className="flex items-center text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 animate-shake">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Budget too low for quality marketing
                        </div>
                    )}

                    {isMatchLikely && (
                        <div className="flex items-center text-green-700 bg-green-50 p-3 rounded-lg border border-green-100 animate-pulse-subtle">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Match Likelihood: High
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Step3TheBid;
