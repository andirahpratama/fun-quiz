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
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={onResetToHome}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#059669] flex items-center justify-center text-white text-xl shadow-md shadow-emerald-600/20">
            🎯
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-black tracking-tight text-slate-900">
                FUN QUIZ
              </h1>
              <span className="bg-emerald-50 text-[#059669] text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-200">
                SMP
              </span>
            </div>
          </div>
        </div>

        {/* Center Nav Pills */}
        {user && (
          <nav className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setActiveTab('create')}
              className={`nav-pill ${activeTab === 'create' ? 'active' : ''}`}
            >
              <PlusCircle className="w-4 h-4" />
              Buat Kuis
            </button>

            <button
              onClick={() => setActiveTab('quizzes')}
              className={`nav-pill ${activeTab === 'quizzes' ? 'active' : ''}`}
            >
              <BookOpen className="w-4 h-4" />
              Kuis Saya
            </button>

            <button
              onClick={() => setActiveTab('results')}
              className={`nav-pill ${activeTab === 'results' ? 'active' : ''}`}
            >
              <Trophy className="w-4 h-4" />
              Rekap Nilai
            </button>
          </nav>
        )}

        {/* User Badge */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3 bg-slate-100 pl-3 pr-2 py-1.5 rounded-full border border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#059669] flex items-center justify-center text-white font-black text-xs">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'G'}
                </div>
                <span className="hidden sm:block text-xs font-extrabold text-slate-800">{user.name}</span>
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

      {/* Mobile Nav Pills */}
      {user && (
        <div className="md:hidden flex items-center justify-around bg-slate-50 py-2 border-t border-slate-200 px-2 gap-1">
          <button
            onClick={() => setActiveTab('create')}
            className={`nav-pill text-[11px] py-1.5 px-3 ${activeTab === 'create' ? 'active' : ''}`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Buat Kuis
          </button>
          <button
            onClick={() => setActiveTab('quizzes')}
            className={`nav-pill text-[11px] py-1.5 px-3 ${activeTab === 'quizzes' ? 'active' : ''}`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Kuis Saya
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`nav-pill text-[11px] py-1.5 px-3 ${activeTab === 'results' ? 'active' : ''}`}
          >
            <Trophy className="w-3.5 h-3.5" />
            Rekap Nilai
          </button>
        </div>
      )}
    </header>
  );
}
