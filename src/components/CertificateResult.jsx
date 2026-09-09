import React, { useEffect } from 'react';
import { Award, Download, Printer, RotateCcw, CheckCircle, Trophy, Sparkles, Star, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { exportCertificatePDF } from '../utils/pdfGenerator';

export default function CertificateResult({
  resultData,
  teacherName,
  onPlayAgain,
}) {
  useEffect(() => {
    // Launch celebratory confetti
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 },
    });
  }, []);

  if (!resultData) return null;

  const score = resultData.score || 0;
  const isPass = score >= 70;

  const handleDownloadPDF = () => {
    exportCertificatePDF('certificate-print-area', resultData.student_name);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-fadeIn">
      
      {/* Top Victory & Action Header Bar */}
      <div className="glass-card p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 print:hidden border-amber-500/30">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center text-3xl shrink-0 shadow-lg shadow-amber-900/20">
            🏆
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              Hasil Akhir & Sertifikat Game
            </h2>
            <p className="text-xs text-slate-300 font-medium mt-0.5">
              Selamat, <strong className="text-amber-400">{resultData.student_name}</strong>! Kamu telah menyelesaikan kuis dengan sukses.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={handleDownloadPDF}
            className="btn-emerald-glow text-xs py-2.5 px-4 font-extrabold cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Unduh Sertifikat (PDF)
          </button>
          <button
            onClick={handlePrint}
            className="btn-glass-secondary text-xs py-2.5 px-3.5 font-bold cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Cetak
          </button>
          <button
            onClick={onPlayAgain}
            className="btn-amber-glow text-xs py-2.5 px-4 font-black cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Main Lagi
          </button>
        </div>
      </div>

      {/* Official Certificate Card Area (Styled for display & PDF printing) */}
      <div 
        id="certificate-print-area" 
        className="bg-white text-slate-900 rounded-3xl p-8 sm:p-12 shadow-2xl border-8 border-amber-500/80 relative overflow-hidden"
      >
        {/* Certificate Decorative Watermark Background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
          <Award className="w-96 h-96 text-amber-600" />
        </div>

        {/* Certificate Header Section */}
        <div className="text-center border-b-2 border-amber-500/30 pb-6 mb-8 relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-amber-600 mb-3 border-2 border-amber-500 shadow-inner">
            <Award className="w-10 h-10" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-wider text-slate-900 uppercase font-['Outfit']">
            SERTIFIKAT KELULUSAN KUIS
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-extrabold tracking-widest uppercase mt-1">
            FUN QUIZ &bull; PLATFORM GAME EDUKASI SMP INTERAKTIF
          </p>
        </div>

        {/* Certificate Body Statement */}
        <div className="text-center space-y-4 my-8 relative z-10">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Diberikan Penghargaan Kepada Siswa:
          </p>

          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 underline decoration-amber-500 decoration-4 underline-offset-8 py-2">
            {resultData.student_name}
          </h2>

          <p className="text-sm font-extrabold text-slate-700">
            Kelas: <span className="text-amber-700 font-black text-base">{resultData.student_class}</span>
          </p>

          <p className="text-sm sm:text-base text-slate-700 max-w-xl mx-auto leading-relaxed pt-2">
            Telah menyelesaikan kuis game edukasi pada mata pelajaran{' '}
            <strong className="text-slate-950 uppercase font-black">{resultData.subject}</strong> dengan topik bahasan{' '}
            <strong className="text-amber-800 font-bold">"{resultData.material}"</strong>.
          </p>

          {/* Prominent Score Display Badge */}
          <div className="my-8 py-6 px-10 bg-gradient-to-r from-amber-500/10 via-amber-400/20 to-amber-500/10 rounded-3xl border-2 border-amber-400/50 inline-block shadow-sm">
            <span className="text-[11px] uppercase tracking-widest text-slate-600 font-black block mb-1">
              NILAI AKHIR SISWA
            </span>
            <div className="text-6xl sm:text-7xl font-black text-amber-600 drop-shadow-sm tracking-tight font-['Outfit']">
              {score}
            </div>
            <div className="text-xs font-extrabold text-slate-700 mt-2 flex items-center justify-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Benar {resultData.correct_count} dari {resultData.total_questions} Soal</span>
            </div>
          </div>
        </div>

        {/* Footer Signature Section */}
        <div className="flex items-end justify-between pt-8 border-t border-slate-200 mt-10 relative z-10">
          <div className="text-left text-[11px] text-slate-500 space-y-1 font-medium">
            <p className="font-bold text-slate-700">ID Sertifikat: {resultData.id || 'FUNQUIZ-' + Date.now()}</p>
            <p>Diterbitkan: {new Date(resultData.completed_at || Date.now()).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}</p>
          </div>

          <div className="text-right">
            <p className="text-xs text-slate-600 font-bold">Guru Mata Pelajaran,</p>
            <div className="h-14 flex items-center justify-end">
              <span className="font-serif italic text-lg text-slate-800 font-bold">
                {teacherName || resultData.teacher_name || 'Guru SMP'}
              </span>
            </div>
            <p className="text-sm font-black text-slate-900 border-t-2 border-slate-900 pt-1 min-w-[180px]">
              {teacherName || resultData.teacher_name || 'Guru SMP'}
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
