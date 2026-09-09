-- SQL Schema for Fun Quiz Application (Supabase Database)

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Profiles Table (For Logged In Users / Teachers)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  school_name TEXT,
  subject_specialty TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 3. Quizzes Table
CREATE TABLE IF NOT EXISTS public.quizzes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  teacher_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  material TEXT NOT NULL,
  question_count INT NOT NULL,
  duration_seconds INT NOT NULL,
  game_type TEXT NOT NULL,
  questions JSONB NOT NULL,
  share_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for Quizzes
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Quizzes are viewable by anyone with share link or owner." ON public.quizzes
  FOR SELECT USING (true);

CREATE POLICY "Teachers can insert their own quizzes." ON public.quizzes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Teachers can update their own quizzes." ON public.quizzes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Teachers can delete their own quizzes." ON public.quizzes
  FOR DELETE USING (auth.uid() = user_id);

-- 4. Quiz Results Table (Student Submissions)
CREATE TABLE IF NOT EXISTS public.quiz_results (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE NOT NULL,
  teacher_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  student_name TEXT NOT NULL,
  student_class TEXT NOT NULL,
  subject TEXT NOT NULL,
  material TEXT NOT NULL,
  score INT NOT NULL,
  correct_count INT NOT NULL,
  total_questions INT NOT NULL,
  time_spent_seconds INT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for Quiz Results
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can submit results." ON public.quiz_results
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Teachers can view results for their quizzes." ON public.quiz_results
  FOR SELECT USING (true);

-- Indexing for fast ranking queries
CREATE INDEX IF NOT EXISTS idx_quiz_results_quiz_score ON public.quiz_results (quiz_id, score DESC);
CREATE INDEX IF NOT EXISTS idx_quiz_results_teacher_score ON public.quiz_results (teacher_id, score DESC);
