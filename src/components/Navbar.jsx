import React, { useState } from 'react';
import { PlusCircle, Trophy, BookOpen, LogOut, ChevronDown, User, Sparkles, Gamepad2 } from 'lucide-react';

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
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="glass-nav sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left Side: Brand Logo */}
        <div 
          onClick={onResetToHome}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white text-xl shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            🎯
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-black tracking-tight text-white">
                Fun Quiz <span className="text-emerald-400">SMP</span>
              </h1>
            </div>
            <p className="text-[10px] text-slate-400 font-semibold hidden sm:block">
              Platform Game Edukasi SMP
            </p>
          </div>
        </div>

        {/* Center: Navigation Menu Pills */}
        {user && (
          <nav className="flex items-center gap-1 sm:gap-2 bg-slate-900/60 p-1 rounded-full border border-slate-800 backdrop-blur-md">
            <button
              onClick={() => setActiveTab('create')}
              className={`nav-tab-modern ${activeTab === 'create' ? 'active' : ''}`}
            >
              <PlusCircle className="w-4 h-4" />
              <span className="text-xs sm:text-sm">Buat Kuis</span>
            </button>

            <button
              onClick={() => setActiveTab('quizzes')}
              className={`nav-tab-modern ${activeTab === 'quizzes' ? 'active' : ''}`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="text-xs sm:text-sm">Kuis Saya</span>
            </button>

            <button
              onClick={() => setActiveTab('results')}
              className={`nav-tab-modern ${activeTab === 'results' ? 'active' : ''}`}
            >
              <Trophy className="w-4 h-4" />
              <span className="text-xs sm:text-sm">Rekap Nilai</span>
            </button>
          </nav>
        )}

        {/* Right Side: Profile Menu Dropdown */}
        <div className="flex items-center gap-3 relative shrink-0">
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 hover:border-slate-500 transition text-white cursor-pointer shadow-md"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black text-xs flex items-center justify-center shadow">
                  {getInitials(user.name)}
                </div>
                <span className="text-xs font-bold text-slate-200 hidden sm:inline">
                  {user.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-2 w-60 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-fadeIn backdrop-blur-xl">
                  <div className="p-3 border-b border-slate-800">
                    <p className="text-xs font-black text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{user.email}</p>
                    <span className="inline-block mt-2 px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider">
                      Guru SMP
                    </span>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3 py-2.5 text-xs font-bold text-rose-400 hover:bg-rose-500/10 rounded-xl transition flex items-center gap-2 mt-1 cursor-pointer"
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
    </header>
  );
}
