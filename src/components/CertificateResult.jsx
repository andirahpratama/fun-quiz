import React, { useEffect } from 'react';
import { Award, Download, Printer, RotateCcw, CheckCircle, Trophy, Sparkles } from 'lucide-react';
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
      
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 print:hidden">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Trophy className="w-7 h-7 text-amber-400" />
            Hasil Akhir Game Edukasi
          </h2>
          <p className="text-xs text-slate-400">
            Selamat! Kamu telah menyelesaikan seluruh soal game dengan luar biasa.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadPDF}
            className="btn-gradient-primary text-sm py-2.5 px-4"
          >
            <Download className="w-4 h-4" />
            Unduh Sertifikat (PDF)
          </button>
          <button
            onClick={handlePrint}
            className="btn-outline text-sm py-2.5 px-3"
          >
            <Printer className="w-4 h-4" />
            Cetak
          </button>
          <button
            onClick={onPlayAgain}
            className="btn-gradient-secondary text-sm py-2.5 px-4"
          >
            <RotateCcw className="w-4 h-4" />
            Main Lagi
          </button>
        </div>
      </div>

      {/* Official Certificate Card Area */}
      <div 
        id="certificate-print-area" 
        className="certificate-frame my-4"
      >
        {/* Certificate Header Accent */}
        <div className="text-center border-b-2 border-amber-600/30 pb-6 mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-amber-600 mb-2 border-2 border-amber-500 shadow-inner">
            <Award className="w-10 h-10" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-wider text-slate-900 uppercase">
            SERTIFIKAT KELULUSAN KUIS
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-bold tracking-widest uppercase mt-1">
            FUN QUIZ - PLATFORM GAME EDUKASI SMP
          </p>
        </div>

        {/* Certificate Body Statement */}
        <div className="text-center space-y-4 my-8">
          <p className="text-sm font-semibold text-slate-600 uppercase tracking-widest">
            Diberikan kepada siswa:
          </p>

          <h2 className="text-3xl sm:text-5xl font-black text-indigo-950 underline decoration-amber-500 decoration-4 underline-offset-8">
            {resultData.student_name}
          </h2>

          <p className="text-base font-bold text-slate-700">
            Kelas: <span className="text-indigo-800 font-extrabold">{resultData.student_class}</span>
          </p>

          <p className="text-sm sm:text-base text-slate-700 max-w-xl mx-auto leading-relaxed pt-2">
            Telah menyelesaikan kuis interaktif mata pelajaran{' '}
            <strong className="text-slate-900 uppercase font-black">{resultData.subject}</strong> dengan materi pokok{' '}
            <strong className="text-indigo-900 font-bold">"{resultData.material}"</strong>.
          </p>

          {/* Large Prominent Score Badge */}
          <div className="my-8 py-6 px-8 bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-amber-500/10 rounded-3xl border-2 border-amber-400/40 inline-block">
            <span className="text-xs uppercase tracking-widest text-slate-600 font-extrabold block mb-1">
              NILAI AKHIR SISWA
            </span>
            <div className="text-6xl sm:text-8xl font-black text-amber-600 drop-shadow-md tracking-tight">
              {score}
            </div>
            <div className="text-xs font-bold text-slate-700 mt-2">
              Benar {resultData.correct_count} dari {resultData.total_questions} Soal
            </div>
          </div>
        </div>

        {/* Footer Signature Section */}
        <div className="flex items-end justify-between pt-8 border-t border-slate-300 mt-10">
          <div className="text-left text-xs text-slate-500 space-y-1">
            <p className="font-semibold">ID Transaksi: {resultData.id || 'FUNQUIZ-' + Date.now()}</p>
            <p>Tanggal: {new Date(resultData.completed_at || Date.now()).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}</p>
          </div>

          <div className="text-right">
            <p className="text-xs text-slate-600 font-medium">Guru Mata Pelajaran,</p>
            <div className="h-14 flex items-center justify-end">
              <span className="font-serif italic text-lg text-indigo-900 opacity-60">
                {teacherName || resultData.teacher_name || 'Guru SMP'}
              </span>
            </div>
            <p className="text-sm font-extrabold text-slate-900 border-t border-slate-800 pt-1 min-w-[180px]">
              {teacherName || resultData.teacher_name || 'Guru SMP'}
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
