import React, { useState } from 'react';
import { User, Mail, Lock, School, BookOpen, LogIn, UserPlus, Key, Eye, EyeOff } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0f2e27]">
      <div className="auth-card-clean text-center animate-fadeIn">
        
        {/* App Logo Header Badge (Neraca UMKM Style) */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#059669] flex items-center justify-center text-white text-2xl shadow-lg shadow-emerald-600/30">
            🎯
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-black text-slate-900 leading-none">
              Fun Quiz <span className="text-[#059669]">SMP</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Game Edukasi Interaktif SMP
            </p>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-black text-slate-900 mb-1">
          {isLoginView ? 'Masuk ke Akun' : 'Daftar Akun Guru'}
        </h2>
        <p className="text-xs text-slate-500 mb-6 font-medium">
          {isLoginView 
            ? 'Kelola kuis dan nilai siswa Anda kapan saja' 
            : 'Buat akun untuk mulai membagikan game kuis'}
        </p>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-xs font-semibold text-center">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          
          {!isLoginView && (
            <div className="form-group-clean">
              <label className="form-label-clean">NAMA LENGKAP & GELAR</label>
              <div className="input-wrapper">
                <User className="input-icon" />
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso, S.Pd."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input-clean"
                />
              </div>
            </div>
          )}

          <div className="form-group-clean">
            <label className="form-label-clean">EMAIL</label>
            <div className="input-wrapper">
              <Mail className="input-icon" />
              <input
                type="email"
                required
                placeholder="nama@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="form-input-clean"
              />
            </div>
          </div>

          <div className="form-group-clean">
            <label className="form-label-clean">PASSWORD</label>
            <div className="input-wrapper">
              <Lock className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="form-input-clean"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {!isLoginView && (
            <>
              <div className="form-group-clean">
                <label className="form-label-clean">NAMA SEKOLAH (SMP)</label>
                <div className="input-wrapper">
                  <School className="input-icon" />
                  <input
                    type="text"
                    placeholder="Contoh: SMP Negeri 1 Bandung"
                    value={formData.schoolName}
                    onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                    className="form-input-clean"
                  />
                </div>
              </div>

              <div className="form-group-clean">
                <label className="form-label-clean">MATA PELAJARAN UTAMA</label>
                <select
                  value={formData.subjectSpecialty}
                  onChange={(e) => setFormData({ ...formData, subjectSpecialty: e.target.value })}
                  className="form-select-clean"
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
            className="btn-emerald mt-4"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Memproses...
              </span>
            ) : isLoginView ? (
              <>
                <Key className="w-4 h-4" />
                Masuk Sekarang
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Daftar Akun Gratis
              </>
            )}
          </button>

        </form>

        {/* Footer Switcher (Neraca UMKM Style) */}
        <div className="mt-6 text-center text-xs text-slate-500 font-medium">
          {isLoginView ? 'Belum punya akun?' : 'Sudah punya akun guru?'}
          <button
            type="button"
            onClick={() => {
              setIsLoginView(!isLoginView);
              setErrorMsg('');
            }}
            className="ml-1 text-[#059669] font-extrabold hover:underline"
          >
            {isLoginView ? 'Daftar Gratis' : 'Masuk Sekarang'}
          </button>
        </div>

      </div>
    </div>
  );
}
