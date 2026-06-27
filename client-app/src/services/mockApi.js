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
  { 
    id: 1, 
    title: 'Two Sum', 
    difficulty: 'Easy', 
    topic: 'Arrays', 
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.', 
    template: 'function twoSum(nums, target) {\n  // Write your code here\n}',
    exampleInput: 'nums = [2,7,11,15], target = 9',
    exampleOutput: '[0, 1]'
  },
  { 
    id: 2, 
    title: 'Valid Parentheses', 
    difficulty: 'Easy', 
    topic: 'Stacks', 
    description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.', 
    template: 'function isValid(s) {\n  // Write your code here\n}',
    exampleInput: 's = "()[]{}"',
    exampleOutput: 'true'
  },
  { 
    id: 3, 
    title: 'Reverse Linked List', 
    difficulty: 'Easy', 
    topic: 'Linked List', 
    description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.', 
    template: 'function reverseList(head) {\n  // Write your code here\n}',
    exampleInput: 'head = [1,2,3,4,5]',
    exampleOutput: '[5,4,3,2,1]'
  },
  { 
    id: 4, 
    title: 'Longest Substring Without Repeating Characters', 
    difficulty: 'Medium', 
    topic: 'Sliding Window', 
    description: 'Given a string s, find the length of the longest substring without repeating characters.', 
    template: 'function lengthOfLongestSubstring(s) {\n  // Write your code here\n}',
    exampleInput: 's = "abcabcbb"',
    exampleOutput: '3'
  }
];

const defaultJobs = [
  { id: 1, title: 'Associate Software Engineer', company: 'Google', location: 'Mountain View, CA / Remote', salary: '$120,000 - $150,000', description: 'Join the Google Core infrastructure team to build robust services.', type: 'Full-time', postedDate: new Date().toISOString() },
  { id: 2, title: 'Frontend Developer', company: 'Meta', location: 'New York, NY / Hybrid', salary: '$130,000 - $160,000', description: 'Work on cutting edge React and Web Technologies for WhatsApp and Instagram.', type: 'Full-time', postedDate: new Date().toISOString() },
  { id: 3, title: 'Software Engineering Intern', company: 'Netflix', location: 'Los Gatos, CA / Remote', salary: '$45 - $60 / hour', description: 'Help build premium consumer experiences on smart TVs.', type: 'Internship', postedDate: new Date().toISOString() },
  { id: 4, title: 'Junior Full-Stack Developer', company: 'TCS', location: 'Mumbai, India', salary: '₹6,00,000 - ₹8,00,000', description: 'Participate in large-scale enterprise application delivery.', type: 'Full-time', postedDate: new Date().toISOString() }
];

const defaultRoadmap = [
  { id: 1, task: 'Master JavaScript Fundamentals', targetRole: 'Full Stack Developer', targetSkills: 'React, C#, SQL Server', period: 'Daily', completed: true },
  { id: 2, task: 'Learn Data Structures & Algorithms', targetRole: 'Full Stack Developer', targetSkills: 'React, C#, SQL Server', period: 'Daily', completed: false },
  { id: 3, task: 'Build 3 Glassmorphic React Apps', targetRole: 'Full Stack Developer', targetSkills: 'React, C#, SQL Server', period: 'Weekly', completed: false },
  { id: 4, task: 'Solve 20 Coding Challenges', targetRole: 'Full Stack Developer', targetSkills: 'React, C#, SQL Server', period: 'Weekly', completed: false },
  { id: 5, task: 'Mock Interview Prep & Resume ATS Optimization', targetRole: 'Full Stack Developer', targetSkills: 'React, C#, SQL Server', period: 'Monthly', completed: false }
];

const defaultNotifications = [
  { id: 1, message: 'Welcome to your AI Career Mentor dashboard! Start by uploading your resume.', isRead: false, createdAt: new Date().toISOString() },
  { id: 2, message: 'Check out today\'s recommended job opening: Software Engineer at Google.', isRead: false, createdAt: new Date().toISOString() }
];

