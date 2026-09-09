import React, { useState } from 'react';
import { Target, PlusCircle, Trophy, BookOpen, LogOut, ChevronDown, User } from 'lucide-react';

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
    <header className="navy-header sticky top-0 z-40 w-full shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left Side: Brand Logo */}
        <div 
          onClick={onResetToHome}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
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
          <nav className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setActiveTab('create')}
              className={`nav-link-item ${activeTab === 'create' ? 'active' : ''}`}
            >
              <PlusCircle className="w-4 h-4" />
              <span className="text-xs sm:text-sm">Buat Kuis</span>
            </button>

            <button
              onClick={() => setActiveTab('quizzes')}
              className={`nav-link-item ${activeTab === 'quizzes' ? 'active' : ''}`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="text-xs sm:text-sm">Kuis Saya</span>
            </button>

            <button
              onClick={() => setActiveTab('results')}
              className={`nav-link-item ${activeTab === 'results' ? 'active' : ''}`}
            >
              <Trophy className="w-4 h-4" />
              <span className="text-xs sm:text-sm">Rekap Nilai</span>
            </button>
          </nav>
        )}

        {/* Right Side: Profile Menu Dropdown (Far Right Position) */}
        <div className="flex items-center gap-3 relative shrink-0">
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                style={{
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '9999px',
                  padding: '6px 14px',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                }}
              >
                <div 
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: '#10b981',
                    color: '#030712',
                    fontWeight: 900,
                    fontSize: '11px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {getInitials(user.name)}
                </div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#f8fafc' }} className="hidden sm:inline">
                  {user.name}
                </span>
                <ChevronDown style={{ width: '14px', height: '14px', color: '#94a3b8' }} />
              </button>

              {/* Styled Profile Dropdown Menu */}
              {showProfileMenu && (
                <div 
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 8px)',
                    width: '220px',
                    background: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '16px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                    padding: '8px 0',
                    zIndex: 9999,
                  }}
                >
                  <div style={{ padding: '8px 16px', borderBottom: '1px solid #1e293b' }}>
                    <p style={{ fontSize: '12px', fontWeight: 800, color: '#ffffff', margin: 0 }}>{user.name}</p>
                    <p style={{ fontSize: '10px', color: '#94a3b8', margin: '2px 0 0 0' }}>{user.email}</p>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      onLogout();
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '10px 16px',
                      background: 'transparent',
                      border: 'none',
                      color: '#fb7185',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <LogOut style={{ width: '14px', height: '14px' }} />
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
