import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// LocalStorage Helper for offline / standalone mode
const LOCAL_STORAGE_KEYS = {
  USERS: 'funquiz_users',
  CURRENT_USER: 'funquiz_current_user',
  QUIZZES: 'funquiz_quizzes',
  RESULTS: 'funquiz_results',
};

const getFromStorage = (key, defaultVal = []) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultVal;
  } catch (e) {
    console.error('LocalStorage read error:', e);
    return defaultVal;
  }
};

const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }
};

// API Service abstraction
export const api = {
  // Auth: Register
  registerUser: async ({ name, email, password, schoolName, subjectSpecialty }) => {
    if (isSupabaseConfigured && supabase) {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, schoolName, subjectSpecialty }
        }
      });
      if (authError) throw authError;
      
      const user = authData.user;
      if (user) {
        // Upsert profile
        await supabase.from('profiles').upsert([
          {
            id: user.id,
            name,
            email,
            school_name: schoolName || 'SMP',
            subject_specialty: subjectSpecialty || 'Semua Mata Pelajaran',
          }
        ]);
      }
      return user;
    } else {
      // LocalStorage Auth
      const users = getFromStorage(LOCAL_STORAGE_KEYS.USERS, []);
      const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) throw new Error('Email sudah terdaftar! Silakan login.');

      const newUser = {
        id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        name,
        email,
        password,
        school_name: schoolName || 'SMP Negeri 1',
        subjectSpecialty: subjectSpecialty || 'Semua Mata Pelajaran',
        created_at: new Date().toISOString(),
      };
      users.push(newUser);
      saveToStorage(LOCAL_STORAGE_KEYS.USERS, users);
      saveToStorage(LOCAL_STORAGE_KEYS.CURRENT_USER, newUser);
      return newUser;
    }
  },

  // Auth: Login
  loginUser: async ({ email, password }) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      return data.user;
    } else {
      const users = getFromStorage(LOCAL_STORAGE_KEYS.USERS, []);
      const user = users.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      if (!user) throw new Error('Email atau password salah!');
      saveToStorage(LOCAL_STORAGE_KEYS.CURRENT_USER, user);
      return user;
    }
  },

  // Auth: Logout
  logoutUser: async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
    }
  },

  // Auth: Get Current User
  getCurrentUser: async () => {
    if (isSupabaseConfigured && supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      // Get profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      return {
        id: user.id,
        email: user.email,
        name: profile?.name || user.user_metadata?.name || 'Guru SMP',
        school_name: profile?.school_name || 'SMP',
        subject_specialty: profile?.subject_specialty || '',
      };
    } else {
      return getFromStorage(LOCAL_STORAGE_KEYS.CURRENT_USER, null);
    }
  },

  // Quizzes: Create Quiz (Safe Profile Auto-Repair)
  createQuiz: async (quizData) => {
    const shareCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newQuiz = {
      ...quizData,
      share_code: shareCode,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        // Ensure profile exists in Supabase DB first before creating quiz
        if (quizData.user_id) {
          await supabase.from('profiles').upsert([
            {
              id: quizData.user_id,
              name: quizData.teacher_name || 'Guru SMP',
              email: quizData.teacher_email || 'guru@sekolah.sch.id',
              school_name: 'SMP',
              subject_specialty: quizData.subject || '',
            }
          ], { onConflict: 'id' }).select();
        }

        const { data, error } = await supabase
          .from('quizzes')
          .insert([{
            user_id: quizData.user_id,
            teacher_name: quizData.teacher_name,
            subject: quizData.subject,
            material: quizData.material,
            question_count: quizData.question_count,
            duration_seconds: quizData.duration_seconds,
            game_type: quizData.game_type,
            questions: quizData.questions,
            share_code: shareCode,
          }])
          .select()
          .single();
          
        if (error) {
          console.warn('Supabase DB Quiz insert warning, saving locally:', error);
          // Local fallback if Supabase table schema constraint errors
          newQuiz.id = 'quiz_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
          const quizzes = getFromStorage(LOCAL_STORAGE_KEYS.QUIZZES, []);
          quizzes.unshift(newQuiz);
          saveToStorage(LOCAL_STORAGE_KEYS.QUIZZES, quizzes);
          return newQuiz;
        }
        return data;
      } catch (err) {
        console.warn('Fallback saving quiz locally due to:', err);
        newQuiz.id = 'quiz_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
        const quizzes = getFromStorage(LOCAL_STORAGE_KEYS.QUIZZES, []);
        quizzes.unshift(newQuiz);
        saveToStorage(LOCAL_STORAGE_KEYS.QUIZZES, quizzes);
        return newQuiz;
      }
    } else {
      newQuiz.id = 'quiz_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
      const quizzes = getFromStorage(LOCAL_STORAGE_KEYS.QUIZZES, []);
      quizzes.unshift(newQuiz);
      saveToStorage(LOCAL_STORAGE_KEYS.QUIZZES, quizzes);
      return newQuiz;
    }
  },

  // Quizzes: Get User's Quizzes
  getUserQuizzes: async (userId) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('quizzes')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (e) {
        console.error('Supabase fetch quizzes fallback');
      }
      const quizzes = getFromStorage(LOCAL_STORAGE_KEYS.QUIZZES, []);
      return quizzes.filter(q => q.user_id === userId);
    } else {
      const quizzes = getFromStorage(LOCAL_STORAGE_KEYS.QUIZZES, []);
      return quizzes.filter(q => q.user_id === userId);
    }
  },

  // Quizzes: Get Quiz By ID or Share Code
  getQuizByIdOrCode: async (identifier) => {
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase.from('quizzes').select('*');
        if (identifier.length > 15 && identifier.includes('-')) {
          query = query.eq('id', identifier);
        } else {
          query = query.eq('share_code', identifier.toUpperCase());
        }
        const { data, error } = await query.maybeSingle();
        if (data) return data;
      } catch (e) {
        console.log('Supabase quiz lookup fallback');
      }
      const quizzes = getFromStorage(LOCAL_STORAGE_KEYS.QUIZZES, []);
      return quizzes.find(
        q => q.id === identifier || (q.share_code && q.share_code.toUpperCase() === identifier.toUpperCase())
      ) || null;
    } else {
      const quizzes = getFromStorage(LOCAL_STORAGE_KEYS.QUIZZES, []);
      return quizzes.find(
        q => q.id === identifier || (q.share_code && q.share_code.toUpperCase() === identifier.toUpperCase())
      ) || null;
    }
  },

  // Quizzes: Delete Quiz
  deleteQuiz: async (quizId, userId) => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('quizzes')
          .delete()
          .eq('id', quizId)
          .eq('user_id', userId);
      } catch (e) {
        console.error('Delete quiz fallback');
      }
    }
    let quizzes = getFromStorage(LOCAL_STORAGE_KEYS.QUIZZES, []);
    quizzes = quizzes.filter(q => q.id !== quizId);
    saveToStorage(LOCAL_STORAGE_KEYS.QUIZZES, quizzes);
  },

  // Results: Save Student Submission
  saveQuizResult: async (resultData) => {
    const resultObj = {
      ...resultData,
      completed_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('quiz_results')
          .insert([{
            quiz_id: resultData.quiz_id.includes('-') ? resultData.quiz_id : null,
            teacher_id: resultData.teacher_id,
            student_name: resultData.student_name,
            student_class: resultData.student_class,
            subject: resultData.subject,
            material: resultData.material,
            score: resultData.score,
            correct_count: resultData.correct_count,
            total_questions: resultData.total_questions,
            time_spent_seconds: resultData.time_spent_seconds,
          }])
          .select()
          .single();
        if (!error && data) return data;
      } catch (e) {
        console.warn('Saving result fallback locally');
      }
    }

    resultObj.id = 'res_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    const results = getFromStorage(LOCAL_STORAGE_KEYS.RESULTS, []);
    results.push(resultObj);
    saveToStorage(LOCAL_STORAGE_KEYS.RESULTS, results);
    return resultObj;
  },

  // Results: Get Results for a Teacher
  getTeacherResults: async (teacherId) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('quiz_results')
          .select('*')
          .eq('teacher_id', teacherId)
          .order('score', { ascending: false });
        if (!error && data) return data;
      } catch (e) {
        console.error('Fetch teacher results fallback');
      }
    }
    const results = getFromStorage(LOCAL_STORAGE_KEYS.RESULTS, []);
    const teacherResults = results.filter(r => r.teacher_id === teacherId);
    return teacherResults.sort((a, b) => b.score - a.score);
  }
};
