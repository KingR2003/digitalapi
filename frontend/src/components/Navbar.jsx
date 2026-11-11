import React from 'react';
import { Coins, LogOut, ShieldCheck, UserCheck, PlusCircle } from 'lucide-react';

export default function Navbar({ user, balance, onOpenWallet, onLogout, onOpenAuth, activeTab, setActiveTab }) {
  return (
    <header className="sticky top-0 z-40 glass border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('explore')}>
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Coins className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
              QuizArena
            </span>
            <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              DigitalAPI
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        {user && (
          <div className="flex items-center space-x-1 bg-slate-800/60 p-1 rounded-xl border border-slate-700/50">
            <button
              onClick={() => setActiveTab('explore')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                activeTab === 'explore'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Explore Quizzes
            </button>
            {user.role === 'ROLE_ADMIN' && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center space-x-1 transition ${
                  activeTab === 'admin'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                Admin Studio
              </button>
            )}
          </div>
        )}

        {/* Right Section: Wallet & User */}
        <div className="flex items-center space-x-3">
          {user ? (
            <>
              {/* Credit Wallet Button */}
              <button
                onClick={onOpenWallet}
                className="flex items-center space-x-2 bg-gradient-to-r from-amber-500/10 via-amber-400/15 to-amber-500/10 hover:from-amber-500/20 hover:to-amber-500/30 text-amber-300 px-3.5 py-1.5 rounded-xl border border-amber-500/30 transition shadow-sm"
              >
                <Coins className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="font-bold text-sm">{balance !== null ? balance.toLocaleString() : '...'}</span>
                <span className="text-xs text-amber-200/80">Credits</span>
                <PlusCircle className="w-3.5 h-3.5 ml-1 text-amber-400 opacity-80" />
              </button>

              {/* User Pill */}
              <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60">
                <div className="w-6 h-6 rounded-full bg-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-300">
                  {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
                </div>
                <span className="text-xs font-medium text-slate-300 hidden md:inline">
                  {user.fullName || user.email}
                </span>
                {user.role === 'ROLE_ADMIN' && (
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-bold uppercase">
                    Admin
                  </span>
                )}
              </div>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                title="Log out"
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onOpenAuth('admin')}
                className="px-3 py-1.5 text-xs font-semibold text-purple-300 hover:text-purple-200 bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/30 rounded-xl flex items-center space-x-1.5 transition"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Studio</span>
              </button>
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition"
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 transition"
              >
                Get 500 Credits Free
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

