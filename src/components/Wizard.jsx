import React, { useState } from 'react';
import Step1ProductSelection from './Step1ProductSelection';
import Step2ScopeDefinition from './Step2ScopeDefinition';
import Step3TheBid from './Step3TheBid';
import { supabase } from '../supabaseClient';

const Wizard = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedPackage, setSelectedPackage] = useState(null); // Changed from scopeApproved
    const [budget, setBudget] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleNext = () => {
        if (currentStep === 1 && selectedProduct) {
            setCurrentStep(2);
        } else if (currentStep === 2 && selectedPackage) { // Check package selection
            setCurrentStep(3);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            if (!supabase) {
                throw new Error('Supabase client is not initialized. Check your .env file.');
            }

            // Combine product and package for the service field
            // e.g. "instagram_advanced"
            const finalService = `${selectedProduct}_${selectedPackage}`;

            const { data, error } = await supabase
                .from('bids')
                .insert([
                    {
                        service: finalService,
                        scope_approved: true, // Legacy field, keeping expected boolean
                        budget: Number(budget),
                        status: 'open'
                    },
                ]);

            if (error) throw error;

            alert('ההצעה הוגשה בהצלחה!');
            // Reset wizard
            setCurrentStep(1);
            setSelectedProduct(null);
            setSelectedPackage(null);
            setBudget('');
        } catch (error) {
            console.error('Error submitting bid:', error);
            alert(error.message || 'שגיאה בהגשת הצעה. אנא נסה שוב.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full">
            <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
                {/* Header / Progress - Making it cleaner */}
                <div className="bg-white p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">אשף יצירת פרויקט</h1>
                        <p className="text-slate-500 text-sm mt-1">שלב {currentStep} מתוך 3: {
                            currentStep === 1 ? 'בחירת שירות' :
                                currentStep === 2 ? 'בחירת חבילה' :
                                    'הצעת תקציב'
                        }</p>
                    </div>

                    {/* Progress Steps UI */}
                    <div className="flex items-center gap-2">
                        {[1, 2, 3].map((step) => (
                            <div key={step} className="flex items-center">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step === currentStep
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                        : step < currentStep
                                            ? 'bg-green-500 text-white'
                                            : 'bg-slate-100 text-slate-400'
                                        }`}
                                >
                                    {step < currentStep ? '✓' : step}
                                </div>
                                {step < 3 && (
                                    <div className={`w-8 h-1 mx-1 rounded-full ${step < currentStep ? 'bg-green-500' : 'bg-slate-100'}`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 md:p-10 min-h-[400px]">
                    {currentStep === 1 && (
                        <Step1ProductSelection
                            selectedProduct={selectedProduct}
                            onSelect={setSelectedProduct}
                        />
                    )}
                    {currentStep === 2 && (
                        <Step2ScopeDefinition
                            selectedProduct={selectedProduct}
                            selectedPackage={selectedPackage}
                            onSelectPackage={setSelectedPackage}
                        />
                    )}
                    {currentStep === 3 && (
                        <Step3TheBid
                            budget={budget}
                            setBudget={setBudget}
                        />
                    )}
                </div>

                {/* Footer / Navigation */}
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                    <button
                        onClick={handleBack}
                        disabled={currentStep === 1}
                        className={`px-6 py-3 rounded-lg font-medium transition-colors ${currentStep === 1
                            ? 'text-slate-300 cursor-not-allowed'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-white hover:shadow-sm'
                            }`}
                    >
                        חזור
                    </button>

                    {currentStep < 3 ? (
                        <button
                            onClick={handleNext}
                            disabled={
                                (currentStep === 1 && !selectedProduct) ||
                                (currentStep === 2 && !selectedPackage)
                            }
                            className={`px-8 py-3 rounded-lg font-bold text-white transition-all transform hover:-translate-y-0.5 ${(currentStep === 1 && !selectedProduct) ||
                                (currentStep === 2 && !selectedPackage)
                                ? 'bg-slate-300 cursor-not-allowed transform-none'
                                : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200'
                                }`}
                        >
                            המשך לשלב הבא
                        </button>
                    ) : (
                        <button
                            className={`px-8 py-3 rounded-lg font-bold text-white shadow-lg transition-all transform hover:-translate-y-0.5 ${isSubmitting
                                ? 'bg-emerald-400 cursor-not-allowed'
                                : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
                                }`}
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'שולח...' : '✨ שלח הצעה'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Wizard;
