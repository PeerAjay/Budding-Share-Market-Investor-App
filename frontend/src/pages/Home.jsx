import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="container py-5">
            <div className="text-center mb-5">
                <h1 className="display-5 fw-bold">Budding Share Market Investor</h1>
                <p className="lead text-muted">
                    Practice trading strategies in a simulated market before investing for real.
                </p>
            </div>

            <div className="row g-4">
                <div className="col-md-4">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Build Your Portfolio</h5>
                            <p className="card-text">
                                Buy and sell virtual stocks to test your ideas and improve decision making.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Track Performance</h5>
                            <p className="card-text">
                                Monitor gains, losses, and long-term portfolio growth with clear data views.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Compete and Learn</h5>
                            <p className="card-text">
                                Compare your performance with other players and sharpen your market skills.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center mt-5 d-flex justify-content-center gap-3">
                <Link to="/" className="btn btn-primary">
                    Go to Login
                </Link>
                <Link to="/register" className="btn btn-outline-primary">
                    Create Account
                </Link>
            </div>
        </div>
    );
}

export default Home;
