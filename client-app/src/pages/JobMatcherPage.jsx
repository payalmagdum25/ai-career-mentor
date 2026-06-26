import React, { useState, useEffect } from 'react';
import { jobsApi } from '../services/api';

const JobMatcherPage = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [locationPref, setLocationPref] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchType, setSearchType] = useState('All');
  const [searchResults, setSearchResults] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [matching, setMatching] = useState(false);
  const [activeTab, setActiveTab] = useState('recommendations'); // 'recommendations', 'search'
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async (loc = '') => {
    setLoading(true);
    try {
      const data = await jobsApi.getRecommendations(loc);
      setRecommendations(data);
    } catch (err) {
      console.error(err);
      setError('Could not load job matches.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = async (e) => {
    e.preventDefault();
    setMatching(true);
    try {
      await fetchRecommendations(locationPref);
    } catch (err) {
      console.error(err);
    } finally {
      setMatching(false);
    }
  };

  const handleSearchJobs = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const typeParam = searchType === 'All' ? '' : searchType;
      const data = await jobsApi.search(searchQuery, searchLocation, typeParam);
      setSearchResults(data);
      setActiveTab('search');
    } catch (err) {
      console.error(err);
      setError('Search failed.');
    } finally {
      setLoading(false);
    }
  };

  // Determine progress bar color based on match percentage
  const getMatchColor = (percent) => {
    if (percent >= 90) return 'bg-success';
    if (percent >= 80) return 'bg-primary';
    return 'bg-warning';
  };

  return (
    <div className="container-fluid py-2 animate-fade-in">
      <div className="mb-4">
        <h2 className="fw-bold mb-1 display-font">Job Matcher Workspace</h2>
        <p className="text-secondary small">Match your profile and skills with career vacancies and find your next tech role.</p>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs border-bottom mb-4">
        <li className="nav-item">
          <button
            className={`nav-link bg-transparent border-0 text-secondary ${activeTab === 'recommendations' ? 'active fw-bold border-bottom border-primary text-primary' : ''}`}
            onClick={() => setActiveTab('recommendations')}
          >
            AI Recommendations
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link bg-transparent border-0 text-secondary ${activeTab === 'search' ? 'active fw-bold border-bottom border-primary text-primary' : ''}`}
            onClick={() => setActiveTab('search')}
          >
            Global Search
          </button>
        </li>
      </ul>

      {activeTab === 'recommendations' ? (
        /* Recommendations view */
        <div className="row g-4">
          {/* Preference controls sidebar */}
          <div className="col-lg-4">
            <div className="glass-card p-4">
              <h5 className="fw-bold mb-3"><i className="bi-sliders text-primary me-2"></i>Preferences</h5>
              <form onSubmit={handleApplyFilters}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Location Preference</label>
                  <input
                    type="text"
                    className="form-control bg-transparent"
                    placeholder="e.g. Remote, San Francisco"
                    value={locationPref}
                    onChange={(e) => setLocationPref(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-gradient w-100" disabled={matching}>
                  {matching ? 'Matching...' : 'Apply Filters'}
                </button>
              </form>
            </div>
          </div>

          {/* Matches listings */}
          <div className="col-lg-8">
            <div className="glass-card p-4 h-100">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status"></div>
                </div>
              ) : recommendations.length === 0 ? (
                <p className="text-secondary text-center py-4 mb-0">No job matches found. Make sure to complete your profile settings!</p>
              ) : (
                <div className="row g-3">
                  {recommendations.map((job) => (
                    <div key={job.id} className="col-md-6">
                      <div className="p-3 rounded border bg-secondary bg-opacity-5 hover-bg h-100 d-flex flex-column justify-content-between">
                        <div>
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <span className="fw-bold text-secondary text-truncate" style={{ maxWidth: '140px' }}>{job.company}</span>
                            <span className="badge bg-primary bg-opacity-10 text-primary">{job.matchPercentage}% Match</span>
                          </div>
                          <h6 className="fw-bold mb-2 text-wrap">{job.position}</h6>
                          <span className="text-secondary small d-block mb-3"><i className="bi-geo-alt me-1"></i>{job.location}</span>
                        </div>

                        {/* Match Percent Bar */}
                        <div>
                          <div className="progress mb-2" style={{ height: '6px' }}>
                            <div
                              className={`progress-bar ${getMatchColor(job.matchPercentage)}`}
                              role="progressbar"
                              style={{ width: `${job.matchPercentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Global Jobs Search View */
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="glass-card p-4">
              <h5 className="fw-bold mb-3"><i className="bi-search text-primary me-2"></i>Find Opportunities</h5>
              <form onSubmit={handleSearchJobs}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Keywords</label>
                  <input
                    type="text"
                    className="form-control bg-transparent"
                    placeholder="e.g. Developer, Intern"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Location</label>
                  <input
                    type="text"
                    className="form-control bg-transparent"
                    placeholder="e.g. Remote, Austin"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Job Type</label>
                  <select
                    className="form-select bg-transparent"
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                  >
                    <option value="All">All Types</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-gradient w-100">
                  Search Openings
                </button>
              </form>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="glass-card p-4 h-100">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status"></div>
                </div>
              ) : searchResults.length === 0 ? (
                <p className="text-secondary text-center py-4 mb-0">Use search controls to find job openings.</p>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {searchResults.map((job) => (
                    <div key={job.id} className="p-3 rounded border bg-secondary bg-opacity-5 hover-bg">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h6 className="fw-bold mb-0">{job.title}</h6>
                          <span className="text-secondary small">{job.company} • {job.location}</span>
                        </div>
                        <span className="badge bg-secondary text-secondary bg-opacity-10">{job.type}</span>
                      </div>
                      <p className="small text-secondary mb-3">{job.description}</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <strong className="text-primary small">{job.salary}</strong>
                        {job.applicationUrl && (
                          <a href={job.applicationUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-glass text-primary px-3">
                            Apply Direct <i className="bi-box-arrow-up-right ms-1"></i>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobMatcherPage;
