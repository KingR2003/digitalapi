import React from 'react';
import { Trophy, Frown, CheckCircle, XCircle, Coins, ArrowRight, Sparkles } from 'lucide-react';

export default function ResultModal({ result, onClose }) {
  if (!result) return null;

  const passed = result.passed;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Banner Header */}
        <div className="text-center pb-5 border-b border-slate-800">
          <div
            className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-3 shadow-xl ${
              passed
                ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-emerald-500/25'
                : 'bg-gradient-to-tr from-rose-500 to-pink-500 text-white shadow-rose-500/25'
            }`}
          >
            {passed ? <Trophy className="w-8 h-8" /> : <Frown className="w-8 h-8" />}
          </div>

          <h2 className="text-2xl font-extrabold text-white">
            {passed ? 'Quiz Passed! Reward Won!' : 'Quiz Attempt Failed'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {passed
              ? `Congratulations! You met the passing threshold of ${result.passingScore}%.`
              : `You scored below the passing threshold of ${result.passingScore}%. Your stake was forfeited.`}
          </p>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3 mt-5 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Your Score</span>
              <span className="text-lg font-extrabold text-white">
                {result.score} / {result.maxScore} ({result.percentage}%)
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Credit Outcome</span>
              <span
                className={`text-lg font-extrabold ${
                  passed ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {passed ? `+${result.rewardWon}` : `-${result.stakeCost}`}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">New Balance</span>
              <span className="text-lg font-extrabold text-amber-400">
                {result.updatedBalance}
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Question Review */}
        <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Answer Review</h4>
          {result.review?.map((rev, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border ${
                rev.correct
                  ? 'bg-emerald-950/20 border-emerald-500/30'
                  : 'bg-rose-950/20 border-rose-500/30'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="text-xs font-bold text-white leading-relaxed">
                  {idx + 1}. {rev.questionText}
                </span>
                {rev.correct ? (
                  <span className="text-[11px] font-bold text-emerald-400 flex items-center shrink-0">
                    <CheckCircle className="w-3.5 h-3.5 mr-1" /> Correct
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-rose-400 flex items-center shrink-0">
                    <XCircle className="w-3.5 h-3.5 mr-1" /> Incorrect
                  </span>
                )}
              </div>

              <div className="text-[11px] space-y-1 text-slate-300">
                <div>
                  <span className="text-slate-500 font-medium">Your answer: </span>
                  <span className={rev.correct ? 'text-emerald-300 font-bold' : 'text-rose-300 font-bold'}>
                    {rev.selectedOptionIndex !== null && rev.selectedOptionIndex !== undefined
                      ? rev.options[rev.selectedOptionIndex]
                      : 'None selected'}
                  </span>
                </div>
                {!rev.correct && (
                  <div>
                    <span className="text-slate-500 font-medium">Correct answer: </span>
                    <span className="text-emerald-300 font-bold">
                      {rev.options[rev.correctOptionIndex]}
                    </span>
                  </div>
                )}
                {rev.explanation && (
                  <p className="mt-1 pt-1.5 border-t border-slate-800/80 text-[11px] text-slate-400 italic">
                    💡 {rev.explanation}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2"
          >
            <span>Return to Quiz Arena</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
