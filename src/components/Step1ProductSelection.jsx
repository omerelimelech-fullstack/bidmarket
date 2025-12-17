import React from 'react';

const products = [
    {
        id: 'instagram',
        title: 'Organic Instagram',
        description: 'Grow your brand organically with consistent, high-quality content and engagement.',
        icon: '📸',
    },
    {
        id: 'ppc',
        title: 'PPC Campaigns',
        description: 'Drive targeted traffic and leads instantly with optimized Pay-Per-Click campaigns.',
        icon: '🚀',
    },
    {
        id: 'seo',
        title: 'SEO/Content',
        description: 'Build long-term authority and rank higher on search engines with strategic content.',
        icon: '✍️',
    },
];

const Step1ProductSelection = ({ selectedProduct, onSelect }) => {
    return (
        <div className="animate-fade-in-up">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Select a Service</h2>
            <p className="text-gray-500 mb-8">Choose the marketing service that best fits your needs.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {products.map((product) => (
                    <div
                        key={product.id}
                        onClick={() => onSelect(product.id)}
                        className={`cursor-pointer rounded-xl border-2 p-6 transition-all duration-300 hover:shadow-lg ${selectedProduct === product.id
                                ? 'border-blue-600 bg-blue-50 transform -translate-y-1'
                                : 'border-gray-200 hover:border-blue-300 bg-white'
                            }`}
                    >
                        <div className="text-4xl mb-4">{product.icon}</div>
                        <h3 className={`text-lg font-bold mb-2 ${selectedProduct === product.id ? 'text-blue-900' : 'text-gray-800'}`}>
                            {product.title}
                        </h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            {product.description}
                        </p>

                        <div className="mt-4 flex justify-end">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedProduct === product.id ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                                }`}>
                                {selectedProduct === product.id && (
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Step1ProductSelection;
