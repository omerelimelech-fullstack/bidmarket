import React, { useEffect, useState } from 'react';

const MOCK_PROJECTS = [
    {
        id: 'm1',
        title: 'ניהול עמוד אינסטגרם למותג אופנה',
        service: 'instagram',
        package: 'premium',
        budget: 4500,
        urgency: 'urgent',
        status: 'open',
        description: 'דרוש מנהל/ת למותג אופנה צומח. כולל יצירת תוכן, רילס, וסטוריז יומיומיים. נדרש ניסיון קודם בתחום.',
        date: new Date(Date.now() - 86400000 * 2).toLocaleDateString('en-GB'), // 2 days ago
        scope_approved: true
    },
    {
        id: 'm2',
        title: 'קידום אורגני לאתר איקומרס',
        service: 'seo',
        package: 'standard',
        budget: 3200,
        urgency: 'flexible',
        status: 'open',
        description: 'אופטימיזציה למנועי חיפוש לחנות וירטואלית בתחום הבית והגן. דגש על מחקר מילים וקישורים.',
        date: new Date(Date.now() - 86400000 * 5).toLocaleDateString('en-GB'),
        scope_approved: true
    },
    {
        id: 'm3',
        title: 'קמפיין PPC ממוקד לידים',
        service: 'ppc',
        package: 'basic',
        budget: 2500,
        urgency: 'normal',
        status: 'open',
        description: 'הקמה וניהול קמפיין ממומן בפייסבוק ואינסטגרם לעסק נותן שירותים. תקציב מדיה נפרד.',
        date: new Date(Date.now() - 86400000 * 1).toLocaleDateString('en-GB'),
        scope_approved: true
    },
    {
        id: 'm4',
        title: 'מיתוג מחדש ושפה ויזואלית',
        service: 'branding',
        package: 'premium',
        budget: 8000,
        urgency: 'urgent',
        status: 'open',
        description: 'עיצוב לוגו, ספר מותג, ועיצובים לרשתות חברתיות עבור סטארטאפ בתחום הפינטק.',
        date: new Date(Date.now() - 86400000 * 3).toLocaleDateString('en-GB'),
        scope_approved: false
    }
];

