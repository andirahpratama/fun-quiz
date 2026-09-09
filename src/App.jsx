import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AuthScreen from './components/AuthScreen';
import TeacherDashboard from './components/TeacherDashboard';
import StudentPlayModal from './components/StudentPlayModal';
import QuestionModal from './components/QuestionModal';
import CertificateResult from './components/CertificateResult';

// Game Engines
import BalloonGame from './components/games/BalloonGame';
import FishingGame from './components/games/FishingGame';
import CatchBallGame from './components/games/CatchBallGame';
import FruitNinjaGame from './components/games/FruitNinjaGame';

import { api } from './lib/supabase';
import { Clock } from 'lucide-react';

export default function App() {
  // User Auth state
  const [currentUser, setCurrentUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Active view tab for Teacher Dashboard: 'create' | 'quizzes' | 'results'
  const [activeTab, setActiveTab] = useState('create');

  // Active Quiz Playing state (for student or test mode)
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [studentInfo, setStudentInfo] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);

  // Gameplay state
  const [timeLeft, setTimeLeft] = useState(0);
  const [answeredQuestionIds, setAnsweredQuestionIds] = useState([]);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [currentQuestionModal, setCurrentQuestionModal] = useState(null);
  const [completedResult, setCompletedResult] = useState(null);

  // Initial Auth & URL Param Check
  useEffect(() => {
    initApp();
  }, []);

  const initApp = async () => {
    // 1. Fetch current logged-in user
    try {
      const user = await api.getCurrentUser();
      if (user) {
        setCurrentUser(user);
      }
    } catch (e) {
      console.log('No active user session');
    } finally {
      setAuthChecked(true);
    }

    // 2. Parse URL parameter ?quiz=<code_or_id> for student share links
    const params = new URLSearchParams(window.location.search);
    const quizCode = params.get('quiz');
    if (quizCode) {
      loadQuizForStudent(quizCode);
    }
  };

  const loadQuizForStudent = async (code) => {
    try {
      const quiz = await api.getQuizByIdOrCode(code);
      if (quiz) {
        setActiveQuiz(quiz);
        setTimeLeft(quiz.duration_seconds || 300);
      } else {
        alert('Kuis tidak ditemukan atau link sudah tidak berlaku.');
      }
    } catch (e) {
      console.error('Error fetching quiz link:', e);
    }
  };

  // Auth Handlers
  const handleLogin = async (credentials) => {
    const user = await api.loginUser(credentials);
    setCurrentUser(user);
  };

  const handleRegister = async (data) => {
    const user = await api.registerUser(data);
    setCurrentUser(user);
  };

  const handleLogout = async () => {
    await api.logoutUser();
    setCurrentUser(null);
    handleResetToHome();
  };

  // Student Gameplay Handlers
  const handleStartGame = (info) => {
    setStudentInfo(info);
    setGameStarted(true);
    setAnsweredQuestionIds([]);
    setCorrectAnswersCount(0);
  };

  // Timer Countdown Effect
  useEffect(() => {
    if (!gameStarted || !activeQuiz || completedResult) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, activeQuiz, completedResult]);

  // Target Hit in Mini-Game
  const handleTargetHit = (question) => {
    setCurrentQuestionModal(question);
  };

  // Answer Submitted in Question Modal
  const handleAnswerSelected = (questionId, isCorrect) => {
    setCurrentQuestionModal(null);
    const updatedAnswered = [...answeredQuestionIds, questionId];
    setAnsweredQuestionIds(updatedAnswered);

    if (isCorrect) {
      setCorrectAnswersCount(prev => prev + 1);
    }

    if (updatedAnswered.length >= activeQuiz.questions.length) {
      finishGame(updatedAnswered, isCorrect ? correctAnswersCount + 1 : correctAnswersCount);
    }
  };

  // Finish Game & Calculate Score
  const finishGame = async (finalAnswered = answeredQuestionIds, finalCorrect = correctAnswersCount) => {
    if (!activeQuiz || !studentInfo) return;

    const totalQuestions = activeQuiz.questions.length;
    const score = Math.round((finalCorrect / totalQuestions) * 100);
    const timeSpent = activeQuiz.duration_seconds - timeLeft;

    const resultPayload = {
      quiz_id: activeQuiz.id,
      teacher_id: activeQuiz.user_id,
      teacher_name: activeQuiz.teacher_name,
      student_name: studentInfo.name,
      student_class: studentInfo.studentClass,
      subject: activeQuiz.subject,
      material: activeQuiz.material,
      score,
      correct_count: finalCorrect,
      total_questions: totalQuestions,
      time_spent_seconds: timeSpent,
    };

    try {
      const savedResult = await api.saveQuizResult(resultPayload);
      setCompletedResult(savedResult);
    } catch (e) {
      console.error('Error saving quiz result:', e);
      setCompletedResult(resultPayload);
    }
  };

  const handleResetToHome = () => {
    setActiveQuiz(null);
    setStudentInfo(null);
    setGameStarted(false);
    setCompletedResult(null);
    window.history.pushState({}, document.title, window.location.pathname);
  };

  const formatTimer = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    const pad = (num) => String(num).padStart(2, '0');
    return `${hrs > 0 ? pad(hrs) + ':' : ''}${pad(mins)}:${pad(secs)}`;
  };

  const renderGameEngine = () => {
    if (!activeQuiz) return null;

    const props = {
      questions: activeQuiz.questions,
      answeredQuestionIds,
      onTargetHit: handleTargetHit,
      gameTimeLeft: timeLeft,
    };

    switch (activeQuiz.game_type) {
      case 'balloon':
        return <BalloonGame {...props} />;
      case 'fishing':
        return <FishingGame {...props} />;
      case 'catch_ball':
        return <CatchBallGame {...props} />;
      case 'fruit_ninja':
      default:
        return <FruitNinjaGame {...props} />;
    }
  };

  // 1. If student opened a share link (`?quiz=...`), show student game play mode directly!
  if (activeQuiz) {
    if (completedResult) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
          <CertificateResult
            resultData={completedResult}
            teacherName={activeQuiz?.teacher_name || currentUser?.name}
            onPlayAgain={handleResetToHome}
          />
        </div>
      );
    }

    if (!gameStarted) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
          <StudentPlayModal
            quiz={activeQuiz}
            onStartGame={handleStartGame}
          />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-4">
        <div className="max-w-5xl mx-auto mb-4 flex items-center justify-between modern-glass p-4">
          <div>
            <span className="text-lg font-bold text-indigo-400">{activeQuiz.subject}</span>
            <p className="text-xs text-slate-400">Siswa: {studentInfo.name} ({studentInfo.studentClass})</p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
            <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="font-mono text-lg font-black text-amber-400">
              {formatTimer(timeLeft)}
            </span>
          </div>
        </div>

        {renderGameEngine()}

        <QuestionModal
          question={currentQuestionModal}
          onAnswerSelected={handleAnswerSelected}
          onClose={() => setCurrentQuestionModal(null)}
        />
      </div>
    );
  }

  // 2. MANDATORY LOGIN FIRST WORKFLOW: If not logged in, force AuthScreen!
  if (!currentUser) {
    return (
      <AuthScreen
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    );
  }

  // 3. Logged In User: Access Main Application Dashboard
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar
        user={currentUser}
        onOpenAuth={() => {}}
        onLogout={handleLogout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onResetToHome={handleResetToHome}
      />

      <main className="flex-1">
        <TeacherDashboard
          user={currentUser}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onPlayCreatedQuiz={(quiz) => {
            setActiveQuiz(quiz);
            setTimeLeft(quiz.duration_seconds || 300);
          }}
        />
      </main>

      <footer className="py-6 border-t border-slate-900 text-center text-xs text-slate-500">
        <p>© 2026 Fun Quiz - Platform Game Edukasi SMP Interaktif.</p>
      </footer>
    </div>
  );
}
