import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, BookOpen, Trophy, Copy, Check, Share2, Play, Trash2, 
  Download, Clock, Layers, Sparkles, HelpCircle, ChevronRight, CheckCircle2, ExternalLink 
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

  // Load questions when subject or material changes
  useEffect(() => {
    const generated = generateQuestions(subject, material, questionCount);
    setQuestions(generated);
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
      setMyQuizzes(quizzes);
      setTeacherResults(results);
    } catch (e) {
      console.error('Error loading teacher data:', e);
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
        teacher_name: user.name,
        subject,
        material,
        question_count: Number(questionCount),
        duration_seconds: durationSeconds,
        game_type: gameType,
        questions,
      };

      const newQuiz = await api.createQuiz(quizPayload);
      setCreatedQuizModal(newQuiz);
      await loadUserData();
    } catch (err) {
      alert('Gagal membuat kuis: ' + err.message);
    }
  };

  const getQuizShareUrl = (quiz) => {
    const code = quiz.share_code || quiz.id;
    return `${window.location.origin}${window.location.pathname}?quiz=${code}`;
  };

  const handleCopyLink = (url) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Open Quiz Game in NEW TAB!
  const handleOpenGameInNewTab = (quiz) => {
    const url = getQuizShareUrl(quiz);
    window.open(url, '_blank');
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kuis ini?')) return;
    try {
      await api.deleteQuiz(quizId, user.id);
      await loadUserData();
    } catch (err) {
      alert('Gagal menghapus kuis: ' + err.message);
    }
  };

  const handleExportPDF = () => {
    const filteredResults = filterQuizId === 'ALL'
      ? teacherResults
      : teacherResults.filter(r => r.quiz_id === filterQuizId);

    if (filteredResults.length === 0) {
      alert('Belum ada data nilai siswa untuk diunduh!');
      return;
    }

    const targetQuiz = myQuizzes.find(q => q.id === filterQuizId);
    exportTeacherResultsPDF(filteredResults, targetQuiz, user.name);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      
      {/* Tab 1: Create Quiz Form */}
      {activeTab === 'create' && (
        <div className="animate-fadeIn">
          
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-indigo-600" />
                Buat Game Kuis Baru
              </h2>
              <p className="text-xs text-slate-500 mt-1">Lengkapi parameter kuis sederhana untuk siswa SMP.</p>
            </div>
          </div>

          <form onSubmit={handleCreateQuiz} className="space-y-6">
            
            {/* Step 1: Subject & Material Card */}
            <div className="bright-panel p-6 sm:p-8">
              <h3 className="text-xs font-black uppercase text-indigo-600 tracking-wider mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                1. MATA PELAJARAN & MATERI SOAL
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Mata Pelajaran SMP</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="form-select text-sm font-bold py-3"
                  >
                    {SUBJECTS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.icon} {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Materi Pokok Soal</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Sistem Pencernaan / Aljabar"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    className="form-input text-sm py-3"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Question Count & Timer Duration Card */}
            <div className="bright-panel p-6 sm:p-8">
              <h3 className="text-xs font-black uppercase text-indigo-600 tracking-wider mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                2. JUMLAH SOAL & DURASI WAKTU
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label className="form-label">Jumlah Soal (3 - 30 Soal)</label>
                  <input
                    type="number"
                    min="3"
                    max="30"
                    required
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    className="form-input text-base font-black py-3 text-indigo-700"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Durasi Waktu Game</label>
                  
                  {/* Preset Pills */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => setQuickDuration(5)}
                      className={`preset-chip ${minutes === 5 && hours === 0 ? 'active' : ''}`}
                    >
                      5 Menit
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickDuration(10)}
                      className={`preset-chip ${minutes === 10 && hours === 0 ? 'active' : ''}`}
                    >
                      10 Menit
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickDuration(15)}
                      className={`preset-chip ${minutes === 15 && hours === 0 ? 'active' : ''}`}
                    >
                      15 Menit
                    </button>
                  </div>

                  {/* Manual Inputs */}
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold block mb-1">Jam</span>
                      <input
                        type="number"
                        min="0"
                        max="5"
                        value={hours}
                        onChange={(e) => setHours(Number(e.target.value))}
                        className="form-input text-center text-sm font-bold py-2"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold block mb-1">Menit</span>
                      <input
                        type="number"
                        min="0"
                        max="59"
                        value={minutes}
                        onChange={(e) => setMinutes(Number(e.target.value))}
                        className="form-input text-center text-sm font-bold py-2"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold block mb-1">Detik</span>
                      <input
                        type="number"
                        min="0"
                        max="59"
                        value={seconds}
                        onChange={(e) => setSeconds(Number(e.target.value))}
                        className="form-input text-center text-sm font-bold py-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Game Type Selection */}
            <div className="bright-panel p-6 sm:p-8">
              <h3 className="text-xs font-black uppercase text-indigo-600 tracking-wider mb-4 flex items-center gap-2">
                🎮 3. PILIH JENIS MINI-GAME
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {GAME_TYPES.map((gt) => (
                  <div
                    key={gt.id}
                    onClick={() => setGameType(gt.id)}
                    className={`cursor-pointer p-4 rounded-xl border transition-all ${
                      gameType === gt.id
                        ? 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-600/30'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{gt.icon}</span>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm">{gt.name}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{gt.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Optional Question Bank Preview Toggle */}
            <div className="bright-panel p-4 sm:p-6">
              <button
                type="button"
                onClick={() => setShowQuestionPreview(!showQuestionPreview)}
                className="w-full flex items-center justify-between text-xs font-bold text-slate-700"
              >
                <span className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-indigo-600" />
                  Pratinjau Bank Soal Otomatis ({questions.length} Soal)
                </span>
                <ChevronRight className={`w-4 h-4 text-indigo-600 transition-transform ${showQuestionPreview ? 'rotate-90' : ''}`} />
              </button>

              {showQuestionPreview && (
                <div className="mt-4 pt-4 border-t border-slate-200 space-y-3 max-h-60 overflow-y-auto pr-2">
                  {questions.map((q, idx) => (
                    <div key={q.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-indigo-600">Soal #{idx + 1}</span>
                        <span className="text-[10px] text-slate-600 bg-slate-200 px-2 py-0.5 rounded font-bold">
                          Jawaban: ({String.fromCharCode(65 + q.correctAnswer)})
                        </span>
                      </div>
                      <p className="font-semibold text-slate-800">{q.question}</p>
                      <p className="text-[11px] text-slate-500 mt-1 italic">
                        Penjelasan: {q.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full btn-primary justify-center py-4 text-base font-bold tracking-wide shadow-lg"
            >
              <Share2 className="w-5 h-5" />
              GENERATE LINK KUIS SEKARANG
            </button>

          </form>
        </div>
      )}

      {/* Tab 2: My Quizzes List */}
      {activeTab === 'quizzes' && (
        <div className="animate-fadeIn">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Daftar Kuis Saya</h2>
              <p className="text-xs text-slate-500">Kuis edukasi yang telah Anda buat untuk siswa SMP.</p>
            </div>
            <button
              onClick={() => setActiveTab('create')}
              className="btn-primary text-xs py-2 px-4"
            >
              <PlusCircle className="w-4 h-4" />
              Buat Kuis Baru
            </button>
          </div>

          {myQuizzes.length === 0 ? (
            <div className="bright-panel p-12 text-center text-slate-400">
              <BookOpen className="w-12 h-12 mx-auto mb-3 text-slate-400" />
              <p className="font-bold text-sm text-slate-700">Belum ada kuis yang dibuat.</p>
              <p className="text-xs mt-1 text-slate-500">Klik tombol "Buat Kuis Baru" untuk membuat game pertama Anda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myQuizzes.map((q) => {
                const gameInfo = GAME_TYPES.find(gt => gt.id === q.game_type) || GAME_TYPES[0];
                const shareUrl = getQuizShareUrl(q);

                return (
                  <div key={q.id} className="bright-card p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl">{gameInfo.icon}</span>
                        <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {q.share_code || 'CODE'}
                        </span>
                      </div>

                      <h3 className="font-black text-lg text-slate-900 mb-1">{q.subject}</h3>
                      <p className="text-xs font-bold text-indigo-600 mb-3">Materi: {q.material}</p>

                      <div className="space-y-1 text-xs text-slate-600 mb-4">
                        <p>• Jumlah Soal: <strong className="text-slate-800">{q.question_count} Soal</strong></p>
                        <p>• Durasi: <strong className="text-slate-800">{Math.floor(q.duration_seconds / 60)} Menit</strong></p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200 space-y-2">
                      <button
                        onClick={() => handleOpenGameInNewTab(q)}
                        className="w-full btn-primary justify-center py-2 text-xs font-bold"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Uji Game di Tab Baru ↗
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopyLink(shareUrl)}
                          className="flex-1 btn-secondary justify-center py-2 text-xs font-semibold"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          Salin Link
                        </button>
                        <button
                          onClick={() => handleDeleteQuiz(q.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Tab 3: Teacher Results & Download PDF Ranking */}
      {activeTab === 'results' && (
        <div className="animate-fadeIn">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-amber-500" />
                Rekap Hasil & Ranking Siswa
              </h2>
              <p className="text-xs text-slate-500">
                Data hasil soal siswa terkumpul otomatis dan ter-ranking dari nilai tertinggi.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={filterQuizId}
                onChange={(e) => setFilterQuizId(e.target.value)}
                className="form-select py-2 text-xs font-semibold"
              >
                <option value="ALL">Semua Kuis ({myQuizzes.length})</option>
                {myQuizzes.map(q => (
                  <option key={q.id} value={q.id}>
                    {q.subject} - {q.material}
                  </option>
                ))}
              </select>

              <button
                onClick={handleExportPDF}
                className="btn-primary text-xs py-2.5 px-4 font-bold shrink-0"
              >
                <Download className="w-4 h-4" />
                Unduh PDF Ranking
              </button>
            </div>
          </div>

          {/* Results Table */}
          <div className="bright-panel overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="py-4 px-6">Ranking</th>
                    <th className="py-4 px-6">Nama Siswa</th>
                    <th className="py-4 px-6">Kelas</th>
                    <th className="py-4 px-6">Mata Pelajaran & Materi</th>
                    <th className="py-4 px-6">Jawaban Benar</th>
                    <th className="py-4 px-6">Nilai Akhir</th>
                    <th className="py-4 px-6">Tanggal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {teacherResults.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-12 text-center text-slate-500 text-sm">
                        Belum ada siswa yang mengerjakan kuis Anda. Bagikan link kuis ke murid SMP!
                      </td>
                    </tr>
                  ) : (
                    teacherResults
                      .filter(r => filterQuizId === 'ALL' || r.quiz_id === filterQuizId)
                      .map((res, index) => (
                        <tr key={res.id || index} className="hover:bg-slate-50 transition-colors">
                          <td className="py-4 px-6 font-black text-sm">
                            {index === 0 ? (
                              <span className="text-amber-500 font-black">🥇 #1</span>
                            ) : index === 1 ? (
                              <span className="text-slate-500 font-bold">🥈 #2</span>
                            ) : index === 2 ? (
                              <span className="text-amber-700 font-bold">🥉 #3</span>
                            ) : (
                              <span className="text-slate-400">#{index + 1}</span>
                            )}
                          </td>
                          <td className="py-4 px-6 font-bold text-slate-900">{res.student_name}</td>
                          <td className="py-4 px-6 font-medium text-slate-500">{res.student_class || '-'}</td>
                          <td className="py-4 px-6">
                            <p className="font-semibold text-indigo-700">{res.subject}</p>
                            <p className="text-xs text-slate-500">{res.material}</p>
                          </td>
                          <td className="py-4 px-6 font-bold">
                            {res.correct_count} / {res.total_questions}
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-lg font-black text-amber-600">
                              {res.score}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-xs text-slate-500">
                            {new Date(res.completed_at || Date.now()).toLocaleDateString('id-ID')}
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Share Link Modal Popup */}
      {createdQuizModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bright-panel p-6 text-center shadow-2xl">
            
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto mb-3 flex items-center justify-center border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-1">Game Kuis Berhasil Dibuat!</h3>
            <p className="text-xs text-slate-500 mb-5">
              Bagikan link aplikasi di bawah ini kepada siswa SMP Anda.
            </p>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 mb-5 text-left">
              <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider block mb-1">
                Link Aplikasi Siswa:
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={getQuizShareUrl(createdQuizModal)}
                  className="form-input text-xs font-mono bg-white text-slate-800 py-2"
                />
                <button
                  onClick={() => handleCopyLink(getQuizShareUrl(createdQuizModal))}
                  className="btn-secondary py-2 px-3 text-xs shrink-0"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCreatedQuizModal(null)}
                className="flex-1 btn-secondary justify-center py-2.5 text-xs font-semibold"
              >
                Tutup
              </button>
              
              {/* Opens game in NEW TAB! */}
              <button
                onClick={() => {
                  const q = createdQuizModal;
                  setCreatedQuizModal(null);
                  handleOpenGameInNewTab(q);
                }}
                className="flex-1 btn-primary justify-center py-2.5 text-xs font-bold"
              >
                Uji di Tab Baru ↗
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
