import React, { useState } from 'react';
import { User, Mail, Lock, School, BookOpen, Key, Eye, EyeOff, Sparkles, ShieldCheck, Gamepad2, Award } from 'lucide-react';
import { SUBJECTS } from '../data/questionBank';

export default function AuthScreen({ onLogin, onRegister }) {
  const [isLoginView, setIsLoginView] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    schoolName: '',
    subjectSpecialty: 'IPA',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isLoginView) {
        await onLogin({
          email: formData.email,
          password: formData.password,
        });
      } else {
        if (!formData.name || !formData.email || !formData.password) {
          throw new Error('Mohon lengkapi seluruh data pendaftaran!');
        }
        await onRegister({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          schoolName: formData.schoolName || 'SMP Negeri 1',
          subjectSpecialty: formData.subjectSpecialty,
        });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat otentikasi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-[#030712]">
      {/* Background Ambient Lighting Blobs */}
      <div className="ambient-bg">
        <div className="ambient-blob-1" />
        <div className="ambient-blob-2" />
        <div className="ambient-blob-3" />
      </div>

      <div className="relative z-10 w-full max-w-md my-auto animate-fadeIn">
        {/* Top App Logo & Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-900/80 border border-emerald-500/30 shadow-lg shadow-emerald-900/20 backdrop-blur-xl mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white text-xl shadow-md shadow-emerald-500/30">
              🎯
            </div>
            <div className="text-left">
              <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                Fun Quiz <span className="text-emerald-400">SMP</span>
              </h1>
              <p className="text-[11px] text-slate-400 font-semibold">
                Platform Game Edukasi SMP Interaktif
              </p>
            </div>
          </div>
        </div>

        {/* Auth Glass Card */}
        <div className="glass-card p-6 sm:p-8 relative">
          
          {/* Segmented View Switcher Pill */}
          <div className="grid grid-cols-2 p-1 bg-slate-950/70 border border-slate-800 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => { setIsLoginView(true); setErrorMsg(''); }}
              className={`py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                isLoginView
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-900/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Masuk Akun
            </button>
            <button
              type="button"
              onClick={() => { setIsLoginView(false); setErrorMsg(''); }}
              className={`py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                !isLoginView
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-900/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Daftar Akun Guru
            </button>
          </div>

          <h2 className="text-2xl font-black text-white text-center mb-1">
            {isLoginView ? 'Selamat Datang Kembali!' : 'Buat Akun Guru Baru'}
          </h2>
          <p className="text-xs text-slate-400 text-center mb-6 font-medium">
            {isLoginView
              ? 'Kelola kuis, bagikan link ke siswa, dan pantau nilai'
              : 'Daftar sekarang untuk mengakses pembuatan kuis game interaktif'}
          </p>

          {/* Error Alert */}
          {errorMsg && (
            <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {!isLoginView && (
              <div>
                <label className="block text-[11px] font-extrabold text-slate-300 uppercase tracking-wider mb-1.5 ml-1">
                  NAMA LENGKAP & GELAR
                </label>
                <div className="input-wrapper-cyber">
                  <User className="input-icon-cyber" />
                  <input
                    type="text"
                    required
                    placeholder="Budi Santoso, S.Pd."
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input-cyber"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-extrabold text-slate-300 uppercase tracking-wider mb-1.5 ml-1">
                EMAIL
              </label>
              <div className="input-wrapper-cyber">
                <Mail className="input-icon-cyber" />
                <input
                  type="email"
                  required
                  placeholder="guru@sekolah.sch.id"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="form-input-cyber"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-slate-300 uppercase tracking-wider mb-1.5 ml-1">
                PASSWORD
              </label>
              <div className="input-wrapper-cyber">
                <Lock className="input-icon-cyber" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="form-input-cyber pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-400 hover:text-white transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {!isLoginView && (
              <>
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-300 uppercase tracking-wider mb-1.5 ml-1">
                    NAMA SEKOLAH (SMP)
                  </label>
                  <div className="input-wrapper-cyber">
                    <School className="input-icon-cyber" />
                    <input
                      type="text"
                      placeholder="SMP Negeri 1 Bandung"
                      value={formData.schoolName}
                      onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                      className="form-input-cyber"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-slate-300 uppercase tracking-wider mb-1.5 ml-1">
                    MATA PELAJARAN UTAMA
                  </label>
                  <div className="relative">
                    <select
                      value={formData.subjectSpecialty}
                      onChange={(e) => setFormData({ ...formData, subjectSpecialty: e.target.value })}
                      className="form-select-cyber pl-4"
                    >
                      {SUBJECTS.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.icon} {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 btn-emerald-glow text-base tracking-wide uppercase cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Memproses...
                </span>
              ) : isLoginView ? (
                <>
                  <Key className="w-5 h-5" />
                  Masuk Sekarang
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Daftar Akun Guru
                </>
              )}
            </button>

          </form>

        </div>

        {/* Feature Highlight Chips Below Login */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <div className="px-3 py-1.5 rounded-full bg-slate-900/60 border border-slate-800 text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
            <Gamepad2 className="w-3.5 h-3.5 text-cyan-400" />
            4 Arcade Mini-Games
          </div>
          <div className="px-3 py-1.5 rounded-full bg-slate-900/60 border border-slate-800 text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            Sertifikat Otomatis
          </div>
          <div className="px-3 py-1.5 rounded-full bg-slate-900/60 border border-slate-800 text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Keamanan Data Guru
          </div>
        </div>

      </div>
    </div>
  );
}
