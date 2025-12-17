import React from 'react';

const scopes = {
    instagram: [
        '8 Posts/month',
        'Daily Story',
        'Community Management',
        'Monthly Report',
    ],
    ppc: [
        'Campaign Setup & Strategy',
        'Ad Copywriting',
        'A/B Testing',
        'Weekly Optimization',
    ],
    seo: [
        '4 Blog Post (1000 words)',
        'On-Page Optimization',
        'Keyword Research',
        'Backlink Strategy',
    ],
};

const Step2ScopeDefinition = ({ selectedProduct, isApproved, onToggleApprove }) => {
    const currentScope = scopes[selectedProduct] || [];

    return (
        <div className="animate-fade-in-up">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Define Scope</h2>
            <p className="text-gray-500 mb-8">Review the deliverables included in this package.</p>

            <div className="bg-white border rounded-xl p-6 mb-8 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 capitalize border-b pb-2">
                    Included in {selectedProduct?.replace('_', ' ')}
                </h3>
                <div className="space-y-3">
                    {currentScope.map((item, index) => (
                        <div key={index} className="flex items-center text-gray-700">
                            <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{item}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex items-center p-4 bg-blue-50 rounded-lg border border-blue-100 cursor-pointer" onClick={() => onToggleApprove(!isApproved)}>
                <div className={`w-6 h-6 rounded border-2 mr-3 flex items-center justify-center transition-colors ${isApproved ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'
                    }`}>
                    {isApproved && (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </div>
                <span className="text-gray-900 font-medium select-none">I approve this scope</span>
            </div>
        </div>
    );
};

export default Step2ScopeDefinition;
