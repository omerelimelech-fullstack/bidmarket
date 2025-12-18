import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Step1ProductSelection from './Step1ProductSelection';
import Step2ScopeDefinition from './Step2ScopeDefinition';
import Step3TheBid from './Step3TheBid';
import { supabase } from '../supabaseClient';

const Wizard = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [budget, setBudget] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [timeline, setTimeline] = useState('flexible'); // Default to flexible
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleNext = () => {
        if (currentStep === 1 && selectedProduct) {
            setCurrentStep(2);
        } else if (currentStep === 2 && selectedPackage && projectDescription.trim()) {
            setCurrentStep(3);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const getProductTitle = (id) => {
        const titles = {
            instagram: 'אינסטגרם אורגני',
            ppc: 'קמפיין ממומן (PPC)',
            seo: 'קידום אורגני (SEO)'
        };
        return titles[id] || id;
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        // 1. Create Local Project Object
        const newProject = {
            id: Math.floor(Math.random() * 10000).toString(),
            title: getProductTitle(selectedProduct),
            status: 'active', // 'active' for 'פעיל' per dashboard logic
            budget: `₪${Number(budget).toLocaleString()}`,
            proposalsCount: 0,
            date: new Date().toLocaleDateString('en-GB'),
            description: projectDescription,
            package: selectedPackage
        };

        // 2. Save to LocalStorage IMMEDIATELY
        try {
            console.log("Saving project to localStorage...", newProject);
            const existingProjects = JSON.parse(localStorage.getItem('my_projects') || '[]');
            localStorage.setItem('my_projects', JSON.stringify([newProject, ...existingProjects]));
        } catch (e) {
            console.error("Local storage error", e);
        }

        // 3. Attempt Supabase Save (Backup/Real DB) in parallel - DO NOT AWAIT blocking the UI
        try {
            if (supabase) {
                const finalService = `${selectedProduct}_${selectedPackage}`;
                // Fire and forget, or handle silently
                supabase.from('bids').insert([{
                    service: finalService,
                    scope_approved: true,
                    budget: Number(budget),
                    status: 'open',
                }]).then(({ error }) => {
                    if (error) console.error('Supabase background save error:', error);
                    else console.log('Supabase background save success');
                });
            }
        } catch (error) {
            console.error('Supabase error:', error);
        }

        // 4. Force Redirect after short delay to show "Processing" state
        setTimeout(() => {
            setIsSubmitting(false);
            console.log("Redirecting to dashboard...");
            navigate('/client-dashboard');
        }, 1500);
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
                            projectDescription={projectDescription}
                            setProjectDescription={setProjectDescription}
                        />
                    )}
                    {currentStep === 3 && (
                        <Step3TheBid
                            budget={budget}
                            setBudget={setBudget}
                            timeline={timeline}
                            setTimeline={setTimeline}
                            selectedProduct={selectedProduct}
                            selectedPackage={selectedPackage}
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
                                (currentStep === 2 && (!selectedPackage || !projectDescription.trim()))
                            }
                            className={`px-8 py-3 rounded-lg font-bold text-white transition-all transform hover:-translate-y-0.5 ${(currentStep === 1 && !selectedProduct) ||
                                (currentStep === 2 && (!selectedPackage || !projectDescription.trim()))
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
                            {isSubmitting ? 'מפרסם...' : '🚀 פרסם מכרז'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Wizard;
