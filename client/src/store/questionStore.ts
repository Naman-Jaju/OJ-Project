import { create } from 'zustand';
import { Question, Submission, QuestionsState } from './types';

interface QuestionsStore extends QuestionsState {
  // Actions
  fetchQuestions: () => Promise<void>;
  fetchQuestionById: (id: string) => Promise<void>;
  submitSolution: (questionId: string, code: string, language: string) => Promise<void>;
  fetchSubmissions: (questionId?: string) => Promise<void>;
  setCurrentQuestion: (question: Question | null) => void;
  updateFilters: (filters: Partial<QuestionsState['filters']>) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

// Mock data
const mockQuestions: Question[] = [
  {
    id: '1',
    title: 'Two Sum',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    difficulty: 'easy',
    tags: ['Array', 'Hash Table'],
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    timeLimit: 1,
    memoryLimit: 256,
    acceptedSubmissions: 1234567,
    totalSubmissions: 2345678,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    title: 'Add Two Numbers',
    description: 'You are given two non-empty linked lists representing two non-negative integers.',
    difficulty: 'medium',
    tags: ['Linked List', 'Math', 'Recursion'],
    examples: [
      {
        input: 'l1 = [2,4,3], l2 = [5,6,4]',
        output: '[7,0,8]',
        explanation: '342 + 465 = 807.'
      }
    ],
    constraints: [
      'The number of nodes in each linked list is in the range [1, 100].',
      '0 <= Node.val <= 9'
    ],
    timeLimit: 2,
    memoryLimit: 256,
    acceptedSubmissions: 987654,
    totalSubmissions: 1876543,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
  {
    id: '3',
    title: 'Median of Two Sorted Arrays',
    description: 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.',
    difficulty: 'hard',
    tags: ['Array', 'Binary Search', 'Divide and Conquer'],
    examples: [
      {
        input: 'nums1 = [1,3], nums2 = [2]',
        output: '2.00000',
        explanation: 'merged array = [1,2,3] and median is 2.'
      }
    ],
    constraints: [
      'nums1.length == m',
      'nums2.length == n',
      '0 <= m <= 1000',
      '0 <= n <= 1000'
    ],
    timeLimit: 2,
    memoryLimit: 256,
    acceptedSubmissions: 456789,
    totalSubmissions: 1234567,
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
  }
];

// Mock API functions
const mockFetchQuestions = async (): Promise<Question[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockQuestions;
};

const mockFetchQuestionById = async (id: string): Promise<Question> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const question = mockQuestions.find(q => q.id === id);
  if (!question) {
    throw new Error('Question not found');
  }
  return question;
};

const mockSubmitSolution = async (questionId: string, code: string, language: string): Promise<Submission> => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock submission result
  const statuses: Submission['status'][] = ['accepted', 'wrong-answer', 'time-limit-exceeded'];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    questionId,
    userId: 'current-user-id',
    code,
    language,
    status: randomStatus,
    runtime: randomStatus === 'accepted' ? Math.floor(Math.random() * 100) + 50 : undefined,
    memory: randomStatus === 'accepted' ? Math.floor(Math.random() * 50) + 20 : undefined,
    testCasesPassed: randomStatus === 'accepted' ? 10 : Math.floor(Math.random() * 8),
    totalTestCases: 10,
    submittedAt: new Date(),
  };
};

const mockFetchSubmissions = async (questionId?: string): Promise<Submission[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Mock submissions data
  return [
    {
      id: '1',
      questionId: questionId || '1',
      userId: 'current-user-id',
      code: 'def twoSum(nums, target):\n    # Solution code here\n    pass',
      language: 'python',
      status: 'accepted',
      runtime: 68,
      memory: 15.2,
      testCasesPassed: 10,
      totalTestCases: 10,
      submittedAt: new Date(Date.now() - 86400000), // 1 day ago
    },
    {
      id: '2',
      questionId: questionId || '1',
      userId: 'current-user-id',
      code: 'def twoSum(nums, target):\n    # Wrong solution\n    return []',
      language: 'python',
      status: 'wrong-answer',
      testCasesPassed: 3,
      totalTestCases: 10,
      submittedAt: new Date(Date.now() - 172800000), // 2 days ago
    }
  ];
};

export const useQuestionsStore = create<QuestionsStore>((set, get) => ({
  // Initial state
  questions: [],
  currentQuestion: null,
  submissions: [],
  isLoading: false,
  error: null,
  filters: {
    difficulty: [],
    tags: [],
    status: [],
  },

  // Actions
  fetchQuestions: async () => {
    set({ isLoading: true, error: null });
    try {
      const questions = await mockFetchQuestions();
      set({ questions, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch questions',
        isLoading: false 
      });
    }
  },

  fetchQuestionById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const question = await mockFetchQuestionById(id);
      set({ currentQuestion: question, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch question',
        isLoading: false 
      });
    }
  },

  submitSolution: async (questionId: string, code: string, language: string) => {
    set({ isLoading: true, error: null });
    try {
      const submission = await mockSubmitSolution(questionId, code, language);
      const currentSubmissions = get().submissions;
      set({ 
        submissions: [submission, ...currentSubmissions],
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to submit solution',
        isLoading: false 
      });
      throw error;
    }
  },

  fetchSubmissions: async (questionId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const submissions = await mockFetchSubmissions(questionId);
      set({ submissions, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch submissions',
        isLoading: false 
      });
    }
  },

  setCurrentQuestion: (question: Question | null) => {
    set({ currentQuestion: question });
  },

  updateFilters: (newFilters: Partial<QuestionsState['filters']>) => {
    const currentFilters = get().filters;
    set({ 
      filters: { 
        ...currentFilters, 
        ...newFilters 
      } 
    });
  },

  clearError: () => {
    set({ error: null });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));