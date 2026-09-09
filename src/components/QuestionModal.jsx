import React, { useState } from 'react';
import { CheckCircle2, XCircle, HelpCircle, ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function QuestionModal({
  question,
  onAnswerSelected,
  onClose
}) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  if (!question) return null;

  const handleOptionClick = (index) => {
    if (hasAnswered) return;
    
    setSelectedOption(index);
    setHasAnswered(true);

    const isCorrect = index === question.correctAnswer;
    if (isCorrect) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleNext = () => {
    const isCorrect = selectedOption === question.correctAnswer;
    onAnswerSelected(question.id, isCorrect);
  };

  const isCorrect = selectedOption === question.correctAnswer;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl glass-card p-6 sm:p-8 shadow-2xl border-emerald-500/30">
        
        {/* Question Header Badge */}
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <HelpCircle className="w-4 h-4" />
            Soal Nomor #{question.questionNumber}
          </span>
          <span className="text-xs text-slate-400 font-semibold">
            Pilih Jawaban Tepat (A, B, C, D)
          </span>
        </div>

        {/* Question Content Text */}
        <div className="bg-slate-900/90 p-4 sm:p-5 rounded-2xl border border-slate-800 mb-6">
          <p className="text-base sm:text-lg font-bold text-white leading-relaxed">
            {question.question}
          </p>
        </div>

        {/* Options List */}
        <div className="space-y-3 mb-6">
          {question.options.map((opt, idx) => {
            const letter = String.fromCharCode(65 + idx); // A, B, C, D
            let optionStyle = 'bg-slate-900/70 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700 text-slate-200';

            if (hasAnswered) {
              if (idx === question.correctAnswer) {
                // Correct Choice
                optionStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-bold ring-2 ring-emerald-500/40';
              } else if (idx === selectedOption && !isCorrect) {
                // Wrong Choice selected by student
                optionStyle = 'bg-rose-500/20 border-rose-500 text-rose-200 font-bold ring-2 ring-rose-500/40';
              } else {
                optionStyle = 'bg-slate-900/30 border-slate-900 text-slate-500 opacity-50';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={hasAnswered}
                onClick={() => handleOptionClick(idx)}
                className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border flex items-center gap-3.5 transition-all text-sm sm:text-base cursor-pointer ${optionStyle}`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 shadow ${
                  hasAnswered && idx === question.correctAnswer
                    ? 'bg-emerald-500 text-slate-950'
                    : hasAnswered && idx === selectedOption && !isCorrect
                    ? 'bg-rose-500 text-white'
                    : 'bg-slate-800 text-slate-300'
                }`}>
                  {letter}
                </div>
                <span className="flex-1 font-semibold leading-normal">{opt}</span>

                {hasAnswered && idx === question.correctAnswer && (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                )}
                {hasAnswered && idx === selectedOption && !isCorrect && (
                  <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Answer Feedback Banner & Explanation Box */}
        {hasAnswered && (
          <div className="space-y-4 animate-fadeIn">
            {/* Status Banner */}
            <div className={`p-4 rounded-2xl flex items-center gap-3 ${
              isCorrect 
                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                : 'bg-rose-500/20 border border-rose-500/40 text-rose-300'
            }`}>
              {isCorrect ? (
                <CheckCircle2 className="w-7 h-7 text-emerald-400 shrink-0 animate-bounce" />
              ) : (
                <XCircle className="w-7 h-7 text-rose-400 shrink-0" />
              )}
              <div>
                <h4 className="font-extrabold text-base">
                  {isCorrect ? 'Jawaban Benar! 🎉' : 'Jawaban Belum Tepat! ❌'}
                </h4>
                <p className="text-xs opacity-90 mt-0.5">
                  {isCorrect 
                    ? 'Luar biasa, skor kamu bertambah!' 
                    : `Jawaban tepat: (${String.fromCharCode(65 + question.correctAnswer)}) ${question.options[question.correctAnswer]}`}
                </p>
              </div>
            </div>

            {/* Detailed Explanation Box */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-300 text-xs sm:text-sm">
              <div className="flex items-center gap-2 font-extrabold text-amber-300 mb-1.5">
                <BookOpen className="w-4 h-4" />
                Pembahasan & Penjelasan Soal:
              </div>
              <p className="leading-relaxed opacity-90">
                {question.explanation || 'Pembahasan materi pokok untuk soal ini.'}
              </p>
            </div>

            {/* Next Action Button */}
            <button
              type="button"
              onClick={handleNext}
              className="w-full py-3.5 btn-emerald-glow text-base font-extrabold uppercase tracking-wider"
            >
              Lanjut ke Game Berikutnya
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
