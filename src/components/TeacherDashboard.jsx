import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, BookOpen, Trophy, Copy, Check, Share2, Play, Trash2, 
  Download, Clock, Layers, Sparkles, HelpCircle, ChevronRight, CheckCircle2, ExternalLink, Gamepad2, Users, Award, AlertCircle
} from 'lucide-react';
import { SUBJECTS, GAME_TYPES, generateQuestions } from '../data/questionBank';
import { api } from '../lib/supabase';
import { exportTeacherResultsPDF } from '../utils/pdfGenerator';

export default function TeacherDashboard({
  user,
  activeTab,
  setActiveTab,
  onPlayCreatedQuiz,
}) {
  // Quiz Creator Form state
  const [subject, setSubject] = useState('IPA');
  const [material, setMaterial] = useState('Sistem Organ & Respirasi');
  const [questionCount, setQuestionCount] = useState(5);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(10);
  const [seconds, setSeconds] = useState(0);
  const [gameType, setGameType] = useState('fruit_ninja');
  
  // Custom Question Editor State
  const [questions, setQuestions] = useState([]);
  const [showQuestionPreview, setShowQuestionPreview] = useState(false);

  // Modal Share Link State
  const [createdQuizModal, setCreatedQuizModal] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // My Quizzes & Results List State
  const [myQuizzes, setMyQuizzes] = useState([]);
  const [teacherResults, setTeacherResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterQuizId, setFilterQuizId] = useState('ALL');

  // Format Current Date
  const currentDateStr = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Load questions when subject or material changes
  useEffect(() => {
    const generated = generateQuestions(subject, material, questionCount);
    setQuestions(Array.isArray(generated) ? generated : []);
  }, [subject, material, questionCount]);

  // Load User Data
  useEffect(() => {
    if (user?.id) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const quizzes = await api.getUserQuizzes(user.id);
      const results = await api.getTeacherResults(user.id);
      setMyQuizzes(Array.isArray(quizzes) ? quizzes : []);
      setTeacherResults(Array.isArray(results) ? results : []);
    } catch (e) {
      console.error('Error loading teacher data:', e);
      setMyQuizzes([]);
      setTeacherResults([]);
    } finally {
      setLoading(false);
    }
  };

  const setQuickDuration = (min) => {
    setHours(0);
    setMinutes(min);
    setSeconds(0);
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Silakan login terlebih dahulu!');
      return;
    }

    const durationSeconds = hours * 3600 + minutes * 60 + seconds;
    if (durationSeconds < 10) {
      alert('Durasi pengerjaan minimal 10 detik!');
      return;
    }

    try {
      const quizPayload = {
        user_id: user.id,
        teacher_name: user.name || 'Guru SMP',
        teacher_email: user.email || '',
        subject,
        material,
        question_count: Number(questionCount),
        duration_seconds: durationSeconds,
        game_type: gameType,
        questions: questions || [],
      };

      const newQuiz = await api.createQuiz(quizPayload);
      setCreatedQuizModal(newQuiz);
      await loadUserData();
    } catch (err) {
      alert('Gagal membuat kuis: ' + err.message);
    }
  };

  const getQuizShareUrl = (quiz) => {
    if (!quiz) return '';
    const code = quiz.share_code || quiz.id;
    return `${window.location.origin}${window.location.pathname}?quiz=${code}`;
  };

  const handleCopyLink = (url) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus kuis ini?')) return;
    try {
      await api.deleteQuiz(quizId, user?.id);
      await loadUserData();
    } catch (e) {
      alert('Gagal menghapus kuis');
    }
  };

  // Defensive Array Wrappers
  const safeQuizzes = Array.isArray(myQuizzes) ? myQuizzes : [];
  const safeResults = Array.isArray(teacherResults) ? teacherResults : [];

  // Stats calculation
  const totalQuizzes = safeQuizzes.length;
  const totalSubmissions = safeResults.length;
  const avgScore = totalSubmissions > 0
    ? Math.round(safeResults.reduce((acc, r) => acc + (r?.score || 0), 0) / totalSubmissions)
    : 0;

  const currentSubjectData = SUBJECTS.find(s => s.id === subject) || SUBJECTS[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 p-6 sm:p-8 border border-emerald-500/20 shadow-2xl mb-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              {currentDateStr}
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Selamat Datang, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">{user?.name || 'Guru SMP'}</span> 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1 max-w-xl">
              Buat kuis game edukasi SMP interaktif, bagikan kode/link ke siswa, dan lihat rekap nilai & sertifikat secara otomatis.
            </p>
          </div>

          {/* Quick Stat Widgets */}
          <div className="grid grid-cols-3 gap-3 shrink-0">
            <div className="glass-card p-3.5 text-center min-w-[100px]">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Kuis</p>
              <p className="text-2xl font-black text-emerald-400 mt-0.5">{totalQuizzes}</p>
            </div>
            <div className="glass-card p-3.5 text-center min-w-[100px]">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Siswa</p>
              <p className="text-2xl font-black text-cyan-400 mt-0.5">{totalSubmissions}</p>
            </div>
            <div className="glass-card p-3.5 text-center min-w-[100px]">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Rerata</p>
              <p className="text-2xl font-black text-amber-400 mt-0.5">{avgScore}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'create' && (
        <div className="space-y-8 animate-fadeIn">
          
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                <PlusCircle className="w-6 h-6 text-emerald-400" />
                Buat Kuis Game Edukasi Baru
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Pilih mata pelajaran, durasi, dan jenis mini-game untuk membuat kuis interaktif siswa.
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateQuiz} className="space-y-8">
            
            {/* Step 1: Mata Pelajaran & Materi */}
            <div className="glass-card p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-black text-sm flex items-center justify-center border border-emerald-500/30">
                  1
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Mata Pelajaran & Materi SMP</h3>
                  <p className="text-xs text-slate-400">Pilih rumpun mata pelajaran dan topik bahasan kuis</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-2">
                    Pilih Mata Pelajaran
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {SUBJECTS.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          setSubject(s.id);
                          setMaterial(s.materials[0]);
                        }}
                        className={`p-3 rounded-xl text-left border flex items-center gap-2.5 transition cursor-pointer ${
                          subject === s.id
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold shadow-lg shadow-emerald-900/20'
                            : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                        }`}
                      >
                        <span className="text-xl">{s.icon}</span>
                        <span className="text-xs font-bold">{s.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-2">
                    Pilih Topik / Materi Pokok
                  </label>
                  <select
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    className="form-select-cyber pl-4 h-12"
                  >
                    {(currentSubjectData.materials || []).map((m) => (
                      <option key={m} value={m}>
                        📚 {m}
                      </option>
                    ))}
                  </select>

                  <div className="mt-4 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
                    <span className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-emerald-400" />
                      Jumlah Pertanyaan Soal:
                    </span>
                    <div className="flex items-center gap-2">
                      {[5, 10, 15].map((cnt) => (
                        <button
                          key={cnt}
                          type="button"
                          onClick={() => setQuestionCount(cnt)}
                          className={`px-3 py-1 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                            questionCount === cnt
                              ? 'bg-emerald-500 text-slate-950 shadow'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {cnt} Soal
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Durasi Pengerjaan Kuis */}
            <div className="glass-card p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 font-black text-sm flex items-center justify-center border border-cyan-500/30">
                    2
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white">Durasi Pengerjaan Kuis</h3>
                    <p className="text-xs text-slate-400">Atur alokasi waktu maksimal siswa menjawab kuis</p>
                  </div>
                </div>

                {/* Preset Chips */}
                <div className="flex items-center gap-2">
                  {[3, 5, 10, 15].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setQuickDuration(m)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        minutes === m && hours === 0 && seconds === 0
                          ? 'bg-cyan-500 text-slate-950 font-black'
                          : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {m} Menit
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto text-center">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">JAM</label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    value={hours}
                    onChange={(e) => setHours(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full text-center py-3 bg-slate-900 border border-slate-800 rounded-xl font-black text-xl text-white focus:border-cyan-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">MENIT</label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={minutes}
                    onChange={(e) => setMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full text-center py-3 bg-slate-900 border border-slate-800 rounded-xl font-black text-xl text-cyan-400 focus:border-cyan-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">DETIK</label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={seconds}
                    onChange={(e) => setSeconds(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full text-center py-3 bg-slate-900 border border-slate-800 rounded-xl font-black text-xl text-white focus:border-cyan-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Pilih Mini Game Edukasi */}
            <div className="glass-card p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 font-black text-sm flex items-center justify-center border border-amber-500/30">
                  3
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Pilih Jenis Game Edukasi Interaktif</h3>
                  <p className="text-xs text-slate-400">Setiap game memiliki mekanisme gameplay seru yang disukai siswa SMP</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {GAME_TYPES.map((gt) => {
                  const isSelected = gameType === gt.id;
                  return (
                    <div
                      key={gt.id}
                      onClick={() => setGameType(gt.id)}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                        isSelected
                          ? 'bg-gradient-to-b from-amber-500/20 to-slate-900 border-amber-400 shadow-xl shadow-amber-900/20 ring-2 ring-amber-400/30'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-xs font-black">
                          ✓
                        </div>
                      )}
                      <div className="text-4xl mb-3">{gt.icon}</div>
                      <h4 className="font-extrabold text-white text-base mb-1">{gt.name}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{gt.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submit Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 glass-card border-emerald-500/30">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-white">
                    Siap Mempublikasikan Kuis {subject} - {material}?
                  </p>
                  <p className="text-xs text-slate-400">
                    Kuis akan langsung tersimpan & dapat dimainkan oleh siswa via link share.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-4 btn-emerald-glow text-base font-black uppercase tracking-wider cursor-pointer"
              >
                <PlusCircle className="w-5 h-5" />
                Terbitkan & Bagikan Kuis
              </button>
            </div>

          </form>
        </div>
      )}

      {/* Tab 2: Kuis Saya */}
      {activeTab === 'quizzes' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-cyan-400" />
                Kuis Saya ({safeQuizzes.length})
              </h2>
              <p className="text-xs text-slate-400">
                Daftar kuis yang telah Anda buat. Salin link untuk dibagikan ke kelas siswa Anda.
              </p>
            </div>
            
            <button
              onClick={() => setActiveTab('create')}
              className="btn-emerald-glow text-xs py-2.5 px-4"
            >
              <PlusCircle className="w-4 h-4" />
              Buat Kuis Baru
            </button>
          </div>

          {loading ? (
            <div className="glass-card p-12 text-center text-slate-400 font-bold">
              Memuat daftar kuis...
            </div>
          ) : safeQuizzes.length === 0 ? (
            <div className="glass-card p-12 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto text-2xl">
                📚
              </div>
              <h3 className="text-lg font-bold text-white">Belum ada kuis yang dibuat</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Klik tombol "Buat Kuis Baru" di atas untuk mulai membuat kuis game edukasi SMP pertama Anda.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {safeQuizzes.map((quiz) => {
                if (!quiz) return null;
                const shareUrl = getQuizShareUrl(quiz);
                const gameIcon = quiz.game_type === 'fishing' ? '🎣' : quiz.game_type === 'balloon' ? '🎯' : quiz.game_type === 'catch_ball' ? '🏀' : '⚔️';

                return (
                  <div key={quiz.id || Math.random()} className="glass-card p-6 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {quiz.subject}
                        </span>
                        <span className="text-xs font-extrabold text-slate-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-cyan-400" />
                          {Math.round((quiz.duration_seconds || 300) / 60)} Menit
                        </span>
                      </div>

                      <h3 className="text-lg font-black text-white leading-snug">
                        {quiz.material}
                      </h3>

                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 font-medium">
                        <span>{gameIcon}</span>
                        <span>Game: <strong className="text-slate-200 uppercase">{(quiz.game_type || 'fruit_ninja').replace('_', ' ')}</strong></span>
                        <span>&bull;</span>
                        <span>{quiz.question_count || quiz.questions?.length || 5} Soal</span>
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopyLink(shareUrl)}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-bold text-slate-200 flex items-center justify-center gap-1.5 transition cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5 text-emerald-400" />
                          Salin Link Siswa
                        </button>
                        
                        <button
                          onClick={() => onPlayCreatedQuiz(quiz)}
                          className="py-2.5 px-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1 transition cursor-pointer hover:bg-emerald-500/30"
                          title="Uji Main Kuis Ini"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          Uji
                        </button>

                        <button
                          onClick={() => handleDeleteQuiz(quiz.id)}
                          className="py-2.5 px-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold hover:bg-rose-500/20 transition cursor-pointer"
                          title="Hapus Kuis"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Rekap Nilai Siswa */}
      {activeTab === 'results' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                <Trophy className="w-6 h-6 text-amber-400" />
                Rekapitulasi Nilai Siswa ({safeResults.length})
              </h2>
              <p className="text-xs text-slate-400">
                Data nilai pengerjaan kuis siswa secara otomatis tersimpan & terkalibrasi.
              </p>
            </div>

            {safeResults.length > 0 && (
              <button
                onClick={() => exportTeacherResultsPDF(safeResults, user?.name)}
                className="btn-cyan-glow text-xs py-2.5 px-4"
              >
                <Download className="w-4 h-4" />
                Unduh Rekap PDF
              </button>
            )}
          </div>

          {loading ? (
            <div className="glass-card p-12 text-center text-slate-400 font-bold">
              Memuat data rekap nilai...
            </div>
          ) : safeResults.length === 0 ? (
            <div className="glass-card p-12 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto text-2xl">
                🏆
              </div>
              <h3 className="text-lg font-bold text-white">Belum ada nilai siswa masuk</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Bagikan link kuis kepada siswa Anda. Ketika siswa menyelesaikan game kuis, nilai mereka akan otomatis muncul di sini.
              </p>
            </div>
          ) : (
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900/80 border-b border-slate-800 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                      <th className="p-4">NAMA SISWA</th>
                      <th className="p-4">KELAS</th>
                      <th className="p-4">MATPEL & MATERI</th>
                      <th className="p-4 text-center">SKOR / NILAI</th>
                      <th className="p-4 text-center">BENAR</th>
                      <th className="p-4 text-center">STATUS</th>
                      <th className="p-4 text-right">TANGGAL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-xs font-semibold text-slate-200">
                    {safeResults.map((res, idx) => {
                      if (!res) return null;
                      const isPassed = (res.score || 0) >= 70;
                      return (
                        <tr key={res.id || idx} className="hover:bg-slate-800/40 transition">
                          <td className="p-4 font-extrabold text-white">
                            {res.student_name}
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-extrabold">
                              {res.student_class}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="font-bold text-slate-300">{res.subject}</span>
                            <span className="block text-[11px] text-slate-400 font-normal">{res.material}</span>
                          </td>
                          <td className="p-4 text-center">
                            <span className={`text-base font-black ${isPassed ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {res.score}
                            </span>
                          </td>
                          <td className="p-4 text-center text-slate-300 font-bold">
                            {res.correct_count} / {res.total_questions}
                          </td>
                          <td className="p-4 text-center">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase ${
                              isPassed 
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            }`}>
                              {isPassed ? 'LULUS' : 'REMIDIAL'}
                            </span>
                          </td>
                          <td className="p-4 text-right text-slate-400 font-normal text-[11px]">
                            {new Date(res.completed_at || Date.now()).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Share Modal Dialog */}
      {createdQuizModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-card max-w-md w-full p-6 text-center space-y-5 border-emerald-500/40">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-3xl mx-auto shadow-lg shadow-emerald-900/30">
              🎉
            </div>

            <div>
              <h3 className="text-xl font-black text-white">Kuis Berhasil Diterbitkan!</h3>
              <p className="text-xs text-slate-400 mt-1">
                Kuis <strong className="text-emerald-400">{createdQuizModal.subject} - {createdQuizModal.material}</strong> telah siap dimainkan siswa.
              </p>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 text-left space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">LINK SHARE SISWA:</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={getQuizShareUrl(createdQuizModal)}
                  className="w-full bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300 p-2.5 rounded-xl outline-none"
                />
                <button
                  onClick={() => handleCopyLink(getQuizShareUrl(createdQuizModal))}
                  className="px-4 py-2.5 btn-emerald-glow text-xs whitespace-nowrap shrink-0"
                >
                  {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiedLink ? 'Tersalin!' : 'Salin'}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setCreatedQuizModal(null);
                  setActiveTab('quizzes');
                }}
                className="flex-1 py-3 btn-glass-secondary text-xs font-bold"
              >
                Lihat Kuis Saya
              </button>

              <button
                onClick={() => {
                  const q = createdQuizModal;
                  setCreatedQuizModal(null);
                  onPlayCreatedQuiz(q);
                }}
                className="flex-1 py-3 btn-emerald-glow text-xs font-bold"
              >
                Uji Main Kuis
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
