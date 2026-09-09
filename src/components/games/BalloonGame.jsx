import React, { useEffect, useRef, useState } from 'react';
import { Target, Sparkles, Volume2 } from 'lucide-react';

export default function BalloonGame({
  questions,
  answeredQuestionIds,
  onTargetHit,
  gameTimeLeft
}) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Resize canvas
    const updateSize = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    // Filter un-answered questions
    const activeQuestions = questions.filter(q => !answeredQuestionIds.includes(q.id));

    // Colors for balloons
    const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

    // Create Balloon Objects
    let balloons = activeQuestions.map((q, idx) => {
      return {
        id: q.id,
        number: q.questionNumber,
        x: Math.random() * (canvas.width - 100) + 50,
        y: canvas.height + 50 + idx * 80,
        radius: 36,
        speedY: 1.2 + Math.random() * 1.5,
        speedX: (Math.random() - 0.5) * 1.2,
        color: colors[idx % colors.length],
        popped: false,
        stringLength: 45,
      };
    });

    let animationFrameId;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Sky Background Gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0f172a');
      gradient.addColorStop(0.5, '#1e1b4b');
      gradient.addColorStop(1, '#311b92');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw subtle cloud/star accents
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      for (let i = 0; i < 20; i++) {
        const sx = (i * 77) % canvas.width;
        const sy = (i * 43) % (canvas.height * 0.7);
        ctx.beginPath();
        ctx.arc(sx, sy, (i % 3) + 1, 0, Math.PI * 2);
        ctx.fill();
      }

      // Update and Draw Balloons
      balloons.forEach((b) => {
        if (b.popped) return;

        // Physics move upward
        b.y -= b.speedY;
        b.x += Math.sin(b.y / 30) * b.speedX;

        // Reset if balloon goes past top
        if (b.y < -60) {
          b.y = canvas.height + 60;
          b.x = Math.random() * (canvas.width - 100) + 50;
        }

        // Draw String
        ctx.beginPath();
        ctx.moveTo(b.x, b.y + b.radius);
        ctx.lineTo(b.x + Math.sin(b.y / 20) * 8, b.y + b.radius + b.stringLength);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw Balloon Body
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Balloon Highlight Glow
        ctx.beginPath();
        ctx.arc(b.x - b.radius * 0.3, b.y - b.radius * 0.3, b.radius * 0.25, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fill();

        // Balloon Knot
        ctx.beginPath();
        ctx.moveTo(b.x - 6, b.y + b.radius);
        ctx.lineTo(b.x + 6, b.y + b.radius);
        ctx.lineTo(b.x, b.y + b.radius + 6);
        ctx.closePath();
        ctx.fillStyle = b.color;
        ctx.fill();

        // Question Number Text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 22px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 4;
        ctx.fillText(`Soal ${b.number}`, b.x, b.y);
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Click / Touch Handler to Pop Balloon
    const handleCanvasClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      balloons.forEach((b) => {
        if (b.popped) return;
        const dist = Math.hypot(clickX - b.x, clickY - b.y);
        if (dist <= b.radius + 10) {
          b.popped = true;
          // Trigger Question Callback
          const selectedQuestion = questions.find(q => q.id === b.id);
          if (selectedQuestion) {
            onTargetHit(selectedQuestion);
          }
        }
      });
    };

    canvas.addEventListener('pointerdown', handleCanvasClick);

    return () => {
      window.removeEventListener('resize', updateSize);
      canvas.removeEventListener('pointerdown', handleCanvasClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, [questions, answeredQuestionIds]);

  return (
    <div className="game-container">
      <canvas ref={canvasRef} className="w-full h-full cursor-crosshair touch-none" />
      <div className="absolute top-4 left-4 pointer-events-none bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700 flex items-center gap-2">
        <span className="text-xl">🎯</span>
        <span className="text-xs font-bold text-slate-200">
          Klik / Panah Balon Soal untuk menjawab!
        </span>
      </div>
    </div>
  );
}
