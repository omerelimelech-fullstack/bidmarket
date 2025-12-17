import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Wizard from './components/Wizard';
import MarketerFeed from './components/MarketerFeed';
import Auth from './components/Auth';
import Sidebar from './components/Sidebar';
import {
  ClientDashboard,
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
  const [showResetHelper, setShowResetHelper] = useState(false);
  const [status, setStatus] = useState('מאתחל...');

  useEffect(() => {
    // Timer to show the reset helper only if loading takes too long
    const timer = setTimeout(() => {
      if (loading) setShowResetHelper(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    const initAuth = async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }

      try {
        setStatus('בודק חיבור...');
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);
        if (initialSession) {
          setStatus('טוען הרשאות...');
          await fetchUserRole(initialSession.user.id);
        } else {
          setLoading(false);
        }
      } catch (e) {
        console.error("Auth init failed", e);
        setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase && supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setSession(null);
        setUserRole(null);
        setLoading(false);
        return;
      }

      setSession(session);
      if (session) {
        setStatus('מסנכרן פרופיל...');
        await fetchUserRole(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  const fetchUserRole = async (userId, retryCount = 0) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) {
        // If row not found (PGRST116) and we haven't retried 3 times yet, wait and retry.
        if (error.code === 'PGRST116' && retryCount < 3) {
          console.log(`Role not found yet, retrying... (${retryCount + 1}/3)`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          return fetchUserRole(userId, retryCount + 1);
        }
        console.error('Error fetching role:', error);
      } else if (data) {
        setUserRole(data.role);
      }
    } catch (err) {
      console.error('Unexpected error fetching role:', err);
    } finally {
      // Only if this is the initial call (retryCount 0) AND we are not retrying (no error or max retries or not PGRST116)
      // Simplification: We only turn off loading if we have a role OR we hit max retries key.
      // Actually, easier: Just turn off loading if data found or if we are done retrying.
      // Since we are recursive, the 'finally' of the *last* call executes.
    }

    // Explicit loading management to avoid premature spinner kill:
    if (retryCount >= 3 || (error && error.code !== 'PGRST116') || data) {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error("Sign out error", e);
    }
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

        {/* Only show the reset button after delay */}
        {showResetHelper && (
          <div className="animate-fade-in flex flex-col items-center mt-4">
            <p className="text-slate-400 text-sm mb-2">לוקח יותר מדי זמן?</p>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 shadow-sm transition-all flex items-center gap-2"
            >
              ⚠️ לחץ כאן לאיפוס ורענון
            </button>
          </div>
        )}
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
        <Sidebar userRole={userRole} onSignOut={handleSignOut} />

        {/* Main Content Area - with right margin for sidebar */}
        <main className="flex-1 mr-64 transition-all duration-300">
          <div className="max-w-7xl mx-auto py-10 px-8">
            <Routes>
              {/* Client Routes */}
              {userRole === 'client' && (
                <>
                  <Route path="/" element={<Navigate to="/client-dashboard" replace />} />
                  <Route path="/client-dashboard" element={<ClientDashboard />} />
                  <Route path="/wizard" element={<Wizard />} />
                  <Route path="/my-marketers" element={<MySquad />} />
                  <Route path="/approvals" element={<Approvals />} />
                  <Route path="/wallet" element={<Wallet />} />
                </>
              )}

              {/* Marketer Routes */}
              {userRole === 'marketer' && (
                <>
                  <Route path="/" element={<Navigate to="/feed" replace />} />
                  <Route path="/feed" element={<MarketerFeed />} />
                  <Route path="/workspace" element={<Workspace />} />
                  <Route path="/earnings" element={<Earnings />} />
                  <Route path="/profile" element={<Profile />} />
                </>
              )}

              {/* Fallback for no role or mismatch */}
              {!userRole && (
                <Route path="*" element={
                  <div className="text-center p-10">
                    <h2 className="text-2xl font-bold">תפקיד לא נמצא</h2>
                    <button onClick={handleSignOut} className="mt-4 text-indigo-600 underline">התנתק</button>
                  </div>
                } />
              )}

              {/* 404 / Catch all within role */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
