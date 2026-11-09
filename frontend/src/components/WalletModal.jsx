import React, { useState, useEffect } from 'react';
import { X, Coins, ArrowUpRight, ArrowDownLeft, ShieldCheck, CreditCard, Sparkles, RefreshCw } from 'lucide-react';
import { api } from '../api';

export default function WalletModal({ isOpen, onClose, balance, onBalanceUpdate }) {
  const [transactions, setTransactions] = useState([]);
  const [loadingTx, setLoadingTx] = useState(false);
  const [buying, setBuying] = useState(false);
  const [selectedPack, setSelectedPack] = useState(500);
  const [paymentSuccess, setPaymentSuccess] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadTransactions();
    }
  }, [isOpen]);

  const loadTransactions = async () => {
    setLoadingTx(true);
    try {
      const data = await api.getTransactions(0, 15);
      setTransactions(data.content || []);
    } catch (err) {
      console.error('Failed to load ledger', err);
    } finally {
      setLoadingTx(false);
    }
  };

  const handleMockBuy = async () => {
    setBuying(true);
    setPaymentSuccess(null);
    try {
      const res = await api.mockBuyCredits(selectedPack, 'MOCK_RAZORPAY_GATEWAY');
      onBalanceUpdate(res.balance);
      setPaymentSuccess(`Successfully purchased ${selectedPack} credits!`);
      loadTransactions();
    } catch (err) {
      alert('Mock payment failed: ' + err.message);
    } finally {
      setBuying(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">Credit Wallet & Ledger</h2>
              <p className="text-xs text-slate-400">Atomic balance management & immutable transaction ledger</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto space-y-6 pt-5 pr-1">
          {/* Current Balance Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 border border-indigo-500/30 p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">Available Balance</span>
                <div className="flex items-baseline space-x-2 mt-1">
                  <span className="text-4xl font-extrabold text-white tracking-tight">
                    {balance !== null ? balance.toLocaleString() : '0'}
                  </span>
                  <span className="text-sm font-semibold text-amber-400">Credits</span>
                </div>
                <div className="flex items-center space-x-1.5 mt-2 text-[11px] text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Pessimistic Row Lock Protected (Zero Negative Risk)</span>
                </div>
              </div>

              {/* Quick Purchase Selector */}
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 sm:w-64">
                <span className="block text-[11px] font-bold text-slate-300 mb-2">Buy Credits (Mock Payment)</span>
                <div className="grid grid-cols-3 gap-1.5 mb-3">
                  {[100, 250, 500].map((pack) => (
                    <button
                      key={pack}
                      type="button"
                      onClick={() => setSelectedPack(pack)}
                      className={`py-1 text-xs font-bold rounded-lg transition ${
                        selectedPack === pack
                          ? 'bg-amber-500 text-slate-950 font-extrabold'
                          : 'bg-slate-700/60 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      +{pack}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleMockBuy}
                  disabled={buying}
                  className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-lg transition shadow-md flex items-center justify-center space-x-1.5 disabled:opacity-50"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>{buying ? 'Processing...' : `Mock Buy ${selectedPack} Credits`}</span>
                </button>
              </div>
            </div>

            {paymentSuccess && (
              <div className="mt-3 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{paymentSuccess}</span>
              </div>
            )}
          </div>

          {/* Transactions Audit Ledger */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <span>Transaction History Ledger</span>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-normal">
                  {transactions.length} entries
                </span>
              </h3>
              <button
                onClick={loadTransactions}
                disabled={loadingTx}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
              >
                <RefreshCw className={`w-3 h-3 ${loadingTx ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>

            {loadingTx ? (
              <div className="text-center py-8 text-xs text-slate-500">Loading ledger records...</div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500 bg-slate-800/40 rounded-xl">
                No transactions recorded yet.
              </div>
            ) : (
              <div className="border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800/60 bg-slate-900/60">
                {transactions.map((tx) => {
                  const isPositive = tx.amount > 0;
                  return (
                    <div key={tx.id} className="p-3 sm:px-4 flex items-center justify-between hover:bg-slate-800/30 transition">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            isPositive
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                              : 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {isPositive ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-200">{tx.description}</div>
                          <div className="text-[10px] text-slate-500">
                            {tx.type} • {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div
                          className={`text-xs font-extrabold ${
                            isPositive ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {isPositive ? `+${tx.amount}` : tx.amount} Credits
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Balance: {tx.balanceAfter}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
