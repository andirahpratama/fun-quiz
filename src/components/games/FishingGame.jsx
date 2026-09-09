import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Send, Award, Download, Printer, RotateCcw, BookOpen, CheckCircle, XCircle } from 'lucide-react';

// Cheerful Procedural Audio Engine (Zero External Audio Files Needed)
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.masterVolume = null;
    this.bgmVolume = null;
    this.isMuted = false;
    this.tempo = 128;
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
      this.bgmVolume.gain.value = 0.32;
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

    const notes = [
      261.63, 293.66, 329.63, 392.00, 440.00,
      523.25, 587.33, 659.25, 783.99, 880.00
    ];

    const melodyPattern = [
      0, 2, 4, 7, 4, 2, 0, 4,
      1, 3, 5, 8, 5, 3, 1, 5,
      2, 4, 6, 9, 6, 4, 2, 6,
      4, 7, 9, 7, 4, 2, 0, 2
    ];
    const bassNotes = [130.81, 130.81, 146.83, 146.83, 164.81, 164.81, 174.61, 196.00];
    const stepDuration = (60 / this.tempo) / 2;

    this.bgmInterval = setInterval(() => {
      if (this.isMuted || !this.ctx) return;

      const now = this.ctx.currentTime;
      const noteIndex = melodyPattern[this.step % melodyPattern.length];
      const freq = notes[noteIndex % notes.length];

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = (this.step % 4 === 0) ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + stepDuration * 1.4);

      osc.connect(gain);
      gain.connect(this.bgmVolume);

      osc.start(now);
      osc.stop(now + stepDuration * 1.4);

      if (this.step % 4 === 0) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        const bassFreq = bassNotes[(Math.floor(this.step / 4)) % bassNotes.length];

        bassOsc.type = 'triangle';
        bassOsc.frequency.setValueAtTime(bassFreq, now);

        bassGain.gain.setValueAtTime(0.45, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + stepDuration * 1.8);

        bassOsc.connect(bassGain);
        bassGain.connect(this.bgmVolume);

        bassOsc.start(now);
        bassOsc.stop(now + stepDuration * 1.8);
      }

      if (this.step % 2 === 1) {
        this.playNoiseHat(now);
      }

      this.step++;
    }, stepDuration * 1000);
  }

  playNoiseHat(time) {
    if (!this.ctx) return;
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.03);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 7500;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.07, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.03);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.bgmVolume);

    noise.start(time);
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

  playCast() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(850, now + 0.22);

    gain.gain.setValueAtTime(0.45, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

    osc.connect(gain);
    gain.connect(this.masterVolume);
    osc.start(now);
    osc.stop(now + 0.22);
  }

  playCatch() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    [440, 587.33, 659.25, 880].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.05);

      gain.gain.setValueAtTime(0.4, now + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.22);

      osc.connect(gain);
      gain.connect(this.masterVolume);
      osc.start(now + i * 0.05);
      osc.stop(now + i * 0.05 + 0.25);
    });
  }

  playCorrect() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);

      gain.gain.setValueAtTime(0.45, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.4);

      osc.connect(gain);
      gain.connect(this.masterVolume);
      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.45);
    });
  }

  playWrong() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(130, now + 0.35);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.masterVolume);
    osc.start(now);
    osc.stop(now + 0.35);
  }

  playFanfare() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const chords = [
      [523.25, 659.25, 783.99],
      [587.33, 698.46, 880.00],
      [659.25, 783.99, 987.77],
      [1046.50, 1318.51, 1567.98]
    ];
    chords.forEach((chord, i) => {
      chord.forEach(f => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + i * 0.18);
        gain.gain.setValueAtTime(0.35, now + i * 0.18);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.18 + 0.45);

        osc.connect(gain);
        gain.connect(this.masterVolume);
        osc.start(now + i * 0.18);
        osc.stop(now + i * 0.18 + 0.5);
      });
    });
  }
}

