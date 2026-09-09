import React, { useState } from 'react';
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
      default: return '🎣';
    }
  };

  const getGameTitle = () => {
    if (quiz.game_type === 'fishing') return 'PANCASILA FISHING QUEST';
    return `${quiz.subject.toUpperCase()} QUEST`;
  };

  const getActionText = () => {
    switch (quiz.game_type) {
      case 'fishing': return 'MULAI MEMANCING';
      case 'balloon': return 'MULAI MEMANAH';
      case 'catch_ball': return 'MULAI TANGKAP BOLA';
      case 'fruit_ninja': return 'MULAI MEMOTONG';
      default: return 'MULAI BERMAIN';
    }
  };

  const getGameDescription = () => {
    switch (quiz.game_type) {
      case 'fishing':
        return 'Nelayan di perahu siap melemparkan kail ke dalam laut! Arahkan kailmu ke ikan bernomor soal (1-10) yang berenang zigzag dan hindari ikan hias liar!';
      case 'balloon':
        return 'Balon bernomor soal melayang di udara! Bidik dan panah balon bernomor (1-10) untuk membuka pertanyaan!';
      case 'catch_ball':
        return 'Bola-bola bernomor soal jatuh dari atas langit! Geser keranjang untuk menangkap bola bernomor (1-10)!';
      case 'fruit_ninja':
        return 'Buah-buahan bernomor soal terlempar ke udara! Usap pedang ninja kamu untuk memotong buah bernomor (1-10)!';
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
    <div className="bg-slate-900 text-white min-h-screen flex flex-col justify-between overflow-x-hidden select-none font-['Fredoka','Nunito',sans-serif]">

      {/* Top Navigation / Status Bar matching Image 2 */}
      <header className="w-full bg-blue-900/80 backdrop-blur border-b-4 border-yellow-400 py-2.5 px-4 sticky top-0 z-40 shadow-lg">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-yellow-400 to-amber-300 flex items-center justify-center text-2xl shadow-inner border-2 border-white shrink-0">
              {getGameIcon()}
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold tracking-wide text-yellow-300 leading-tight uppercase">
                {getGameTitle()}
              </h1>
              <p className="text-xs text-blue-200 font-semibold tracking-wider">
                {quiz.subject} &bull; {quiz.material}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="hidden sm:flex items-center bg-blue-950/70 px-3 py-1 rounded-full border border-blue-400/40 text-xs text-cyan-200">
              <span className="mr-1">👤</span>
              <span className="font-bold text-white max-w-[120px] truncate">Siswa</span>
              <span className="ml-1 bg-yellow-400 text-blue-900 px-1.5 py-0.2 rounded font-black text-[10px]">8H</span>
            </div>
            <div className="flex items-center bg-yellow-500 text-blue-950 px-3 py-1 rounded-full font-black text-sm shadow-md border-2 border-white">
              ⭐ <span className="ml-1 text-base">0</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-blue-700 border-2 border-yellow-300 flex items-center justify-center text-sm shadow">
              🔊
            </div>
          </div>
        </div>
      </header>

      {/* Main Screen Container matching Image 2 */}
      <main className="flex-1 relative flex flex-col items-center justify-center w-full p-4 overflow-hidden my-auto">
        <section className="w-full max-w-md bg-gradient-to-b from-blue-600 via-sky-600 to-cyan-700 rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-yellow-400 relative z-20 text-center my-auto animate-fadeIn">
          
          {/* Decorative Badge */}
          <div className="inline-block bg-yellow-400 text-blue-950 font-black px-4 py-1.5 rounded-full text-xs uppercase tracking-widest mb-3 shadow-md">
            🌟 UJI PEMAHAMAN {quiz.subject.toUpperCase()} SMP 🌟
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white drop-shadow-[0_3px_5px_rgba(0,0,0,0.5)] mb-2 uppercase">
            AYO MEMANCING!
          </h2>

          <p className="text-sky-100 text-sm mb-5 leading-relaxed">
            {getGameDescription()}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-yellow-300 uppercase tracking-wider mb-1 ml-1">
                NAMA LENGKAP SISWA
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-lg pointer-events-none text-sky-300">👤</span>
                <input
                  type="text"
                  required
                  placeholder="Riska Puspita"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/90 focus:bg-white text-blue-950 font-bold placeholder-slate-400/60 rounded-2xl border-2 border-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-300 shadow-inner text-sm transition"
                />
              </div>
              <span className="text-[11px] text-sky-200/80 italic ml-1 mt-0.5 block font-light">Contoh: Riska Puspita</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-yellow-300 uppercase tracking-wider mb-1 ml-1">
                KELAS
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-lg pointer-events-none text-sky-300">🏫</span>
                <input
                  type="text"
                  required
                  placeholder="8H"
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/90 focus:bg-white text-blue-950 font-bold placeholder-slate-400/60 rounded-2xl border-2 border-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-300 shadow-inner text-sm transition"
                />
              </div>
              <span className="text-[11px] text-sky-200/80 italic ml-1 mt-0.5 block font-light">Contoh: 8H</span>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-4 rounded-2xl btn-3d btn-3d-yellow text-blue-950 font-black text-xl tracking-wider uppercase flex items-center justify-center space-x-2 border-2 border-white shadow-xl cursor-pointer"
              >
                <span>{getActionText()}</span>
                <span className="text-2xl">🚀</span>
              </button>
            </div>
          </form>

          {/* Music Info Note */}
          <div className="mt-5 text-[11px] text-cyan-200/90 bg-blue-950/50 py-2 px-3 rounded-xl border border-sky-300/30 flex items-center justify-center space-x-1.5">
            <span>🎵</span>
            <span>Musik ceria & efek Web Audio langsung berbunyi otomatis!</span>
          </div>

        </section>
      </main>

      {/* Footer matching Image 2 */}
      <footer className="w-full bg-blue-950 py-2.5 text-center text-xs text-sky-400 border-t border-sky-800">
        {quiz.subject} Kelas 8 SMP &bull; Materi {quiz.material}
      </footer>
    </div>
  );
}
