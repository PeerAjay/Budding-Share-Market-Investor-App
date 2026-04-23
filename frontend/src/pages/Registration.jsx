import { Link } from 'react-router-dom'
import './Registration.css'

function Registration({ onRegister }) {
  return (
    <div className="register-page">
      <div className="container-fluid min-vh-100">
        <div className="row min-vh-100">

          <div className="col-lg-6 d-none d-lg-flex register-brand-side">
            <div className="register-overlay"></div>

            <div className="register-brand-content">
              <div className="register-badge mb-4">Create your investor profile</div>

              <h1 className="register-brand-title">
                Start building your trading journey today.
              </h1>

              <p className="register-brand-subtitle">
                Join the Budding Share Market Investor platform and explore the
                opportunities and risks of share market trading with virtual money.
              </p>

              <div className="register-feature-list mt-4">
                <div className="register-feature-card">
                  <h5>Safe Learning Environment</h5>
                  <p>Practice buying and selling shares without risking real money.</p>
                </div>

                <div className="register-feature-card">
                  <h5>Realistic Trading Experience</h5>
                  <p>Track brokerage, portfolio growth, and stock price movement over time.</p>
                </div>

                <div className="register-feature-card">
                  <h5>Compete and Improve</h5>
                  <p>Compare your performance on the leaderboard and improve your strategy.</p>
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

              <form>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label register-label">First name</label>
                    <input
                      type="text"
                      className="form-control register-input"
                      placeholder="Enter first name"
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label register-label">Last name</label>
                    <input
                      type="text"
                      className="form-control register-input"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label register-label">Email address</label>
                  <input
                    type="email"
                    className="form-control register-input"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label register-label">Password</label>
                  <input
                    type="password"
                    className="form-control register-input"
                    placeholder="Create a password"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label register-label">Confirm password</label>
                  <input
                    type="password"
                    className="form-control register-input"
                    placeholder="Confirm your password"
                  />
                </div>

                <div className="form-check mb-4">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="agreeTerms"
                  />
                  <label className="form-check-label register-check-text" htmlFor="agreeTerms">
                    I agree to the terms and conditions
                  </label>
                </div>

                <button
                  type="button"
                  className="btn register-btn w-100"
                  onClick={onRegister}
                >
                  Create Account
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