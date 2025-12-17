import React from 'react';

const products = [
    {
        id: 'instagram',
        title: 'אינסטגרם אורגני',
        description: 'הגדל את המותג שלך עם תוכן עקבי ואיכותי ומעורבות קהל.',
        icon: '📸',
    },
    {
        id: 'ppc',
        title: 'קמפיין ממומן (PPC)',
        description: 'הזרם תנועה ולידים באופן מיידי עם קמפיינים ממומנים מותאמים אישית.',
        icon: '🚀',
    },
    {
        id: 'seo',
        title: 'קידום אורגני (SEO)',
        description: 'בנה סמכות לטווח ארוך ודורג גבוה יותר במנועי חיפוש עם אסטרטגיית תוכן.',
        icon: '✍️',
    },
];

const Step1ProductSelection = ({ selectedProduct, onSelect }) => {
    return (
        <div className="animate-fade-in-up">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">בחירת שירות ראשי</h2>
            <p className="text-slate-500 mb-8 max-w-2xl">בחר את שירות השיווק המתאים ביותר לצרכים שלך. אנו נתאים לך את המומחים הטובים ביותר בתחום.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {products.map((product) => (
                    <div
                        key={product.id}
                        onClick={() => onSelect(product.id)}
                        className={`cursor-pointer rounded-2xl border-2 p-6 transition-all duration-300 relative group overflow-hidden ${selectedProduct === product.id
                            ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-1 ring-indigo-600'
                            : 'border-slate-100 hover:border-indigo-200 bg-white hover:shadow-lg'
                            }`}
                    >
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5 transition-colors ${selectedProduct === product.id ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-50 text-slate-700 group-hover:bg-indigo-50 group-hover:text-indigo-600'
                            }`}>
                            {product.icon}
                        </div>

                        <h3 className={`text-lg font-bold mb-3 ${selectedProduct === product.id ? 'text-indigo-900' : 'text-slate-900'}`}>
                            {product.title}
                        </h3>
                        <p className="text-sm text-slate-500 leading-relaxed group-hover:text-slate-600">
                            {product.description}
                        </p>

                        <div className="mt-6 flex justify-end">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${selectedProduct === product.id ? 'border-indigo-600 bg-indigo-600' : 'border-slate-200'
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
