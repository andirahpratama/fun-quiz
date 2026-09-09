import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Shield, Send } from 'lucide-react';

class CatchBallSoundEngine {
  constructor() {
    this.ctx = null;
    this.masterVolume = null;
    this.bgmVolume = null;
    this.isMuted = false;
    this.tempo = 125;
    this.step = 0;
    this.bgmInterval = null;
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();

      this.masterVolume = this.ctx.createGain();
      this.masterVolume.gain.value = 1.0;
      this.masterVolume.connect(this.ctx.destination);

      this.bgmVolume = this.ctx.createGain();
      this.bgmVolume.gain.value = 0.3;
      this.bgmVolume.connect(this.masterVolume);
    } catch (e) {
      console.log('Audio not supported', e);
    }
  }

  startBGM() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (this.bgmInterval) return;

    const notes = [329.63, 392.00, 440.00, 523.25, 659.25];
    const stepDuration = (60 / this.tempo) / 2;

    this.bgmInterval = setInterval(() => {
      if (this.isMuted || !this.ctx) return;

      const now = this.ctx.currentTime;
      const note = notes[this.step % notes.length];

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note, now);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + stepDuration * 1.3);

      osc.connect(gain);
      gain.connect(this.bgmVolume);

      osc.start(now);
      osc.stop(now + stepDuration * 1.3);

      this.step++;
    }, stepDuration * 1000);
  }

  stopBGM() {
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  toggleSound() {
    this.isMuted = !this.isMuted;
    if (this.masterVolume && this.ctx) {
      this.masterVolume.gain.setValueAtTime(this.isMuted ? 0 : 1.0, this.ctx.currentTime);
    }
    return !this.isMuted;
  }

  playCatch() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.18);

    gain.gain.setValueAtTime(0.45, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

    osc.connect(gain);
    gain.connect(this.masterVolume);
    osc.start(now);
    osc.stop(now + 0.18);
  }

  playDecoy() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.linearRampToValueAtTime(100, now + 0.2);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    osc.connect(gain);
    gain.connect(this.masterVolume);
    osc.start(now);
    osc.stop(now + 0.2);
  }
}

