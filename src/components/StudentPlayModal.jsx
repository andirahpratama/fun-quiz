import React, { useState } from 'react';
import { User, School, Rocket, Sparkles, Clock, BookOpen, Award, Play } from 'lucide-react';
import { GAME_TYPES } from '../data/questionBank';

export default function StudentPlayModal({ quiz, onStartGame }) {
  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState('');

  if (!quiz) return null;

  const gameTypeInfo = GAME_TYPES.find(g => g.id === quiz.game_type) || GAME_TYPES[0];

  const formatDuration = (totalSec) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    const parts = [];
    if (hrs > 0) parts.push(`${hrs} Jam`);
    if (mins > 0) parts.push(`${mins} Menit`);
    if (secs > 0 || parts.length === 0) parts.push(`${secs} Detik`);
    return parts.join(' ');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!studentName.trim() || !studentClass.trim()) {
      alert('Mohon isi Nama Lengkap dan Kelas Anda sebelum mulai memancing/bermain!');
      return;
    }
    onStartGame({
      name: studentName.trim(),
      studentClass: studentClass.trim(),
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-blue-950 via-slate-900 to-slate-950 text-white font-['Fredoka','Nunito',sans-serif]">
      <section className="w-full max-w-md bg-gradient-to-b from-blue-600 via-sky-600 to-cyan-700 rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-yellow-400 relative z-20 text-center animate-fadeIn my-auto">
        
        {/* Decorative Badge */}
        <div className="inline-block bg-yellow-400 text-blue-950 font-black px-4 py-1.5 rounded-full text-xs uppercase tracking-widest mb-3 shadow-md">
          🌟 Game Kuis Interaktif SMP 🌟
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-white drop-shadow-[0_3px_5px_rgba(0,0,0,0.5)] mb-2 uppercase">
          AYO BERMAIN!
        </h2>
        
        <p className="text-sky-100 text-xs sm:text-sm mb-5 leading-relaxed font-semibold">
          {quiz.subject} &bull; <span className="text-yellow-300 font-bold">{quiz.material}</span>
        </p>

        {/* Quiz Meta Info Badge Row */}
        <div className="grid grid-cols-3 gap-2 mb-6 bg-blue-950/50 p-2.5 rounded-2xl border border-sky-300/30 text-[11px]">
          <div className="flex flex-col items-center">
            <span className="text-sky-300 font-bold">Soal</span>
            <span className="font-extrabold text-yellow-300 text-sm">{quiz.question_count} Soal</span>
          </div>
          <div className="flex flex-col items-center border-x border-sky-400/30">
            <span className="text-sky-300 font-bold">Durasi</span>
            <span className="font-extrabold text-yellow-300 text-xs">{formatDuration(quiz.duration_seconds)}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sky-300 font-bold">Guru</span>
            <span className="font-extrabold text-white text-xs truncate max-w-[80px]" title={quiz.teacher_name}>
              {quiz.teacher_name}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold text-yellow-300 uppercase tracking-wider mb-1 ml-1">
              Nama Lengkap Siswa
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-lg pointer-events-none text-sky-400">👤</span>
              <input
                type="text"
                required
                placeholder="Contoh: Riska Puspita"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/95 text-blue-950 font-bold placeholder-slate-400 rounded-2xl border-2 border-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-300 shadow-inner text-sm transition"
              />
            </div>
            <span className="text-[11px] text-sky-200/80 italic ml-1 mt-0.5 block font-light">Contoh: Riska Puspita</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-yellow-300 uppercase tracking-wider mb-1 ml-1">
              Kelas Siswa
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-lg pointer-events-none text-sky-400">🏫</span>
              <input
                type="text"
                required
                placeholder="Contoh: 8H"
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/95 text-blue-950 font-bold placeholder-slate-400 rounded-2xl border-2 border-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-300 shadow-inner text-sm transition"
              />
            </div>
            <span className="text-[11px] text-sky-200/80 italic ml-1 mt-0.5 block font-light">Contoh: 8H</span>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-4 rounded-2xl btn-3d btn-3d-yellow text-blue-950 font-black text-lg tracking-wider uppercase flex items-center justify-center space-x-2 border-2 border-white shadow-xl"
            >
              <span>MULAI MEMANCING / GAME</span>
              <span className="text-2xl">🚀</span>
            </button>
          </div>
        </form>

        <div className="mt-5 text-[11px] text-cyan-200/90 bg-blue-950/50 py-2 px-3 rounded-xl border border-sky-300/30 flex items-center justify-center space-x-1.5">
          <span>🎵</span>
          <span>Musik ceria & efek Web Audio langsung berbunyi otomatis!</span>
        </div>

      </section>
    </div>
  );
}
