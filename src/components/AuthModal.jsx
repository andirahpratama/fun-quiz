import React, { useState } from 'react';
import { X, User, Mail, Lock, School, Book, Sparkles, LogIn, UserPlus } from 'lucide-react';
import { SUBJECTS } from '../data/questionBank';

export default function AuthModal({ isOpen, onClose, onLogin, onRegister }) {
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

  if (!isOpen) return null;

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
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat otentikasi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-indigo-500/10">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800/50 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600/20 text-indigo-400 mb-3 border border-indigo-500/30">
            {isLoginView ? <LogIn className="w-7 h-7" /> : <UserPlus className="w-7 h-7" />}
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {isLoginView ? 'Login Akun Guru' : 'Daftar Akun Guru'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isLoginView
              ? 'Masuk untuk membuat kuis dan mengelola nilai siswa'
              : 'Daftarkan diri Anda untuk mulai membuat game edukasi SMP'}
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-medium text-center">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginView && (
            <div className="form-group">
              <label className="form-label">
                <User className="w-4 h-4 text-indigo-400" />
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
              <Mail className="w-4 h-4 text-indigo-400" />
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
              <Lock className="w-4 h-4 text-indigo-400" />
              Kata Sandi / Password
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
                  <School className="w-4 h-4 text-indigo-400" />
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
                  <Book className="w-4 h-4 text-indigo-400" />
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
            className="w-full btn-gradient-primary justify-center py-3 text-base font-bold mt-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Memproses...
              </span>
            ) : isLoginView ? (
              'Masuk Ke Aplikasi'
            ) : (
              'Daftar Akun Baru'
            )}
          </button>
        </form>

        {/* Toggle Switch */}
        <div className="mt-6 text-center pt-4 border-t border-slate-800">
          <p className="text-xs text-slate-400">
            {isLoginView ? 'Belum memiliki akun?' : 'Sudah punya akun guru?'}
            <button
              type="button"
              onClick={() => {
                setIsLoginView(!isLoginView);
                setErrorMsg('');
              }}
              className="ml-1 text-indigo-400 hover:text-indigo-300 font-bold underline"
            >
              {isLoginView ? 'Daftar Sekarang' : 'Login Di Sini'}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}
