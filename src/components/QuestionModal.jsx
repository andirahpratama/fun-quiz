import React, { useState } from 'react';
import { CheckCircle2, XCircle, HelpCircle, ArrowRight, BookOpen } from 'lucide-react';
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
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-indigo-500/20">
        
        {/* Question Header Badge */}
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <HelpCircle className="w-4 h-4" />
            Soal Nomor #{question.questionNumber}
          </span>
          <span className="text-xs text-slate-400 font-semibold">
            Pilihlah 1 Jawaban yang Paling Tepat
          </span>
        </div>

        {/* Question Content Text */}
        <div className="bg-slate-800/60 p-4 sm:p-5 rounded-2xl border border-slate-700 mb-6">
          <p className="text-base sm:text-lg font-bold text-slate-100 leading-relaxed">
            {question.question}
          </p>
        </div>

        {/* Options List */}
        <div className="space-y-3 mb-6">
          {question.options.map((opt, idx) => {
            const letter = String.fromCharCode(65 + idx); // A, B, C, D
            let optionStyle = 'bg-slate-800/40 border-slate-700/80 hover:bg-slate-800 hover:border-indigo-500 text-slate-200';

            if (hasAnswered) {
              if (idx === question.correctAnswer) {
                // Correct Choice
                optionStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-bold ring-2 ring-emerald-500/40';
              } else if (idx === selectedOption && !isCorrect) {
                // Wrong Choice selected by student
                optionStyle = 'bg-rose-500/20 border-rose-500 text-rose-200 font-bold ring-2 ring-rose-500/40';
              } else {
                optionStyle = 'bg-slate-800/20 border-slate-800 text-slate-500 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                disabled={hasAnswered}
                onClick={() => handleOptionClick(idx)}
                className={`w-full text-left p-3.5 sm:p-4 rounded-xl border flex items-center gap-3.5 transition-all text-sm sm:text-base ${optionStyle}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-extrabold text-sm shrink-0 ${
                  hasAnswered && idx === question.correctAnswer
                    ? 'bg-emerald-500 text-slate-950'
                    : hasAnswered && idx === selectedOption && !isCorrect
                    ? 'bg-rose-500 text-white'
                    : 'bg-slate-700 text-slate-300'
                }`}>
                  {letter}
                </div>
                <span className="flex-1 font-medium">{opt}</span>

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
                  {isCorrect ? 'Jawaban Benar! 🎉' : 'Jawaban Salah! ❌'}
                </h4>
                <p className="text-xs opacity-90">
                  {isCorrect 
                    ? 'Selamat, poin kamu bertambah!' 
                    : `Jawaban yang benar adalah pilihan (${String.fromCharCode(65 + question.correctAnswer)}): ${question.options[question.correctAnswer]}`}
                </p>
              </div>
            </div>

            {/* Detailed Explanation Box */}
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/50 text-indigo-100 text-xs sm:text-sm">
              <div className="flex items-center gap-2 font-extrabold text-indigo-300 mb-1.5">
                <BookOpen className="w-4 h-4" />
                Penjelasan Lengkap:
              </div>
              <p className="leading-relaxed opacity-90">
                {question.explanation || 'Pembahasan materi pokok untuk soal ini.'}
              </p>
            </div>

            {/* Next Action Button */}
            <button
              onClick={handleNext}
              className="w-full btn-gradient-primary justify-center py-3.5 text-base font-bold"
            >
              Lanjut ke Game berikutnya
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
