import React from 'react';
import { Coins, Trophy, Clock, HelpCircle, ArrowRight } from 'lucide-react';

export default function QuizCard({ quiz, userBalance, onStart, loading }) {
  const canAfford = userBalance >= quiz.stakeCost;

  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group">
      {/* Glow highlight on hover */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all pointer-events-none" />

      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
            {quiz.category || 'General'}
          </span>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1 text-slate-500" />
              {Math.floor(quiz.timeLimitSeconds / 60)}m
            </span>
            <span className="text-[11px] font-semibold text-slate-400 flex items-center">
              <HelpCircle className="w-3.5 h-3.5 mr-1 text-slate-500" />
              {quiz.totalQuestions} Qs
            </span>
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
          {quiz.title}
        </h3>
        <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
          {quiz.description || 'Test your knowledge and multiply your credits upon passing.'}
        </p>

        {/* Stake vs Reward Economics */}
        <div className="grid grid-cols-2 gap-2 mt-5 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-center border-r border-slate-800 pr-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Stake Fee</span>
            <div className="flex items-center justify-center space-x-1 mt-0.5 text-rose-400 font-extrabold text-sm">
              <Coins className="w-3.5 h-3.5" />
              <span>{quiz.stakeCost}</span>
            </div>
          </div>
          <div className="text-center pl-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Win Reward</span>
            <div className="flex items-center justify-center space-x-1 mt-0.5 text-emerald-400 font-extrabold text-sm">
              <Trophy className="w-3.5 h-3.5" />
              <span>+{quiz.rewardAmount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">
          Pass threshold: <strong className="text-slate-200">{quiz.passingScore}%</strong>
        </span>
        <button
          onClick={() => onStart(quiz.id)}
          disabled={loading || !canAfford}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-md ${
            !canAfford
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
          }`}
        >
          <span>{!canAfford ? 'Need Credits' : 'Stake & Start'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
