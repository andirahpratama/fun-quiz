import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Send, Award, Download, Printer, RotateCcw, BookOpen, CheckCircle, XCircle } from 'lucide-react';

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

export default function BalloonGame({
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
  const [toastMessage, setToastMessage] = useState('Panah Balon Soal Siap! Sentuh layar untuk membidik 🎯');
  const [isToastWarning, setIsToastWarning] = useState(false);
  const [showToast, setShowToast] = useState(true);

  // In-Game Question Modal & Pause Logic
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasAnsweredModal, setHasAnsweredModal] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(0);

  const [viewState, setViewState] = useState('game');
  const [showReviewAccordion, setShowReviewAccordion] = useState(false);

  const isPausedRef = useRef(false);

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
    if (viewState !== 'game') return;

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
      return questions.filter(q => !userAnswers[q.id]);
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
      if (isPausedRef.current) return;
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
      if (isPausedRef.current) return;
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      shootArrowAt(clickX, clickY);
    };

    canvas.addEventListener('pointerdown', handleCanvasClick);

    let animationFrameId;

    const render = () => {
      if (!isPausedRef.current) {
        if (balloons.filter(b => !b.popped).length < 7) {
          balloons.push(spawnSingleBalloon(null));
        }

        balloons.forEach(b => {
          if (b.popped) return;
          b.y -= b.speedY;
          b.wobbleTimer += b.wobbleFreq;
          b.x += Math.sin(b.wobbleTimer) * 0.8;

          if (b.y < -70) {
            b.y = canvasH + 70;
            b.x = Math.random() * (canvasW - 120) + 60;
          }
        });

        for (let i = arrows.length - 1; i >= 0; i--) {
          const arr = arrows[i];
          arr.x += arr.vx;
          arr.y += arr.vy;

          balloons.forEach(b => {
            if (b.popped) return;
            const dist = Math.hypot(arr.x - b.x, arr.y - b.y);
            if (dist < b.radius + 10) {
              b.popped = true;
              arrows.splice(i, 1);

              if (soundRef.current) soundRef.current.playPop();

              if (b.isQuestion) {
                // PAUSE GAME IMMEDIATELY ON QUESTION POP!
                isPausedRef.current = true;
                setActiveQuestion(b.question);
                setSelectedOption(null);
                setHasAnsweredModal(false);
                triggerToast(`🎯 Memanah Balon Soal #${b.question.questionNumber}!`);
              } else {
                triggerToast(`🎈 Memanah Balon Biasa (${b.decoyEmoji}). Cari Balon Soal!`, true);
              }
            }
          });

          if (arr.x < -20 || arr.x > canvasW + 20 || arr.y < -20 || arr.y > canvasH + 20) {
            arrows.splice(i, 1);
          }
        }
      }

      ctx.clearRect(0, 0, canvasW, canvasH);

      const skyGrad = ctx.createLinearGradient(0, 0, 0, canvasH);
      skyGrad.addColorStop(0, '#1E1B4B');
      skyGrad.addColorStop(0.5, '#312E81');
      skyGrad.addColorStop(1, '#4C1D95');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvasW, canvasH);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.beginPath();
      ctx.arc(100, 80, 45, 0, Math.PI * 2);
      ctx.arc(150, 70, 60, 0, Math.PI * 2);
      ctx.arc(200, 80, 45, 0, Math.PI * 2);
      ctx.fill();

      balloons.forEach(b => {
        if (b.popped) return;

        ctx.beginPath();
        ctx.moveTo(b.x, b.y + b.radius);
        ctx.lineTo(b.x + Math.sin(b.wobbleTimer) * 10, b.y + b.radius + 40);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(b.x - b.radius * 0.35, b.y - b.radius * 0.35, b.radius * 0.25, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(b.x - 5, b.y + b.radius);
        ctx.lineTo(b.x + 5, b.y + b.radius);
        ctx.lineTo(b.x, b.y + b.radius + 6);
        ctx.closePath();
        ctx.fillStyle = b.color;
        ctx.fill();

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

      for (let i = 0; i < arrows.length; i++) {
        const arr = arrows[i];
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
      }

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
  }, [questions, userAnswers, viewState]);

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

  const handleNextQuestionModal = () => {
    setActiveQuestion(null);
    setSelectedOption(null);
    setHasAnsweredModal(false);

    const updatedAnswersCount = Object.keys(userAnswers).length;
    if (updatedAnswersCount >= questions.length) {
      if (soundRef.current) soundRef.current.playFanfare();
      setViewState('result');
      setTimeout(() => renderDigitalCertificate(), 100);
    } else {
      isPausedRef.current = false;
    }
  };

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

    ctxCert.fillStyle = '#FFFDF5';
    ctxCert.fillRect(0, 0, w, h);

    ctxCert.strokeStyle = '#D97706';
    ctxCert.lineWidth = 14;
    ctxCert.strokeRect(20, 20, w - 40, h - 40);

    ctxCert.strokeStyle = '#1E3A8A';
    ctxCert.lineWidth = 3;
    ctxCert.strokeRect(34, 34, w - 68, h - 68);

    ctxCert.fillStyle = '#B45309';
    ctxCert.font = 'bold 36px "Fredoka", sans-serif';
    ctxCert.textAlign = 'center';
    ctxCert.fillText('🇲🇨 SERTIFIKAT PENGHARGAAN 🇲🇨', w / 2, 95);

    ctxCert.fillStyle = '#1E3A8A';
    ctxCert.font = 'bold 16px "Nunito", sans-serif';
    ctxCert.fillText(`PETUALANGAN EDUKASI ${subject.toUpperCase()}`, w / 2, 125);
    ctxCert.fillText(`Materi Pokok: ${material}`, w / 2, 148);

    ctxCert.strokeStyle = '#D97706';
    ctxCert.lineWidth = 2;
    ctxCert.beginPath();
    ctxCert.moveTo(w / 2 - 250, 170);
    ctxCert.lineTo(w / 2 + 250, 170);
    ctxCert.stroke();

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
    ctxCert.fillText(`Telah berhasil menuntaskan ${questions.length} tantangan memanah balon soal interaktif`, w / 2, 370);
    ctxCert.fillText('dan menguasai konsep materi dengan hasil:', w / 2, 398);

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

  const handleQuickShoot = () => {
    if (!canvasRef.current || isPausedRef.current) return;
    const canvasW = canvasRef.current.width || 800;
    const clickEvent = new PointerEvent('pointerdown', {
      clientX: canvasRef.current.getBoundingClientRect().left + canvasW / 2,
      clientY: canvasRef.current.getBoundingClientRect().top + 100
    });
    canvasRef.current.dispatchEvent(clickEvent);
  };

  const remainingQuestionsCount = questions.length - Object.keys(userAnswers).length;

  return (
    <div className="w-full min-h-screen bg-slate-900 text-white font-['Fredoka','Nunito',sans-serif] flex flex-col justify-between">
      
      <header className="w-full bg-indigo-900/90 backdrop-blur border-b-4 border-yellow-400 py-2.5 px-4 sticky top-0 z-40 shadow-lg">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-yellow-400 to-amber-300 flex items-center justify-center text-2xl shadow-inner border-2 border-white">
              🎈
            </div>
            <div>
              <h1 className="text-base sm:text-xl font-bold tracking-wide text-yellow-300 leading-tight uppercase">
                {subject || 'BALLOON ARCHERY QUEST'}
              </h1>
              <p className="text-xs text-indigo-200 font-semibold tracking-wider">
                Materi: {material || 'Materi Pokok'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            {studentInfo && (
              <div className="hidden sm:flex items-center bg-indigo-950/70 px-3 py-1 rounded-full border border-indigo-400/40 text-xs text-cyan-200">
                👤 <span className="ml-1 font-bold text-white max-w-[120px] truncate">{studentInfo.name}</span>
                <span className="ml-1 bg-yellow-400 text-indigo-900 px-1.5 py-0.2 rounded font-black text-[10px]">{studentInfo.studentClass}</span>
              </div>
            )}
            <div className="flex items-center bg-yellow-500 text-indigo-950 px-3 py-1 rounded-full font-black text-sm shadow-md border-2 border-white">
              ⭐ <span className="ml-1 text-base">{score}</span>
            </div>
            <button
              onClick={toggleSound}
              className="w-9 h-9 rounded-full bg-indigo-700 hover:bg-indigo-600 border-2 border-yellow-300 flex items-center justify-center text-sm shadow transition"
            >
              {soundEnabled ? '🔊' : '🔇'}
            </button>
          </div>
        </div>
      </header>

      {viewState === 'game' && (
        <section className="flex-1 w-full max-w-4xl mx-auto my-3 h-[75vh] min-h-[500px] max-h-[720px] relative bg-purple-950 rounded-3xl overflow-hidden border-4 border-yellow-400 shadow-2xl flex flex-col">
          <div className="w-full bg-indigo-950/70 backdrop-blur px-4 py-2 flex items-center justify-between text-xs sm:text-sm font-bold border-b border-indigo-400/30 z-20">
            <div className="flex items-center space-x-2 text-cyan-200">
              <span>Target Balon Tersisa:</span>
              <span className="bg-yellow-400 text-blue-950 px-2.5 py-0.5 rounded-full font-black text-sm">
                {remainingQuestionsCount}
              </span>
            </div>
            <div className="text-yellow-300 animate-pulse hidden sm:block text-xs">
              🎯 Panah Balon Bernomor Soal!
            </div>
            <div className="text-right text-emerald-300 font-black">
              Soal Terjawab: {Object.keys(userAnswers).length}/{questions.length}
            </div>
          </div>

          <div className="relative flex-1 w-full h-full cursor-crosshair overflow-hidden">
            <canvas ref={canvasRef} className="w-full h-full block" />

            {showToast && (
              <div className={`absolute top-16 inset-x-0 mx-auto w-max max-w-[90%] px-4 py-2 rounded-2xl border-2 shadow-2xl pointer-events-none transition-opacity duration-300 z-30 font-bold text-center text-xs sm:text-sm ${
                isToastWarning ? 'bg-amber-950/95 text-yellow-300 border-yellow-400' : 'bg-indigo-950/95 text-cyan-300 border-sky-400'
              }`}>
                {toastMessage}
              </div>
            )}
          </div>

          <div className="w-full bg-indigo-950/85 backdrop-blur py-2.5 px-4 flex items-center justify-between border-t-2 border-yellow-400/40 z-20">
            <div className="text-xs text-indigo-200 flex items-center space-x-1.5 font-bold">
              <span>🏹 Pemanah Panah Balon</span>
            </div>
            <button
              onClick={handleQuickShoot}
              className="px-5 py-2 rounded-xl btn-3d btn-3d-yellow text-blue-950 text-xs font-black uppercase flex items-center space-x-1"
            >
              <span>Lepas Panah 🎯</span>
            </button>
            <div className="text-xs text-yellow-300 font-bold">
              Target Soal: {questions.length}
            </div>
          </div>
        </section>
      )}

      {/* IN-GAME QUESTION MODAL */}
      {activeQuestion && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 animate-fadeIn">
          <div className="bg-gradient-to-b from-indigo-800 via-purple-800 to-indigo-950 w-full max-w-2xl rounded-3xl border-4 border-yellow-400 shadow-2xl p-5 sm:p-7 relative max-h-[92vh] flex flex-col justify-between overflow-y-auto text-white">
            
            <div className="flex items-center justify-between border-b-2 border-indigo-400/40 pb-3 mb-3">
              <div className="flex items-center space-x-2">
                <span className="w-9 h-9 rounded-xl bg-yellow-400 text-blue-950 flex items-center justify-center font-black text-lg shadow">
                  🎈
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

            <div className="my-2 bg-indigo-950/60 p-4 rounded-2xl border border-sky-400/30 shadow-inner">
              <p className="text-white text-sm sm:text-base leading-relaxed font-semibold">
                {activeQuestion.question}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-3">
              {activeQuestion.options.map((optText, optIdx) => {
                let btnStyle = 'bg-indigo-900/70 hover:bg-purple-700/80 border-indigo-400/50';

                if (hasAnsweredModal) {
                  if (optIdx === activeQuestion.correctAnswer) {
                    btnStyle = 'bg-emerald-600 border-emerald-300 text-white ring-4 ring-emerald-400/50';
                  } else if (optIdx === selectedOption && selectedOption !== activeQuestion.correctAnswer) {
                    btnStyle = 'bg-rose-600 border-rose-300 text-white ring-4 ring-rose-400/50';
                  } else {
                    btnStyle = 'bg-indigo-950/40 border-indigo-900 text-slate-400 opacity-60';
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
              <div className="mt-2 pt-2 border-t border-indigo-400/30 flex justify-end">
                <button
                  onClick={handleNextQuestionModal}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl btn-3d btn-3d-yellow text-blue-950 font-black text-sm uppercase tracking-wider flex items-center justify-center space-x-2"
                >
                  <span>Lanjut Memanah Balon</span>
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
          
          <div className="bg-gradient-to-r from-purple-700 via-indigo-600 to-indigo-800 p-6 rounded-2xl border-2 border-yellow-300 shadow-lg text-white relative overflow-hidden">
            <span className="bg-yellow-400 text-blue-950 text-xs font-black uppercase px-3 py-1 rounded-full shadow">
              Petualangan Tuntas!
            </span>
            <h2 className="text-2xl sm:text-3xl font-black mt-2">Selamat, Seluruh Soal Telah Berhasil Dijawab!</h2>
            <p className="text-purple-100 text-sm mt-1">Kamu telah menyelesaikan {questions.length} soal kuis {subject}.</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 max-w-2xl mx-auto">
              <div className="bg-indigo-950/70 p-3 rounded-xl border border-indigo-400/40">
                <div className="text-xs text-indigo-200">Total Skor</div>
                <div className="text-3xl font-black text-yellow-300">{score}</div>
              </div>
              <div className="bg-indigo-950/70 p-3 rounded-xl border border-indigo-400/40">
                <div className="text-xs text-indigo-200">Jawaban Benar</div>
                <div className="text-3xl font-black text-emerald-400">
                  {Object.values(userAnswers).filter(a => a.isCorrect).length}
                </div>
              </div>
              <div className="bg-indigo-950/70 p-3 rounded-xl border border-indigo-400/40">
                <div className="text-xs text-indigo-200">Jawaban Salah</div>
                <div className="text-3xl font-black text-rose-400">
                  {questions.length - Object.values(userAnswers).filter(a => a.isCorrect).length}
                </div>
              </div>
              <div className="bg-indigo-950/70 p-3 rounded-xl border border-indigo-400/40">
                <div className="text-xs text-indigo-200">Predikat</div>
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

          {showReviewAccordion && (
            <div className="text-left bg-slate-950 p-4 sm:p-6 rounded-2xl border border-indigo-500/40 space-y-4">
              <h3 className="text-lg font-black text-yellow-300 border-b border-indigo-500/30 pb-2">
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

      <footer className="w-full bg-indigo-950 py-2 text-center text-xs text-indigo-300 border-t border-indigo-800 mt-4">
        {subject} &bull; {material}
      </footer>
    </div>
  );
}
