import './Dashboard.css'

function Dashboard() {
  const identity = localStorage.getItem('identity') || 'Investor'

  const portfolioCards = [
    { title: 'Available Balance', value: '$1,000,000', change: '+0.00%' },
    { title: 'Portfolio Value', value: '$1,245,320', change: '+4.53%' },
    { title: 'Total Profit/Loss', value: '+$245,320', change: '+24.53%' },
    { title: 'Active Holdings', value: '6 Stocks', change: 'Updated today' }
  ]

  const watchlist = [
    { symbol: 'BHP', name: 'BHP Group', price: '$45.12', change: '+1.24%' },
    { symbol: 'CBA', name: 'Commonwealth Bank', price: '$118.45', change: '+0.82%' },
    { symbol: 'TLS', name: 'Telstra Group', price: '$3.94', change: '-0.31%' },
    { symbol: 'WES', name: 'Wesfarmers', price: '$67.28', change: '+0.56%' }
  ]

  const holdings = [
    { symbol: 'BHP', shares: 120, avgPrice: '$41.20', currentPrice: '$45.12', value: '$5,414.40' },
    { symbol: 'CBA', shares: 40, avgPrice: '$110.10', currentPrice: '$118.45', value: '$4,738.00' },
    { symbol: 'TLS', shares: 500, avgPrice: '$3.60', currentPrice: '$3.94', value: '$1,970.00' }
  ]

  const recentActivity = [
    'Bought 50 BHP shares at $44.80',
    'Sold 20 TLS shares at $3.90',
    'Portfolio value increased by 1.8% today',
    'CBA added to watchlist'
  ]

  return (
    <div className="dashboard-page">
      <div className="container py-5">
        <div className="dashboard-hero">
          <div>
            <p className="dashboard-eyebrow">Welcome back</p>
            <h1 className="dashboard-title">{identity}&apos;s Dashboard</h1>
            <p className="dashboard-subtitle">
              Track your portfolio, monitor stock performance, and manage your trading activity in one place.
            </p>
          </div>

          <div className="dashboard-hero-badge">
            Market Status
            <span>Open</span>
          </div>
        </div>

        <div className="row g-4 mb-4">
          {portfolioCards.map((card) => (
            <div className="col-md-6 col-xl-3" key={card.title}>
              <div className="dashboard-card stat-card">
                <p className="stat-label">{card.title}</p>
                <h3 className="stat-value">{card.value}</h3>
                <span className="stat-change">{card.change}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-4">
          <div className="col-xl-8">
            <div className="dashboard-card mb-4">
              <div className="section-header">
                <div>
                  <h3 className="section-title">Portfolio Overview</h3>
                  <p className="section-subtitle">A quick snapshot of your current trading position</p>
                </div>
                <button className="dashboard-btn" type="button">
                  View Full Portfolio
                </button>
              </div>

              <div className="dashboard-chart-placeholder">
                <div className="chart-line"></div>
                <div className="chart-line chart-line--two"></div>
                <div className="chart-line chart-line--three"></div>
                <p>Portfolio performance chart placeholder</p>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="section-header">
                <div>
                  <h3 className="section-title">Current Holdings</h3>
                  <p className="section-subtitle">Your active stock positions</p>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table dashboard-table align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Symbol</th>
                      <th>Shares</th>
                      <th>Avg Price</th>
                      <th>Current Price</th>
                      <th>Total Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {holdings.map((item) => (
                      <tr key={item.symbol}>
                        <td>{item.symbol}</td>
                        <td>{item.shares}</td>
                        <td>{item.avgPrice}</td>
                        <td>{item.currentPrice}</td>
                        <td>{item.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="col-xl-4">
            <div className="dashboard-card mb-4">
              <div className="section-header">
                <div>
                  <h3 className="section-title">Watchlist</h3>
                  <p className="section-subtitle">Stocks you are monitoring</p>
                </div>
              </div>

              <div className="watchlist">
                {watchlist.map((stock) => (
                  <div className="watchlist-item" key={stock.symbol}>
                    <div>
                      <h4>{stock.symbol}</h4>
                      <p>{stock.name}</p>
                    </div>
                    <div className="watchlist-price">
                      <strong>{stock.price}</strong>
                      <span className={stock.change.startsWith('-') ? 'negative' : 'positive'}>
                        {stock.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="dashboard-card mb-4">
              <div className="section-header">
                <div>
                  <h3 className="section-title">Quick Actions</h3>
                  <p className="section-subtitle">Common actions for investors</p>
                </div>
              </div>

              <div className="quick-actions">
                <button type="button" className="dashboard-btn w-100">Buy Shares</button>
                <button type="button" className="dashboard-btn dashboard-btn--secondary w-100">Sell Shares</button>
                <button type="button" className="dashboard-btn dashboard-btn--secondary w-100">View Transactions</button>
                <button type="button" className="dashboard-btn dashboard-btn--secondary w-100">Open Watchlist</button>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="section-header">
                <div>
                  <h3 className="section-title">Recent Activity</h3>
                  <p className="section-subtitle">Latest updates on your account</p>
                </div>
              </div>

              <ul className="activity-list">
                {recentActivity.map((activity, index) => (
                  <li key={index}>{activity}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard