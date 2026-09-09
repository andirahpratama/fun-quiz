import React, { useState } from 'react';
import { Target, PlusCircle, Trophy, BookOpen, LogOut, ChevronDown } from 'lucide-react';

export default function Navbar({
  user,
  onOpenAuth,
  onLogout,
  activeTab,
  setActiveTab,
  onResetToHome
}) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'G';
    const parts = name.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="navy-header sticky top-0 z-40 w-full shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left Side: Brand Logo (Neraca UMKM Style) */}
        <div 
          onClick={onResetToHome}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#059669] flex items-center justify-center text-white text-xl shadow-md shadow-emerald-900/40">
            🎯
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-black tracking-tight text-white">
                Fun Quiz <span className="text-[#10b981]">SMP</span>
              </h1>
            </div>
          </div>
        </div>

        {/* Center: Navigation Menu Pills */}
        {user && (
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-full border border-slate-800">
            <button
              onClick={() => setActiveTab('create')}
              className={`nav-link-item ${activeTab === 'create' ? 'active' : ''}`}
            >
              <PlusCircle className="w-4 h-4" />
              Buat Kuis
            </button>

            <button
              onClick={() => setActiveTab('quizzes')}
              className={`nav-link-item ${activeTab === 'quizzes' ? 'active' : ''}`}
            >
              <BookOpen className="w-4 h-4" />
              Kuis Saya
            </button>

            <button
              onClick={() => setActiveTab('results')}
              className={`nav-link-item ${activeTab === 'results' ? 'active' : ''}`}
            >
              <Trophy className="w-4 h-4" />
              Rekap Nilai
            </button>
          </nav>
        )}

        {/* Right Side: User Profile Avatar Badge (Neraca UMKM Style) */}
        <div className="flex items-center gap-3 relative">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2.5 bg-slate-900/80 hover:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700/80 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-[#10b981] flex items-center justify-center text-slate-950 font-black text-xs">
                  {getInitials(user.name)}
                </div>
                <span className="hidden sm:block text-xs font-bold text-slate-200">
                  {user.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl py-2 z-50 animate-fadeIn">
                  <div className="px-4 py-2 border-b border-slate-800">
                    <p className="text-xs font-bold text-white truncate">{user.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onLogout();
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Keluar Akun
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </div>

      </div>

      {/* Mobile Nav Pills */}
      {user && (
        <div className="md:hidden flex items-center justify-around bg-slate-950 py-2 border-t border-slate-800 px-2 gap-1">
          <button
            onClick={() => setActiveTab('create')}
            className={`nav-link-item text-[11px] py-1.5 px-3 ${activeTab === 'create' ? 'active' : ''}`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Buat Kuis
          </button>
          <button
            onClick={() => setActiveTab('quizzes')}
            className={`nav-link-item text-[11px] py-1.5 px-3 ${activeTab === 'quizzes' ? 'active' : ''}`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Kuis Saya
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`nav-link-item text-[11px] py-1.5 px-3 ${activeTab === 'results' ? 'active' : ''}`}
          >
            <Trophy className="w-3.5 h-3.5" />
            Rekap Nilai
          </button>
        </div>
      )}
    </header>
  );
}
