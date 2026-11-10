import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function QuizPlayer({ quizSession, onSubmit, submitting }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(quizSession.timeLimitSeconds || 120);

  const questions = quizSession.questions || [];
  const currentQ = questions[currentIdx];

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      handleFinalSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const selectOption = (optIdx) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optIdx,
    }));
  };

  const handleFinalSubmit = () => {
    onSubmit(answers);
  };

  const answeredCount = Object.keys(answers).length;
  const progressPercent = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 animate-fadeIn">
      {/* Quiz Top bar */}
      <div className="glass rounded-2xl p-4 sm:p-5 mb-6 flex items-center justify-between border border-slate-800">
        <div>
          <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block">
            Active Attempt #{quizSession.attemptId}
          </span>
          <h2 className="text-base sm:text-lg font-extrabold text-white">{quizSession.quizTitle}</h2>
        </div>

        {/* Timer Badge */}
        <div
          className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl border font-mono font-bold text-sm ${
            timeLeft < 30
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/30 animate-pulse'
              : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/20'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-semibold">
          <span>
            Question {currentIdx + 1} of {questions.length}
          </span>
          <span>
            {answeredCount} of {questions.length} Answered
          </span>
        </div>
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      {currentQ && (
        <div className="glass-card rounded-2xl p-6 sm:p-8 mb-6 border border-slate-800">
          <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md">
            {currentQ.points} Point{currentQ.points > 1 ? 's' : ''}
          </span>

          <h3 className="text-lg sm:text-xl font-bold text-white mt-3 mb-6 leading-relaxed">
            {currentQ.questionText}
          </h3>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = answers[currentQ.id] === optIdx;
              const optionLetters = ['A', 'B', 'C', 'D'];

              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => selectOption(optIdx)}
                  className={`w-full text-left p-4 rounded-xl border transition flex items-center space-x-3.5 ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                      : 'bg-slate-800/50 hover:bg-slate-800 border-slate-700/60 text-slate-300'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-700/60 text-slate-400'
                    }`}
                  >
                    {optionLetters[optIdx]}
                  </div>
                  <span className="text-sm font-medium leading-normal">{opt}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation & Submit Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
          disabled={currentIdx === 0}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold flex items-center space-x-1.5 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <div className="flex items-center space-x-2">
          {currentIdx < questions.length - 1 ? (
            <button
              onClick={() => setCurrentIdx((i) => Math.min(questions.length - 1, i + 1))}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center space-x-1.5 transition shadow-md shadow-indigo-600/20"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinalSubmit}
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-1.5 transition shadow-lg shadow-emerald-600/30 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{submitting ? 'Scoring Answers...' : 'Submit Attempt'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

