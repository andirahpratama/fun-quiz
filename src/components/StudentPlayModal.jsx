import React, { useState } from 'react';
import { User, School, Sparkles, Volume2, ShieldCheck, Gamepad2, Rocket, HelpCircle } from 'lucide-react';
import { GAME_TYPES } from '../data/questionBank';

export default function StudentPlayModal({ quiz, onStartGame }) {
  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState('');

  if (!quiz) return null;

  const gameTypeInfo = GAME_TYPES.find(g => g.id === quiz.game_type) || GAME_TYPES[0];

  const getGameIcon = () => {
    switch (quiz.game_type) {
      case 'fishing': return '🎣';
      case 'balloon': return '🎯';
      case 'catch_ball': return '🏀';
      case 'fruit_ninja': return '⚔️';
      default: return '🎮';
    }
  };

  const getGameTitle = () => {
    if (quiz.game_type === 'fishing') return 'PANCASILA FISHING QUEST';
    return `${quiz.subject.toUpperCase()} QUEST`;
  };

  const getActionText = () => {
    switch (quiz.game_type) {
      case 'fishing': return 'MULAI MEMANCING NOW';
      case 'balloon': return 'MULAI MEMANAH NOW';
      case 'catch_ball': return 'MULAI TANGKAP BOLA';
      case 'fruit_ninja': return 'MULAI MEMOTONG NOW';
      default: return 'MULAI BERMAIN GAME';
    }
  };

  const getGameDescription = () => {
    switch (quiz.game_type) {
      case 'fishing':
        return 'Nelayan siap melemparkan kail! Arahkan kail ke ikan bernomor soal (1-10) yang berenang di lautan untuk membuka pertanyaan kuis!';
      case 'balloon':
        return 'Balon-balon bernomor soal melayang di udara! Bidik dan panah balon bernomor (1-10) untuk menjawab pertanyaan!';
      case 'catch_ball':
        return 'Bola-bola bernomor soal jatuh dari langit! Geser keranjang basket kamu untuk menangkap bola bernomor (1-10)!';
      case 'fruit_ninja':
        return 'Buah-buahan bernomor soal terlempar ke udara! Tebas buah bernomor (1-10) dengan pedang ninja kamu!';
      default:
        return 'Jawab seluruh pertanyaan kuis dengan seru sambil bermain game interaktif!';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!studentName.trim() || !studentClass.trim()) {
      alert('Mohon isi Nama Lengkap dan Kelas Anda sebelum memulai game!');
      return;
    }
    onStartGame({
      name: studentName.trim(),
      studentClass: studentClass.trim(),
    });
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden bg-[#030712] text-white select-none">
      
      {/* Background Ambient Lighting Blobs */}
      <div className="ambient-bg">
        <div className="ambient-blob-1" />
        <div className="ambient-blob-2" />
        <div className="ambient-blob-3" />
      </div>

      {/* Top Header / Status Bar */}
      <header className="glass-nav py-3.5 px-4 sticky top-0 z-40 shadow-xl">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 flex items-center justify-center text-2xl shadow-lg shadow-amber-500/20 shrink-0 font-black">
              {getGameIcon()}
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-wider text-amber-300 uppercase leading-none">
                {getGameTitle()}
              </h1>
              <p className="text-xs text-slate-300 font-bold mt-1">
                {quiz.subject} &bull; <span className="text-cyan-300">{quiz.material}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-slate-300 font-bold">
              <span>👤</span>
              <span>Lobby Siswa SMP</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-black">
              <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Audio Active</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Form Lobby Card Container */}
      <main className="flex-1 relative z-10 flex flex-col items-center justify-center p-4 my-auto">
        <div className="w-full max-w-lg glass-card p-6 sm:p-10 text-center animate-fadeIn relative overflow-hidden border-amber-400/30">
          
          {/* Top Decorative Game Tag */}
          <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/40 text-amber-300 font-extrabold px-4 py-1.5 rounded-full text-xs uppercase tracking-widest mb-4 shadow-inner">
            <Sparkles className="w-3.5 h-3.5" />
            GAME KUIS EDUKASI {quiz.subject.toUpperCase()} SMP
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight mb-2 drop-shadow-md">
            SIAP BERMAIN & BELAJAR?
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
            {getGameDescription()}
          </p>

          {/* Student Entrance Form */}
          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            <div>
              <label className="block text-[11px] font-black text-amber-300 uppercase tracking-widest mb-1.5 ml-1">
                NAMA LENGKAP SISWA
              </label>
              <div className="input-wrapper-cyber">
                <User className="input-icon-cyber text-amber-400" />
                <input
                  type="text"
                  required
                  placeholder="Contoh: Riska Puspita"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="form-input-cyber text-white font-bold"
                />
              </div>
              <span className="text-[10px] text-slate-400 italic ml-1 mt-1 block">
                *Masukkan nama lengkap agar tercantum di Sertifikat Kelulusan
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-black text-amber-300 uppercase tracking-widest mb-1.5 ml-1">
                KELAS SISWA
              </label>
              <div className="input-wrapper-cyber">
                <School className="input-icon-cyber text-amber-400" />
                <input
                  type="text"
                  required
                  placeholder="Contoh: 8H / 7A / 9C"
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                  className="form-input-cyber text-white font-bold"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 rounded-2xl btn-amber-glow text-slate-950 font-black text-lg sm:text-xl tracking-wider uppercase flex items-center justify-center gap-3 shadow-2xl cursor-pointer"
              >
                <span>{getActionText()}</span>
                <Rocket className="w-6 h-6 fill-current animate-bounce" />
              </button>
            </div>
          </form>

          {/* Audio & Game Tips */}
          <div className="mt-6 text-[11px] text-slate-400 bg-slate-900/80 p-3 rounded-2xl border border-slate-800 flex items-center justify-center gap-2">
            <Gamepad2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Game ini menggunakan Web Audio API interaktif!</span>
          </div>

        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="w-full glass-nav py-3 text-center text-xs text-slate-400 border-t border-slate-800">
        Kuis {quiz.subject} Kelas SMP &bull; Materi {quiz.material} &bull; Fun Quiz Platform
      </footer>

    </div>
  );
}
