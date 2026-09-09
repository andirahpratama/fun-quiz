import React, { useEffect, useRef } from 'react';

export default function FishingGame({
  questions,
  answeredQuestionIds,
  onTargetHit,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const updateSize = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    const activeQuestions = questions.filter(q => !answeredQuestionIds.includes(q.id));
    const fishColors = ['#f97316', '#06b6d4', '#ec4899', '#8b5cf6', '#10b981', '#eab308'];

    let fishes = activeQuestions.map((q, idx) => {
      const direction = Math.random() > 0.5 ? 1 : -1;
      return {
        id: q.id,
        number: q.questionNumber,
        x: Math.random() * (canvas.width - 150) + 75,
        y: 100 + (idx * 65) % (canvas.height - 180),
        width: 80,
        height: 45,
        speed: (1.5 + Math.random() * 1.5) * direction,
        direction,
        color: fishColors[idx % fishColors.length],
        caught: false,
      };
    });

    let animationFrameId;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Deep Sea Background Gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0284c7');
      gradient.addColorStop(0.4, '#0369a1');
      gradient.addColorStop(1, '#0f172a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Water Bubbles
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      for (let i = 0; i < 15; i++) {
        const bx = (i * 90 + Date.now() * 0.02) % canvas.width;
        const by = (canvas.height - ((Date.now() * 0.05 + i * 50) % canvas.height));
        ctx.beginPath();
        ctx.arc(bx, by, (i % 4) + 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Update & Draw Fishes
      fishes.forEach((f) => {
        if (f.caught) return;

        f.x += f.speed;

        // Bounce at edges
        if (f.x > canvas.width - 60) {
          f.speed = -Math.abs(f.speed);
          f.direction = -1;
        } else if (f.x < 60) {
          f.speed = Math.abs(f.speed);
          f.direction = 1;
        }

        ctx.save();
        ctx.translate(f.x, f.y);
        if (f.direction === -1) {
          ctx.scale(-1, 1);
        }

        // Draw Fish Tail
        ctx.beginPath();
        ctx.moveTo(-f.width / 2, 0);
        ctx.lineTo(-f.width / 2 - 25, -18);
        ctx.lineTo(-f.width / 2 - 25, 18);
        ctx.closePath();
        ctx.fillStyle = f.color;
        ctx.fill();

        // Draw Fish Body
        ctx.beginPath();
        ctx.ellipse(0, 0, f.width / 2, f.height / 2, 0, 0, Math.PI * 2);
        ctx.fillStyle = f.color;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Draw Fish Eye
        ctx.beginPath();
        ctx.arc(f.width / 4, -8, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(f.width / 4 + 1.5, -8, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#000000';
        ctx.fill();

        // Restore context before drawing text (so text isn't flipped)
        ctx.restore();

        // Draw Question Label
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 18px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0,0,0,0.7)';
        ctx.shadowBlur = 4;
        ctx.fillText(`Soal ${f.number}`, f.x, f.y);
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleCanvasClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      fishes.forEach((f) => {
        if (f.caught) return;
        const dist = Math.hypot(clickX - f.x, clickY - f.y);
        if (dist <= f.width / 2 + 15) {
          f.caught = true;
          const selectedQuestion = questions.find(q => q.id === f.id);
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
      <canvas ref={canvasRef} className="w-full h-full cursor-pointer touch-none" />
      <div className="absolute top-4 left-4 pointer-events-none bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700 flex items-center gap-2">
        <span className="text-xl">🎣</span>
        <span className="text-xs font-bold text-slate-200">
          Klik / Pancing Ikan Nomor Soal untuk menjawab!
        </span>
      </div>
    </div>
  );
}
