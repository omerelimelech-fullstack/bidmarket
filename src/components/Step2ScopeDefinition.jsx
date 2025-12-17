import React from 'react';

const packages = {
    instagram: [
        {
            id: 'basic',
            name: 'Basic',
            hebrewName: 'בסיסי',
            features: [
                '4 פוסטים בחודש',
                'סטורי 4 פעמים בשבוע',
                'ניהול קהילה בסיסי',
                'דוח חודשי'
            ],
            color: 'bg-slate-50 border-slate-200'
        },
        {
            id: 'advanced',
            name: 'Advanced',
            hebrewName: 'מתקדם',
            features: [
                '8 פוסטים בחודש',
                'סטורי יומי',
                'ניהול קהילה מלא + תגובות',
                'דוח ביצועים מפורט'
            ],
            color: 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-100'
        },
        {
            id: 'pro',
            name: 'Pro',
            hebrewName: 'פרימיום',
            features: [
                '12 פוסטים בחודש',
                '2 סרטוני Reels',
                'סטורי יומי + עיצוב',
                'ניהול קמפיין ממומן בסיסי'
            ],
            color: 'bg-emerald-50 border-emerald-200 ring-1 ring-emerald-100'
        }
    ],
    // Copying logic for other services for MVP, or we can define specific ones later.
    // User only specified Instagram explicitly, I will generate logical placeholders for others.
    ppc: [
        {
            id: 'basic',
            name: 'Basic',
            hebrewName: 'בסיסי',
            features: [
                'הקמת קמפיין יחיד',
                'מילות מפתח בסיסיות',
                'דוח חודשי',
                'תקציב מדיה עד 2000₪'
            ],
            color: 'bg-slate-50 border-slate-200'
        },
        {
            id: 'advanced',
            name: 'Advanced',
            hebrewName: 'מתקדם',
            features: [
                'עד 3 קמפיינים',
                'רימרקטינג',
                'קופירייטינג למודעות',
                'אופטימיזציה שבועית'
            ],
            color: 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-100'
        },
        {
            id: 'pro',
            name: 'Pro',
            hebrewName: 'פרימיום',
            features: [
                'קמפיינים ללא הגבלה',
                'עיצוב באנרים',
                'דפי נחיתה ייעודיים',
                'אופטימיזציה יומית'
            ],
            color: 'bg-emerald-50 border-emerald-200 ring-1 ring-emerald-100'
        }
    ],
    seo: [
        {
            id: 'basic',
            name: 'Basic',
            hebrewName: 'בסיסי',
            features: [
                'מחקר מילות מפתח',
                'אופטימיזציה טכנית בסיסית',
                'מאמר אחד בחודש',
                'דוח מיקומים'
            ],
            color: 'bg-slate-50 border-slate-200'
        },
        {
            id: 'advanced',
            name: 'Advanced',
            hebrewName: 'מתקדם',
            features: [
                '3 מאמרים בחודש',
                'בניית קישורים (2 בחודש)',
                'אופטימיזציה לשיפור המרה',
                'מחקר מתחרים'
            ],
            color: 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-100'
        },
        {
            id: 'pro',
            name: 'Pro',
            hebrewName: 'פרימיום',
            features: [
                '6 מאמרים בחודש',
                'בניית קישורים איכותית',
                'ניקוי קישורים רעילים',
                'ליווי אסטרטגי מלא'
            ],
            color: 'bg-emerald-50 border-emerald-200 ring-1 ring-emerald-100'
        }
    ]
};

const Step2ScopeDefinition = ({ selectedProduct, selectedPackage, onSelectPackage }) => {
    const currentPackages = packages[selectedProduct] || packages['instagram'];

    return (
        <div className="animate-fade-in-up w-full">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">בחר חבילת שירות</h2>
            <p className="text-slate-500 mb-10">בחר את היקף השירות המתאים לתקציב ולמטרות שלך.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {currentPackages.map((pkg) => {
                    const isSelected = selectedPackage === pkg.id;
                    return (
                        <div
                            key={pkg.id}
                            onClick={() => onSelectPackage(pkg.id)}
                            className={`relative bg-white rounded-2xl p-6 border-2 transition-all duration-200 cursor-pointer flex flex-col ${isSelected
                                    ? 'border-indigo-600 shadow-xl transform -translate-y-1 ring-2 ring-indigo-100'
                                    : 'border-slate-100 hover:border-slate-300 hover:shadow-lg'
                                }`}
                        >
                            {/* Selection Indicator */}
                            <div className="flex justify-between items-center mb-4">
                                <span className={`text-sm font-bold px-3 py-1 rounded-full uppercase tracking-wider ${pkg.id === 'pro' ? 'bg-emerald-100 text-emerald-800' :
                                        pkg.id === 'advanced' ? 'bg-indigo-100 text-indigo-800' :
                                            'bg-slate-100 text-slate-600'
                                    }`}>
                                    {pkg.hebrewName}
                                </span>
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'
                                    }`}>
                                    {isSelected && (
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 mb-4">{pkg.name}</h3>

                            <div className="space-y-3 flex-1">
                                {pkg.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-start text-sm text-slate-600">
                                        <svg className="w-4 h-4 text-emerald-500 ml-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Visual bottom bar for style */}
                            {isSelected && (
                                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-indigo-600 rounded-b-xl"></div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Step2ScopeDefinition;