const MarketerFeed = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProject, setSelectedProject] = useState(null); // For proposal modal
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showProposalModal, setShowProposalModal] = useState(false);
    const [proposalAmount, setProposalAmount] = useState('');
    const [proposalPitch, setProposalPitch] = useState('');

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = () => {
        setLoading(true);
        // Simulate network delay
        setTimeout(() => {
            try {
                const localProjects = JSON.parse(localStorage.getItem('my_projects') || '[]');

                // Merge local projects with mock projects
                // Local projects usually don't have all fields like 'urgency' populated by wizard yet, so we define defaults
                const formattedLocalProjects = localProjects.map(p => ({
                    ...p,
                    source: 'local',
                    urgency: p.urgency || 'normal'
                }));

                // Combine: Newest (Local) First
                const allProjects = [...formattedLocalProjects, ...MOCK_PROJECTS];
                setProjects(allProjects);
            } catch (e) {
                console.error("Failed to load projects", e);
                setProjects(MOCK_PROJECTS);
            } finally {
                setLoading(false);
            }
        }, 800);
    };

    const handleOpenProposal = (project) => {
        setSelectedProject(project);
        setProposalAmount(project.budget || '');
        setProposalPitch('');
        setShowProposalModal(true);
    };

    const handleSubmitProposal = (e) => {
        e.preventDefault();

        const proposal = {
            id: Math.random().toString(36).substr(2, 9),
            projectId: selectedProject.id,
            projectTitle: selectedProject.title,
            marketerRole: 'marketer', // As requested
            amount: proposalAmount,
            pitch: proposalPitch,
            date: new Date().toISOString()
        };

        // Save to localStorage
        try {
            const currentProposals = JSON.parse(localStorage.getItem('proposals') || '[]');
            localStorage.setItem('proposals', JSON.stringify([proposal, ...currentProposals]));
            console.log('Proposal saved:', proposal);
        } catch (error) {
            console.error('Error saving proposal:', error);
        }

        setShowProposalModal(false);
        setTimeout(() => {
            setShowSuccessModal(true);
        }, 300);
    };

    const closeSuccessModal = () => {
        setShowSuccessModal(false);
        setSelectedProject(null);
    };

    const getServiceIcon = (service) => {
        const s = (service || '').toLowerCase();
        if (s.includes('instagram')) return '📸';
        if (s.includes('seo')) return '🔍';
        if (s.includes('ppc')) return '📈';
        if (s.includes('branding')) return '🎨';
        return '💼';
    };

    const getUrgencyBadge = (urgency) => {
        switch (urgency) {
            case 'urgent':
                return <span className="bg-red-50 text-red-600 px-2 py-1 rounded-md text-xs font-bold border border-red-100 flex items-center gap-1">🔥 דחוף</span>;
            case 'flexible':
                return <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-xs font-bold border border-blue-100">📅 גמיש</span>;
            default:
                return <span className="bg-slate-50 text-slate-600 px-2 py-1 rounded-md text-xs font-bold border border-slate-200">⚡ רגיל</span>;
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                <p className="text-slate-500 font-medium animate-pulse">מחפש פרויקטים מתאימים...</p>
            </div>
        );
    }

    return (
        <div className=" pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">לוח פרויקטים</h1>
                    <p className="text-slate-500 mt-2 text-lg">מצא את האתגר הבא שלך מתוך {projects.length} פרויקטים פעילים</p>
                </div>

                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-colors shadow-sm">
                        סינון מתקדם
                    </button>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200">
                        התראות חדשות
                    </button>
                </div>
            </div>

            {/* Projects Grid */}
            {projects.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                    <div className="text-6xl mb-4">📭</div>
                    <h3 className="text-xl font-bold text-slate-900">אין פרויקטים כרגע</h3>
                    <p className="text-slate-500">נסה לשנות את הגדרות הסינון או חזור מאוחר יותר</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {projects.map((project, index) => (
                        <div
                            key={project.id || index}
                            className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 group flex flex-col"
                        >
                            <div className="p-6 flex-1">
                                {/* Card Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-2xl border border-indigo-100 group-hover:scale-110 transition-transform">
                                            {getServiceIcon(project.service || project.title)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold text-slate-900 line-clamp-1 text-lg" title={project.title}>
                                                    {project.title}
                                                </h3>
                                            </div>
                                            <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
                                                פורסם: {project.date || 'היום'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Badges */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {getUrgencyBadge(project.urgency)}
                                    <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md text-xs font-bold border border-emerald-100">
                                        💰 {typeof project.budget === 'number' ? `₪${project.budget.toLocaleString()}` : project.budget}
                                    </span>
                                    {project.source === 'local' && (
                                        <span className="bg-purple-50 text-purple-600 px-2 py-1 rounded-md text-xs font-bold border border-purple-100">
                                            🌟 חדש
                                        </span>
                                    )}
                                </div>

                                {/* Description */}
                                <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-4 min-h-[4.5em]">
                                    {project.description || 'אין תיאור זמין לפרויקט זה. מומלץ ליצור קשר לקבלת פרטים נוספים.'}
                                </p>

                                {/* Verification */}
                                {project.scope_approved && (
                                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
                                        <svg className="w-4 h-4 text-sky-500 fill-current" viewBox="0 0 20 20">
                                            <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span>תקציב מאומת</span>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl mt-auto">
                                <button
                                    onClick={() => handleOpenProposal(project)}
                                    className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all shadow-md shadow-indigo-100 hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <span>שלח הצעה</span>
                                    <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Proposal Modal */}
            {showProposalModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in font-['Heebo']">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-scale-in border border-slate-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-800">הגשת הצעה לפרויקט</h3>
                            <button onClick={() => setShowProposalModal(false)} className="text-slate-400 hover:text-slate-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmitProposal}>
                            <div className="mb-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <p className="text-sm text-slate-500 mb-1">פרויקט:</p>
                                <p className="font-bold text-slate-900">{selectedProject?.title}</p>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">הצעת מחיר (₪)</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            required
                                            value={proposalAmount}
                                            onChange={(e) => setProposalAmount(e.target.value)}
                                            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all pl-10"
                                            placeholder="0.00"
                                        />
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₪</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">למה דווקא אני? (Brief Pitch)</label>
                                    <textarea
                                        required
                                        rows="4"
                                        value={proposalPitch}
                                        onChange={(e) => setProposalPitch(e.target.value)}
                                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                                        placeholder="פרט את הניסיון הרלוונטי שלך ולמה אתה מתאים לפרויקט זה..."
                                    ></textarea>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowProposalModal(false)}
                                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors"
                                >
                                    ביטול
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-boldshadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-1"
                                >
                                    🚀 שלח הצעה
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in font-['Heebo']">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center border border-white/20 animate-scale-in">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-subtle">
                            <span className="text-3xl">🚀</span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">ההצעה נשלחה!</h3>
                        <p className="text-slate-500 mb-6 text-sm">
                            ההצעה שלך לפרויקט <span className="font-bold text-slate-800">"{selectedProject?.title}"</span> התקבלה בהצלחה והועברה ללקוח.
                        </p>
                        <button
                            onClick={closeSuccessModal}
                            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-transform transform hover:-translate-y-1"
                        >
                            מעולה, תודה
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MarketerFeed;
