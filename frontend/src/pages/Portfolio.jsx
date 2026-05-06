import './Portfolio.css'

function Portfolio() {
  const identity = localStorage.getItem('identity') || 'Investor'

  const summaryCards = [
    { title: 'Total Portfolio Value', value: '$1,245,320', note: '+24.53%' },
    { title: 'Total Invested', value: '$1,000,000', note: 'Initial capital' },
    { title: 'Unrealised Profit/Loss', value: '+$245,320', note: 'Across holdings' },
    { title: 'Cash Available', value: '$126,540', note: 'Ready to trade' }
  ]

  const holdings = [
    {
      symbol: 'BHP',
      company: 'BHP Group',
      shares: 120,
      avgPrice: '$41.20',
      currentPrice: '$45.12',
      marketValue: '$5,414.40',
      gainLoss: '+$470.40'
    },
    {
      symbol: 'CBA',
      company: 'Commonwealth Bank',
      shares: 40,
      avgPrice: '$110.10',
      currentPrice: '$118.45',
      marketValue: '$4,738.00',
      gainLoss: '+$334.00'
    },
    {
      symbol: 'TLS',
      company: 'Telstra Group',
      shares: 500,
      avgPrice: '$3.60',
      currentPrice: '$3.94',
      marketValue: '$1,970.00',
      gainLoss: '+$170.00'
    },
    {
      symbol: 'WES',
      company: 'Wesfarmers',
      shares: 35,
      avgPrice: '$63.20',
      currentPrice: '$67.28',
      marketValue: '$2,354.80',
      gainLoss: '+$142.80'
    }
  ]

  return (
    <div className="portfolio-page">
      <div className="container py-5">
        <div className="portfolio-hero">
          <div>
            <p className="portfolio-eyebrow">Portfolio Overview</p>
            <h1 className="portfolio-title">{identity}&apos;s Portfolio</h1>
            <p className="portfolio-subtitle">
              Review your holdings, monitor investment performance, and track
              the current value of your portfolio.
            </p>
          </div>

          <div className="portfolio-badge">
            Holdings
            <span>{holdings.length} Active Positions</span>
          </div>
        </div>

        <div className="row g-4 mb-4">
          {summaryCards.map((card) => (
            <div className="col-md-6 col-xl-3" key={card.title}>
              <div className="portfolio-card summary-card">
                <p className="summary-label">{card.title}</p>
                <h3 className="summary-value">{card.value}</h3>
                <span className="summary-note">{card.note}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-4">
          <div className="col-xl-8">
            <div className="portfolio-card">
              <div className="portfolio-section-header">
                <div>
                  <h3 className="portfolio-section-title">Current Holdings</h3>
                  <p className="portfolio-section-subtitle">
                    Shares currently owned in your simulated account
                  </p>
                </div>

                <button type="button" className="portfolio-btn">
                  Add Stock
                </button>
              </div>

              <div className="table-responsive">
                <table className="table portfolio-table align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Stock</th>
                      <th>Shares</th>
                      <th>Avg Price</th>
                      <th>Current Price</th>
                      <th>Market Value</th>
                      <th>Gain/Loss</th>
                    </tr>
                  </thead>
                  <tbody>
                    {holdings.map((stock) => (
                      <tr key={stock.symbol}>
                        <td>
                          <div className="portfolio-stock-cell">
                            <strong>{stock.symbol}</strong>
                            <span>{stock.company}</span>
                          </div>
                        </td>
                        <td>{stock.shares}</td>
                        <td>{stock.avgPrice}</td>
                        <td>{stock.currentPrice}</td>
                        <td>{stock.marketValue}</td>
                        <td
                          className={
                            stock.gainLoss.startsWith('-')
                              ? 'loss-text'
                              : 'profit-text'
                          }
                        >
                          {stock.gainLoss}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="col-xl-4">
            <div className="portfolio-card mb-4">
              <div className="portfolio-section-header">
                <div>
                  <h3 className="portfolio-section-title">Allocation</h3>
                  <p className="portfolio-section-subtitle">
                    Example distribution of your investments
                  </p>
                </div>
              </div>

              <div className="allocation-list">
                <div className="allocation-item">
                  <div>
                    <strong>BHP</strong>
                    <span>Resources</span>
                  </div>
                  <span>32%</span>
                </div>

                <div className="allocation-item">
                  <div>
                    <strong>CBA</strong>
                    <span>Banking</span>
                  </div>
                  <span>28%</span>
                </div>

                <div className="allocation-item">
                  <div>
                    <strong>TLS</strong>
                    <span>Telecommunications</span>
                  </div>
                  <span>18%</span>
                </div>

                <div className="allocation-item">
                  <div>
                    <strong>WES</strong>
                    <span>Retail / Industrials</span>
                  </div>
                  <span>22%</span>
                </div>
              </div>
            </div>

            <div className="portfolio-card mb-4">
              <div className="portfolio-section-header">
                <div>
                  <h3 className="portfolio-section-title">Quick Actions</h3>
                  <p className="portfolio-section-subtitle">
                    Common portfolio actions
                  </p>
                </div>
              </div>

              <div className="portfolio-actions">
                <button type="button" className="portfolio-btn w-100">
                  Buy Shares
                </button>
                <button
                  type="button"
                  className="portfolio-btn portfolio-btn--secondary w-100"
                >
                  Sell Shares
                </button>
                <button
                  type="button"
                  className="portfolio-btn portfolio-btn--secondary w-100"
                >
                  View Transactions
                </button>
              </div>
            </div>

            <div className="portfolio-card">
              <div className="portfolio-section-header">
                <div>
                  <h3 className="portfolio-section-title">Insights</h3>
                  <p className="portfolio-section-subtitle">
                    Helpful portfolio notes
                  </p>
                </div>
              </div>

              <ul className="portfolio-insights">
                <li>Your strongest performing holding is currently BHP.</li>
                <li>Your portfolio is weighted toward large-cap ASX stocks.</li>
                <li>Portfolio analytics and graphs can be added later.</li>
                <li>Live valuation can be connected once backend data is ready.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Portfolio