export default function CatchBallGame({
  questions,
  answeredQuestionIds,
  onTargetHit,
}) {
  const canvasRef = useRef(null);
  const soundRef = useRef(null);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [toastMessage, setToastMessage] = useState('Keranjang Siap! Geser kursor/sentuh layar untuk menangkap bola 🏀');
  const [isToastWarning, setIsToastWarning] = useState(false);
  const [showToast, setShowToast] = useState(true);

  useEffect(() => {
    soundRef.current = new CatchBallSoundEngine();

    const handleUserInteraction = () => {
      if (soundRef.current) {
        soundRef.current.init();
        soundRef.current.startBGM();
      }
    };

    window.addEventListener('click', handleUserInteraction, { once: true });
    window.addEventListener('touchstart', handleUserInteraction, { once: true });

    return () => {
      if (soundRef.current) {
        soundRef.current.stopBGM();
      }
    };
  }, []);

  const toggleSound = () => {
    if (soundRef.current) {
      const active = soundRef.current.toggleSound();
      setSoundEnabled(active);
    }
  };

  const triggerToast = (msg, isWarning = false) => {
    setToastMessage(msg);
    setIsToastWarning(isWarning);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2500);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let canvasW = canvas.parentElement.clientWidth || 800;
    let canvasH = canvas.parentElement.clientHeight || 550;
    canvas.width = canvasW;
    canvas.height = canvasH;

    const basket = {
      x: canvasW / 2,
      y: canvasH - 50,
      width: 120,
      height: 30
    };

    const ballColors = ['#F97316', '#3B82F6', '#10B981', '#EAB308', '#EC4899', '#8B5CF6'];
    const decoyItems = ['⚽', '🏀', '🏈', '🎾', '⭐', '💣'];

    let balls = [];

    const getAvailableQuestions = () => {
      return questions.filter(q => !answeredQuestionIds.includes(q.id));
    };

    const spawnSingleBall = (forcedQuestion = null) => {
      const availableQs = getAvailableQuestions();
      const activeQIds = new Set(balls.filter(b => b.isQuestion && !b.caught).map(b => b.question.id));
      const candidates = availableQs.filter(q => !activeQIds.has(q.id));

      let isQuestion = false;
      let questionObj = null;

      if (forcedQuestion) {
        isQuestion = true;
        questionObj = forcedQuestion;
      } else if (candidates.length > 0 && (Math.random() < 0.65 || balls.filter(b => b.isQuestion).length < 3)) {
        isQuestion = true;
        questionObj = candidates[Math.floor(Math.random() * candidates.length)];
      }

      const color = ballColors[Math.floor(Math.random() * ballColors.length)];
      const decoy = decoyItems[Math.floor(Math.random() * decoyItems.length)];

      return {
        uid: Math.random().toString(36).substring(2, 9),
        isQuestion,
        question: questionObj,
        decoySymbol: decoy,
        x: Math.random() * (canvasW - 100) + 50,
        y: -40 - Math.random() * 80,
        radius: isQuestion ? 26 : 22,
        speedY: 2.2 + Math.random() * 1.8,
        color,
        caught: false
      };
    };

    const initBalls = () => {
      balls = [];
      const availableQs = getAvailableQuestions();
      availableQs.forEach(q => {
        balls.push(spawnSingleBall(q));
      });
      for (let d = 0; d < 4; d++) {
        balls.push(spawnSingleBall(null));
      }
    };

    initBalls();

    const handleResize = () => {
      if (!canvas.parentElement) return;
      canvasW = canvas.parentElement.clientWidth || 800;
      canvasH = canvas.parentElement.clientHeight || 550;
      canvas.width = canvasW;
      canvas.height = canvasH;
      basket.y = canvasH - 50;
    };

    window.addEventListener('resize', handleResize);

    const handlePointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const moveX = e.clientX - rect.left;
      basket.x = Math.max(basket.width / 2, Math.min(canvasW - basket.width / 2, moveX));
    };

    canvas.addEventListener('pointermove', handlePointerMove);

    let animationFrameId;

    const render = () => {
      ctx.clearRect(0, 0, canvasW, canvasH);

      // Stadium Court Gradient
      const courtGrad = ctx.createLinearGradient(0, 0, 0, canvasH);
      courtGrad.addColorStop(0, '#064E3B');
      courtGrad.addColorStop(0.5, '#047857');
      courtGrad.addColorStop(1, '#065F46');
      ctx.fillStyle = courtGrad;
      ctx.fillRect(0, 0, canvasW, canvasH);

      // Court Lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(canvasW / 2, canvasH / 2, 100, 0, Math.PI * 2);
      ctx.stroke();

      // Maintain Ball Count
      if (balls.filter(b => !b.caught).length < 7) {
        balls.push(spawnSingleBall(null));
      }

      // Update & Draw Falling Balls
      balls.forEach(b => {
        if (b.caught) return;

        b.y += b.speedY;

        if (b.y > canvasH + 40) {
          b.y = -40;
          b.x = Math.random() * (canvasW - 100) + 50;
        }

        // Draw Ball
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Highlight
        ctx.beginPath();
        ctx.arc(b.x - b.radius * 0.3, b.y - b.radius * 0.3, b.radius * 0.25, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.fill();

        // Badge / Symbol
        if (b.isQuestion && b.question) {
          ctx.fillStyle = '#FEF08A';
          ctx.beginPath();
          ctx.arc(b.x, b.y, 11, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#854D0E';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.fillStyle = '#713F12';
          ctx.font = 'bold 12px "Fredoka", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(b.question.questionNumber, b.x, b.y + 0.5);
        } else {
          ctx.font = '14px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(b.decoySymbol, b.x, b.y);
        }

        // Catch Collision Check with Basket
        const basketTop = basket.y - 10;
        if (
          b.y + b.radius >= basketTop &&
          b.y - b.radius <= basketTop + basket.height &&
          b.x >= basket.x - basket.width / 2 &&
          b.x <= basket.x + basket.width / 2
        ) {
          b.caught = true;

          if (b.isQuestion) {
            if (soundRef.current) soundRef.current.playCatch();
            onTargetHit(b.question);
            triggerToast(`🏀 Berhasil Menangkap Bola Soal #${b.question.questionNumber}!`);
          } else {
            if (soundRef.current) soundRef.current.playDecoy();
            triggerToast(`⚡ Menangkap Item Biasa (${b.decoySymbol}). Cari Bola Soal!`, true);
          }
        }
      });

      // Draw Basket Net
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.roundRect(basket.x - basket.width / 2, basket.y, basket.width, basket.height, 12);
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = '#FEF08A';
      ctx.font = 'bold 12px "Fredoka", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('KERANJANG SOAL', basket.x, basket.y + basket.height / 2);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('pointermove', handlePointerMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [questions, answeredQuestionIds]);

  const remainingQuestionsCount = questions.length - answeredQuestionIds.length;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col bg-slate-900 rounded-3xl overflow-hidden border-4 border-yellow-400 shadow-2xl">
      <div className="w-full bg-emerald-950/90 backdrop-blur px-4 py-2.5 flex items-center justify-between text-xs sm:text-sm font-bold border-b border-yellow-400/30 z-20">
        <div className="flex items-center gap-2 text-cyan-200">
          <span>Target Bola Soal Tersisa:</span>
          <span className="bg-yellow-400 text-blue-950 px-2.5 py-0.5 rounded-full font-black text-sm">
            {remainingQuestionsCount}
          </span>
        </div>

        <div className="hidden sm:block text-yellow-300 font-bold animate-pulse text-xs">
          🎯 Geser Keranjang untuk Menangkap Bola Bernomor Soal!
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleSound}
            className="w-9 h-9 rounded-full bg-emerald-700 hover:bg-emerald-600 border-2 border-yellow-300 flex items-center justify-center text-white text-sm shadow transition"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-yellow-300" /> : <VolumeX className="w-5 h-5 text-rose-300" />}
          </button>
        </div>
      </div>

      <div className="relative w-full h-[480px] sm:h-[540px] cursor-crosshair overflow-hidden bg-emerald-900">
        <canvas ref={canvasRef} className="w-full h-full block" />

        {showToast && (
          <div className={`absolute top-16 inset-x-0 mx-auto w-max max-w-[90%] px-4 py-2 rounded-2xl border-2 shadow-2xl pointer-events-none transition-opacity duration-300 z-30 font-extrabold text-center text-xs sm:text-sm ${
            isToastWarning ? 'bg-amber-950/95 text-yellow-300 border-yellow-400' : 'bg-emerald-950/95 text-cyan-300 border-sky-400'
          }`}>
            {toastMessage}
          </div>
        )}
      </div>

      <div className="w-full bg-emerald-950/95 backdrop-blur py-3 px-4 flex items-center justify-between border-t-2 border-yellow-400/40 z-20">
        <div className="text-xs text-emerald-200 flex items-center gap-1.5 font-bold">
          <span>🏀 Arena Tangkap Bola Soal</span>
        </div>

        <div className="text-xs text-yellow-300 font-extrabold">
          Soal Terjawab: {answeredQuestionIds.length}/{questions.length}
        </div>
      </div>
    </div>
  );
}
