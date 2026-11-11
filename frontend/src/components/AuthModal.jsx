import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, User, Sparkles, AlertCircle, ArrowRight, ShieldCheck, ShieldAlert } from 'lucide-react';
import { api, setAuthSession } from '../api';

export default function AuthModal({ isOpen, mode, onClose, onSuccess }) {
  const [activeTab, setActiveTab] = useState(mode || 'login'); // 'login' | 'register' | 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(mode || 'login');
      setError(null);
      setEmail('');
      setPassword('');
      setFullName('');
    }
  }, [isOpen, mode]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let res;
      if (activeTab === 'register') {
        res = await api.register(email, password, fullName);
      } else {
        // Both 'login' and 'admin' use the authenticate endpoint
        res = await api.login(email, password);
      }

      // If user attempted to log into Admin Studio, ensure they actually have ROLE_ADMIN
      if (activeTab === 'admin' && res.role !== 'ROLE_ADMIN') {
        throw new Error('Access denied: This account does not possess administrator privileges.');
      }

      setAuthSession(res.token, {
        userId: res.userId,
        email: res.email,
        fullName: res.fullName,
        role: res.role,
      });

      onSuccess(res);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const useDemoAccount = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setActiveTab('login');
  };

  const isAdminMode = activeTab === 'admin';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div
        className={`relative w-full max-w-md rounded-2xl shadow-2xl p-6 sm:p-8 border transition-all duration-300 ${
          isAdminMode
            ? 'bg-slate-950 border-purple-500/40 shadow-purple-900/20'
            : 'bg-slate-900 border-slate-800'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Toggle for User Modes */}
        {!isAdminMode ? (
          <div className="flex bg-slate-800/80 p-1 rounded-xl mb-6">
            <button
              onClick={() => { setActiveTab('login'); setError(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                activeTab === 'login' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setActiveTab('register'); setError(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                activeTab === 'register' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Register (+500 Credits)
            </button>
          </div>
        ) : (
          /* Admin Top Badge */
          <div className="mb-6 flex items-center justify-between bg-purple-950/50 border border-purple-500/30 px-3.5 py-2 rounded-xl text-purple-300">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
              <span className="text-[11px] font-bold tracking-wider uppercase">Admin Studio Portal</span>
            </div>
            <span className="text-[10px] bg-purple-500/20 text-purple-200 px-2 py-0.5 rounded-full font-semibold border border-purple-500/30">
              Restricted
            </span>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-6">
          {isAdminMode ? (
            <>
              <div className="mx-auto w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 mb-3 shadow-lg shadow-purple-600/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Administrator Login
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Authenticate with elevated credentials to manage quizzes, question pools, and economic parameters.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-extrabold text-white">
                {activeTab === 'login' ? 'Welcome Back!' : 'Claim Your 500 Credits'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {activeTab === 'login'
                  ? 'Enter your credentials to access your quiz arena & wallet.'
                  : 'Sign up in seconds and get 500 bonus credits instantly added to your balance.'}
              </p>
            </>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === 'register' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Johnson"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              {isAdminMode ? 'Admin Email Address' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                placeholder={isAdminMode ? 'admin@digitalapi.com' : 'you@domain.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition ${
                  isAdminMode
                    ? 'bg-slate-900 border border-purple-500/30 focus:ring-purple-500'
                    : 'bg-slate-800/80 border border-slate-700/80 focus:ring-indigo-500'
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              {isAdminMode ? 'Admin Password' : 'Password'}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition ${
                  isAdminMode
                    ? 'bg-slate-900 border border-purple-500/30 focus:ring-purple-500'
                    : 'bg-slate-800/80 border border-slate-700/80 focus:ring-indigo-500'
                }`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 font-bold text-sm rounded-xl transition shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 ${
              isAdminMode
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-600/30'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
            }`}
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : isAdminMode ? (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Enter Admin Studio</span>
              </>
            ) : (
              <>
                <span>{activeTab === 'login' ? 'Sign In' : 'Register & Claim 500 Credits'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Navigation between User and Admin */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
          {isAdminMode ? (
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setError(null);
                setEmail('');
                setPassword('');
              }}
              className="text-xs font-semibold text-slate-400 hover:text-white transition flex items-center justify-center space-x-1 mx-auto"
            >
              <span>← Back to User Login</span>
            </button>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-center space-x-2">
                <button
                  type="button"
                  onClick={() => useDemoAccount('user@digitalapi.com', 'user123')}
                  className="py-1.5 px-3 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-lg text-[11px] font-semibold text-slate-300 transition"
                >
                  Quick Demo User (500 Credits)
                </button>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('admin');
                    setError(null);
                    setEmail('');
                    setPassword('');
                  }}
                  className="text-xs font-medium text-purple-400 hover:text-purple-300 transition flex items-center justify-center space-x-1 mx-auto"
                >
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                  <span>Looking for Admin Studio? Sign in as Administrator →</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

