import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const features = [
    {
      title: 'AI Resume Analyzer',
      description: 'Upload your resume to receive an ATS (Applicant Tracking System) compatibility score with structure, formatting, and keyword suggestions.',
      icon: 'bi-file-earmark-bar-graph',
      color: 'text-primary',
    },
    {
      title: 'AI Career Chat',
      description: 'Consult with the AI Career Mentor to get specific advice about career paths, interview strategies, and salary negotiations.',
      icon: 'bi-chat-heart',
      color: 'text-purple',
    },
    {
      title: 'Mock Interview Arena',
      description: 'Select your technology stack (e.g. React, C#) and complete simulated interviews graded automatically by AI models.',
      icon: 'bi-mic',
      color: 'text-info',
    },
    {
      title: 'DSA Practice Terminal',
      description: 'Solve coding and algorithmic challenges inside our online code editor. Compile and run test cases instantly.',
      icon: 'bi-code-slash',
      color: 'text-success',
    },
    {
      title: 'Learning Roadmap',
      description: 'Generate dynamic progress trackers customized to your dream roles. Complete daily, weekly, and monthly tasks.',
      icon: 'bi-compass',
      color: 'text-warning',
    },
    {
      title: 'Smart Job Matcher',
      description: 'Find positions tailored to your profile. View matching percentages, key requirements, and company profiles.',
      icon: 'bi-briefcase',
      color: 'text-danger',
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section id="hero" className="position-relative py-5 min-vh-90 d-flex align-items-center">
        {/* Decorative Blur Backgrounds */}
        <div
          className="position-absolute rounded-circle pulse-bg bg-primary bg-opacity-10"
          style={{ width: '400px', height: '400px', top: '-10%', right: '5%', filter: 'blur(80px)' }}
        ></div>
        <div
          className="position-absolute rounded-circle pulse-bg bg-purple bg-opacity-10"
          style={{ width: '500px', height: '500px', bottom: '10%', left: '-10%', filter: 'blur(100px)' }}
        ></div>

        <div className="container px-4 position-relative">
          <div className="row align-items-center g-5">
            <div className="col-lg-6 text-center text-lg-start animate-fade-in">
              <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill fw-semibold mb-3">
                Powered by Advanced AI Algorithms
              </span>
              <h1 className="display-4 fw-extrabold mb-4 display-font" style={{ lineHeight: '1.2' }}>
                Build Your Future with <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r" style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  AI Career Mentor
                </span>
              </h1>
              <p className="lead text-secondary mb-5 fs-5">
                Optimize your resume, prepare for mock interviews, practice coding challenges, create structured learning roadmaps, and find your dream tech jobs.
              </p>
              <div className="d-flex flex-column flex-sm-row justify-content-center justify-content-lg-start gap-3">
                <Link to="/register" className="btn btn-gradient btn-lg px-4">
                  Get Started Free
                </Link>
                <a href="#features" className="btn btn-glass btn-lg px-4">
                  Explore Features
                </a>
              </div>
            </div>

            <div className="col-lg-6 text-center position-relative">
              <div className="position-relative d-inline-block p-4">
                {/* Decorative border circle */}
                <div
                  className="position-absolute border border-primary border-opacity-20 rounded-circle"
                  style={{ width: '110%', height: '110%', top: '-5%', left: '-5%', borderStyle: 'dashed' }}
                ></div>
                <img
                  src="https://img.freepik.com/free-vector/gradient-ai-robot-concept-illustration_23-2148972565.jpg?semt=ais_hybrid"
                  alt="AI Assistant Graphic"
                  className="img-fluid rounded-4 shadow-xl glass-card position-relative"
                  style={{ maxWidth: '480px', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-5 bg-secondary bg-opacity-5">
        <div className="container px-4">
          <div className="text-center max-w-2xl mx-auto mb-5">
            <h2 className="display-5 fw-bold mb-3">Complete Portfolio Toolkit</h2>
            <p className="text-secondary fs-5">
              Everything you need to accelerate your technical career preparation in one place.
            </p>
          </div>

          <div className="row g-4 mt-2">
            {features.map((f, i) => (
              <div key={i} className="col-md-6 col-lg-4">
                <div className="glass-card h-100 p-4 d-flex flex-column justify-content-between">
                  <div>
                    <div className={`d-inline-flex p-3 rounded-3 bg-primary bg-opacity-10 ${f.color} mb-4`}>
                      <i className={`bi ${f.icon} fs-3`}></i>
                    </div>
                    <h4 className="fw-bold mb-3">{f.title}</h4>
                    <p className="text-secondary small mb-4">{f.description}</p>
                  </div>
                  <Link to="/login" className="text-primary text-decoration-none fw-semibold small d-inline-flex align-items-center">
                    Learn more <i className="bi-arrow-right ms-2"></i>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-5">
        <div className="container px-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <img
                src="https://img.freepik.com/free-vector/hand-drawn-chatting-with-chatbot-concept_23-2148816579.jpg"
                alt="AI Chatbot Interaction"
                className="img-fluid rounded-4 shadow-lg"
                style={{ maxWidth: '450px' }}
              />
            </div>
            <div className="col-lg-6">
              <h2 className="display-5 fw-bold mb-4">Master Your Prep Loop</h2>
              <p className="text-secondary mb-4">
                AI Career Mentor utilizes rule-based parser algorithms and simulated AI dialogue agents to give immediate, actionable metrics. Whether you are correcting a programming answer or scanning keywords on a CV, the feedback loop runs in real-time.
              </p>
              <div className="row g-3">
                <div className="col-sm-6">
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi-check-circle-fill text-success fs-5"></i>
                    <span className="fw-semibold">Real-time ATS Scoring</span>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi-check-circle-fill text-success fs-5"></i>
                    <span className="fw-semibold">Adaptive Tech Roadmap</span>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi-check-circle-fill text-success fs-5"></i>
                    <span className="fw-semibold">Interactive Editor</span>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi-check-circle-fill text-success fs-5"></i>
                    <span className="fw-semibold">Guided Interviews</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-5 bg-secondary bg-opacity-5">
        <div className="container px-4">
          <div className="glass-card p-5 text-center position-relative overflow-hidden">
            <div
              className="position-absolute rounded-circle pulse-bg bg-primary bg-opacity-10"
              style={{ width: '300px', height: '300px', top: '-50%', left: '-20%', filter: 'blur(80px)' }}
            ></div>
            <h2 className="display-5 fw-bold mb-3 display-font">Ready to Transform Your Career?</h2>
            <p className="text-secondary max-w-xl mx-auto mb-5 fs-5">
              Sign up today and unlock full access to automated coding compilers, ATS feedback reports, and career advisor dialogues.
            </p>
            <div className="d-flex justify-content-center gap-3 position-relative">
              <Link to="/register" className="btn btn-gradient btn-lg px-5">
                Join Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
