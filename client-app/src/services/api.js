import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5298/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle unauthorized redirects or tokens clearance
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // optional: window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const liveAuthApi = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  register: async (name, email, phone, password, role) => {
    const response = await api.post('/auth/register', { name, email, phone, password, role });
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

const liveProfileApi = {
  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },
  updateProfile: async (profileData) => {
    const response = await api.put('/profile', profileData);
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/profile/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  getNotifications: async () => {
    const response = await api.get('/profile/notifications');
    return response.data;
  },
  markNotificationRead: async (id) => {
    const response = await api.put(`/profile/notifications/${id}/read`);
    return response.data;
  },
};

const liveChatApi = {
  getSessions: async () => {
    const response = await api.get('/chat');
    return response.data;
  },
  getSessionDetails: async (sessionId) => {
    const response = await api.get(`/chat/${sessionId}`);
    return response.data;
  },
  createSession: async (title) => {
    const response = await api.post('/chat', { title });
    return response.data;
  },
  sendMessage: async (sessionId, messageText) => {
    const response = await api.post(`/chat/${sessionId}/message`, { messageText });
    return response.data;
  },
  deleteSession: async (sessionId) => {
    const response = await api.delete(`/chat/${sessionId}`);
    return response.data;
  },
  searchHistory: async (query) => {
    const response = await api.get(`/chat/search?query=${encodeURIComponent(query)}`);
    return response.data;
  },
};

const liveResumeApi = {
  analyze: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/resume/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  getHistory: async () => {
    const response = await api.get('/resume');
    return response.data;
  },
  getDetails: async (id) => {
    const response = await api.get(`/resume/${id}`);
    return response.data;
  },
};

const liveInterviewApi = {
  getSessions: async () => {
    const response = await api.get('/interview');
    return response.data;
  },
  getSessionDetails: async (id) => {
    const response = await api.get(`/interview/${id}`);
    return response.data;
  },
  startSession: async (technology) => {
    const response = await api.post('/interview/start', { technology });
    return response.data;
  },
  submitAnswer: async (questionId, answer) => {
    const response = await api.post('/interview/answer', { questionId, answer });
    return response.data;
  },
  completeSession: async (id) => {
    const response = await api.post(`/interview/${id}/complete`);
    return response.data;
  },
};

const liveJobsApi = {
  getRecommendations: async (location) => {
    const url = location ? `/jobs/recommendations?location=${encodeURIComponent(location)}` : '/jobs/recommendations';
    const response = await api.get(url);
    return response.data;
  },
  search: async (query, location, type) => {
    let params = [];
    if (query) params.push(`query=${encodeURIComponent(query)}`);
    if (location) params.push(`location=${encodeURIComponent(location)}`);
    if (type) params.push(`type=${encodeURIComponent(type)}`);
    const qStr = params.length > 0 ? `?${params.join('&')}` : '';
    const response = await api.get(`/jobs/search${qStr}`);
    return response.data;
  },
};

const liveCodeApi = {
  getProblems: async () => {
    const response = await api.get('/code/problems');
    return response.data;
  },
  getProblemDetails: async (id) => {
    const response = await api.get(`/code/problems/${id}`);
    return response.data;
  },
  runCode: async (problemId, language, code) => {
    const response = await api.post('/code/run', { problemId, language, code });
    return response.data;
  },
  submitCode: async (problemId, language, code) => {
    const response = await api.post('/code/submit', { problemId, language, code });
    return response.data;
  },
  getSubmissions: async () => {
    const response = await api.get('/code/submissions');
    return response.data;
  },
};

const liveRoadmapApi = {
  getRoadmap: async () => {
    const response = await api.get('/roadmap');
    return response.data;
  },
  generate: async (targetRole, targetSkills) => {
    const response = await api.post('/roadmap/generate', { targetRole, targetSkills });
    return response.data;
  },
  toggleTask: async (id) => {
    const response = await api.put(`/roadmap/task/${id}/toggle`);
    return response.data;
  },
};

const liveDashboardApi = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },
};

// Determine if we should use Mock API (e.g. if explicitly set, or if running in production without VITE_API_BASE_URL)
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || 
  (window.location.hostname !== 'localhost' && !import.meta.env.VITE_API_BASE_URL);

import {
  mockAuthApi,
  mockProfileApi,
  mockChatApi,
  mockResumeApi,
  mockInterviewApi,
  mockJobsApi,
  mockCodeApi,
  mockRoadmapApi,
  mockDashboardApi
} from './mockApi';

export const authApi = USE_MOCK ? mockAuthApi : liveAuthApi;
export const profileApi = USE_MOCK ? mockProfileApi : liveProfileApi;
export const chatApi = USE_MOCK ? mockChatApi : liveChatApi;
export const resumeApi = USE_MOCK ? mockResumeApi : liveResumeApi;
export const interviewApi = USE_MOCK ? mockInterviewApi : liveInterviewApi;
export const jobsApi = USE_MOCK ? mockJobsApi : liveJobsApi;
export const codeApi = USE_MOCK ? mockCodeApi : liveCodeApi;
export const roadmapApi = USE_MOCK ? mockRoadmapApi : liveRoadmapApi;
export const dashboardApi = USE_MOCK ? mockDashboardApi : liveDashboardApi;

export default api;
