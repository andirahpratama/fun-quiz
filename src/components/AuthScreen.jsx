import React, { useState } from 'react';
import { User, Mail, Lock, School, BookOpen, LogIn, UserPlus, ShieldCheck, Sparkles } from 'lucide-react';
import { SUBJECTS } from '../data/questionBank';

export default function AuthScreen({ onLogin, onRegister }) {
  const [isLoginView, setIsLoginView] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-50">
      
      {/* Background Pastel Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md bright-panel p-8 relative z-10 animate-fadeIn">
        
        {/* App Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-1 shadow-lg shadow-indigo-500/30 mb-3">
            <div className="w-full h-full bg-white rounded-[12px] flex items-center justify-center">
              <span className="text-3xl">🎯</span>
            </div>
          </div>
          
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            FUN QUIZ
          </h1>
          <p className="text-xs font-bold text-indigo-600 tracking-wider uppercase mt-1">
            Game Edukasi Interaktif SMP
          </p>

          <div className="mt-4 p-2.5 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-700 font-semibold flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Silakan login terlebih dahulu untuk mengakses aplikasi</span>
          </div>
        </div>

        {/* View Toggle Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 mb-6">
          <button
            type="button"
            onClick={() => { setIsLoginView(true); setErrorMsg(''); }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
              isLoginView 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-3.5 h-3.5 inline mr-1.5" />
            LOGIN GURU
          </button>
          <button
            type="button"
            onClick={() => { setIsLoginView(false); setErrorMsg(''); }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
              !isLoginView 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5 inline mr-1.5" />
            DAFTAR AKUN
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-xs font-semibold text-center">
            {errorMsg}
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {!isLoginView && (
            <div className="form-group">
              <label className="form-label">
                <User className="w-3.5 h-3.5 text-indigo-600" />
                Nama Lengkap & Gelar Guru
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Budi Santoso, S.Pd."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="form-input"
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">
              <Mail className="w-3.5 h-3.5 text-indigo-600" />
              Alamat Email
            </label>
            <input
              type="email"
              required
              placeholder="guru@sekolah.sch.id"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Lock className="w-3.5 h-3.5 text-indigo-600" />
              Password / Kata Sandi
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="form-input"
            />
          </div>

          {!isLoginView && (
            <>
              <div className="form-group">
                <label className="form-label">
                  <School className="w-3.5 h-3.5 text-indigo-600" />
                  Nama Sekolah (SMP)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: SMP Negeri 1 Bandung"
                  value={formData.schoolName}
                  onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                  Mata Pelajaran Utama
                </label>
                <select
                  value={formData.subjectSpecialty}
                  onChange={(e) => setFormData({ ...formData, subjectSpecialty: e.target.value })}
                  className="form-select"
                >
                  {SUBJECTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.icon} {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary justify-center py-3.5 text-sm font-bold mt-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Memproses...
              </span>
            ) : isLoginView ? (
              'MASUK KE APLIKASI'
            ) : (
              'BUAT AKUN GURU BARU'
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
