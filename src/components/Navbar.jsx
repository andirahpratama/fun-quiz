import React from 'react';
import { Target, User, LogOut, PlusCircle, Trophy, BookOpen, Zap } from 'lucide-react';

export default function Navbar({
  user,
  onOpenAuth,
  onLogout,
  activeTab,
  setActiveTab,
  onResetToHome
}) {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/80 border-b border-cyan-500/20 shadow-lg shadow-cyan-500/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Futuristic Brand Logo */}
        <div 
          onClick={onResetToHome}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 via-indigo-500 to-pink-500 p-0.5 shadow-lg shadow-cyan-500/40 transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <span className="text-xl">🎯</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-black tracking-wider bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                FUN QUIZ
              </h1>
              <span className="bg-cyan-500/20 text-cyan-300 text-[9px] font-black px-2 py-0.5 rounded-full border border-cyan-500/40">
                SMP
              </span>
            </div>
          </div>
        </div>

        {/* Center Simple Futuristic Tabs */}
        {user && (
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-cyan-500/20">
            <button
              onClick={() => setActiveTab('create')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'create'
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Buat Kuis
            </button>

            <button
              onClick={() => setActiveTab('quizzes')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'quizzes'
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Kuis Saya
            </button>

            <button
              onClick={() => setActiveTab('results')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'results'
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              Rekap Nilai
            </button>
          </nav>
        )}

        {/* User Auth Section */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3 bg-slate-900/80 pl-3 pr-2 py-1 rounded-full border border-cyan-500/30">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center text-slate-950 font-black text-xs">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'G'}
                </div>
                <span className="hidden sm:block text-xs font-extrabold text-slate-200">{user.name}</span>
              </div>
              <button
                onClick={onLogout}
                title="Keluar"
                className="p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-full transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : null}
        </div>

      </div>

      {/* Mobile Navigation Bar */}
      {user && (
        <div className="md:hidden flex items-center justify-around bg-slate-950/95 py-2 border-t border-cyan-500/20">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex flex-col items-center gap-1 text-[11px] font-extrabold ${
              activeTab === 'create' ? 'text-cyan-400' : 'text-slate-400'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            Buat Kuis
          </button>
          <button
            onClick={() => setActiveTab('quizzes')}
            className={`flex flex-col items-center gap-1 text-[11px] font-extrabold ${
              activeTab === 'quizzes' ? 'text-cyan-400' : 'text-slate-400'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Kuis Saya
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`flex flex-col items-center gap-1 text-[11px] font-extrabold ${
              activeTab === 'results' ? 'text-cyan-400' : 'text-slate-400'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            Rekap Nilai
          </button>
        </div>
      )}
    </header>
  );
}
