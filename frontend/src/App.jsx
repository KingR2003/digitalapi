import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import WalletModal from './components/WalletModal';
import QuizCard from './components/QuizCard';
import QuizPlayer from './components/QuizPlayer';
import ResultModal from './components/ResultModal';
import AdminPanel from './components/AdminPanel';
import { api, getStoredUser, clearAuthSession } from './api';
import { Sparkles, Trophy, ShieldCheck, Zap } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);

  // Modals & Navigation
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('explore'); // 'explore' | 'admin'

  // Quiz Gameplay
  const [activeQuizSession, setActiveQuizSession] = useState(null);
  const [startingQuizId, setStartingQuizId] = useState(null);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  useEffect(() => {
    const stored = getStoredUser();
    if (stored) {
      setUser(stored);
      fetchWallet();
    }
    loadQuizzes();
  }, []);

  const fetchWallet = async () => {
    try {
      const data = await api.getWallet();
      setBalance(data.balance);
    } catch (err) {
      console.error('Wallet fetch error:', err);
    }
  };

  const loadQuizzes = async () => {
    setLoadingQuizzes(true);
    try {
      const data = await api.getQuizzes();
      setQuizzes(data || []);
    } catch (err) {
      console.error('Failed to load quizzes', err);
    } finally {
      setLoadingQuizzes(false);
    }
  };

  const handleAuthSuccess = (authRes) => {
    setUser({
      userId: authRes.userId,
      email: authRes.email,
      fullName: authRes.fullName,
      role: authRes.role,
    });
    setBalance(authRes.creditBalance);
    loadQuizzes();
  };

  const handleLogout = () => {
    clearAuthSession();
    setUser(null);
    setBalance(null);
    setActiveQuizSession(null);
    setActiveTab('explore');
  };

  const handleStartQuiz = async (quizId) => {
    if (!user) {
      setAuthModalMode('register');
      setAuthModalOpen(true);
      return;
    }

    setStartingQuizId(quizId);
    try {
      const session = await api.startQuiz(quizId);
      setActiveQuizSession(session);
      setBalance(session.remainingBalance);
    } catch (err) {
      alert(err.message);
    } finally {
      setStartingQuizId(null);
    }
  };

  const handleSubmitQuiz = async (answers) => {
    if (!activeQuizSession) return;
    setSubmittingQuiz(true);
    try {
      const result = await api.submitQuiz(activeQuizSession.attemptId, answers);
      setQuizResult(result);
      setBalance(result.updatedBalance);
      setActiveQuizSession(null);
    } catch (err) {
      alert('Submission failed: ' + err.message);
    } finally {
      setSubmittingQuiz(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col">
      {/* Top Navigation */}
      <Navbar
        user={user}
        balance={balance}
        onOpenWallet={() => setWalletModalOpen(true)}
        onLogout={handleLogout}
        onOpenAuth={(mode) => {
          setAuthModalMode(mode);
          setAuthModalOpen(true);
        }}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* If user is taking a quiz, render the arena */}
        {activeQuizSession ? (
          <QuizPlayer
            quizSession={activeQuizSession}
            onSubmit={handleSubmitQuiz}
            submitting={submittingQuiz}
          />
        ) : activeTab === 'admin' && user?.role === 'ROLE_ADMIN' ? (
          <AdminPanel onQuizCreated={loadQuizzes} />
        ) : (
          <div>
            {/* Hero Section */}
            <div className="relative rounded-3xl p-8 sm:p-12 mb-10 overflow-hidden border border-indigo-500/20 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative max-w-2xl">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold mb-4">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Interview Assignment Demonstration</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  Stake Credits. Answer Fast. <br />
                  <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-amber-300 bg-clip-text text-transparent">
                    Multiply Your Winnings.
                  </span>
                </h1>

                <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
                  A high-concurrency quiz application featuring an immutable credit ledger,
                  database row locking, and cloud API gateway integration.
                </p>

                {/* Micro Highlights */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
                  <div className="flex items-center space-x-2 text-xs text-slate-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Pessimistic DB Locks</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-slate-300">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>500 Free Credits</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-slate-300">
                    <Trophy className="w-4 h-4 text-indigo-400" />
                    <span>Instant Rewards</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quiz Cards Grid */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-extrabold text-white">Active Quiz Challenges</h2>
                <p className="text-xs text-slate-400">Choose a quiz, stake your credits, and beat the passing threshold</p>
              </div>
              <span className="text-xs font-semibold text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
                {quizzes.length} Quizzes Online
              </span>
            </div>

            {loadingQuizzes ? (
              <div className="text-center py-16 text-slate-500 text-xs">Loading available quizzes...</div>
            ) : quizzes.length === 0 ? (
              <div className="text-center py-16 glass rounded-2xl border border-slate-800 text-slate-400 text-sm">
                No quizzes available right now. Check back shortly or create one in Admin Studio!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzes.map((quiz) => (
                  <QuizCard
                    key={quiz.id}
                    quiz={quiz}
                    userBalance={balance || 0}
                    onStart={handleStartQuiz}
                    loading={startingQuizId === quiz.id}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 mt-12 bg-slate-950/40 text-center text-xs text-slate-500">
        <p>Built for the DigitalAPICraft Fullstack Developer Interview Assignment.</p>
        <p className="mt-1">Powered by Spring Boot 3, PostgreSQL, React, and DigitalAPI Gateway.</p>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={authModalOpen}
        mode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      <WalletModal
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        balance={balance}
        onBalanceUpdate={(newBal) => setBalance(newBal)}
      />

      <ResultModal
        result={quizResult}
        onClose={() => setQuizResult(null)}
      />
    </div>
  );
}

