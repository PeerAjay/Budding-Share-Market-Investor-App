import { useState } from 'react'
import './Profile.css'

function Profile() {
  const storedIdentity = localStorage.getItem('identity') || ''

  const [profileData, setProfileData] = useState({
    username: storedIdentity,
    email: '',
    phone: '',
    bio: '',
    location: 'Melbourne, Australia'
  })

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    marketAlerts: true,
    darkMode: true
  })

  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfileData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePreferenceChange = (e) => {
    const { name, checked } = e.target
    setPreferences((prev) => ({
      ...prev,
      [name]: checked
    }))
  }

  const handleSaveProfile = (e) => {
    e.preventDefault()
    setMessage('Profile changes saved locally for now.')
    console.log('Profile data:', profileData)
    console.log('Preferences:', preferences)

    setTimeout(() => {
      setMessage('')
    }, 2500)
  }

  return (
    <div className="profile-page">
      <div className="container py-5">
        <div className="profile-header mb-4">
          <div>
            <h1 className="profile-title">My Profile</h1>
            <p className="profile-subtitle">
              Manage your personal details and account preferences
            </p>
          </div>
        </div>

        {message && (
          <div className="alert alert-success profile-alert" role="alert">
            {message}
          </div>
        )}

        <div className="row g-4">
          <div className="col-lg-4">
            <div className="profile-card profile-summary-card">
              <div className="profile-avatar">
                {storedIdentity ? storedIdentity.charAt(0).toUpperCase() : 'U'}
              </div>

              <h3 className="profile-name">
                {profileData.username || 'User'}
              </h3>

              <p className="profile-role">Standard Investor Account</p>

              <div className="profile-summary-list">
                <div className="profile-summary-item">
                  <span>Status</span>
                  <strong>Logged In</strong>
                </div>
                <div className="profile-summary-item">
                  <span>Account Type</span>
                  <strong>User</strong>
                </div>
                <div className="profile-summary-item">
                  <span>Portfolio Access</span>
                  <strong>Enabled</strong>
                </div>
              </div>
            </div>

            <div className="profile-card mt-4">
              <h4 className="section-title">Quick Settings</h4>

              <label className="profile-toggle">
                <span>Email Notifications</span>
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={preferences.emailNotifications}
                  onChange={handlePreferenceChange}
                />
              </label>

              <label className="profile-toggle">
                <span>Market Alerts</span>
                <input
                  type="checkbox"
                  name="marketAlerts"
                  checked={preferences.marketAlerts}
                  onChange={handlePreferenceChange}
                />
              </label>

              <label className="profile-toggle">
                <span>Dark Mode</span>
                <input
                  type="checkbox"
                  name="darkMode"
                  checked={preferences.darkMode}
                  onChange={handlePreferenceChange}
                />
              </label>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="profile-card">
              <h4 className="section-title">Account Details</h4>

              <form onSubmit={handleSaveProfile}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label profile-label">Username</label>
                    <input
                      type="text"
                      name="username"
                      className="form-control profile-input"
                      value={profileData.username}
                      onChange={handleChange}
                      placeholder="Enter username"
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label profile-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control profile-input"
                      value={profileData.email}
                      onChange={handleChange}
                      placeholder="Enter email"
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label profile-label">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      className="form-control profile-input"
                      value={profileData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label profile-label">Location</label>
                    <input
                      type="text"
                      name="location"
                      className="form-control profile-input"
                      value={profileData.location}
                      onChange={handleChange}
                      placeholder="Enter location"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label profile-label">Bio</label>
                  <textarea
                    name="bio"
                    rows="4"
                    className="form-control profile-input"
                    value={profileData.bio}
                    onChange={handleChange}
                    placeholder="Write a short bio"
                  ></textarea>
                </div>

                <div className="profile-actions">
                  <button type="submit" className="btn profile-save-btn">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>

            <div className="profile-card mt-4">
              <h4 className="section-title">Security</h4>

              <div className="security-box">
                <div>
                  <h5 className="security-title">Password</h5>
                  <p className="security-text">
                    Password update functionality can be connected later when the backend endpoint is ready.
                  </p>
                </div>

                <button type="button" className="btn profile-secondary-btn">
                  Change Password
                </button>
              </div>

              <div className="security-box mt-3">
                <div>
                  <h5 className="security-title">Two-Factor Authentication</h5>
                  <p className="security-text">
                    Extra account protection can be added in a future update.
                  </p>
                </div>

                <button type="button" className="btn profile-secondary-btn">
                  Set Up
                </button>
              </div>
            </div>

            <div className="profile-card mt-4">
              <h4 className="section-title">Coming Soon</h4>
              <ul className="coming-soon-list">
                <li>Real profile data from database</li>
                <li>Update profile endpoint integration</li>
                <li>Trading account summary widgets</li>
                <li>Portfolio activity and recent transactions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile