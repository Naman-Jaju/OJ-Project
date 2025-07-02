export interface User {
    id : string;
    name: string;
    email: string;
    provider?: 'email' | 'google' | 'github';
    createdAt: string;
    updatedAt: string;
}

export interface Question {
    id: string;
    title: string;
    description: string;
    tags: string[];
    difficulty: 'easy' | 'medium' | 'hard';
    constraints: string[];
    examples: Example[];
    acceptedSubmissions: number;
    timeLimit: number; // in seconds
    memoryLimit: number; // in MB
    totalSubmissions: number;
    createdAt: string;
    updatedAt: string;
}

export interface Example {
    input: string;
    output: string;
    explanation?: string;
}


export interface Submission{
    id: string;
    userId: string;
    questionId: string;
    code: string;
    language: 'javascript' | 'python' | 'cpp';
    status: 'pending' | 'accepted' | 'wrong-answer' | 'time-limit-exceeded' | 'memory-limit-exceeded' | 'runtime-error' | 'compilation-error';
    runtime?: number;
    memory?: number;
    testCasesPassed?: number;
    totalTestCases?: number;
    submittedAt: Date;
}

export interface QuestionsState {
  questions: Question[];
  currentQuestion: Question | null;
  submissions: Submission[];
  isLoading: boolean;
  error: string | null;
  filters: {
    difficulty: string[];
    tags: string[];
    status: string[];
  };
}
export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

export interface Contest {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  questions: string[]; // question IDs
  participants: string[]; // user IDs
  isPublic: boolean;
  createdBy: string;
  createdAt: Date;
}