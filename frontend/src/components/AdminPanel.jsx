import React, { useState, useEffect } from 'react';
import { Plus, Trash2, HelpCircle, Shield, AlertCircle, CheckCircle, Clock, Trophy, Coins } from 'lucide-react';
import { api } from '../api';

export default function AdminPanel({ onQuizCreated }) {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeQuizForQuestion, setActiveQuizForQuestion] = useState(null);

  // New Quiz State
  const [showNewQuizModal, setShowNewQuizModal] = useState(false);
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    description: '',
    category: 'Backend Architecture',
    stakeCost: 100,
    rewardAmount: 250,
    passingScore: 70,
    timeLimitSeconds: 180,
  });

  // New Question State
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    questionText: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctOptionIndex: 0,
    points: 1,
    explanation: '',
  });

  const [statusMsg, setStatusMsg] = useState(null);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminQuizzes();
      setQuizzes(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    try {
      await api.createQuiz(newQuiz);
      setStatusMsg({ type: 'success', text: 'Quiz created successfully!' });
      setShowNewQuizModal(false);
      loadQuizzes();
      onQuizCreated && onQuizCreated();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message });
    }
  };

  const handleDeleteQuiz = async (id) => {
    if (!window.confirm('Are you sure you want to delete this quiz and its questions?')) return;
    try {
      await api.deleteQuiz(id);
      loadQuizzes();
      onQuizCreated && onQuizCreated();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (!activeQuizForQuestion) return;
    try {
      await api.addQuestion(activeQuizForQuestion.id, newQuestion);
      setStatusMsg({ type: 'success', text: `Question added to "${activeQuizForQuestion.title}"!` });
      setShowQuestionModal(false);
      setNewQuestion({
        questionText: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctOptionIndex: 0,
        points: 1,
        explanation: '',
      });
      loadQuizzes();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message });
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 animate-fadeIn">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
              <Shield className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Administration</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-1">Quiz Management Studio</h2>
          <p className="text-xs text-slate-400">Configure quizzes, adjust credit economics, and manage question banks.</p>
        </div>

        <button
          onClick={() => setShowNewQuizModal(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-lg shadow-indigo-600/30 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Quiz</span>
        </button>
      </div>

      {statusMsg && (
        <div
          className={`mt-4 p-3 rounded-xl text-xs flex items-center space-x-2 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
          }`}
        >
          {statusMsg.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Quiz Table */}
      <div className="mt-6 border border-slate-800 rounded-2xl overflow-hidden bg-slate-900/60 shadow-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-800/60 text-slate-400 border-b border-slate-800 uppercase font-bold text-[10px] tracking-wider">
              <th className="p-4">Quiz Title & Category</th>
              <th className="p-4">Economics</th>
              <th className="p-4">Passing Score</th>
              <th className="p-4">Questions</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {quizzes.map((q) => (
              <tr key={q.id} className="hover:bg-slate-800/30 transition">
                <td className="p-4">
                  <div className="font-bold text-white text-sm">{q.title}</div>
                  <div className="text-[11px] text-slate-400">{q.category} • {q.timeLimitSeconds}s</div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-rose-400 font-bold flex items-center">
                      <Coins className="w-3 h-3 mr-0.5" /> Stake: {q.stakeCost}
                    </span>
                    <span className="text-emerald-400 font-bold flex items-center">
                      <Trophy className="w-3 h-3 mr-0.5" /> Win: {q.rewardAmount}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="font-bold text-slate-200">{q.passingScore}%</span>
                </td>
                <td className="p-4">
                  <span className="bg-slate-800 px-2 py-1 rounded text-slate-300 font-bold">
                    {q.totalQuestions} Questions
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => {
                      setActiveQuizForQuestion(q);
                      setShowQuestionModal(true);
                    }}
                    className="px-3 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-300 rounded-lg font-semibold transition"
                  >
                    + Add Question
                  </button>
                  <button
                    onClick={() => handleDeleteQuiz(q.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal: Create Quiz */}
      {showNewQuizModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg">
            <h3 className="text-lg font-bold text-white mb-4">Create New Quiz</h3>
            <form onSubmit={handleCreateQuiz} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newQuiz.title}
                  onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Description</label>
                <textarea
                  rows="2"
                  value={newQuiz.description}
                  onChange={(e) => setNewQuiz({ ...newQuiz, description: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Stake Fee (Credits)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newQuiz.stakeCost}
                    onChange={(e) => setNewQuiz({ ...newQuiz, stakeCost: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Reward Payout (Credits)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newQuiz.rewardAmount}
                    onChange={(e) => setNewQuiz({ ...newQuiz, rewardAmount: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Passing Score (%)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="100"
                    value={newQuiz.passingScore}
                    onChange={(e) => setNewQuiz({ ...newQuiz, passingScore: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Time Limit (Seconds)</label>
                  <input
                    type="number"
                    required
                    min="10"
                    value={newQuiz.timeLimitSeconds}
                    onChange={(e) => setNewQuiz({ ...newQuiz, timeLimitSeconds: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewQuizModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold"
                >
                  Create Quiz
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Question */}
      {showQuestionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-2">Add Question</h3>
            <p className="text-xs text-indigo-400 mb-4">{activeQuizForQuestion?.title}</p>
            <form onSubmit={handleAddQuestion} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Question Prompt</label>
                <textarea
                  rows="2"
                  required
                  value={newQuestion.questionText}
                  onChange={(e) => setNewQuestion({ ...newQuestion, questionText: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              {['optionA', 'optionB', 'optionC', 'optionD'].map((optKey, idx) => (
                <div key={optKey}>
                  <label className="block text-slate-400 mb-1">Option {['A', 'B', 'C', 'D'][idx]}</label>
                  <input
                    type="text"
                    required
                    value={newQuestion[optKey]}
                    onChange={(e) => setNewQuestion({ ...newQuestion, [optKey]: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
              ))}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Correct Option</label>
                  <select
                    value={newQuestion.correctOptionIndex}
                    onChange={(e) => setNewQuestion({ ...newQuestion, correctOptionIndex: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                  >
                    <option value={0}>Option A</option>
                    <option value={1}>Option B</option>
                    <option value={2}>Option C</option>
                    <option value={3}>Option D</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Points</label>
                  <input
                    type="number"
                    min="1"
                    value={newQuestion.points}
                    onChange={(e) => setNewQuestion({ ...newQuestion, points: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Explanation (Revealed in review)</label>
                <input
                  type="text"
                  value={newQuestion.explanation}
                  onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowQuestionModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