// Helper database initialization
const initDb = () => {
  const checkAndReset = (key, validator) => {
    const data = localStorage.getItem(key);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (!validator(parsed[0])) {
            localStorage.removeItem(key);
          }
        }
      } catch (e) {
        localStorage.removeItem(key);
      }
    }
  };

  // Run validation/healing checks
  checkAndReset('mock_resumes', (item) => item.resumeScore !== undefined && item.feedbacks !== undefined && item.feedbacks.length > 0 && item.feedbacks[0].suggestion !== undefined);
  checkAndReset('mock_interviews', (item) => item.questions && Array.isArray(item.questions) && item.questions.length > 0 && item.questions[0].questionText !== undefined);
  checkAndReset('mock_sessions', (item) => item.messages && Array.isArray(item.messages) && (item.messages.length === 0 || item.messages[0].message !== undefined));
  checkAndReset('mock_roadmap', (item) => item.task !== undefined && item.period !== undefined);
  checkAndReset('mock_problems', (item) => item.exampleInput !== undefined);

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

// Helper mappers for backward compatibility and model mapping
const mapChatMessage = (m) => {
  if (!m) return m;
  const isAI = m.sender?.toLowerCase() === 'ai' || m.sender === 'AI' || m.sender === 'ai';
  return {
    id: m.id || Date.now(),
    sender: isAI ? 'AI' : 'User',
    message: m.message || m.messageText || '',
    timestamp: m.timestamp || m.createdAt || new Date().toISOString()
  };
};

const mapChatSession = (s) => {
  if (!s) return s;
  return {
    id: s.id,
    title: s.title || 'Career Advisory',
    createdAt: s.createdAt || new Date().toISOString(),
    messages: (s.messages || []).map(mapChatMessage)
  };
};

const mapResumeRecord = (h) => {
  if (!h) return h;
  const score = h.resumeScore !== undefined ? h.resumeScore : (h.atsScore || 75);
  
  let mappedFeedbacks = [];
  if (h.feedbacks && Array.isArray(h.feedbacks) && h.feedbacks.length > 0) {
    mappedFeedbacks = h.feedbacks.map(f => ({
      category: f.category || 'General',
      suggestion: f.suggestion || f.feedbackText || 'Optimize your resume sections for better readability.'
    }));
  } else {
    mappedFeedbacks = [
      { category: 'Structure', suggestion: h.feedback?.structure || 'Consider using a single-column layout. Avoid sidebars, graphs, or tables as ATS scanners often misread them.' },
      { category: 'Keywords', suggestion: h.feedback?.keywords || 'Detected React, JavaScript, Git. Missing: Redux, TypeScript, Docker.' },
      { category: 'Verbs', suggestion: h.feedback?.verbs || 'Good use of action verbs like "developed", "built", "implemented". Try adding metrics.' },
      { category: 'Formatting', suggestion: 'Add a specialized skills section at the top.' },
      { category: 'Structure', suggestion: 'Use the STAR format to detail your bullet points.' },
      { category: 'Keywords', suggestion: 'Include keyword matches for "Rest APIs" and "State Management".' }
    ];
  }

  return {
    id: h.id,
    fileName: h.fileName || 'resume.pdf',
    resumeScore: score,
    createdDate: h.createdDate || h.analyzedDate || new Date().toISOString(),
    feedbacks: mappedFeedbacks
  };
};

const mapInterviewQuestion = (q) => {
  if (!q) return q;
  return {
    id: q.id,
    questionText: q.questionText || '',
    userAnswer: q.userAnswer || null,
    score: q.score || 0,
    feedback: q.feedback || null
  };
};

