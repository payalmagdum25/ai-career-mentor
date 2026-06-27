// High-fidelity Mock API Client using localStorage
// Automatically runs when the application is hosted online without a running backend.

const delay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

// Retrieve or initialize data in localStorage
const getStorageItem = (key, defaultValue) => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  return JSON.parse(data);
};

const setStorageItem = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Seed Data
const defaultProblems = [
  { id: 1, title: 'Two Sum', difficulty: 'Easy', topic: 'Arrays', description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.', template: 'function twoSum(nums, target) {\n  // Write your code here\n}' },
  { id: 2, title: 'Valid Parentheses', difficulty: 'Easy', topic: 'Stacks', description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.', template: 'function isValid(s) {\n  // Write your code here\n}' },
  { id: 3, title: 'Reverse Linked List', difficulty: 'Easy', topic: 'Linked List', description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.', template: 'function reverseList(head) {\n  // Write your code here\n}' },
  { id: 4, title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', topic: 'Sliding Window', description: 'Given a string s, find the length of the longest substring without repeating characters.', template: 'function lengthOfLongestSubstring(s) {\n  // Write your code here\n}' }
];

const defaultJobs = [
  { id: 1, title: 'Associate Software Engineer', company: 'Google', location: 'Mountain View, CA / Remote', salary: '$120,000 - $150,000', description: 'Join the Google Core infrastructure team to build robust services.', type: 'Full-time', postedDate: new Date().toISOString() },
  { id: 2, title: 'Frontend Developer', company: 'Meta', location: 'New York, NY / Hybrid', salary: '$130,000 - $160,000', description: 'Work on cutting edge React and Web Technologies for WhatsApp and Instagram.', type: 'Full-time', postedDate: new Date().toISOString() },
  { id: 3, title: 'Software Engineering Intern', company: 'Netflix', location: 'Los Gatos, CA / Remote', salary: '$45 - $60 / hour', description: 'Help build premium consumer experiences on smart TVs.', type: 'Internship', postedDate: new Date().toISOString() },
  { id: 4, title: 'Junior Full-Stack Developer', company: 'TCS', location: 'Mumbai, India', salary: '₹6,00,000 - ₹8,00,000', description: 'Participate in large-scale enterprise application delivery.', type: 'Full-time', postedDate: new Date().toISOString() }
];

const defaultRoadmap = [
  { id: 1, title: 'Master JavaScript Fundamentals', targetRole: 'Frontend Developer', targetSkills: 'React, JS', completed: true },
  { id: 2, title: 'Learn Data Structures & Algorithms', targetRole: 'Frontend Developer', targetSkills: 'React, JS', completed: false },
  { id: 3, title: 'Build 3 Glassmorphic React Apps', targetRole: 'Frontend Developer', targetSkills: 'React, JS', completed: false },
  { id: 4, title: 'Solve 20 Coding Challenges', targetRole: 'Frontend Developer', targetSkills: 'React, JS', completed: false },
  { id: 5, title: 'Mock Interview Prep & Resume ATS Optimization', targetRole: 'Frontend Developer', targetSkills: 'React, JS', completed: false }
];

const defaultNotifications = [
  { id: 1, message: 'Welcome to your AI Career Mentor dashboard! Start by uploading your resume.', isRead: false, createdAt: new Date().toISOString() },
  { id: 2, message: 'Check out today\'s recommended job opening: Software Engineer at Google.', isRead: false, createdAt: new Date().toISOString() }
];

// Helper database initialization
const initDb = () => {
  getStorageItem('mock_users', [
    { id: 1, name: 'Jane Doe', email: 'jane@example.com', phone: '1234567890', password: 'password', role: 'Student' }
  ]);
  getStorageItem('mock_problems', defaultProblems);
  getStorageItem('mock_jobs', defaultJobs);
  getStorageItem('mock_roadmap', defaultRoadmap);
  getStorageItem('mock_notifications', defaultNotifications);
  getStorageItem('mock_sessions', []);
  getStorageItem('mock_interviews', []);
  getStorageItem('mock_resumes', []);
};

initDb();

// Mock API implementations
export const mockAuthApi = {
  login: async (email, password) => {
    await delay();
    const users = getStorageItem('mock_users', []);
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) throw new Error('Invalid email or password');
    
    const token = 'mock-jwt-token-' + Math.random().toString(36).substring(2);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return { token, user };
  },
  
  register: async (name, email, phone, password, role) => {
    await delay();
    const users = getStorageItem('mock_users', []);
    if (users.find(u => u.email === email)) throw new Error('Email is already registered');
    
    const newUser = { id: users.length + 1, name, email, phone, password, role };
    users.push(newUser);
    setStorageItem('mock_users', users);
    return { message: 'Registration successful' };
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: async () => {
    await delay(100);
    const user = localStorage.getItem('user');
    if (!user) throw new Error('Unauthorized');
    return JSON.parse(user);
  }
};

export const mockProfileApi = {
  getProfile: async () => {
    await delay(300);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return {
      ...user,
      skills: ['React', 'JavaScript', 'HTML/CSS', 'Git'],
      bio: 'Enthusiastic developer looking for new opportunities in tech.',
      experience: '1 year of self-study and hobby projects.',
      education: 'B.S. in Computer Science (Ongoing)'
    };
  },
  
  updateProfile: async (profileData) => {
    await delay();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const updatedUser = { ...user, ...profileData };
    
    // Update in mock_users list
    const users = getStorageItem('mock_users', []);
    const updatedUsers = users.map(u => u.id === user.id ? { ...u, ...profileData } : u);
    setStorageItem('mock_users', updatedUsers);
    
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return { message: 'Profile updated successfully', user: updatedUser };
  },
  
  uploadImage: async (file) => {
    await delay(1200);
    return { message: 'Profile image updated successfully', imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' };
  },
  
  getNotifications: async () => {
    await delay(200);
    return getStorageItem('mock_notifications', []);
  },
  
  markNotificationRead: async (id) => {
    await delay(100);
    const notifications = getStorageItem('mock_notifications', []);
    const updated = notifications.map(n => n.id === Number(id) ? { ...n, isRead: true } : n);
    setStorageItem('mock_notifications', updated);
    return { success: true };
  }
};

export const mockChatApi = {
  getSessions: async () => {
    await delay(300);
    return getStorageItem('mock_sessions', []);
  },
  
  getSessionDetails: async (sessionId) => {
    await delay(300);
    const sessions = getStorageItem('mock_sessions', []);
    const session = sessions.find(s => s.id === Number(sessionId));
    if (!session) throw new Error('Session not found');
    return session;
  },
  
  createSession: async (title) => {
    await delay(300);
    const sessions = getStorageItem('mock_sessions', []);
    const newSession = {
      id: Date.now(),
      title: title || 'New Career Advice Chat',
      createdAt: new Date().toISOString(),
      messages: [
        { id: 1, sender: 'ai', messageText: 'Hello! I am your AI Career Mentor. I can help you with resume writing, mock interview preparation, learning paths, or job searching. What is on your mind today?', createdAt: new Date().toISOString() }
      ]
    };
    sessions.push(newSession);
    setStorageItem('mock_sessions', sessions);
    return newSession;
  },
  
  sendMessage: async (sessionId, messageText) => {
    await delay(800);
    const sessions = getStorageItem('mock_sessions', []);
    const sessionIndex = sessions.findIndex(s => s.id === Number(sessionId));
    if (sessionIndex === -1) throw new Error('Session not found');
    
    const userMsg = { id: Date.now(), sender: 'user', messageText, createdAt: new Date().toISOString() };
    
    // Simple rule-based AI response generation
    let aiResponseText = "That's a very good question. To succeed in your career, I recommend continuing to practice coding challenges, formatting your resume with action verbs, and building glassmorphism portfolio projects to stand out.";
    
    const lower = messageText.toLowerCase();
    if (lower.includes('resume') || lower.includes('cv')) {
      aiResponseText = "For a high-impact resume, ensure your ATS score is above 80%. Include quantitative achievements (e.g., 'Improved database load time by 30%'), limit formatting to simple columns, and add keywords relevant to the job description.";
    } else if (lower.includes('interview') || lower.includes('mock')) {
      aiResponseText = "Mock interviews are key. I suggest practicing the STAR method (Situation, Task, Action, Result) for behavioral questions, and revising core structures like React components, OOP principles, or Web API architectures.";
    } else if (lower.includes('roadmap') || lower.includes('learn') || lower.includes('path')) {
      aiResponseText = "I can generate a dynamic roadmap for you! Go to the 'Roadmap' tab and input your desired role (e.g. Frontend Developer). I'll outline daily checklists, practice modules, and project challenges.";
    } else if (lower.includes('hello') || lower.includes('hi')) {
      aiResponseText = "Hello! Ready to take your career preparation to the next level? Ask me about job listings, coding challenges, or resume reviews.";
    }
    
    const aiMsg = { id: Date.now() + 1, sender: 'ai', messageText: aiResponseText, createdAt: new Date().toISOString() };
    
    sessions[sessionIndex].messages.push(userMsg, aiMsg);
    setStorageItem('mock_sessions', sessions);
    
    return { userMessage: userMsg, aiMessage: aiMsg };
  },
  
  deleteSession: async (sessionId) => {
    await delay(200);
    const sessions = getStorageItem('mock_sessions', []);
    const filtered = sessions.filter(s => s.id !== Number(sessionId));
    setStorageItem('mock_sessions', filtered);
    return { success: true };
  },
  
  searchHistory: async (query) => {
    await delay(300);
    const sessions = getStorageItem('mock_sessions', []);
    return sessions.filter(s => s.title.toLowerCase().includes(query.toLowerCase()));
  }
};

export const mockResumeApi = {
  analyze: async (file) => {
    await delay(2200); // Realistic parsing delay
    const score = Math.floor(Math.random() * 25) + 65; // 65 - 90
    const mockAnalysis = {
      id: Date.now(),
      fileName: file ? file.name : 'resume.pdf',
      atsScore: score,
      analyzedDate: new Date().toISOString(),
      feedback: {
        structure: score > 75 ? 'Good formatting, clear sections.' : 'Consider using a single-column layout. Avoid sidebars, graphs, or tables as ATS scanners often misread them.',
        keywords: 'Detected React, JavaScript, Git. Missing: Redux, TypeScript, Docker.',
        verbs: 'Good use of action verbs like "developed", "built", "implemented". Try adding metrics (e.g., "by 15%").'
      },
      suggestions: [
        'Add a specialized skills section at the top.',
        'Use the STAR format to detail your bullet points.',
        'Include keyword matches for "Rest APIs" and "State Management".'
      ]
    };
    
    const history = getStorageItem('mock_resumes', []);
    history.push(mockAnalysis);
    setStorageItem('mock_resumes', history);
    
    return mockAnalysis;
  },
  
  getHistory: async () => {
    await delay(400);
    return getStorageItem('mock_resumes', []);
  },
  
  getDetails: async (id) => {
    await delay(300);
    const history = getStorageItem('mock_resumes', []);
    const item = history.find(h => h.id === Number(id));
    if (!item) throw new Error('Analysis report not found');
    return item;
  }
};

export const mockInterviewApi = {
  getSessions: async () => {
    await delay(300);
    return getStorageItem('mock_interviews', []);
  },
  
  getSessionDetails: async (id) => {
    await delay(300);
    const interviews = getStorageItem('mock_interviews', []);
    return interviews.find(i => i.id === Number(id));
  },
  
  startSession: async (technology) => {
    await delay(1000);
    const questions = {
      React: [
        { id: 101, questionText: 'Explain the React virtual DOM and how reconciliation works.', codeSnippet: '' },
        { id: 102, questionText: 'What is the difference between UseState and UseRef hooks? When should you use which?', codeSnippet: '' },
        { id: 103, questionText: 'Explain React Context API and how it prevents prop drilling.', codeSnippet: '' }
      ],
      'C#': [
        { id: 201, questionText: 'Explain the difference between interface inheritance and class inheritance in C#.', codeSnippet: '' },
        { id: 202, questionText: 'What are async and await keywords? How do they help avoid UI blocking?', codeSnippet: '' },
        { id: 203, questionText: 'What is the difference between IEnumerable and IQueryable in Entity Framework?', codeSnippet: '' }
      ],
      JavaScript: [
        { id: 301, questionText: 'What is closures in JavaScript? Can you give an example?', codeSnippet: '' },
        { id: 302, questionText: 'Explain event delegation and event bubbling.', codeSnippet: '' },
        { id: 303, questionText: 'What are promises, and how do they differ from callback functions?', codeSnippet: '' }
      ]
    };
    
    const activeQuestions = questions[technology] || [
      { id: 401, questionText: 'Explain basic computer science data structures like arrays, stacks, and queues.', codeSnippet: '' },
      { id: 402, questionText: 'What is your preferred programming language and why?', codeSnippet: '' }
    ];
    
    const newSession = {
      id: Date.now(),
      technology,
      startedAt: new Date().toISOString(),
      isCompleted: false,
      questions: activeQuestions,
      answers: []
    };
    
    const interviews = getStorageItem('mock_interviews', []);
    interviews.push(newSession);
    setStorageItem('mock_interviews', interviews);
    
    return newSession;
  },
  
  submitAnswer: async (questionId, answer) => {
    await delay(1200); // Evaluation latency
    const score = Math.floor(Math.random() * 30) + 70; // 70 - 100
    let feedback = "Your answer covers the basic concepts. To improve, mention architectural performance gains and concrete projects where you utilized this technology.";
    
    if (answer.length < 15) {
      feedback = "The answer is too brief. Try to write a detailed explanation with examples to make it look professional.";
    } else if (answer.toLowerCase().includes('virtual dom') || answer.toLowerCase().includes('reconciliation')) {
      feedback = "Excellent explanation of virtual DOM diffing and components patches! Very accurate.";
    }
    
    return { score, feedback };
  },
  
  completeSession: async (id) => {
    await delay(500);
    const interviews = getStorageItem('mock_interviews', []);
    const index = interviews.findIndex(i => i.id === Number(id));
    if (index !== -1) {
      interviews[index].isCompleted = true;
      interviews[index].completedAt = new Date().toISOString();
      interviews[index].overallScore = Math.floor(Math.random() * 20) + 80;
      setStorageItem('mock_interviews', interviews);
      return interviews[index];
    }
    throw new Error('Interview not found');
  }
};

export const mockJobsApi = {
  getRecommendations: async (location) => {
    await delay(400);
    const jobs = getStorageItem('mock_jobs', []);
    if (location) {
      return jobs.filter(j => j.location.toLowerCase().includes(location.toLowerCase()));
    }
    return jobs;
  },
  
  search: async (query, location, type) => {
    await delay(600);
    let jobs = getStorageItem('mock_jobs', []);
    if (query) {
      jobs = jobs.filter(j => j.title.toLowerCase().includes(query.toLowerCase()) || j.company.toLowerCase().includes(query.toLowerCase()));
    }
    if (location) {
      jobs = jobs.filter(j => j.location.toLowerCase().includes(location.toLowerCase()));
    }
    if (type) {
      jobs = jobs.filter(j => j.type.toLowerCase() === type.toLowerCase());
    }
    return jobs;
  }
};

export const mockCodeApi = {
  getProblems: async () => {
    await delay(300);
    return getStorageItem('mock_problems', []);
  },
  
  getProblemDetails: async (id) => {
    await delay(200);
    const problems = getStorageItem('mock_problems', []);
    return problems.find(p => p.id === Number(id));
  },
  
  runCode: async (problemId, language, code) => {
    await delay(1000);
    return {
      status: 'Success',
      output: 'Test Cases Passed: 3/3\nExecution time: 42ms\nOutput: [0, 1]',
      error: null
    };
  },
  
  submitCode: async (problemId, language, code) => {
    await delay(1500);
    const isAccepted = code.trim().length > 30; // simple validation
    
    // Add code submission to list
    const submissions = getStorageItem('mock_submissions', []);
    const prob = getStorageItem('mock_problems', []).find(p => p.id === Number(problemId));
    
    const newSubmission = {
      id: Date.now(),
      problemTitle: prob ? prob.title : 'Challenge',
      language,
      status: isAccepted ? 'Accepted' : 'Wrong Answer',
      submittedDate: new Date().toISOString(),
      runTime: isAccepted ? '38ms' : '0ms'
    };
    
    submissions.push(newSubmission);
    setStorageItem('mock_submissions', submissions);
    
    // Update progress stats in dashboard
    if (isAccepted) {
      const roadmap = getStorageItem('mock_roadmap', []);
      const codingTask = roadmap.find(t => t.title.includes('Coding'));
      if (codingTask) {
        codingTask.completed = true;
        setStorageItem('mock_roadmap', roadmap);
      }
    }
    
    return {
      status: isAccepted ? 'Accepted' : 'Wrong Answer',
      details: isAccepted ? 'All 15/15 test cases passed!' : 'Failed on test case 4/15. Expected: [0,1], Got: undefined',
      runtime: isAccepted ? '38ms' : 'N/A'
    };
  },
  
  getSubmissions: async () => {
    await delay(200);
    return getStorageItem('mock_submissions', []);
  }
};

export const mockRoadmapApi = {
  getRoadmap: async () => {
    await delay(300);
    return getStorageItem('mock_roadmap', []);
  },
  
  generate: async (targetRole, targetSkills) => {
    await delay(1500);
    const newTasks = [
      { id: 1, title: `Learn core syntax for ${targetSkills}`, targetRole, targetSkills, completed: false },
      { id: 2, title: `Build an advanced project using ${targetSkills}`, targetRole, targetSkills, completed: false },
      { id: 3, title: `Solve DSA problems related to ${targetRole}`, targetRole, targetSkills, completed: false },
      { id: 4, title: `Prepare HR behavioral answers for ${targetRole}`, targetRole, targetSkills, completed: false }
    ];
    setStorageItem('mock_roadmap', newTasks);
    return newTasks;
  },
  
  toggleTask: async (id) => {
    await delay(100);
    const roadmap = getStorageItem('mock_roadmap', []);
    const updated = roadmap.map(t => t.id === Number(id) ? { ...t, completed: !t.completed } : t);
    setStorageItem('mock_roadmap', updated);
    return { success: true };
  }
};

export const mockDashboardApi = {
  getStats: async () => {
    await delay(300);
    const roadmap = getStorageItem('mock_roadmap', []);
    const completedTasks = roadmap.filter(t => t.completed).length;
    const totalTasks = roadmap.length;
    const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    return {
      streakDays: 5,
      progressPercentage,
      completedTasks,
      pendingTasks: totalTasks - completedTasks
    };
  }
};
