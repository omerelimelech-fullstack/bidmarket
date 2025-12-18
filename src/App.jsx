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
    let mounted = true;

    // 1. Failsafe Timeout: Force stop loading after 2 seconds no matter what
    const failsafe = setTimeout(() => {
      if (mounted && loading) {
        console.warn('Auth check timed out - forcing app as Client');
        setUserRole('client'); // Default to client on timeout
        setLoading(false);
      }
    }, 2000);

    const initAuth = async () => {
      if (!supabase) {
        if (mounted) setLoading(false);
        return;
      }

      try {
        if (mounted) setStatus('בודק חיבור...');
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (mounted) setSession(initialSession);

        if (initialSession) {
          if (mounted) setStatus('טוען הרשאות...');
          await resolveUserRole(initialSession.user);
        }
      } catch (e) {
        console.error("Auth init failed", e);
      } finally {
        clearTimeout(failsafe);
        if (mounted) setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_OUT') {
        setSession(null);
        setUserRole(null);
        setLoading(false);
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setSession(session);
        if (session && !userRole) {
          await resolveUserRole(session.user);
        }
      }
    });

    return () => {
      mounted = false;
      clearTimeout(failsafe);
      subscription?.unsubscribe();
    };
  }, []);

  // Robust Role Resolver
  const resolveUserRole = async (user) => {
    // 1. Check Metadata
    if (user?.user_metadata?.role) {
      setUserRole(user.user_metadata.role);
      return;
    }

    // 2. Check Database
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (data?.role) {
        setUserRole(data.role);
      } else {
        console.warn("Role missing in DB, defaulting to Client.");
        setUserRole('client');
      }
    } catch (err) {
      console.error('Error fetching role, defaulting to Client:', err);
      setUserRole('client');
    }
  };

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
      <div className="min-h-screen bg-slate-50 font-['Heebo'] flex flex-row-reverse">
        {/* Sidebar (Right) */}
        <Sidebar userRole={userRole || 'client'} onSignOut={handleSignOut} />

        {/* Main Content Area */}
        <main className="flex-1 mr-64 transition-all duration-300">
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
