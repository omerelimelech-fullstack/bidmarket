import React, { useEffect, useState } from 'react';
import { LayoutDashboard, Users, Wallet, ArrowUpRight, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const ClientDashboard = () => {
    // 1. Mock Data in Hebrew
    const mockProjects = [
        {
            id: '101',
            title: 'קידום ממומן לאינסטגרם (PPC)',
            status: 'active',
            budget: '₪2,500',
            proposalsCount: 5,
            date: '15/12/2024'
        },
        {
            id: '102',
            title: 'בניית דף נחיתה למבצע חורף',
            status: 'review',
            budget: '₪1,200',
            proposalsCount: 3,
            date: '12/12/2024'
        },
        {
            id: '103',
            title: 'ניהול עמוד פייסבוק עסקי',
            status: 'completed',
            budget: '₪4,000',
            proposalsCount: 8,
            date: '01/12/2024'
        },
        {
            id: '104',
            title: 'כתיבת תוכן לאתר תדמית',
            status: 'pending',
            budget: '₪800',
            proposalsCount: 0,
            date: '18/12/2024'
        }
    ];

    const [projects, setProjects] = useState([]);
    const [allProposals, setAllProposals] = useState([]);
    const [showProposalsModal, setShowProposalsModal] = useState(false);
    const [selectedProjectForProposals, setSelectedProjectForProposals] = useState(null);

    const loadDashboardData = () => {
        // Load local projects
        const localProjects = JSON.parse(localStorage.getItem('my_projects') || '[]');
        const proposals = JSON.parse(localStorage.getItem('proposals') || '[]');

        console.log("--------------------------------------------------");
        console.log("ClientDashboard: Loaded Proposals:", proposals);
        console.log("ClientDashboard: Loaded Projects:", localProjects);

        setAllProposals(proposals);

        // Merge projects and update counts
        const mergedProjects = [...localProjects, ...mockProjects].map(p => {
            const count = proposals.filter(prop => prop.projectId == p.id).length;
            return {
                ...p,
                proposalsCount: count
            };
        });

        setProjects(mergedProjects);
    };

    useEffect(() => {
        loadDashboardData();
    }, []);

    const handleAcceptProposal = (proposal) => {
        const confirmAccept = window.confirm("האם אתה בטוח שברצונך לקבל הצעה זו ולהתחיל בפרויקט?");
        if (!confirmAccept) return;

        // 1. Update Project Status in LocalStorage
        const localProjects = JSON.parse(localStorage.getItem('my_projects') || '[]');
        const updatedProjects = localProjects.map(p => {
            if (p.id == proposal.projectId) {
                return { ...p, status: 'in_progress' }; // Update status to In Progress
            }
            return p;
        });
        localStorage.setItem('my_projects', JSON.stringify(updatedProjects));

        // 2. Update Proposal Status (Optional, good for record keeping)
        const allProps = JSON.parse(localStorage.getItem('proposals') || '[]');
        const updatedProps = allProps.map(p => {
            if (p.id == proposal.id) {
                return { ...p, status: 'accepted' };
            }
            return p;
        });
        localStorage.setItem('proposals', JSON.stringify(updatedProps));

        // 3. UI Feedback
        alert("🎉 ההצעה התקבלה בהצלחה! הפרויקט יצא לדרך.");
        setShowProposalsModal(false);
        loadDashboardData(); // Refresh list
    };

    const handleViewProposals = (project) => {
        setSelectedProjectForProposals(project);
        setShowProposalsModal(true);
    };

    const getProjectProposals = () => {
        if (!selectedProjectForProposals) return [];
        // Loose equality check here too
        const matches = allProposals.filter(p => p.projectId == selectedProjectForProposals.id);
        console.log(`Viewing proposals for ID ${selectedProjectForProposals.id}. Found:`, matches);
        return matches;
    };

    const stats = [
        { label: 'פרויקטים פעילים', value: '12', icon: LayoutDashboard, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'הצעות שהתקבלו', value: allProposals.length.toString(), icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'תקציב שנוצל', value: '₪15,400', icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ];

    const getStatusBadge = (status) => {
        const styles = {
            active: 'bg-blue-100 text-blue-700',
            in_progress: 'bg-green-600 text-white shadow-md shadow-green-200', // Distinct style for active projects
            review: 'bg-amber-100 text-amber-700',
            completed: 'bg-emerald-100 text-emerald-700',
            pending: 'bg-slate-100 text-slate-600',
            open: 'bg-purple-100 text-purple-700'
        };
        const labels = {
            active: 'פעיל',
            in_progress: '🚀 בעבודה',
            review: 'בבדיקה',
            completed: 'הושלם',
            pending: 'ממתין',
            open: 'פתוח להצעות'
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold border border-transparent transition-all ${styles[status] || styles.pending}`}>
                {labels[status] || status}
            </span>
        );
    };

    return (
        <div className="space-y-8 animate-fade-in text-right" dir="rtl">

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900">לוח בקרה</h1>
                <p className="text-slate-500 mt-1">ברוך שובך! הנה סיכום הפעילות שלך.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
                        <div>
                            <p className="text-slate-500 text-sm font-medium mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
                        </div>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Projects Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-900">פרויקטים אחרונים</h2>
                    <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1">
                        לכל הפרויקטים
                        <ArrowUpRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                            <tr>
                                <th className="px-6 py-4 rounded-tr-xl">שם הפרויקט</th>
                                <th className="px-6 py-4">סטטוס</th>
                                <th className="px-6 py-4">תקציב</th>
                                <th className="px-6 py-4">הצעות</th>
                                <th className="px-6 py-4">תאריך יצירה</th>
                                <th className="px-6 py-4 rounded-tl-xl text-center">פעולות</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {projects.map((project) => (
                                <tr key={project.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">
                                        {project.title}
                                        <div className="text-xs text-slate-400 font-normal mt-0.5">ID: #{project.id}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(project.status)}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 font-medium">
                                        {project.budget}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-slate-600">
                                            <Users className="w-4 h-4 text-slate-400" />
                                            <span className="font-bold text-indigo-600">{project.proposalsCount} הצעות</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-sm">
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5" />
                                            {project.date}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => handleViewProposals(project)}
                                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                            title="צפה בהצעות"
                                        >
                                            <div className="flex items-center gap-1 text-sm font-bold">
                                                <ArrowUpRight className="w-4 h-4" />
                                                צפה
                                            </div>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Proposals Modal */}
            {showProposalsModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in font-['Heebo']">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 animate-scale-in border border-slate-100 flex flex-col max-h-[85vh]">
                        <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">הצעות מחיר שהתקבלו</h3>
                                <p className="text-slate-500 text-sm">עבור: {selectedProjectForProposals?.title}</p>
                            </div>
                            <button onClick={() => setShowProposalsModal(false)} className="text-slate-400 hover:text-slate-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar">
                            {getProjectProposals().length === 0 ? (
                                <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                    <div className="text-4xl mb-3">📭</div>
                                    <p className="text-slate-500 font-medium">טרם התקבלו הצעות לפרויקט זה</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {getProjectProposals().map((proposal, idx) => (
                                        <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-indigo-200 hover:shadow-md transition-all">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                                                        {proposal.marketerRole === 'expert' ? 'E' : 'M'}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-900">משווק מומחה</h4>
                                                        <span className="text-xs text-slate-400">{new Date(proposal.date).toLocaleDateString('he-IL')}</span>
                                                    </div>
                                                </div>
                                                <div className="text-lg font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                                                    ₪{Number(proposal.amount).toLocaleString()}
                                                </div>
                                            </div>
                                            <div className="bg-slate-50 p-3 rounded-lg text-slate-600 text-sm leading-relaxed border border-slate-100">
                                                <p className="font-semibold text-slate-700 mb-1">הסבר על ההצעה:</p>
                                                {proposal.pitch}
                                            </div>
                                            <div className="mt-4 flex gap-3">
                                                <button
                                                    onClick={() => handleAcceptProposal(proposal)}
                                                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-sm transition-colors shadow-sm shadow-indigo-200"
                                                >
                                                    קבל הצעה
                                                </button>
                                                <button className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg font-bold text-sm transition-colors">
                                                    שלח הודעה
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ClientDashboard;