const mapInterviewSession = (i) => {
  if (!i) return i;
  return {
    id: i.id,
    technology: i.technology || 'General',
    startedAt: i.startedAt || new Date().toISOString(),
    isCompleted: i.isCompleted || false,
    score: i.score !== undefined ? i.score : (i.overallScore || 0),
    questions: (i.questions || []).map(mapInterviewQuestion)
  };
};

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
    const sessions = getStorageItem('mock_sessions', []);
    return sessions.map(mapChatSession);
  },
  
  getSessionDetails: async (sessionId) => {
    await delay(300);
    const sessions = getStorageItem('mock_sessions', []);
    const session = sessions.find(s => s.id === Number(sessionId));
    if (!session) throw new Error('Session not found');
    return mapChatSession(session);
  },
  
  createSession: async (title) => {
    await delay(300);
    const sessions = getStorageItem('mock_sessions', []);
    const newSession = {
      id: Date.now(),
      title: title || 'New Career Advice Chat',
      createdAt: new Date().toISOString(),
      messages: [
        { id: 1, sender: 'AI', message: 'Hello! I am your AI Career Mentor. I can help you with resume writing, mock interview preparation, learning paths, or job searching. What is on your mind today?', timestamp: new Date().toISOString() }
      ]
    };
    sessions.push(newSession);
    setStorageItem('mock_sessions', sessions);
    return mapChatSession(newSession);
  },
  
  sendMessage: async (sessionId, messageText) => {
    await delay(800);
    const sessions = getStorageItem('mock_sessions', []);
    const sessionIndex = sessions.findIndex(s => s.id === Number(sessionId));
    if (sessionIndex === -1) throw new Error('Session not found');
    
    const userMsg = { id: Date.now(), sender: 'User', message: messageText, timestamp: new Date().toISOString() };
    
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
    
    const aiMsg = { id: Date.now() + 1, sender: 'AI', message: aiResponseText, timestamp: new Date().toISOString() };
    
    // Map existing session messages to latest schema first
    const mappedMessages = (sessions[sessionIndex].messages || []).map(mapChatMessage);
    mappedMessages.push(userMsg, aiMsg);
    
    sessions[sessionIndex].messages = mappedMessages;
    setStorageItem('mock_sessions', sessions);
    
    return mapChatMessage(aiMsg);
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
    const matches = [];
    for (const session of sessions) {
      const mapped = mapChatSession(session);
      for (const msg of mapped.messages) {
        if (msg.message.toLowerCase().includes(query.toLowerCase())) {
          matches.push({
            id: msg.id,
            chatSessionId: session.id,
            sender: msg.sender,
            message: msg.message,
            timestamp: msg.timestamp
          });
        }
      }
    }
    return matches;
  }
};

export const mockResumeApi = {
  analyze: async (file) => {
    await delay(2200); // Realistic parsing delay
    const score = Math.floor(Math.random() * 25) + 65; // 65 - 90
    const mockAnalysis = {
      id: Date.now(),
      fileName: file ? file.name : 'resume.pdf',
      resumeScore: score,
      createdDate: new Date().toISOString(),
      feedbacks: [
        { category: 'Structure', suggestion: score > 75 ? 'Good formatting, clear sections.' : 'Consider using a single-column layout. Avoid sidebars, graphs, or tables as ATS scanners often misread them.' },
        { category: 'Keywords', suggestion: 'Detected React, JavaScript, Git. Missing: Redux, TypeScript, Docker.' },
        { category: 'Verbs', suggestion: 'Good use of action verbs like "developed", "built", "implemented". Try adding metrics (e.g., "by 15%").' },
        { category: 'Formatting', suggestion: 'Add a specialized skills section at the top.' },
        { category: 'Structure', suggestion: 'Use the STAR format to detail your bullet points.' },
        { category: 'Keywords', suggestion: 'Include keyword matches for "Rest APIs" and "State Management".' }
      ]
    };
    
    const history = getStorageItem('mock_resumes', []);
    history.push(mockAnalysis);
    setStorageItem('mock_resumes', history);
    
    return {
      message: 'Resume analyzed successfully.',
      analysis: mapResumeRecord(mockAnalysis)
    };
  },
  
  getHistory: async () => {
    await delay(400);
    const history = getStorageItem('mock_resumes', []);
    return history.map(mapResumeRecord);
  },
  
  getDetails: async (id) => {
    await delay(300);
    const history = getStorageItem('mock_resumes', []);
    const item = history.find(h => h.id === Number(id));
    if (!item) throw new Error('Analysis report not found');
    return mapResumeRecord(item);
  }
};

