import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Flame, Zap } from 'lucide-react';

class NinjaSoundEngine {
  constructor() {
    this.ctx = null;
    this.masterVolume = null;
    this.bgmVolume = null;
    this.isMuted = false;
    this.tempo = 140;
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
      this.bgmVolume.gain.value = 0.28;
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

    const notes = [220.00, 261.63, 293.66, 329.63, 392.00, 440.00];
    const stepDuration = (60 / this.tempo) / 2;

    this.bgmInterval = setInterval(() => {
      if (this.isMuted || !this.ctx) return;

      const now = this.ctx.currentTime;
      const note = notes[this.step % notes.length];

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(note, now);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + stepDuration * 1.1);

      osc.connect(gain);
      gain.connect(this.bgmVolume);

      osc.start(now);
      osc.stop(now + stepDuration * 1.1);

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

  playSlice() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.12);

    gain.gain.setValueAtTime(0.45, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    osc.connect(gain);
    gain.connect(this.masterVolume);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  playSwoosh() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.08);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(gain);
    gain.connect(this.masterVolume);
    osc.start(now);
    osc.stop(now + 0.08);
  }
}

export default function FruitNinjaGame({
  questions,
  answeredQuestionIds,
  onTargetHit,
}) {
  const canvasRef = useRef(null);
  const soundRef = useRef(null);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [toastMessage, setToastMessage] = useState('Pedang Ninja Siap! Usap / Potong buah bernomor soal! 🍉');
  const [isToastWarning, setIsToastWarning] = useState(false);
  const [showToast, setShowToast] = useState(true);

  useEffect(() => {
    soundRef.current = new NinjaSoundEngine();

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

    const gravity = 0.28;
    const trail = [];
    const maxTrailLength = 14;

    const fruitColors = ['#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#3B82F6'];
    const decoyFruits = ['🍉', '🍍', '🍓', '🍊', '🍎', '💣'];

    let fruits = [];

    const getAvailableQuestions = () => {
      return questions.filter(q => !answeredQuestionIds.includes(q.id));
    };

    const spawnSingleFruit = (forcedQuestion = null) => {
      const availableQs = getAvailableQuestions();
      const activeQIds = new Set(fruits.filter(f => f.isQuestion && !f.sliced).map(f => f.question.id));
      const candidates = availableQs.filter(q => !activeQIds.has(q.id));

      let isQuestion = false;
      let questionObj = null;

      if (forcedQuestion) {
        isQuestion = true;
        questionObj = forcedQuestion;
      } else if (candidates.length > 0 && (Math.random() < 0.6 || fruits.filter(f => f.isQuestion).length < 3)) {
        isQuestion = true;
        questionObj = candidates[Math.floor(Math.random() * candidates.length)];
      }

      const color = fruitColors[Math.floor(Math.random() * fruitColors.length)];
      const symbol = decoyFruits[Math.floor(Math.random() * decoyFruits.length)];

      const startX = Math.random() * (canvasW - 200) + 100;
      const vx = (canvasW / 2 - startX) * 0.015 + (Math.random() - 0.5) * 4;
      const vy = -(13 + Math.random() * 5);

      return {
        uid: Math.random().toString(36).substring(2, 9),
        isQuestion,
        question: questionObj,
        decoySymbol: symbol,
        x: startX,
        y: canvasH + 40,
        vx,
        vy,
        radius: isQuestion ? 30 : 25,
        color,
        sliced: false,
        rotation: 0,
        rotSpeed: (Math.random() - 0.5) * 0.1
      };
    };

    const initFruits = () => {
      fruits = [];
      const availableQs = getAvailableQuestions();
      availableQs.forEach(q => {
        fruits.push(spawnSingleFruit(q));
      });
      for (let d = 0; d < 4; d++) {
        fruits.push(spawnSingleFruit(null));
      }
    };

    initFruits();

    const handleResize = () => {
      if (!canvas.parentElement) return;
      canvasW = canvas.parentElement.clientWidth || 800;
      canvasH = canvas.parentElement.clientHeight || 550;
      canvas.width = canvasW;
      canvas.height = canvasH;
    };

    window.addEventListener('resize', handleResize);

    let isSwiping = false;

    const handlePointerDown = (e) => {
      isSwiping = true;
      const rect = canvas.getBoundingClientRect();
      trail.push({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handlePointerMove = (e) => {
      if (!isSwiping && e.buttons !== 1) return;
      const rect = canvas.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      trail.push({ x: px, y: py });

      if (trail.length > maxTrailLength) {
        trail.shift();
      }

      if (soundRef.current && Math.random() < 0.15) {
        soundRef.current.playSwoosh();
      }

      // Check Blade Slice Collision with Fruits
      fruits.forEach(f => {
        if (f.sliced) return;
        const dist = Math.hypot(px - f.x, py - f.y);
        if (dist <= f.radius + 15) {
          f.sliced = true;

          if (soundRef.current) soundRef.current.playSlice();

          if (f.isQuestion) {
            onTargetHit(f.question);
            triggerToast(`⚔️ Berhasil Memotong Buah Soal #${f.question.questionNumber}!`);
          } else {
            triggerToast(`🍍 Memotong Buah Biasa (${f.decoySymbol}). Cari Buah Soal!`, true);
          }
        }
      });
    };

    const handlePointerUp = () => {
      isSwiping = false;
    };

    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerup', handlePointerUp);

    let animationFrameId;

    const render = () => {
      ctx.clearRect(0, 0, canvasW, canvasH);

      // Ninja Dojo Background
      const dojoGrad = ctx.createLinearGradient(0, 0, 0, canvasH);
      dojoGrad.addColorStop(0, '#450A0A');
      dojoGrad.addColorStop(0.5, '#7F1D1D');
      dojoGrad.addColorStop(1, '#991B1B');
      ctx.fillStyle = dojoGrad;
      ctx.fillRect(0, 0, canvasW, canvasH);

      // Maintain Fruit Spawn Rate
      if (fruits.filter(f => !f.sliced && f.y < canvasH + 50).length < 6) {
        fruits.push(spawnSingleFruit(null));
      }

      // Update & Draw Thrown Fruits
      fruits.forEach(f => {
        if (f.sliced) return;

        f.x += f.vx;
        f.y += f.vy;
        f.vy += gravity;
        f.rotation += f.rotSpeed;

        if (f.y > canvasH + 60) {
          f.y = canvasH + 60;
          f.vy = -(13 + Math.random() * 5);
          f.x = Math.random() * (canvasW - 200) + 100;
        }

        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.rotate(f.rotation);

        ctx.beginPath();
        ctx.arc(0, 0, f.radius, 0, Math.PI * 2);
        ctx.fillStyle = f.color;
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(-f.radius * 0.3, -f.radius * 0.3, f.radius * 0.25, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.fill();

        if (f.isQuestion && f.question) {
          ctx.fillStyle = '#FEF08A';
          ctx.beginPath();
          ctx.arc(0, 0, 11, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#854D0E';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.fillStyle = '#713F12';
          ctx.font = 'bold 12px "Fredoka", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(f.question.questionNumber, 0, 0.5);
        } else {
          ctx.font = '14px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(f.decoySymbol, 0, 0);
        }

        ctx.restore();
      });

      // Draw Glowing Blade Trail
      if (trail.length > 1) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(trail[0].x, trail[0].y);
        for (let i = 1; i < trail.length; i++) {
          ctx.lineTo(trail[i].x, trail[i].y);
        }
        ctx.strokeStyle = '#FDE047';
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowColor = '#EAB308';
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerup', handlePointerUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [questions, answeredQuestionIds]);

  const remainingQuestionsCount = questions.length - answeredQuestionIds.length;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col bg-slate-900 rounded-3xl overflow-hidden border-4 border-yellow-400 shadow-2xl">
      <div className="w-full bg-rose-950/90 backdrop-blur px-4 py-2.5 flex items-center justify-between text-xs sm:text-sm font-bold border-b border-yellow-400/30 z-20">
        <div className="flex items-center gap-2 text-cyan-200">
          <span>Target Buah Soal Tersisa:</span>
          <span className="bg-yellow-400 text-blue-950 px-2.5 py-0.5 rounded-full font-black text-sm">
            {remainingQuestionsCount}
          </span>
        </div>

        <div className="hidden sm:block text-yellow-300 font-bold animate-pulse text-xs">
          ⚔️ Usap & Potong Buah Bernomor Soal dengan Pedang Ninja!
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleSound}
            className="w-9 h-9 rounded-full bg-rose-700 hover:bg-rose-600 border-2 border-yellow-300 flex items-center justify-center text-white text-sm shadow transition"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-yellow-300" /> : <VolumeX className="w-5 h-5 text-rose-300" />}
          </button>
        </div>
      </div>

      <div className="relative w-full h-[480px] sm:h-[540px] cursor-crosshair overflow-hidden bg-rose-950">
        <canvas ref={canvasRef} className="w-full h-full block" />

        {showToast && (
          <div className={`absolute top-16 inset-x-0 mx-auto w-max max-w-[90%] px-4 py-2 rounded-2xl border-2 shadow-2xl pointer-events-none transition-opacity duration-300 z-30 font-extrabold text-center text-xs sm:text-sm ${
            isToastWarning ? 'bg-amber-950/95 text-yellow-300 border-yellow-400' : 'bg-rose-950/95 text-cyan-300 border-sky-400'
          }`}>
            {toastMessage}
          </div>
        )}
      </div>

      <div className="w-full bg-rose-950/95 backdrop-blur py-3 px-4 flex items-center justify-between border-t-2 border-yellow-400/40 z-20">
        <div className="text-xs text-rose-200 flex items-center gap-1.5 font-bold">
          <span>⚔️ Arena Potong Buah Ninja</span>
        </div>

        <div className="text-xs text-yellow-300 font-extrabold">
          Soal Terjawab: {answeredQuestionIds.length}/{questions.length}
        </div>
      </div>
    </div>
  );
}
