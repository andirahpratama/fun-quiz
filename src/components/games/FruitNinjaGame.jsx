import React, { useEffect, useRef, useState } from 'react';

export default function FruitNinjaGame({
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
    const fruitIcons = ['🍉', '🍊', '🍎', '🍍', '🍓', '🍇', '🍐'];

    // Fruit physics objects
    let fruits = activeQuestions.map((q, idx) => {
      const icon = fruitIcons[idx % fruitIcons.length];
      return {
        id: q.id,
        number: q.questionNumber,
        icon,
        x: Math.random() * (canvas.width - 200) + 100,
        y: canvas.height + 50 + idx * 70,
        radius: 38,
        vx: (Math.random() - 0.5) * 4,
        vy: -(12 + Math.random() * 5),
        gravity: 0.28,
        sliced: false,
      };
    });

    // Blade swipe trail points
    let bladeTrail = [];
    let isSwiping = false;

    let animationFrameId;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dojo Background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#1e1b4b');
      gradient.addColorStop(0.5, '#311b92');
      gradient.addColorStop(1, '#0f172a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Wooden Wall Texture Lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 2;
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Update & Draw Fruits
      fruits.forEach((f) => {
        if (f.sliced) return;

        // Gravity arc physics
        f.vy += f.gravity;
        f.x += f.vx;
        f.y += f.vy;

        // Bounce horizontally if hitting edges
        if (f.x < f.radius || f.x > canvas.width - f.radius) {
          f.vx = -f.vx;
        }

        // Relaunch fruit if it falls past bottom
        if (f.y > canvas.height + 100 && f.vy > 0) {
          f.y = canvas.height + 50;
          f.x = Math.random() * (canvas.width - 200) + 100;
          f.vy = -(12 + Math.random() * 5);
          f.vx = (Math.random() - 0.5) * 4;
        }

        // Fruit Glow Circle
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(244, 63, 94, 0.15)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(251, 113, 133, 0.6)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Fruit Emoji Icon
        ctx.font = '36px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(f.icon, f.x, f.y - 4);

        // Question Number Label Tag
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Outfit, sans-serif';
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 5;
        ctx.fillText(`Soal ${f.number}`, f.x, f.y + 30);
        ctx.shadowBlur = 0;
      });

      // Draw Glowing Blade Trail
      if (bladeTrail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(bladeTrail[0].x, bladeTrail[0].y);
        for (let i = 1; i < bladeTrail.length; i++) {
          ctx.lineTo(bladeTrail[i].x, bladeTrail[i].y);
        }
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.shadowColor = '#0284c7';
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Age out blade trail points
      bladeTrail = bladeTrail.filter((p) => Date.now() - p.time < 180);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Check Slice Collisions
    const checkSlice = (x, y) => {
      bladeTrail.push({ x, y, time: Date.now() });

      fruits.forEach((f) => {
        if (f.sliced) return;
        const dist = Math.hypot(x - f.x, y - f.y);
        if (dist <= f.radius + 15) {
          f.sliced = true;
          const selectedQuestion = questions.find(q => q.id === f.id);
          if (selectedQuestion) {
            onTargetHit(selectedQuestion);
          }
        }
      });
    };

    const handlePointerDown = (e) => {
      isSwiping = true;
      const rect = canvas.getBoundingClientRect();
      checkSlice(e.clientX - rect.left, e.clientY - rect.top);
    };

    const handlePointerMove = (e) => {
      if (!isSwiping && e.buttons !== 1) return;
      const rect = canvas.getBoundingClientRect();
      checkSlice(e.clientX - rect.left, e.clientY - rect.top);
    };

    const handlePointerUp = () => {
      isSwiping = false;
    };

    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('resize', updateSize);
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerup', handlePointerUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [questions, answeredQuestionIds]);

  return (
    <div className="game-container">
      <canvas ref={canvasRef} className="w-full h-full cursor-crosshair touch-none" />
      <div className="absolute top-4 left-4 pointer-events-none bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700 flex items-center gap-2">
        <span className="text-xl">🍉</span>
        <span className="text-xs font-bold text-slate-200">
          Potong / Usap (Swipe) Buah Nomor Soal untuk menjawab!
        </span>
      </div>
    </div>
  );
}
