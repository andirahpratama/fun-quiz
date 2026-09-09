import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Target, Send } from 'lucide-react';

class BalloonSoundEngine {
  constructor() {
    this.ctx = null;
    this.masterVolume = null;
    this.bgmVolume = null;
    this.isMuted = false;
    this.tempo = 132;
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

    const notes = [293.66, 329.63, 369.99, 440.00, 493.88, 587.33, 659.25];
    const stepDuration = (60 / this.tempo) / 2;

    this.bgmInterval = setInterval(() => {
      if (this.isMuted || !this.ctx) return;

      const now = this.ctx.currentTime;
      const note = notes[this.step % notes.length];

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = (this.step % 8 === 0) ? 'square' : 'sine';
      osc.frequency.setValueAtTime(note, now);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + stepDuration * 1.2);

      osc.connect(gain);
      gain.connect(this.bgmVolume);

      osc.start(now);
      osc.stop(now + stepDuration * 1.2);

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

  playPop() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.12);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    osc.connect(gain);
    gain.connect(this.masterVolume);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  playArrowShoot() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.linearRampToValueAtTime(700, now + 0.15);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.connect(gain);
    gain.connect(this.masterVolume);
    osc.start(now);
    osc.stop(now + 0.15);
  }
}

export default function BalloonGame({
  questions,
  answeredQuestionIds,
  onTargetHit,
}) {
  const canvasRef = useRef(null);
  const soundRef = useRef(null);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [toastMessage, setToastMessage] = useState('Panah Balon Soal Siap! Sentuh layar untuk membidik & memanah 🎯');
  const [isToastWarning, setIsToastWarning] = useState(false);
  const [showToast, setShowToast] = useState(true);

  useEffect(() => {
    soundRef.current = new BalloonSoundEngine();

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

    const bow = {
      x: canvasW / 2,
      y: canvasH - 45,
      angle: -Math.PI / 2
    };

    const arrows = [];
    const balloonColors = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4'];
    const decoyEmojis = ['🎈', '✨', '🌟', '☁️', '🎉'];

    let balloons = [];

    const getAvailableQuestions = () => {
      return questions.filter(q => !answeredQuestionIds.includes(q.id));
    };

    const spawnSingleBalloon = (forcedQuestion = null) => {
      const availableQs = getAvailableQuestions();
      const activeQIds = new Set(balloons.filter(b => b.isQuestion && !b.popped).map(b => b.question.id));
      const candidates = availableQs.filter(q => !activeQIds.has(q.id));

      let isQuestion = false;
      let questionObj = null;

      if (forcedQuestion) {
        isQuestion = true;
        questionObj = forcedQuestion;
      } else if (candidates.length > 0 && (Math.random() < 0.6 || balloons.filter(b => b.isQuestion).length < 3)) {
        isQuestion = true;
        questionObj = candidates[Math.floor(Math.random() * candidates.length)];
      }

      const color = balloonColors[Math.floor(Math.random() * balloonColors.length)];
      const emoji = decoyEmojis[Math.floor(Math.random() * decoyEmojis.length)];

      return {
        uid: Math.random().toString(36).substring(2, 9),
        isQuestion,
        question: questionObj,
        decoyEmoji: emoji,
        x: Math.random() * (canvasW - 120) + 60,
        y: canvasH + 60 + Math.random() * 40,
        radius: isQuestion ? 34 : 28,
        speedY: 1.2 + Math.random() * 1.6,
        wobbleFreq: 0.03 + Math.random() * 0.02,
        wobbleAmp: 18 + Math.random() * 15,
        wobbleTimer: Math.random() * Math.PI * 2,
        color,
        popped: false
      };
    };

    const initBalloons = () => {
      balloons = [];
      const availableQs = getAvailableQuestions();
      availableQs.forEach(q => {
        balloons.push(spawnSingleBalloon(q));
      });
      for (let d = 0; d < 4; d++) {
        balloons.push(spawnSingleBalloon(null));
      }
    };

    initBalloons();

    const handleResize = () => {
      if (!canvas.parentElement) return;
      canvasW = canvas.parentElement.clientWidth || 800;
      canvasH = canvas.parentElement.clientHeight || 550;
      canvas.width = canvasW;
      canvas.height = canvasH;
      bow.x = canvasW / 2;
      bow.y = canvasH - 45;
    };

    window.addEventListener('resize', handleResize);

    const shootArrowAt = (targetX, targetY) => {
      const dx = targetX - bow.x;
      const dy = targetY - bow.y;
      const angle = Math.atan2(dy, dx);
      bow.angle = angle;

      const speed = 18;
      arrows.push({
        x: bow.x,
        y: bow.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        angle
      });

      if (soundRef.current) soundRef.current.playArrowShoot();
    };

    const handleCanvasClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      shootArrowAt(clickX, clickY);
    };

    canvas.addEventListener('pointerdown', handleCanvasClick);

    let animationFrameId;

    const render = () => {
      ctx.clearRect(0, 0, canvasW, canvasH);

      // Sky Sunset Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, canvasH);
      skyGrad.addColorStop(0, '#1E1B4B');
      skyGrad.addColorStop(0.5, '#312E81');
      skyGrad.addColorStop(1, '#4C1D95');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvasW, canvasH);

      // Clouds
      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.beginPath();
      ctx.arc(100, 80, 45, 0, Math.PI * 2);
      ctx.arc(150, 70, 60, 0, Math.PI * 2);
      ctx.arc(200, 80, 45, 0, Math.PI * 2);
      ctx.fill();

      // Maintain Balloon Count
      if (balloons.filter(b => !b.popped).length < 7) {
        balloons.push(spawnSingleBalloon(null));
      }

      // Update & Draw Balloons
      balloons.forEach(b => {
        if (b.popped) return;

        b.y -= b.speedY;
        b.wobbleTimer += b.wobbleFreq;
        b.x += Math.sin(b.wobbleTimer) * 0.8;

        if (b.y < -70) {
          b.y = canvasH + 70;
          b.x = Math.random() * (canvasW - 120) + 60;
        }

        // Draw String
        ctx.beginPath();
        ctx.moveTo(b.x, b.y + b.radius);
        ctx.lineTo(b.x + Math.sin(b.wobbleTimer) * 10, b.y + b.radius + 40);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw Balloon Body
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Balloon Highlight
        ctx.beginPath();
        ctx.arc(b.x - b.radius * 0.35, b.y - b.radius * 0.35, b.radius * 0.25, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.fill();

        // Balloon Knot
        ctx.beginPath();
        ctx.moveTo(b.x - 5, b.y + b.radius);
        ctx.lineTo(b.x + 5, b.y + b.radius);
        ctx.lineTo(b.x, b.y + b.radius + 6);
        ctx.closePath();
        ctx.fillStyle = b.color;
        ctx.fill();

        // Number Badge vs Decoy Emoji
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
          ctx.fillText(b.decoyEmoji, b.x, b.y);
        }
      });

      // Update & Draw Arrows
      for (let i = arrows.length - 1; i >= 0; i--) {
        const arr = arrows[i];
        arr.x += arr.vx;
        arr.y += arr.vy;

        // Draw Arrow
        ctx.save();
        ctx.translate(arr.x, arr.y);
        ctx.rotate(arr.angle);
        ctx.fillStyle = '#FDE047';
        ctx.fillRect(-15, -2, 30, 4);
        ctx.fillStyle = '#EF4444';
        ctx.beginPath();
        ctx.moveTo(15, -5);
        ctx.lineTo(24, 0);
        ctx.lineTo(15, 5);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Collision Check with Balloons
        balloons.forEach(b => {
          if (b.popped) return;
          const dist = Math.hypot(arr.x - b.x, arr.y - b.y);
          if (dist < b.radius + 10) {
            b.popped = true;
            arrows.splice(i, 1);

            if (soundRef.current) soundRef.current.playPop();

            if (b.isQuestion) {
              onTargetHit(b.question);
              triggerToast(`🎯 Memanah Balon Soal #${b.question.questionNumber}!`);
            } else {
              triggerToast(`🎈 Memanah Balon Biasa (${b.decoyEmoji}). Cari Balon Soal!`, true);
            }
          }
        });

        // Out of bounds check
        if (arr.x < -20 || arr.x > canvasW + 20 || arr.y < -20 || arr.y > canvasH + 20) {
          arrows.splice(i, 1);
        }
      }

      // Draw Bow at Bottom
      ctx.save();
      ctx.translate(bow.x, bow.y);
      ctx.rotate(bow.angle + Math.PI / 2);
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(0, 0, 35, -Math.PI * 0.4, Math.PI * 0.4, false);
      ctx.stroke();

      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-25, 22);
      ctx.lineTo(25, 22);
      ctx.stroke();
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('pointerdown', handleCanvasClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, [questions, answeredQuestionIds]);

  const handleQuickShoot = () => {
    if (!canvasRef.current) return;
    const canvasW = canvasRef.current.width || 800;
    const clickEvent = new PointerEvent('pointerdown', {
      clientX: canvasRef.current.getBoundingClientRect().left + canvasW / 2,
      clientY: canvasRef.current.getBoundingClientRect().top + 100
    });
    canvasRef.current.dispatchEvent(clickEvent);
  };

  const remainingQuestionsCount = questions.length - answeredQuestionIds.length;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col bg-slate-900 rounded-3xl overflow-hidden border-4 border-yellow-400 shadow-2xl">
      <div className="w-full bg-indigo-950/90 backdrop-blur px-4 py-2.5 flex items-center justify-between text-xs sm:text-sm font-bold border-b border-yellow-400/30 z-20">
        <div className="flex items-center gap-2 text-cyan-200">
          <span>Target Balon Soal Tersisa:</span>
          <span className="bg-yellow-400 text-blue-950 px-2.5 py-0.5 rounded-full font-black text-sm">
            {remainingQuestionsCount}
          </span>
        </div>

        <div className="hidden sm:block text-yellow-300 font-bold animate-pulse text-xs">
          🎯 Panah & Letuskan Balon Bernomor Soal!
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleSound}
            className="w-9 h-9 rounded-full bg-indigo-700 hover:bg-indigo-600 border-2 border-yellow-300 flex items-center justify-center text-white text-sm shadow transition"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-yellow-300" /> : <VolumeX className="w-5 h-5 text-rose-300" />}
          </button>
        </div>
      </div>

      <div className="relative w-full h-[480px] sm:h-[540px] cursor-crosshair overflow-hidden bg-purple-950">
        <canvas ref={canvasRef} className="w-full h-full block" />

        {showToast && (
          <div className={`absolute top-16 inset-x-0 mx-auto w-max max-w-[90%] px-4 py-2 rounded-2xl border-2 shadow-2xl pointer-events-none transition-opacity duration-300 z-30 font-extrabold text-center text-xs sm:text-sm ${
            isToastWarning ? 'bg-amber-950/95 text-yellow-300 border-yellow-400' : 'bg-indigo-950/95 text-cyan-300 border-sky-400'
          }`}>
            {toastMessage}
          </div>
        )}
      </div>

      <div className="w-full bg-indigo-950/95 backdrop-blur py-3 px-4 flex items-center justify-between border-t-2 border-yellow-400/40 z-20">
        <div className="text-xs text-indigo-200 flex items-center gap-1.5 font-bold">
          <span>🏹 Pemanah Panah Balon</span>
        </div>

        <button
          type="button"
          onClick={handleQuickShoot}
          className="px-5 py-2.5 rounded-xl btn-3d btn-3d-yellow text-blue-950 text-xs font-black uppercase flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          <span>Lepas Panah 🎯</span>
        </button>

        <div className="text-xs text-yellow-300 font-extrabold">
          Soal Terjawab: {answeredQuestionIds.length}/{questions.length}
        </div>
      </div>
    </div>
  );
}