export const mockInterviewApi = {
  getSessions: async () => {
    await delay(300);
    const interviews = getStorageItem('mock_interviews', []);
    return interviews.map(mapInterviewSession);
  },
  
  getSessionDetails: async (id) => {
    await delay(300);
    const interviews = getStorageItem('mock_interviews', []);
    const session = interviews.find(i => i.id === Number(id));
    return mapInterviewSession(session);
  },
  
  startSession: async (technology) => {
    await delay(1000);
    const questions = {
      React: [
        { id: 101, questionText: 'Explain the React virtual DOM and how reconciliation works.', codeSnippet: '' },
        { id: 102, questionText: 'What is the difference between UseState and UseRef hooks? When should you use which?', codeSnippet: '' },
        { id: 103, questionText: 'Explain React Context API and how it prevents prop drilling.', codeSnippet: '' }
      ],
      'C# & ASP.NET Core': [
        { id: 201, questionText: 'Explain the difference between interface inheritance and class inheritance in C#.', codeSnippet: '' },
        { id: 202, questionText: 'What are async and await keywords? How do they help avoid UI blocking?', codeSnippet: '' },
        { id: 203, questionText: 'What is the difference between IEnumerable and IQueryable in Entity Framework Core?', codeSnippet: '' }
      ],
      'SQL & Databases': [
        { id: 301, questionText: 'Explain the difference between clustered and non-clustered indexes in SQL Server.', codeSnippet: '' },
        { id: 302, questionText: 'What are database normalization rules (1NF, 2NF, 3NF)? Explain with examples.', codeSnippet: '' },
        { id: 303, questionText: 'Explain outer joins vs inner joins and their performance differences.', codeSnippet: '' }
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
      questions: activeQuestions.map(q => ({
        id: q.id,
        questionText: q.questionText,
        userAnswer: null,
        score: 0,
        feedback: null
      })),
      overallScore: 0
    };
    
    const interviews = getStorageItem('mock_interviews', []);
    interviews.push(newSession);
    setStorageItem('mock_interviews', interviews);
    
    return mapInterviewSession(newSession);
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
    
    const interviews = getStorageItem('mock_interviews', []);
    let updatedQuestion = null;
    
    for (let session of interviews) {
      const q = session.questions.find(q => q.id === Number(questionId));
      if (q) {
        q.userAnswer = answer;
        q.score = score;
        q.feedback = feedback;
        updatedQuestion = mapInterviewQuestion(q);
        break;
      }
    }
    
    if (updatedQuestion) {
      setStorageItem('mock_interviews', interviews);
      return updatedQuestion;
    }
    
    return {
      id: Number(questionId),
      questionText: 'Mock Interview Question',
      userAnswer: answer,
      score,
      feedback
    };
  },
  
  completeSession: async (id) => {
    await delay(500);
    const interviews = getStorageItem('mock_interviews', []);
    const index = interviews.findIndex(i => i.id === Number(id));
    if (index !== -1) {
      interviews[index].isCompleted = true;
      interviews[index].completedAt = new Date().toISOString();
      
      const gradedQuestions = interviews[index].questions.filter(q => q.score > 0);
      const avgScore = gradedQuestions.length > 0
        ? Math.round(gradedQuestions.reduce((acc, q) => acc + q.score, 0) / gradedQuestions.length)
        : 75;
        
      interviews[index].overallScore = avgScore;
      setStorageItem('mock_interviews', interviews);
      return mapInterviewSession(interviews[index]);
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
      const codingTask = roadmap.find(t => (t.task || t.title || '').includes('Coding') || (t.task || t.title || '').includes('Challenges'));
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
    const skillsString = Array.isArray(targetSkills) ? targetSkills.join(', ') : targetSkills;
    const newTasks = [
      { id: 1, task: `Learn core syntax and fundamentals of ${skillsString}`, targetRole, targetSkills: skillsString, period: 'Daily', completed: false },
      { id: 2, task: `Solve 5 basic programming questions in ${skillsString}`, targetRole, targetSkills: skillsString, period: 'Daily', completed: false },
      { id: 3, task: `Build an advanced glassmorphic portfolio project showcasing ${skillsString}`, targetRole, targetSkills: skillsString, period: 'Weekly', completed: false },
      { id: 4, task: `Solve 20 medium-difficulty coding challenges related to ${targetRole}`, targetRole, targetSkills: skillsString, period: 'Weekly', completed: false },
      { id: 5, task: `Conduct a full simulated mock interview for a ${targetRole} position`, targetRole, targetSkills: skillsString, period: 'Monthly', completed: false }
    ];
    setStorageItem('mock_roadmap', newTasks);
    return newTasks;
  },
  
  toggleTask: async (id) => {
    await delay(100);
    const roadmap = getStorageItem('mock_roadmap', []);
    let updatedTask = null;
    const updated = roadmap.map(t => {
      if (t.id === Number(id)) {
        t.completed = !t.completed;
        updatedTask = t;
      }
      return t;
    });
    if (updatedTask) {
      setStorageItem('mock_roadmap', updated);
      return updatedTask;
    }
    return { id: Number(id), completed: true };
  }
};

export const mockDashboardApi = {
  getStats: async () => {
    await delay(300);
    
    // 1. Resume Score
    const resumes = getStorageItem('mock_resumes', []).map(mapResumeRecord);
    const latestResume = resumes.length > 0 ? resumes[resumes.length - 1] : null;
    const resumeScore = latestResume ? latestResume.resumeScore : 0;
    
    // 2. Interview Score
    const interviews = getStorageItem('mock_interviews', []).map(mapInterviewSession);
    const latestInterview = interviews.length > 0 ? interviews[interviews.length - 1] : null;
    const interviewScore = latestInterview ? latestInterview.score : 0;
    
    // 3. Learning Progress
    const roadmap = getStorageItem('mock_roadmap', []);
    const completedTasks = roadmap.filter(t => t.completed).length;
    const totalTasks = roadmap.length;
    const learningProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // 4. Streak
    const dailyStreak = 5;
    
    // 5. Recent Activities
    const recentActivities = [];
    
    // Add resumes
    resumes.forEach(r => {
      recentActivities.push({
        type: 'Resume',
        title: `Analyzed Resume: ${r.fileName}`,
        status: `Score: ${r.resumeScore}/100`,
        date: r.createdDate
      });
    });
    
    // Add interviews
    interviews.forEach(i => {
      recentActivities.push({
        type: 'Interview',
        title: `Completed ${i.technology} Mock Interview`,
        status: `Score: ${i.score}%`,
        date: i.startedAt
      });
    });
    
    // Add submissions
    const submissions = getStorageItem('mock_submissions', []);
    submissions.forEach(s => {
      recentActivities.push({
        type: 'Coding',
        title: `Submitted solution for ${s.problemTitle}`,
        status: s.status,
        date: s.submittedDate
      });
    });
    
    // Sort desc by date
    const sortedActivities = recentActivities
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
      
    // 6. Upcoming Tasks (take 4 uncompleted)
    const upcomingTasks = roadmap
      .filter(t => !t.completed)
      .slice(0, 4)
      .map(t => ({
        id: t.id,
        task: t.task,
        period: t.period,
        targetDate: t.targetDate || new Date().toISOString()
      }));
      
    // 7. Chart Data (interviews over time, fallback to defaults for visuals if empty)
    let chartData = interviews.map(i => ({
      label: i.technology,
      score: i.score
    }));
    if (chartData.length === 0) {
      chartData = [
        { label: 'React', score: 80 },
        { label: 'C# & .NET', score: 75 }
      ];
    }
    
    return {
      resumeScore,
      interviewScore,
      learningProgress,
      dailyStreak,
      recentActivities: sortedActivities,
      upcomingTasks,
      chartData
    };
  }
};