export default function FishingGame({
  questions,
  answeredQuestionIds,
  onTargetHit,
  studentInfo,
  subject,
  material,
}) {
  const canvasRef = useRef(null);
  const certificateCanvasRef = useRef(null);
  const soundRef = useRef(null);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [toastMessage, setToastMessage] = useState('Pancingan Siap! Sentuh air laut untuk meluncurkan mata kail 🎣');
  const [isToastWarning, setIsToastWarning] = useState(false);
  const [showToast, setShowToast] = useState(true);

  // In-Game Question Modal State (Pauses Game when active)
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasAnsweredModal, setHasAnsweredModal] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(0);

  // Screen View State: 'game' | 'result'
  const [viewState, setViewState] = useState('game');
  const [showReviewAccordion, setShowReviewAccordion] = useState(false);

  // Ref to track pause state synchronously inside canvas animation loop
  const isPausedRef = useRef(false);

  useEffect(() => {
    soundRef.current = new SoundEngine();

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

  // Canvas Fishing Engine Setup
  useEffect(() => {
    if (viewState !== 'game') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let canvasW = canvas.parentElement.clientWidth || 800;
    let canvasH = canvas.parentElement.clientHeight || 550;
    canvas.width = canvasW;
    canvas.height = canvasH;

    const boat = {
      x: canvasW / 2,
      y: 72,
      width: 140,
      height: 38,
      swayTimer: 0,
      swayOffset: 0
    };

    const fishingRod = {
      tipX: canvasW / 2 + 48,
      tipY: 60,
      angle: Math.PI / 3,
      aimSpeed: 0.02,
      aimDirection: 1,
      minAngle: Math.PI * 0.15,
      maxAngle: Math.PI * 0.85,
      hook: {
        x: canvasW / 2 + 48,
        y: 60,
        vx: 0,
        vy: 0,
        active: false,
        returning: false,
        caughtFish: null,
        radius: 12
      }
    };

    const fishColors = [
      { body: '#F97316', fin: '#FB923C' },
      { body: '#EC4899', fin: '#F472B6' },
      { body: '#EAB308', fin: '#FDE047' },
      { body: '#06B6D4', fin: '#38BDF8' },
      { body: '#8B5CF6', fin: '#A78BFA' },
      { body: '#10B981', fin: '#34D399' },
      { body: '#EF4444', fin: '#F87171' },
      { body: '#F59E0B', fin: '#FBBF24' }
    ];

    const decoySymbols = ['✨', '🐠', '⭐', '🫧', '🦐', '🐬'];

    let fishes = [];
    let ambientBubbles = [];

    const getAvailableQuestions = () => {
      return questions.filter(q => !userAnswers[q.id]);
    };

    const spawnSingleFish = (forcedQuestion = null) => {
      const waterTop = 135;
      const waterBottom = canvasH - 65;
      const availableQs = getAvailableQuestions();
      const activeQIds = new Set(fishes.filter(f => f.isQuestion && !f.caught && !f.answered).map(f => f.question.id));
      const candidates = availableQs.filter(q => !activeQIds.has(q.id));

      let isQuestion = false;
      let questionObj = null;

      if (forcedQuestion) {
        isQuestion = true;
        questionObj = forcedQuestion;
      } else if (candidates.length > 0) {
        const activeCount = fishes.filter(f => f.isQuestion && !f.caught).length;
        if (activeCount < 4 || Math.random() < 0.6) {
          isQuestion = true;
          questionObj = candidates[Math.floor(Math.random() * candidates.length)];
        }
      }

      const dir = Math.random() > 0.5 ? 1 : -1;
      const startX = (dir === 1) ? -65 - Math.random() * 80 : canvasW + 65 + Math.random() * 80;
      const randomY = waterTop + Math.random() * (waterBottom - waterTop);
      const color = fishColors[Math.floor(Math.random() * fishColors.length)];
      const symbol = decoySymbols[Math.floor(Math.random() * decoySymbols.length)];

      return {
        uid: Math.random().toString(36).substring(2, 9),
        isQuestion,
        question: questionObj,
        decoySymbol: symbol,
        x: startX,
        baseY: randomY,
        y: randomY,
        direction: dir,
        speed: 1.35 + Math.random() * 1.5,
        waveFreq: 0.032 + Math.random() * 0.025,
        waveAmp: 22 + Math.random() * 18,
        waveTimer: Math.random() * Math.PI * 2,
        radius: isQuestion ? 24 : 19,
        color,
        caught: false,
        answered: false,
        swimOffset: Math.random() * 10
      };
    };

    const initFishes = () => {
      fishes = [];
      const availableQs = getAvailableQuestions();
      availableQs.forEach(q => {
        fishes.push(spawnSingleFish(q));
      });
      for (let d = 0; d < 4; d++) {
        fishes.push(spawnSingleFish(null));
      }

      ambientBubbles = [];
      for (let b = 0; b < 25; b++) {
        ambientBubbles.push({
          x: Math.random() * canvasW,
          y: 90 + Math.random() * (canvasH - 90),
          size: 3 + Math.random() * 6,
          speed: 0.6 + Math.random() * 1.4,
          wobble: Math.random() * Math.PI * 2
        });
      }
    };

    initFishes();

    const handleResize = () => {
      if (!canvas.parentElement) return;
      canvasW = canvas.parentElement.clientWidth || 800;
      canvasH = canvas.parentElement.clientHeight || 550;
      canvas.width = canvasW;
      canvas.height = canvasH;
      boat.x = canvasW / 2;
      boat.y = 70;
      fishingRod.tipX = boat.x + 48;
      fishingRod.tipY = boat.y - 12;
      if (!fishingRod.hook.active) {
        fishingRod.hook.x = fishingRod.tipX;
        fishingRod.hook.y = fishingRod.tipY;
      }
    };

    window.addEventListener('resize', handleResize);

    const launchHookAt = (targetX, targetY) => {
      if (isPausedRef.current || fishingRod.hook.active) return;
      if (targetY < 95) return;

      const startX = fishingRod.tipX;
      const startY = fishingRod.tipY;
      const dx = targetX - startX;
      const dy = targetY - startY;
      const angle = Math.atan2(dy, dx);

      fishingRod.angle = angle;
      fishingRod.hook.active = true;
      fishingRod.hook.returning = false;
      fishingRod.hook.caughtFish = null;
      fishingRod.hook.x = startX;
      fishingRod.hook.y = startY;

      const launchSpeed = 16.0;
      fishingRod.hook.vx = Math.cos(angle) * launchSpeed;
      fishingRod.hook.vy = Math.sin(angle) * launchSpeed;

      if (soundRef.current) soundRef.current.playCast();
    };

    const handleCanvasClick = (e) => {
      if (isPausedRef.current) return;
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      launchHookAt(clickX, clickY);
    };

    canvas.addEventListener('pointerdown', handleCanvasClick);

    let animationFrameId;

    const render = () => {
      // ONLY UPDATE PHYSICS IF NOT PAUSED BY QUESTION MODAL!
      if (!isPausedRef.current) {
        boat.swayTimer += 0.04;
        boat.swayOffset = Math.sin(boat.swayTimer) * 4;
        fishingRod.tipX = boat.x + 48;
        fishingRod.tipY = boat.y - 12 + boat.swayOffset;

        const activeUncaught = fishes.filter(f => !f.caught && !f.answered).length;
        if (activeUncaught < 7) {
          fishes.push(spawnSingleFish(null));
        }

        fishes.forEach(fish => {
          if (fish.caught) return;
          fish.x += fish.direction * fish.speed;
          fish.waveTimer += fish.waveFreq;
          fish.y = fish.baseY + Math.sin(fish.waveTimer) * fish.waveAmp;

          if (fish.direction === 1 && fish.x > canvasW + 90) {
            fish.x = -90;
            fish.baseY = 135 + Math.random() * (canvasH - 200);
          } else if (fish.direction === -1 && fish.x < -90) {
            fish.x = canvasW + 90;
            fish.baseY = 135 + Math.random() * (canvasH - 200);
          }
        });

        const hook = fishingRod.hook;
        if (hook.active) {
          if (!hook.returning) {
            hook.x += hook.vx;
            hook.y += hook.vy;

            for (let fish of fishes) {
              if (!fish.caught && !fish.answered) {
                const dist = Math.hypot(hook.x - fish.x, hook.y - fish.y);
                if (dist < hook.radius + fish.radius) {
                  fish.caught = true;
                  hook.caughtFish = fish;
                  hook.returning = true;

                  if (fish.isQuestion) {
                    if (soundRef.current) soundRef.current.playCatch();
                    triggerToast(`🎣 Menangkap Ikan Soal #${fish.question.questionNumber}!`);
                  } else {
                    triggerToast(`🌊 Tertangkap Ikan Hias (${fish.decoySymbol}). Cari ikan bernomor!`, true);
                  }
                  break;
                }
              }
            }

            if (hook.x < 15 || hook.x > canvasW - 15 || hook.y > canvasH - 20) {
              hook.returning = true;
            }
          } else {
            const returnDx = fishingRod.tipX - hook.x;
            const returnDy = fishingRod.tipY - hook.y;
            const returnDist = Math.hypot(returnDx, returnDy);
            const reelSpeed = 17.5;

            if (returnDist < reelSpeed) {
              hook.x = fishingRod.tipX;
              hook.y = fishingRod.tipY;
              hook.active = false;
              hook.returning = false;

              if (hook.caughtFish) {
                const caught = hook.caughtFish;
                hook.caughtFish = null;

                if (caught.isQuestion) {
                  // PAUSE GAME IMMEDIATELY & OPEN QUESTION MODAL!
                  isPausedRef.current = true;
                  setActiveQuestion(caught.question);
                  setSelectedOption(null);
                  setHasAnsweredModal(false);
                  caught.answered = true;
                } else {
                  caught.caught = false;
                  caught.x = (caught.direction === 1) ? -70 : canvasW + 70;
                }
              }
            } else {
              hook.x += (returnDx / returnDist) * reelSpeed;
              hook.y += (returnDy / returnDist) * reelSpeed;

              if (hook.caughtFish) {
                hook.caughtFish.x = hook.x;
                hook.caughtFish.y = hook.y + 10;
              }
            }
          }
        } else {
          fishingRod.angle += fishingRod.aimSpeed * fishingRod.aimDirection;
          if (fishingRod.angle > fishingRod.maxAngle) {
            fishingRod.angle = fishingRod.maxAngle;
            fishingRod.aimDirection = -1;
          } else if (fishingRod.angle < fishingRod.minAngle) {
            fishingRod.angle = fishingRod.minAngle;
            fishingRod.aimDirection = 1;
          }
          hook.x = fishingRod.tipX;
          hook.y = fishingRod.tipY;
        }

        ambientBubbles.forEach(b => {
          b.y -= b.speed;
          b.wobble += 0.04;
          b.x += Math.sin(b.wobble) * 0.4;
          if (b.y < 85) {
            b.y = canvasH + 15;
            b.x = Math.random() * canvasW;
          }
        });
      }

      // Draw Graphics
      ctx.clearRect(0, 0, canvasW, canvasH);
      const waterLine = 85;

      const skyGrad = ctx.createLinearGradient(0, 0, 0, waterLine);
      skyGrad.addColorStop(0, '#7DD3FC');
      skyGrad.addColorStop(1, '#BAE6FD');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvasW, waterLine);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.beginPath();
      ctx.arc(65, 30, 18, 0, Math.PI * 2);
      ctx.arc(90, 24, 24, 0, Math.PI * 2);
      ctx.arc(115, 30, 18, 0, Math.PI * 2);
      ctx.fill();

      const seaGrad = ctx.createLinearGradient(0, waterLine, 0, canvasH);
      seaGrad.addColorStop(0, '#0284C7');
      seaGrad.addColorStop(0.3, '#0369A1');
      seaGrad.addColorStop(0.7, '#075985');
      seaGrad.addColorStop(1, '#082F49');
      ctx.fillStyle = seaGrad;
      ctx.fillRect(0, waterLine, canvasW, canvasH - waterLine);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.beginPath();
      for (let wx = 0; wx <= canvasW; wx += 20) {
        const wy = waterLine + Math.sin(wx * 0.04 + Date.now() * 0.0035) * 3;
        if (wx === 0) ctx.moveTo(wx, wy);
        else ctx.lineTo(wx, wy);
      }
      ctx.lineTo(canvasW, waterLine + 5);
      ctx.lineTo(0, waterLine + 5);
      ctx.closePath();
      ctx.fill();

      ambientBubbles.forEach(b => {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      ctx.fillStyle = '#065F46';
      for (let sw = 0; sw < canvasW; sw += 45) {
        ctx.beginPath();
        ctx.moveTo(sw, canvasH);
        ctx.quadraticCurveTo(sw + Math.sin(Date.now() * 0.003 + sw) * 16, canvasH - 48, sw + 12, canvasH);
        ctx.fill();
      }

      fishes.forEach(fish => {
        if (fish.answered) return;

        ctx.save();
        ctx.translate(fish.x, fish.y);
        if (fish.direction === -1) {
          ctx.scale(-1, 1);
        }

        const tailFlap = Math.sin(Date.now() * 0.012 + fish.swimOffset) * 6;

        ctx.fillStyle = fish.color.fin;
        ctx.beginPath();
        ctx.moveTo(-20, 0);
        ctx.lineTo(-36, -13 + tailFlap);
        ctx.lineTo(-32, 0);
        ctx.lineTo(-36, 13 - tailFlap);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = fish.color.body;
        ctx.beginPath();
        ctx.ellipse(0, 0, fish.radius + 3, fish.radius - 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2.2;
        ctx.stroke();

        ctx.fillStyle = fish.color.fin;
        ctx.beginPath();
        ctx.moveTo(-5, -14);
        ctx.quadraticCurveTo(4, -22, 12, -13);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(12, -4, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0F172A';
        ctx.beginPath();
        ctx.arc(13.2, -4, 2.2, 0, Math.PI * 2);
        ctx.fill();

        if (fish.isQuestion && fish.question) {
          ctx.fillStyle = '#FEF08A';
          ctx.beginPath();
          ctx.arc(-2, 0, 10.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#854D0E';
          ctx.lineWidth = 1.8;
          ctx.stroke();

          ctx.fillStyle = '#713F12';
          ctx.font = 'bold 12px "Fredoka", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          if (fish.direction === -1) {
            ctx.save();
            ctx.scale(-1, 1);
            ctx.fillText(fish.question.questionNumber, 2, 0.5);
            ctx.restore();
          } else {
            ctx.fillText(fish.question.questionNumber, -2, 0.5);
          }
        } else {
          ctx.font = '12px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          if (fish.direction === -1) {
            ctx.save();
            ctx.scale(-1, 1);
            ctx.fillText(fish.decoySymbol, 2, 0);
            ctx.restore();
          } else {
            ctx.fillText(fish.decoySymbol, -2, 0);
          }
        }

        ctx.restore();
      });

      const hook = fishingRod.hook;
      if (hook.active) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(fishingRod.tipX, fishingRod.tipY);
        ctx.lineTo(hook.x, hook.y);
        ctx.strokeStyle = '#FDE047';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.translate(hook.x, hook.y);
        ctx.strokeStyle = '#E2E8F0';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(0, 0, hook.radius, 0.2, Math.PI * 1.1, false);
        ctx.lineTo(-4, -6);
        ctx.stroke();

        ctx.fillStyle = '#CBD5E1';
        ctx.beginPath();
        ctx.arc(0, -hook.radius, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      const boatY = boat.y + boat.swayOffset;
      ctx.save();
      ctx.translate(boat.x, boatY);

      ctx.fillStyle = 'rgba(0, 30, 60, 0.25)';
      ctx.beginPath();
      ctx.ellipse(0, 16, 75, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#92400E';
      ctx.beginPath();
      ctx.moveTo(-68, -4);
      ctx.lineTo(-50, 15);
      ctx.lineTo(52, 15);
      ctx.lineTo(72, -4);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#FDE047';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.fillStyle = '#D97706';
      ctx.fillRect(-70, -6, 142, 5);

      ctx.fillStyle = '#1E3A8A';
      ctx.fillRect(-8, -18, 7, 14);
      ctx.fillRect(1, -18, 7, 14);

      ctx.fillStyle = '#EF4444';
      ctx.fillRect(-12, -34, 24, 18);

      ctx.fillStyle = '#FDE68A';
      ctx.beginPath();
      ctx.arc(0, -42, 9, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.ellipse(0, -48, 17, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(-8, -56, 16, 9);

      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(4, -28);
      ctx.lineTo(20, -22);
      ctx.stroke();

      ctx.save();
      ctx.translate(18, -22);
      ctx.rotate(fishingRod.angle - Math.PI / 2);
      ctx.fillStyle = '#CA8A04';
      ctx.fillRect(-2, -4, 4, 52);
      ctx.fillStyle = '#EF4444';
      ctx.fillRect(-3, 44, 6, 8);
      ctx.restore();

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('pointerdown', handleCanvasClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, [questions, userAnswers, viewState]);

  // Handle Option Select in Question Modal
  const handleSelectOption = (idx) => {
    if (hasAnsweredModal || !activeQuestion) return;
    setSelectedOption(idx);
    setHasAnsweredModal(true);

    const isCorrect = (idx === activeQuestion.correctAnswer);
    if (isCorrect) {
      if (soundRef.current) soundRef.current.playCorrect();
      setScore(prev => prev + 10);
    } else {
      if (soundRef.current) soundRef.current.playWrong();
    }

    setUserAnswers(prev => ({
      ...prev,
      [activeQuestion.id]: {
        chosen: idx,
        correct: activeQuestion.correctAnswer,
        isCorrect,
        question: activeQuestion
      }
    }));
  };

  // Continue after Question Modal
  const handleNextQuestionModal = () => {
    setActiveQuestion(null);
    setSelectedOption(null);
    setHasAnsweredModal(false);

    const updatedAnswersCount = Object.keys(userAnswers).length;
    if (updatedAnswersCount >= questions.length) {
      // All questions done -> Finish game & render certificate!
      if (soundRef.current) soundRef.current.playFanfare();
      setViewState('result');
      setTimeout(() => renderDigitalCertificate(), 100);
    } else {
      // Resume game physics
      isPausedRef.current = false;
    }
  };

  // Render Digital Certificate on Canvas
  const renderDigitalCertificate = () => {
    const canvas = certificateCanvasRef.current;
    if (!canvas) return;
    const ctxCert = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    const name = studentInfo?.name || "Siswa";
    const studentClass = studentInfo?.studentClass || "8H";
    const finalScore = score;
    let gradeText = "Baik ⭐";
    if (finalScore >= 90) gradeText = "Sangat Istimewa ⭐⭐⭐";
    else if (finalScore >= 80) gradeText = "Sangat Baik ⭐⭐";

    // Clean Background
    ctxCert.fillStyle = '#FFFDF5';
    ctxCert.fillRect(0, 0, w, h);

    // Decorative Borders
    ctxCert.strokeStyle = '#D97706';
    ctxCert.lineWidth = 14;
    ctxCert.strokeRect(20, 20, w - 40, h - 40);

    ctxCert.strokeStyle = '#1E3A8A';
    ctxCert.lineWidth = 3;
    ctxCert.strokeRect(34, 34, w - 68, h - 68);

    // Header Emblem Motif
    ctxCert.fillStyle = '#B45309';
    ctxCert.font = 'bold 36px "Fredoka", sans-serif';
    ctxCert.textAlign = 'center';
    ctxCert.fillText('🇲🇨 SERTIFIKAT PENGHARGAAN 🇲🇨', w / 2, 95);

    ctxCert.fillStyle = '#1E3A8A';
    ctxCert.font = 'bold 16px "Nunito", sans-serif';
    ctxCert.fillText(`PETUALANGAN EDUKASI ${subject.toUpperCase()}`, w / 2, 125);
    ctxCert.fillText(`Materi Pokok: ${material}`, w / 2, 148);

    // Divider Line
    ctxCert.strokeStyle = '#D97706';
    ctxCert.lineWidth = 2;
    ctxCert.beginPath();
    ctxCert.moveTo(w / 2 - 250, 170);
    ctxCert.lineTo(w / 2 + 250, 170);
    ctxCert.stroke();

    // Body Text
    ctxCert.fillStyle = '#334155';
    ctxCert.font = 'italic 18px "Nunito", sans-serif';
    ctxCert.fillText('Sertifikat ini secara resmi dan bangga diberikan kepada:', w / 2, 215);

    ctxCert.fillStyle = '#0F172A';
    ctxCert.font = 'bold 44px "Fredoka", sans-serif';
    ctxCert.fillText(name.toUpperCase(), w / 2, 275);

    ctxCert.strokeStyle = '#F59E0B';
    ctxCert.lineWidth = 3;
    ctxCert.beginPath();
    ctxCert.moveTo(w / 2 - 280, 292);
    ctxCert.lineTo(w / 2 + 280, 292);
    ctxCert.stroke();

    ctxCert.fillStyle = '#1E293B';
    ctxCert.font = 'bold 22px "Nunito", sans-serif';
    ctxCert.fillText(`Kelas: ${studentClass}`, w / 2, 330);

    ctxCert.fillStyle = '#475569';
    ctxCert.font = '18px "Nunito", sans-serif';
    ctxCert.fillText(`Telah berhasil menuntaskan ${questions.length} tantangan memancing soal interaktif`, w / 2, 370);
    ctxCert.fillText('dan menguasai konsep materi dengan hasil:', w / 2, 398);

    // Gold Score Seal
    const sealX = w / 2;
    const sealY = 485;

    ctxCert.fillStyle = '#FEF3C7';
    ctxCert.beginPath();
    ctxCert.arc(sealX, sealY, 56, 0, Math.PI * 2);
    ctxCert.fill();
    ctxCert.strokeStyle = '#D97706';
    ctxCert.lineWidth = 5;
    ctxCert.stroke();

    ctxCert.fillStyle = '#92400E';
    ctxCert.font = 'bold 13px "Fredoka", sans-serif';
    ctxCert.fillText('NILAI AKHIR', sealX, sealY - 22);

    ctxCert.fillStyle = '#B45309';
    ctxCert.font = 'bold 40px "Fredoka", sans-serif';
    ctxCert.fillText(`${finalScore}`, sealX, sealY + 16);

    ctxCert.fillStyle = '#047857';
    ctxCert.font = 'bold 13px "Nunito", sans-serif';
    ctxCert.fillText('SKOR MAKS 100', sealX, sealY + 34);

    const today = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    ctxCert.textAlign = 'left';
    ctxCert.fillStyle = '#334155';
    ctxCert.font = '14px "Nunito", sans-serif';
    ctxCert.fillText(`📅 Tanggal Selesai: ${today}`, 70, 600);
    ctxCert.fillText(`🏆 Predikat: ${gradeText}`, 70, 625);
    ctxCert.fillText(`🔐 Verifikasi: FUNQUIZ-VALID-${Date.now().toString().slice(-6)}`, 70, 650);

    ctxCert.textAlign = 'center';
    ctxCert.fillText('Guru Pengampu Mata Pelajaran,', w - 180, 565);

    ctxCert.strokeStyle = '#1D4ED8';
    ctxCert.lineWidth = 2.5;
    ctxCert.beginPath();
    ctxCert.moveTo(w - 230, 605);
    ctxCert.bezierCurveTo(w - 200, 580, w - 190, 625, w - 130, 600);
    ctxCert.stroke();

    ctxCert.strokeStyle = 'rgba(220, 38, 38, 0.7)';
    ctxCert.lineWidth = 2;
    ctxCert.beginPath();
    ctxCert.arc(w - 180, 600, 26, 0, Math.PI * 2);
    ctxCert.stroke();
    ctxCert.fillStyle = 'rgba(220, 38, 38, 0.8)';
    ctxCert.font = 'bold 9px sans-serif';
    ctxCert.fillText('LULUS KUIS', w - 180, 603);

    ctxCert.fillStyle = '#0F172A';
    ctxCert.font = 'bold 15px "Nunito", sans-serif';
    ctxCert.fillText('( Guru Mata Pelajaran )', w - 180, 645);
  };

  const handleDownloadJPG = () => {
    const canvas = certificateCanvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    const safeName = (studentInfo?.name || 'Siswa').replace(/\s+/g, '_');
    link.download = `Sertifikat_${subject}_${safeName}.jpg`;
    link.href = canvas.toDataURL('image/jpeg', 0.95);
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleRestart = () => {
    setUserAnswers({});
    setScore(0);
    setViewState('game');
    isPausedRef.current = false;
  };

  const handleQuickLaunch = () => {
    if (!canvasRef.current || isPausedRef.current) return;
    const canvasH = canvasRef.current.height || 550;
    const canvasW = canvasRef.current.width || 800;
    const clickEvent = new PointerEvent('pointerdown', {
      clientX: canvasRef.current.getBoundingClientRect().left + canvasW / 2,
      clientY: canvasRef.current.getBoundingClientRect().top + canvasH - 60
    });
    canvasRef.current.dispatchEvent(clickEvent);
  };

  const remainingQuestionsCount = questions.length - Object.keys(userAnswers).length;

  return (
    <div className="w-full min-h-screen bg-slate-900 text-white font-['Fredoka','Nunito',sans-serif] flex flex-col justify-between">
      
      {/* Top Navigation Header matching HTML */}
      <header className="w-full bg-blue-900/90 backdrop-blur border-b-4 border-yellow-400 py-2.5 px-4 sticky top-0 z-40 shadow-lg">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-yellow-400 to-amber-300 flex items-center justify-center text-2xl shadow-inner border-2 border-white">
              🎣
            </div>
            <div>
              <h1 className="text-base sm:text-xl font-bold tracking-wide text-yellow-300 leading-tight uppercase">
                {subject || 'PANCASILA FISHING QUEST'}
              </h1>
              <p className="text-xs text-blue-200 font-semibold tracking-wider">
                Materi: {material || 'Tata Urutan Perundang-undangan'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            {studentInfo && (
              <div className="hidden sm:flex items-center bg-blue-950/70 px-3 py-1 rounded-full border border-blue-400/40 text-xs text-cyan-200">
                👤 <span className="ml-1 font-bold text-white max-w-[120px] truncate">{studentInfo.name}</span>
                <span className="ml-1 bg-yellow-400 text-blue-900 px-1.5 py-0.2 rounded font-black text-[10px]">{studentInfo.studentClass}</span>
              </div>
            )}
            <div className="flex items-center bg-yellow-500 text-blue-950 px-3 py-1 rounded-full font-black text-sm shadow-md border-2 border-white">
              ⭐ <span className="ml-1 text-base">{score}</span>
            </div>
            <button
              onClick={toggleSound}
              className="w-9 h-9 rounded-full bg-blue-700 hover:bg-blue-600 border-2 border-yellow-300 flex items-center justify-center text-sm shadow transition"
              title="Nyalakan/Matikan Suara"
            >
              {soundEnabled ? '🔊' : '🔇'}
            </button>
          </div>
        </div>
      </header>

      {/* SCREEN 2: GAMEPLAY SCREEN */}
      {viewState === 'game' && (
        <section className="flex-1 w-full max-w-4xl mx-auto my-3 h-[75vh] min-h-[500px] max-h-[720px] relative bg-gradient-to-b from-sky-400 via-blue-600 to-blue-950 rounded-3xl overflow-hidden border-4 border-yellow-400 shadow-2xl flex flex-col">
          
          {/* Status Bar */}
          <div className="w-full bg-blue-950/70 backdrop-blur px-4 py-2 flex items-center justify-between text-xs sm:text-sm font-bold border-b border-blue-400/30 z-20">
            <div className="flex items-center space-x-2 text-cyan-200">
              <span>Target Ikan Soal Tersisa:</span>
              <span className="bg-yellow-400 text-blue-950 px-2.5 py-0.5 rounded-full font-black text-sm">
                {remainingQuestionsCount}
              </span>
            </div>
            <div className="text-yellow-300 animate-pulse hidden sm:block text-xs">
              🎯 Tangkap ikan bernomor (1-{questions.length})!
            </div>
            <div className="text-right text-emerald-300 font-black">
              Skor: {score} / {questions.length * 10}
            </div>
          </div>

          {/* Canvas Container */}
          <div className="relative flex-1 w-full h-full cursor-crosshair overflow-hidden">
            <canvas ref={canvasRef} className="w-full h-full block" />

            {showToast && (
              <div className={`absolute top-16 inset-x-0 mx-auto w-max max-w-[90%] px-4 py-2 rounded-2xl border-2 shadow-2xl pointer-events-none transition-opacity duration-300 z-30 font-bold text-center text-xs sm:text-sm ${
                isToastWarning ? 'bg-amber-950/95 text-yellow-300 border-yellow-400' : 'bg-blue-950/95 text-cyan-300 border-sky-400'
              }`}>
                {toastMessage}
              </div>
            )}

            <div className="absolute bottom-16 inset-x-0 mx-auto w-max bg-blue-950/80 text-yellow-300 text-xs px-4 py-1.5 rounded-full border border-yellow-400/60 pointer-events-none">
              🎯 Sentuh / Klik ke arah air laut untuk meluncurkan kail!
            </div>
          </div>

          {/* Bottom Launch Reel */}
          <div className="w-full bg-blue-950/85 backdrop-blur py-2.5 px-4 flex items-center justify-between border-t-2 border-yellow-400/40 z-20">
            <div className="text-xs text-sky-200 flex items-center space-x-1.5">
              <span>🚣 Nelayan di Atas Perahu</span>
            </div>
            <button
              onClick={handleQuickLaunch}
              className="px-5 py-2 rounded-xl btn-3d btn-3d-cyan text-white text-xs font-black uppercase flex items-center space-x-1"
            >
              <span>Lempar Kail 🎣</span>
            </button>
            <div className="text-xs text-yellow-300 font-bold">
              Soal Terjawab: {Object.keys(userAnswers).length}/{questions.length}
            </div>
          </div>
        </section>
      )}

      {/* IN-GAME QUESTION MODAL (PAUSES GAME UNTIL ANSWERED) */}
      {activeQuestion && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 animate-fadeIn">
          <div className="bg-gradient-to-b from-blue-800 via-sky-800 to-blue-950 w-full max-w-2xl rounded-3xl border-4 border-yellow-400 shadow-2xl p-5 sm:p-7 relative max-h-[92vh] flex flex-col justify-between overflow-y-auto text-white">
            
            <div className="flex items-center justify-between border-b-2 border-blue-400/40 pb-3 mb-3">
              <div className="flex items-center space-x-2">
                <span className="w-9 h-9 rounded-xl bg-yellow-400 text-blue-950 flex items-center justify-center font-black text-lg shadow">
                  🐟
                </span>
                <div>
                  <span className="text-xs font-black uppercase text-yellow-300 tracking-wider">
                    Soal No. {activeQuestion.questionNumber} dari {questions.length}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {subject}
                  </h3>
                </div>
              </div>
              <div className="bg-emerald-500 text-blue-950 px-3 py-1 rounded-xl text-xs font-black shadow">
                Nilai: +10 Poin
              </div>
            </div>

            <div className="my-2 bg-blue-950/60 p-4 rounded-2xl border border-sky-400/30 shadow-inner">
              <p className="text-white text-sm sm:text-base leading-relaxed font-semibold">
                {activeQuestion.question}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-3">
              {activeQuestion.options.map((optText, optIdx) => {
                let btnStyle = 'bg-blue-900/70 hover:bg-sky-700/80 border-sky-400/50';

                if (hasAnsweredModal) {
                  if (optIdx === activeQuestion.correctAnswer) {
                    btnStyle = 'bg-emerald-600 border-emerald-300 text-white ring-4 ring-emerald-400/50';
                  } else if (optIdx === selectedOption && selectedOption !== activeQuestion.correctAnswer) {
                    btnStyle = 'bg-rose-600 border-rose-300 text-white ring-4 ring-rose-400/50';
                  } else {
                    btnStyle = 'bg-blue-950/40 border-blue-900 text-slate-400 opacity-60';
                  }
                }

                return (
                  <button
                    key={optIdx}
                    disabled={hasAnsweredModal}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full text-left p-3.5 rounded-2xl border-2 text-white font-semibold text-xs sm:text-sm transition shadow flex items-center space-x-2 ${btnStyle}`}
                  >
                    <span className="w-6 h-6 rounded-lg bg-yellow-400 text-blue-950 font-black flex items-center justify-center text-xs shrink-0">
                      {['A','B','C','D'][optIdx]}
                    </span>
                    <span>{optText}</span>
                  </button>
                );
              })}
            </div>

            {hasAnsweredModal && (
              <div className={`my-2 p-3.5 rounded-2xl border-2 transition-all ${
                selectedOption === activeQuestion.correctAnswer 
                  ? 'bg-emerald-950/80 border-emerald-400 text-emerald-100'
                  : 'bg-rose-950/80 border-rose-400 text-rose-100'
              }`}>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xl">
                    {selectedOption === activeQuestion.correctAnswer ? '🎉' : '💡'}
                  </span>
                  <span className={`font-black text-sm uppercase ${
                    selectedOption === activeQuestion.correctAnswer ? 'text-emerald-300' : 'text-rose-300'
                  }`}>
                    {selectedOption === activeQuestion.correctAnswer ? 'Jawaban Tepat! (+10 Poin)' : 'Kurang Tepat'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
                  {activeQuestion.explanation}
                </p>
              </div>
            )}

            {hasAnsweredModal && (
              <div className="mt-2 pt-2 border-t border-blue-400/30 flex justify-end">
                <button
                  onClick={handleNextQuestionModal}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl btn-3d btn-3d-yellow text-blue-950 font-black text-sm uppercase tracking-wider flex items-center justify-center space-x-2"
                >
                  <span>Lanjut Memancing Ikan</span>
                  <span>➡️</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SCREEN 3: RESULT RECAP & DIGITAL CERTIFICATE */}
      {viewState === 'result' && (
        <section className="w-full max-w-4xl mx-auto my-auto p-4 sm:p-8 bg-slate-900/90 rounded-3xl border-4 border-yellow-400 shadow-2xl text-center space-y-6 animate-fadeIn">
          
          <div className="bg-gradient-to-r from-blue-700 via-sky-600 to-indigo-700 p-6 rounded-2xl border-2 border-yellow-300 shadow-lg text-white relative overflow-hidden">
            <span className="bg-yellow-400 text-blue-950 text-xs font-black uppercase px-3 py-1 rounded-full shadow">
              Petualangan Tuntas!
            </span>
            <h2 className="text-2xl sm:text-3xl font-black mt-2">Selamat, Seluruh Soal Telah Berhasil Dijawab!</h2>
            <p className="text-sky-100 text-sm mt-1">Kamu telah menyelesaikan {questions.length} soal kuis {subject}.</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 max-w-2xl mx-auto">
              <div className="bg-blue-950/70 p-3 rounded-xl border border-sky-400/40">
                <div className="text-xs text-sky-200">Total Skor</div>
                <div className="text-3xl font-black text-yellow-300">{score}</div>
              </div>
              <div className="bg-blue-950/70 p-3 rounded-xl border border-sky-400/40">
                <div className="text-xs text-sky-200">Jawaban Benar</div>
                <div className="text-3xl font-black text-emerald-400">
                  {Object.values(userAnswers).filter(a => a.isCorrect).length}
                </div>
              </div>
              <div className="bg-blue-950/70 p-3 rounded-xl border border-sky-400/40">
                <div className="text-xs text-sky-200">Jawaban Salah</div>
                <div className="text-3xl font-black text-rose-400">
                  {questions.length - Object.values(userAnswers).filter(a => a.isCorrect).length}
                </div>
              </div>
              <div className="bg-blue-950/70 p-3 rounded-xl border border-sky-400/40">
                <div className="text-xs text-sky-200">Predikat</div>
                <div className="text-xl sm:text-2xl font-black text-cyan-300">
                  {score >= 90 ? 'Sangat Istimewa ⭐⭐⭐' : score >= 80 ? 'Sangat Baik ⭐⭐' : 'Baik ⭐'}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleDownloadJPG}
              className="px-5 py-3 rounded-2xl btn-3d btn-3d-yellow text-blue-950 font-black text-sm uppercase flex items-center space-x-2 border border-white shadow-lg"
            >
              <span>📥 Unduh Sertifikat (JPG)</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-3 rounded-2xl btn-3d btn-3d-cyan text-white font-black text-sm uppercase flex items-center space-x-2 border border-white shadow-lg"
            >
              <span>🖨️ Cetak Langsung</span>
            </button>
            <button
              onClick={() => setShowReviewAccordion(prev => !prev)}
              className="px-5 py-3 rounded-2xl btn-3d btn-3d-emerald text-white font-black text-sm uppercase flex items-center space-x-2 border border-white shadow-lg"
            >
              <span>📝 Pembahasan Soal</span>
            </button>
            <button
              onClick={handleRestart}
              className="px-5 py-3 rounded-2xl btn-3d btn-3d-rose text-white font-black text-sm uppercase flex items-center space-x-2 border border-white shadow-lg"
            >
              <span>🔄 Main Lagi</span>
            </button>
          </div>

          {/* Certificate Canvas Preview */}
          <div className="mt-4 bg-slate-950/80 p-3 rounded-2xl border-2 border-yellow-400/50 shadow-inner">
            <h3 className="text-sm font-black text-yellow-300 uppercase tracking-widest mb-2 flex items-center justify-center space-x-2">
              <span>📜</span>
              <span>Sertifikat Kelulusan Resmi Digital</span>
              <span>📜</span>
            </h3>
            <div className="overflow-x-auto flex justify-center py-2">
              <canvas ref={certificateCanvasRef} width="1000" height="700" className="max-w-full h-auto rounded-xl shadow-2xl border-2 border-amber-400" />
            </div>
          </div>

          {/* Question Review Accordion */}
          {showReviewAccordion && (
            <div className="text-left bg-slate-950 p-4 sm:p-6 rounded-2xl border border-sky-500/40 space-y-4">
              <h3 className="text-lg font-black text-yellow-300 border-b border-sky-500/30 pb-2">
                📚 Kunci Jawaban & Pembahasan Lengkap ({questions.length} Soal)
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {questions.map((q) => {
                  const rec = userAnswers[q.id];
                  const isCorrect = rec ? rec.isCorrect : false;
                  const chosenText = rec && rec.chosen !== undefined ? q.options[rec.chosen] : 'Tidak dijawab';
                  const correctText = q.options[q.correctAnswer];

                  return (
                    <div key={q.id} className={`p-3.5 rounded-xl border ${isCorrect ? 'bg-emerald-950/40 border-emerald-500/50' : 'bg-rose-950/40 border-rose-500/50'} text-xs sm:text-sm`}>
                      <div className="flex items-center justify-between mb-1.5 font-bold">
                        <span className={isCorrect ? 'text-emerald-400' : 'text-rose-400'}>
                          Soal #{q.questionNumber}: {isCorrect ? '✅ Jawaban Benar (+10)' : '❌ Jawaban Salah (+0)'}
                        </span>
                      </div>
                      <p className="text-white font-medium mb-2">{q.question}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] sm:text-xs mb-2">
                        <div className="bg-black/40 p-2 rounded text-slate-300">
                          <span className="font-bold">Jawabanmu:</span> {chosenText}
                        </div>
                        <div className="bg-emerald-950/60 p-2 rounded text-emerald-200">
                          <span className="font-bold">Kunci Jawaban:</span> {correctText}
                        </div>
                      </div>
                      <div className="bg-sky-950/60 p-2 rounded text-sky-200 text-[11px] leading-relaxed">
                        <span className="font-bold">💡 Pembahasan:</span> {q.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </section>
      )}

      <footer className="w-full bg-blue-950 py-2 text-center text-xs text-sky-400 border-t border-sky-800 mt-4">
        {subject} &bull; {material}
      </footer>
    </div>
  );
}
