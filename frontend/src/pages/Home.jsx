import { Link } from "react-router-dom";
import stockPreview from "../assets/Stock Images.jpg";
import "./Home.css";

function Home() {
    return (
        <div className="home-page">
            <div className="home-layout">
                <section className="home-hero-content">
                    <div className="home-hero-badge">Budding Share Market Investor</div>

                    <h1 className="home-hero-title">
                        Master the ASX with <span>$1,000,000</span> Virtual Cash.
                    </h1>

                    <p className="home-hero-description">
                        The ultimate risk-free stock market simulator. Trade real ASX stocks in
                        real-time and climb the global leaderboard.
                    </p>

                    <div className="home-cta-group">
                        <Link to="/register" className="home-cta-primary">Create Account</Link>
                        <Link to="/" className="home-cta-secondary">Go to Login </Link>
                    </div>
                </section>

                <section className="home-visual-panel">
                    <div className="home-market-preview-card">
                        <img src={stockPreview} alt="Stock market dashboard preview" className="home-market-preview-image" />
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Home;
