import { Link } from "react-router-dom";
import "./Login.css";

function Login() {
  return (
    <div className="login-page">
      <div className="container-fluid min-vh-100">
        <div className="row min-vh-100">
          <div className="col-lg-6 d-none d-lg-flex login-brand-side">
            <div className="brand-overlay"></div>

            <div className="brand-content">
              <div className="brand-badge mb-4">
                Budding Share Market Investor
              </div>

              <h1 className="brand-title">Learn to trade with confidence.</h1>

              <p className="brand-subtitle">
                A modern stock market simulator where players can build
                portfolios, track prices, compete on the leaderboard, and learn
                trading without real risk.
              </p>

              <div className="feature-list mt-4">
                <div className="feature-card">
                  <h5>Virtual Starting Balance</h5>
                  <p>
                    Begin with $1,000,000 in simulated funds and test your
                    strategy.
                  </p>
                </div>

                <div className="feature-card">
                  <h5>Track Market Movement</h5>
                  <p>
                    Monitor stock price changes and review trends through clean
                    charts.
                  </p>
                </div>

                <div className="feature-card">
                  <h5>Compete With Others</h5>
                  <p>
                    Climb the leaderboard and compare your portfolio against
                    other players.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6 d-flex align-items-center justify-content-center login-form-side">
            <div className="login-card shadow-lg">
              <div className="mb-4 text-center text-lg-start">
                <div className="small-label mb-2">Welcome back</div>
                <h2 className="login-title">Sign in to your account</h2>
                <p className="login-subtitle">
                  Enter your details below to access your trading dashboard.
                </p>
              </div>

              <form>
                <div className="mb-3">
                  <label className="form-label custom-label">
                    Email address
                  </label>
                  <input
                    type="email"
                    className="form-control custom-input"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label custom-label">Password</label>
                  <input
                    type="password"
                    className="form-control custom-input"
                    placeholder="Enter your password"
                  />
                </div>

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="rememberMe"
                    />
                    <label
                      className="form-check-label remember-text"
                      htmlFor="rememberMe"
                    >
                      Remember me
                    </label>
                  </div>

                  <button type="button" className="forgot-link forgot-btn">
                    Forgot password?
                  </button>
                </div>

                <button type="button" className="btn login-btn w-100 mb-3">
                  Sign In
                </button>

                <button type="button" className="btn guest-btn w-100 mb-4">
                  Continue as Guest
                </button>
              </form>

              <div className="divider">
                <span>or</span>
              </div>

              <p className="register-text text-center mt-4 mb-0">
                Don&apos;t have an account?{" "}
                <Link to="/register" className="register-link">
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
