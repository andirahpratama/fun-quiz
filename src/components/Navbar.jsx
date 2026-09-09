import React from 'react';
import { Target, User, LogOut, PlusCircle, Trophy, BookOpen } from 'lucide-react';

export default function Navbar({
  user,
  onOpenAuth,
  onLogout,
  activeTab,
  setActiveTab,
  onResetToHome
}) {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={onResetToHome}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-md shadow-indigo-500/20 transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-white rounded-[9px] flex items-center justify-center">
              <span className="text-xl">🎯</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-black tracking-tight text-slate-900">
                FUN QUIZ
              </h1>
              <span className="bg-indigo-50 text-indigo-700 text-[10px] font-black px-2 py-0.5 rounded-full border border-indigo-200">
                SMP
              </span>
            </div>
          </div>
        </div>

        {/* Center Nav Tabs */}
        {user && (
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab('create')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'create'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Buat Kuis
            </button>

            <button
              onClick={() => setActiveTab('quizzes')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'quizzes'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Kuis Saya
            </button>

            <button
              onClick={() => setActiveTab('results')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'results'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              Rekap Nilai
            </button>
          </nav>
        )}

        {/* User Badge */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3 bg-slate-100 pl-3 pr-2 py-1 rounded-full border border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'G'}
                </div>
                <span className="hidden sm:block text-xs font-bold text-slate-800">{user.name}</span>
              </div>
              <button
                onClick={onLogout}
                title="Keluar"
                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : null}
        </div>

      </div>

      {/* Mobile Nav */}
      {user && (
        <div className="md:hidden flex items-center justify-around bg-white py-2 border-t border-slate-200">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex flex-col items-center gap-1 text-[11px] font-bold ${
              activeTab === 'create' ? 'text-indigo-600' : 'text-slate-500'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            Buat Kuis
          </button>
          <button
            onClick={() => setActiveTab('quizzes')}
            className={`flex flex-col items-center gap-1 text-[11px] font-bold ${
              activeTab === 'quizzes' ? 'text-indigo-600' : 'text-slate-500'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Kuis Saya
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`flex flex-col items-center gap-1 text-[11px] font-bold ${
              activeTab === 'results' ? 'text-indigo-600' : 'text-slate-500'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-500" />
            Rekap Nilai
          </button>
        </div>
      )}
    </header>
  );
}
