import React, { useState } from 'react';
import Step1ProductSelection from './Step1ProductSelection';
import Step2ScopeDefinition from './Step2ScopeDefinition';
import Step3TheBid from './Step3TheBid';
import { supabase } from '../supabaseClient';

const Wizard = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [scopeApproved, setScopeApproved] = useState(false);
    const [budget, setBudget] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleNext = () => {
        if (currentStep === 1 && selectedProduct) {
            setCurrentStep(2);
        } else if (currentStep === 2 && scopeApproved) {
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

            const { data, error } = await supabase
                .from('bids')
                .insert([
                    {
                        service: selectedProduct,
                        scope_approved: scopeApproved,
                        budget: Number(budget),
                        status: 'open'
                    },
                ]);

            if (error) throw error;

            alert('Bid placed successfully!');
        } catch (error) {
            console.error('Error submitting bid:', error);
            alert(error.message || 'Error placing bid. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden">
                {/* Header / Progress */}
                <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Client Wizard</h1>
                        <p className="text-blue-100 text-sm">Step {currentStep} of 3</p>
                    </div>
                    <div className="flex gap-2">
                        {[1, 2, 3].map((step) => (
                            <div
                                key={step}
                                className={`w-3 h-3 rounded-full ${step <= currentStep ? 'bg-white' : 'bg-blue-400'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="p-8">
                    {currentStep === 1 && (
                        <Step1ProductSelection
                            selectedProduct={selectedProduct}
                            onSelect={setSelectedProduct}
                        />
                    )}
                    {currentStep === 2 && (
                        <Step2ScopeDefinition
                            selectedProduct={selectedProduct}
                            isApproved={scopeApproved}
                            onToggleApprove={setScopeApproved}
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
                <div className="p-6 bg-gray-50 border-t flex justify-between">
                    <button
                        onClick={handleBack}
                        disabled={currentStep === 1}
                        className={`px-6 py-2 rounded-lg font-medium transition-colors ${currentStep === 1
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        Back
                    </button>

                    {currentStep < 3 ? (
                        <button
                            onClick={handleNext}
                            disabled={
                                (currentStep === 1 && !selectedProduct) ||
                                (currentStep === 2 && !scopeApproved)
                            }
                            className={`px-6 py-2 rounded-lg font-medium text-white transition-colors ${(currentStep === 1 && !selectedProduct) ||
                                (currentStep === 2 && !scopeApproved)
                                ? 'bg-blue-300 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/30'
                                }`}
                        >
                            Next Step
                        </button>
                    ) : (
                        <button
                            className={`px-6 py-2 rounded-lg font-medium text-white shadow-lg ${isSubmitting
                                ? 'bg-green-400 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700 shadow-green-600/30'
                                }`}
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Bid'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Wizard;
