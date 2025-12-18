import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Wizard from './components/Wizard';
import MarketerFeed from './components/MarketerFeed';
import Auth from './components/Auth';
import Sidebar from './components/Sidebar';
import ClientDashboard from './components/ClientDashboard';
import {
  MySquad,
  Approvals,
  Wallet,
  Workspace,
  Earnings,
  Profile
} from './components/Placeholders';
import { supabase } from './supabaseClient';

function App() {
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('מאתחל...');

  useEffect(() => {
    // Helper to handle session updates
    const handleSession = (session) => {
      if (!session) {
        console.log("No active session. User is Guest.");
        setSession(null);
        setUserRole(null);
        setLoading(false);
        return;
      }

      setSession(session);

      // Strict Role Check
      const role = session.user?.user_metadata?.role;

      if (role) {
        console.log("User Role Found:", role);
        setUserRole(role);
      } else {
        console.error("CRITICAL: User is logged in but has NO ROLE in metadata.");
        // Option: Sign them out if data is corrupted, or just leave role null so they can't access dashboards
        setUserRole(null);
      }
      setLoading(false);
    };

    // 1. Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
    });

    // 2. Listen for auth changes (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Nuclear Logout
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) { console.error(e); }

    setSession(null);
    setUserRole(null);
    localStorage.clear();
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="text-slate-500 font-medium font-['Heebo']">{status}</p>
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <Router>
      <div dir="rtl" className="min-h-screen bg-slate-50 font-['Heebo'] flex">
        {/* Sidebar (Right) */}
        <Sidebar userRole={userRole || 'client'} onSignOut={handleSignOut} />

        {/* Main Content Area */}
        <main className="flex-1 transition-all duration-300">
          <div className="max-w-7xl mx-auto py-10 px-8">
            <Routes>
              {/* Client Routes - Default */}
              {(userRole === 'client' || !userRole) && (
                <>
                  <Route path="/" element={<Navigate to="/client-dashboard" replace />} />
                  <Route path="/client-dashboard" element={<ClientDashboard />} />
                  <Route path="/wizard" element={<Wizard />} />
                  <Route path="/my-marketers" element={<MySquad />} />
                  <Route path="/approvals" element={<Approvals />} />
                  <Route path="/wallet" element={<Wallet />} />
                  {/* Guard: If accidentally here as marketer, bounce */}
                  <Route path="/marketer-feed" element={<Navigate to="/" replace />} />
                </>
              )}

              {/* Marketer Routes */}
              {userRole === 'marketer' && (
                <>
                  <Route path="/" element={<Navigate to="/marketer-feed" replace />} />
                  <Route path="/marketer-feed" element={<MarketerFeed />} />
                  <Route path="/workspace" element={<Workspace />} />
                  <Route path="/earnings" element={<Earnings />} />
                  <Route path="/profile" element={<Profile />} />
                  {/* Guard: If accidentally here as client, bounce */}
                  <Route path="/client-dashboard" element={<Navigate to="/" replace />} />
                </>
              )}

              {/* Fallback "Reset App" for any weird state */}
              <Route path="*" element={
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <h2 className="text-2xl font-bold text-slate-800">משהו השתבש...</h2>
                  <button
                    onClick={handleSignOut}
                    className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 shadow-lg font-bold"
                  >
                    איפוס אפליקציה (Reset App)
                  </button>
                </div>
              } />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
