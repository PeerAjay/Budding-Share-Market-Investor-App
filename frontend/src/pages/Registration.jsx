import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import './Registration.css'

function Registration() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      await api.post('/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      })

      setSuccess('Account created successfully. Please sign in.')
      setTimeout(() => navigate('/'), 1200)
    } catch (err) {
      setError(err?.response?.data || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-page">
      <div className="container-fluid min-vh-100">
        <div className="row min-vh-100">
          <div className="col-lg-6 d-none d-lg-flex register-brand-side">
            <div className="register-overlay"></div>

            <div className="register-brand-content">
              <div className="register-badge mb-4">
                Create your investor profile
              </div>

              <h1 className="register-brand-title">
                Start building your trading journey today.
              </h1>

              <p className="register-brand-subtitle">
                Join the Budding Share Market Investor platform and explore the
                opportunities and risks of share market trading with virtual
                money.
              </p>

              <div className="register-feature-list mt-4">
                <div className="register-feature-card">
                  <h5>Safe Learning Environment</h5>
                  <p>
                    Practice buying and selling shares without risking real
                    money.
                  </p>
                </div>

                <div className="register-feature-card">
                  <h5>Realistic Trading Experience</h5>
                  <p>
                    Track brokerage, portfolio growth, and stock price movement
                    over time.
                  </p>
                </div>

                <div className="register-feature-card">
                  <h5>Compete and Improve</h5>
                  <p>
                    Compare your performance on the leaderboard and improve your
                    strategy.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6 d-flex align-items-center justify-content-center register-form-side">
            <div className="register-card shadow-lg">
              <div className="mb-4 text-center text-lg-start">
                <div className="register-small-label mb-2">Get started</div>
                <h2 className="register-title">Create an account</h2>
                <p className="register-subtitle">
                  Fill in your details below to create your trading account.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label register-label">Username</label>
                  <input
                    type="text"
                    name="username"
                    className="form-control register-input"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label register-label">Email address</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control register-input"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label register-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control register-input"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label register-label">Confirm password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-control register-input"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>

                {error && (
                  <div className="alert alert-danger py-2" role="alert">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="alert alert-success py-2" role="alert">
                    {success}
                  </div>
                )}

                <div className="form-check mb-4">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="agreeTerms"
                    required
                  />
                  <label
                    className="form-check-label register-check-text"
                    htmlFor="agreeTerms"
                  >
                    I agree to the terms and conditions
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn register-btn w-100"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>

              <p className="signin-text text-center mt-4 mb-0">
                Already have an account?{' '}
                <Link to="/" className="signin-link">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Registration