import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { profileApi } from '../services/api';

const ProfilePage = () => {
  const { user, updateProfileContext } = useAuth();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [education, setEducation] = useState('');
  
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [memberSince, setMemberSince] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await profileApi.getProfile();
      setName(data.name || '');
      setPhone(data.phone || '');
      setGithub(data.github || '');
      setLinkedin(data.linkedin || '');
      setEducation(data.education || '');
      setSkills(data.skills || []);
      setImagePreview(data.profileImage || '');
      setMemberSince(data.createdAt || '');
    } catch (err) {
      console.error(err);
      setError('Could not load profile details.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setUpdating(true);
    setError('');
    setSuccess('');
    try {
      const payload = { name, phone, github, linkedin, education, skills };
      const result = await profileApi.updateProfile(payload);
      updateProfileContext(result.user);
      setSuccess('Profile updated successfully.');
    } catch (err) {
      console.error(err);
      setError('Failed to update profile settings.');
    } finally {
      setUpdating(false);
    }
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills((prev) => [...prev, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills((prev) => prev.filter((s) => s !== skillToRemove));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create local preview URL
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUploadImage = async () => {
    if (!imageFile) return;

    setUploading(true);
    setError('');
    setSuccess('');
    try {
      const result = await profileApi.uploadImage(imageFile);
      // Update local profile image settings
      const updatedUser = { ...user, profileImage: result.profileImage };
      updateProfileContext(updatedUser);
      setSuccess('Avatar image uploaded successfully.');
      setImageFile(null);
    } catch (err) {
      console.error(err);
      setError('Failed to upload profile photo.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-2 animate-fade-in">
      <div className="mb-4">
        <h2 className="fw-bold mb-1 display-font">Profile Settings</h2>
        <p className="text-secondary small">Manage your credentials, upload resume identifiers, and tag technical skills.</p>
      </div>

      <div className="row g-4">
        {/* Left Card: Avatar upload & Profile info summary */}
        <div className="col-lg-4">
          <div className="glass-card p-4 text-center">
            <h5 className="fw-bold mb-4">Profile Picture</h5>
            <div className="position-relative d-inline-block mb-3">
              <img
                src={imagePreview || 'https://api.dicebear.com/7.x/adventurer/svg?seed=avatar'}
                alt="Avatar Preview"
                className="rounded-circle border border-4 border-primary"
                width="140"
                height="140"
                style={{ objectFit: 'cover' }}
              />
              <button
                className="btn btn-sm btn-primary position-absolute bottom-0 end-0 rounded-circle p-2 d-flex align-items-center justify-content-center"
                style={{ width: '36px', height: '36px' }}
                onClick={() => document.getElementById('avatarFileInput').click()}
              >
                <i className="bi-camera"></i>
              </button>
              <input
                id="avatarFileInput"
                type="file"
                className="d-none"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            <p className="text-secondary small mb-3">Update your avatar image (.jpg, .png)</p>

            {imageFile && (
              <button
                className="btn btn-sm btn-gradient px-4"
                onClick={handleUploadImage}
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Save Avatar Photo'}
              </button>
            )}

            <div className="border-top border-secondary border-opacity-10 mt-4 pt-4 text-start">
              <p className="mb-1 text-secondary small"><strong>Registered Email:</strong></p>
              <p className="fw-semibold text-secondary mb-3">{user?.email}</p>
              
              <p className="mb-1 text-secondary small"><strong>Member Since:</strong></p>
              <p className="fw-semibold text-secondary small mb-0">{memberSince ? new Date(memberSince).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Right Card: Settings form */}
        <div className="col-lg-8">
          <div className="glass-card p-4">
            <h5 className="fw-bold mb-4"><i className="bi-person-gear text-primary me-2"></i>Personal Credentials</h5>
            
            {error && (
              <div className="alert alert-danger border-0 bg-danger bg-opacity-10 text-danger mb-3 small">
                {error}
              </div>
            )}
            
            {success && (
              <div className="alert alert-success border-0 bg-success bg-opacity-10 text-success mb-3 small">
                {success}
              </div>
            )}

            <form onSubmit={handleUpdateProfile}>
              <div className="row g-3 mb-3">
                <div className="col-sm-6">
                  <label className="form-label small fw-semibold">Full Name</label>
                  <input
                    type="text"
                    className="form-control bg-transparent"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={updating}
                  />
                </div>
                <div className="col-sm-6">
                  <label className="form-label small fw-semibold">Phone Number</label>
                  <input
                    type="text"
                    className="form-control bg-transparent"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={updating}
                  />
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-sm-6">
                  <label className="form-label small fw-semibold">GitHub Profile URL</label>
                  <input
                    type="url"
                    className="form-control bg-transparent"
                    placeholder="https://github.com/username"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    disabled={updating}
                  />
                </div>
                <div className="col-sm-6">
                  <label className="form-label small fw-semibold">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    className="form-control bg-transparent"
                    placeholder="https://linkedin.com/in/username"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    disabled={updating}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold">Education & Degree</label>
                <input
                  type="text"
                  className="form-control bg-transparent"
                  placeholder="e.g. BS in Computer Science, Stanford University"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  disabled={updating}
                />
              </div>

              {/* Skill tag list */}
              <div className="mb-4">
                <label className="form-label small fw-semibold d-block">Skills Tag List</label>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {skills.length === 0 ? (
                    <span className="text-secondary small">No skills added yet.</span>
                  ) : (
                    skills.map((s) => (
                      <span key={s} className="badge bg-primary bg-opacity-10 text-primary py-2 px-3 rounded-pill d-flex align-items-center gap-2">
                        {s}
                        <button type="button" className="btn-close btn-close-white p-0" style={{ fontSize: '0.65rem' }} onClick={() => handleRemoveSkill(s)}></button>
                      </span>
                    ))
                  )}
                </div>

                <div className="d-flex gap-2" style={{ maxWidth: '320px' }}>
                  <input
                    type="text"
                    className="form-control bg-transparent form-control-sm"
                    placeholder="Add skill (e.g. SQL)"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    disabled={updating}
                  />
                  <button className="btn btn-sm btn-glass text-primary px-3" onClick={handleAddSkill} disabled={updating}>
                    Add
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-gradient px-5" disabled={updating}>
                {updating ? 'Saving changes...' : 'Save Settings'}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
