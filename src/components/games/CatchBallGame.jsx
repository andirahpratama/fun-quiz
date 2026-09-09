import React, { useEffect, useRef } from 'react';

export default function CatchBallGame({
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
    const ballColors = ['#e11d48', '#2563eb', '#059669', '#d97706', '#7c3aed', '#0891b2'];

    let balls = activeQuestions.map((q, idx) => {
      return {
        id: q.id,
        number: q.questionNumber,
        x: Math.random() * (canvas.width - 120) + 60,
        y: -50 - idx * 110,
        radius: 34,
        speedY: 1.5 + Math.random() * 1.5,
        color: ballColors[idx % ballColors.length],
        caught: false,
      };
    });

    let animationFrameId;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Night Sky Background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0f172a');
      gradient.addColorStop(1, '#064e3b');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Stadium Lights Effect
      ctx.fillStyle = 'rgba(16, 185, 129, 0.08)';
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height + 100, canvas.width * 0.7, 0, Math.PI, true);
      ctx.fill();

      // Update & Draw Balls
      balls.forEach((b) => {
        if (b.caught) return;

        b.y += b.speedY;

        // Reset to top if reaches bottom
        if (b.y > canvas.height + 50) {
          b.y = -60;
          b.x = Math.random() * (canvas.width - 120) + 60;
        }

        // Outer Glow
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius + 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fill();

        // Ball Body
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Sports ball pattern lines
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius * 0.7, 0, Math.PI);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Question Number Text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0,0,0,0.6)';
        ctx.shadowBlur = 4;
        ctx.fillText(`Soal ${b.number}`, b.x, b.y);
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleCanvasClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      balls.forEach((b) => {
        if (b.caught) return;
        const dist = Math.hypot(clickX - b.x, clickY - b.y);
        if (dist <= b.radius + 15) {
          b.caught = true;
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
      <canvas ref={canvasRef} className="w-full h-full cursor-pointer touch-none" />
      <div className="absolute top-4 left-4 pointer-events-none bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700 flex items-center gap-2">
        <span className="text-xl">⚽</span>
        <span className="text-xs font-bold text-slate-200">
          Tangkap / Klik Bola Jatuh Nomor Soal untuk menjawab!
        </span>
      </div>
    </div>
  );
}
