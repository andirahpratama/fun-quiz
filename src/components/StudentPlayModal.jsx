import React, { useState } from 'react';
import { User, School, Play, Sparkles, Clock, BookOpen, Award } from 'lucide-react';
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
      alert('Mohon isi Nama Lengkap dan Kelas Anda sebelum memulai game!');
      return;
    }
    onStartGame({
      name: studentName.trim(),
      studentClass: studentClass.trim(),
    });
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-xl glass-panel p-6 sm:p-10 text-center animate-fadeIn relative overflow-hidden">
        
        {/* Glow Decor */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Game Icon Badge */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-4xl shadow-xl shadow-indigo-500/30 mb-4 animate-float">
          {gameTypeInfo.icon}
        </div>

        <h2 className="text-3xl font-black text-white tracking-tight mb-1">
          {quiz.subject}
        </h2>
        <p className="text-sm font-semibold text-indigo-400 mb-6">
          Materi: {quiz.material}
        </p>

        {/* Quiz Meta Info Grid */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800 flex flex-col items-center justify-center">
            <BookOpen className="w-5 h-5 text-indigo-400 mb-1" />
            <span className="text-[10px] text-slate-400 font-medium">Jumlah Soal</span>
            <span className="text-sm font-extrabold text-white">{quiz.question_count} Soal</span>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800 flex flex-col items-center justify-center">
            <Clock className="w-5 h-5 text-amber-400 mb-1" />
            <span className="text-[10px] text-slate-400 font-medium">Durasi Waktu</span>
            <span className="text-sm font-extrabold text-white">{formatDuration(quiz.duration_seconds)}</span>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800 flex flex-col items-center justify-center">
            <Award className="w-5 h-5 text-cyan-400 mb-1" />
            <span className="text-[10px] text-slate-400 font-medium">Guru Pengampu</span>
            <span className="text-xs font-extrabold text-white truncate max-w-[100px]" title={quiz.teacher_name}>
              {quiz.teacher_name}
            </span>
          </div>
        </div>

        {/* Student Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="form-group">
            <label className="form-label">
              <User className="w-4 h-4 text-indigo-400" />
              Nama Lengkap Siswa
            </label>
            <input
              type="text"
              required
              placeholder="Masukkan nama lengkap kamu..."
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="form-input text-base"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <School className="w-4 h-4 text-indigo-400" />
              Kelas (Contoh: VII-A, VIII-B, IX-C)
            </label>
            <input
              type="text"
              required
              placeholder="Masukkan kelas kamu..."
              value={studentClass}
              onChange={(e) => setStudentClass(e.target.value)}
              className="form-input text-base"
            />
          </div>

          <button
            type="submit"
            className="w-full btn-gradient-primary justify-center py-4 text-lg font-black tracking-wide mt-4 shadow-xl shadow-indigo-600/40"
          >
            <Play className="w-6 h-6 fill-current" />
            MULAI GAME SEKARANG
          </button>
        </form>

      </div>
    </div>
  );
}
