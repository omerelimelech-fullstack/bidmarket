import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const Auth = () => {
    const [view, setView] = useState('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('client');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (view === 'signup') {
                const { data, error: signUpError } = await supabase.auth.signUp({
                    email: email.trim(),
                    password,
                });

                if (signUpError) throw signUpError;

                if (data.user) {
                    const { error: profileError } = await supabase
                        .from('profiles')
                        .insert([
                            { id: data.user.id, role: role }
                        ]);

                    if (profileError) {
                        console.error('Error creating profile:', profileError);
                        throw new Error('שגיאה ביצירת פרופיל. אנא נסה שוב.');
                    }
                }
                alert('ההרשמה הצליחה! אנא בדוק את האימייל לאימות (אם נדרש) או התחבר.');
            } else {
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email: email.trim(),
                    password,
                });

                if (signInError) throw signInError;
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 font-['Heebo']">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">

                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 text-white mb-4 shadow-lg shadow-indigo-200">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                        Flex-Bid
                    </h1>
                    <p className="text-slate-500">
                        {view === 'signin' ? 'ברוך שובך! התחבר כדי להמשיך.' : 'הצטרף לפלטפורמה לחברות מובילות.'}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100 flex items-start">
                        <svg className="w-5 h-5 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                    </div>
                )}

                <form onSubmit={handleAuth} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">כתובת אימייל</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-slate-400"
                            placeholder="name@company.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">סיסמה</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-slate-400"
                            placeholder="••••••••"
                        />
                    </div>

                    {view === 'signup' && (
                        <div className="pt-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-3">אני מחפש...</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setRole('client')}
                                    className={`p-4 rounded-xl border-2 text-center transition-all ${role === 'client'
                                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600'
                                            : 'border-slate-200 hover:border-indigo-300 text-slate-600 bg-white'
                                        }`}
                                >
                                    <div className="text-2xl mb-2">💼</div>
                                    <div className="font-bold text-sm">לשכור</div>
                                    <div className="text-xs opacity-80 mt-1">לקוח עסקי</div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('marketer')}
                                    className={`p-4 rounded-xl border-2 text-center transition-all ${role === 'marketer'
                                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600'
                                            : 'border-slate-200 hover:border-indigo-300 text-slate-600 bg-white'
                                        }`}
                                >
                                    <div className="text-2xl mb-2">🚀</div>
                                    <div className="font-bold text-sm">לעבוד</div>
                                    <div className="text-xs opacity-80 mt-1">ספק שירות</div>
                                </button>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                    >
                        {loading ? 'מעבד נתונים...' : view === 'signin' ? 'התחבר למערכת' : 'צור חשבון חדש'}
                    </button>
                </form>

                <div className="mt-8 text-center pt-6 border-t border-slate-100">
                    <p className="text-slate-600 text-sm">
                        {view === 'signin' ? 'עדיין אין לך חשבון?' : 'כבר רשום למערכת?'}
                        <button
                            onClick={() => {
                                setView(view === 'signin' ? 'signup' : 'signin');
                                setError(null);
                            }}
                            className="mr-2 text-indigo-600 hover:text-indigo-800 font-bold transition-colors"
                        >
                            {view === 'signin' ? "הרשם עכשיו" : "התחבר"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Auth;
