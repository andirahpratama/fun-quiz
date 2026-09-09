import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Anchor, Send } from 'lucide-react';

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

      // Lead synth pluck
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

      // Bass kick on beat
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

      // Percussive hat
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

  playDecoySplash() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(350, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.25);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.connect(gain);
    gain.connect(this.masterVolume);
    osc.start(now);
    osc.stop(now + 0.25);
  }
}

export default function FishingGame({
  questions,
  answeredQuestionIds,
  onTargetHit,
}) {
  const canvasRef = useRef(null);
  const soundRef = useRef(null);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [toastMessage, setToastMessage] = useState('Pancingan Siap! Sentuh air untuk lempar kail 🎣');
  const [isToastWarning, setIsToastWarning] = useState(false);
  const [showToast, setShowToast] = useState(true);

  // Initialize Sound Engine
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

  useEffect(() => {
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
      return questions.filter(q => !answeredQuestionIds.includes(q.id));
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
      if (fishingRod.hook.active) return;
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
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      launchHookAt(clickX, clickY);
    };

    canvas.addEventListener('pointerdown', handleCanvasClick);

    let animationFrameId;

    const render = () => {
      // 1. Update Physics
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
                  if (soundRef.current) soundRef.current.playDecoySplash();
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
                onTargetHit(caught.question);
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

      // 2. Draw Graphics
      ctx.clearRect(0, 0, canvasW, canvasH);
      const waterLine = 85;

      // Sky Background
      const skyGrad = ctx.createLinearGradient(0, 0, 0, waterLine);
      skyGrad.addColorStop(0, '#7DD3FC');
      skyGrad.addColorStop(1, '#BAE6FD');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvasW, waterLine);

      // Fluffy Clouds
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.beginPath();
      ctx.arc(65, 30, 18, 0, Math.PI * 2);
      ctx.arc(90, 24, 24, 0, Math.PI * 2);
      ctx.arc(115, 30, 18, 0, Math.PI * 2);
      ctx.fill();

      // Deep Sea Gradient
      const seaGrad = ctx.createLinearGradient(0, waterLine, 0, canvasH);
      seaGrad.addColorStop(0, '#0284C7');
      seaGrad.addColorStop(0.3, '#0369A1');
      seaGrad.addColorStop(0.7, '#075985');
      seaGrad.addColorStop(1, '#082F49');
      ctx.fillStyle = seaGrad;
      ctx.fillRect(0, waterLine, canvasW, canvasH - waterLine);

      // Water Ripple
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

      // Sunbeams
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
      for (let r = 0; r < 5; r++) {
        ctx.beginPath();
        ctx.moveTo(canvasW * (0.15 + r * 0.18), waterLine);
        ctx.lineTo(canvasW * (0.24 + r * 0.18), waterLine);
        ctx.lineTo(canvasW * (0.32 + r * 0.18), canvasH);
        ctx.lineTo(canvasW * (0.2 + r * 0.18), canvasH);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // Bubbles
      ambientBubbles.forEach(b => {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Seaweed
      ctx.fillStyle = '#065F46';
      for (let sw = 0; sw < canvasW; sw += 45) {
        ctx.beginPath();
        ctx.moveTo(sw, canvasH);
        ctx.quadraticCurveTo(sw + Math.sin(Date.now() * 0.003 + sw) * 16, canvasH - 48, sw + 12, canvasH);
        ctx.fill();
      }

      // Draw Fishes
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

      // Fishing Line & Hook
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

      // Wooden Boat & Fisherman Character
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
  }, [questions, answeredQuestionIds]);

  const handleQuickLaunch = () => {
    if (!canvasRef.current) return;
    const canvasH = canvasRef.current.height || 550;
    const canvasW = canvasRef.current.width || 800;
    const clickEvent = new PointerEvent('pointerdown', {
      clientX: canvasRef.current.getBoundingClientRect().left + canvasW / 2,
      clientY: canvasRef.current.getBoundingClientRect().top + canvasH - 60
    });
    canvasRef.current.dispatchEvent(clickEvent);
  };

  const remainingQuestionsCount = questions.length - answeredQuestionIds.length;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col bg-slate-900 rounded-3xl overflow-hidden border-4 border-yellow-400 shadow-2xl">
      
      {/* Top Header Controls Bar */}
      <div className="w-full bg-blue-950/90 backdrop-blur px-4 py-2.5 flex items-center justify-between text-xs sm:text-sm font-bold border-b border-yellow-400/30 z-20">
        <div className="flex items-center gap-2 text-cyan-200">
          <span>Target Ikan Soal Tersisa:</span>
          <span className="bg-yellow-400 text-blue-950 px-2.5 py-0.5 rounded-full font-black text-sm">
            {remainingQuestionsCount}
          </span>
        </div>

        <div className="hidden sm:block text-yellow-300 font-bold animate-pulse text-xs">
          🎯 Sentuh air laut untuk pancing ikan bernomor soal!
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleSound}
            className="w-9 h-9 rounded-full bg-blue-700 hover:bg-blue-600 border-2 border-yellow-300 flex items-center justify-center text-white text-sm shadow transition"
            title="Nyalakan/Matikan Suara"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-yellow-300" /> : <VolumeX className="w-5 h-5 text-rose-300" />}
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="relative w-full h-[480px] sm:h-[540px] cursor-crosshair overflow-hidden bg-sky-900">
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Toast Notification Banner */}
        {showToast && (
          <div className={`absolute top-16 inset-x-0 mx-auto w-max max-w-[90%] px-4 py-2 rounded-2xl border-2 shadow-2xl pointer-events-none transition-opacity duration-300 z-30 font-extrabold text-center text-xs sm:text-sm ${
            isToastWarning ? 'bg-amber-950/95 text-yellow-300 border-yellow-400' : 'bg-blue-950/95 text-cyan-300 border-sky-400'
          }`}>
            {toastMessage}
          </div>
        )}
      </div>

      {/* Floating Controller at Bottom */}
      <div className="w-full bg-blue-950/95 backdrop-blur py-3 px-4 flex items-center justify-between border-t-2 border-yellow-400/40 z-20">
        <div className="text-xs text-sky-200 flex items-center gap-1.5 font-bold">
          <span>🚣 Nelayan di Atas Perahu</span>
        </div>

        <button
          type="button"
          onClick={handleQuickLaunch}
          className="px-5 py-2.5 rounded-xl btn-3d btn-3d-cyan text-white text-xs font-black uppercase flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          <span>Lempar Kail 🎣</span>
        </button>

        <div className="text-xs text-yellow-300 font-extrabold">
          Soal Terjawab: {answeredQuestionIds.length}/{questions.length}
        </div>
      </div>
    </div>
  );
}
