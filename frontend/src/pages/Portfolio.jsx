import { useEffect, useMemo, useState } from 'react'
import api from '../services/api'
import './Portfolio.css'

function Portfolio() {
  const identity = localStorage.getItem('identity') || 'Investor'

  const [accounts, setAccounts] = useState([])
  const [selectedAccountId, setSelectedAccountId] = useState('')
  const [holdings, setHoldings] = useState([])
  const [accountsLoading, setAccountsLoading] = useState(true)
  const [holdingsLoading, setHoldingsLoading] = useState(false)
  const [openingAccount, setOpeningAccount] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    fetchAccounts()
  }, [])

  useEffect(() => {
    if (selectedAccountId) {
      fetchHoldings(selectedAccountId)
    } else {
      setHoldings([])
    }
  }, [selectedAccountId])

  const fetchAccounts = async () => {
    setAccountsLoading(true)
    setError('')

    try {
      const response = await api.get('/dashboard/accounts')
      const accountList = response.data || []

      setAccounts(accountList)

      if (accountList.length > 0) {
        setSelectedAccountId(String(accountList[0].id))
      }
    } catch (err) {
      setError(err?.response?.data || 'Failed to load trading accounts.')
    } finally {
      setAccountsLoading(false)
    }
  }

  const fetchHoldings = async (accountId) => {
    setHoldingsLoading(true)
    setError('')

    try {
      const response = await api.get(`/portfolio/${accountId}/holdings`)
      setHoldings(response.data || [])
    } catch (err) {
      setError(err?.response?.data || 'Failed to load holdings.')
    } finally {
      setHoldingsLoading(false)
    }
  }

  const handleCreateAccount = async () => {
    setOpeningAccount(true)
    setError('')
    setSuccessMessage('')

    try {
      await api.post('/dashboard/accounts', {
        accountName: 'Main Trading Account'
      })

      setSuccessMessage('Trading account created successfully.')
      await fetchAccounts()
    } catch (err) {
      setError(err?.response?.data || 'Failed to create trading account.')
    } finally {
      setOpeningAccount(false)
      setTimeout(() => setSuccessMessage(''), 2500)
    }
  }

  const selectedAccount = useMemo(() => {
    return accounts.find((account) => String(account.id) === String(selectedAccountId)) || null
  }, [accounts, selectedAccountId])

  const accountBalance = selectedAccount ? parseFloat(selectedAccount.balance) : 0
  const holdingsValue = holdings.reduce((sum, item) => sum + (item.currentValue || 0), 0)
  const totalProfitLoss = holdings.reduce((sum, item) => sum + (item.profitLoss || 0), 0)
  const totalPortfolioValue = accountBalance + holdingsValue

  const allocation = useMemo(() => {
    const total = holdings.reduce((sum, item) => sum + (item.currentValue || 0), 0)

    if (!total) return []

    return holdings.map((item) => ({
      symbol: item.stockSymbol,
      companyName: item.companyName,
      percentage: ((item.currentValue / total) * 100).toFixed(1)
    }))
  }, [holdings])

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(value || 0)

  return (
    <div className="portfolio-page">
      <div className="container py-5">
        <div className="portfolio-hero">
          <div>
            <p className="portfolio-eyebrow">Portfolio Overview</p>
            <h1 className="portfolio-title">{identity}&apos;s Portfolio</h1>
            <p className="portfolio-subtitle">
              Review your holdings, account balance, and current portfolio
              performance using live-backed portfolio data.
            </p>
          </div>

          <div className="portfolio-badge">
            Holdings
            <span>{holdings.length} Active Positions</span>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger mb-4" role="alert">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success mb-4" role="alert">
            {successMessage}
          </div>
        )}

        {accountsLoading ? (
          <div className="portfolio-card">
            <h3 className="portfolio-section-title">Loading accounts...</h3>
          </div>
        ) : accounts.length === 0 ? (
          <div className="portfolio-card empty-state-card">
            <h2 className="portfolio-section-title mb-3">No Trading Account Yet</h2>
            <p className="portfolio-section-subtitle mb-4">
              Create your trading account to start tracking holdings and building your portfolio.
            </p>

            <button
              type="button"
              className="portfolio-btn"
              onClick={handleCreateAccount}
              disabled={openingAccount}
            >
              {openingAccount ? 'Creating Account...' : 'Open Trading Account'}
            </button>
          </div>
        ) : (
          <>
            <div className="portfolio-card account-picker-card mb-4">
              <div className="portfolio-section-header">
                <div>
                  <h3 className="portfolio-section-title">Trading Account</h3>
                  <p className="portfolio-section-subtitle">
                    Select which account portfolio to view
                  </p>
                </div>
              </div>

              <div className="row align-items-end">
                <div className="col-md-6">
                  <label className="form-label portfolio-label">Account</label>
                  <select
                    className="form-select portfolio-select"
                    value={selectedAccountId}
                    onChange={(e) => setSelectedAccountId(e.target.value)}
                  >
                    {accounts.map((account, index) => (
                      <option key={account.id} value={account.id}>
                        {account.accountName} - #{index + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6 mt-3 mt-md-0">
                  <div className="account-meta">
                    <span>Created</span>
                    <strong>
                      {selectedAccount?.createdAt
                        ? new Date(selectedAccount.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-4 mb-4">
              <div className="col-md-6 col-xl-3">
                <div className="portfolio-card summary-card">
                  <p className="summary-label">Available Balance</p>
                  <h3 className="summary-value">{formatCurrency(accountBalance)}</h3>
                  <span className="summary-note">Cash ready to trade</span>
                </div>
              </div>

              <div className="col-md-6 col-xl-3">
                <div className="portfolio-card summary-card">
                  <p className="summary-label">Holdings Value</p>
                  <h3 className="summary-value">{formatCurrency(holdingsValue)}</h3>
                  <span className="summary-note">Current market value</span>
                </div>
              </div>

              <div className="col-md-6 col-xl-3">
                <div className="portfolio-card summary-card">
                  <p className="summary-label">Total Portfolio Value</p>
                  <h3 className="summary-value">{formatCurrency(totalPortfolioValue)}</h3>
                  <span className="summary-note">Balance + holdings</span>
                </div>
              </div>

              <div className="col-md-6 col-xl-3">
                <div className="portfolio-card summary-card">
                  <p className="summary-label">Profit / Loss</p>
                  <h3 className="summary-value">{formatCurrency(totalProfitLoss)}</h3>
                  <span className={totalProfitLoss >= 0 ? 'summary-note profit-text' : 'summary-note loss-text'}>
                    {totalProfitLoss >= 0 ? 'Overall gain' : 'Overall loss'}
                  </span>
                </div>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-xl-8">
                <div className="portfolio-card">
                  <div className="portfolio-section-header">
                    <div>
                      <h3 className="portfolio-section-title">Current Holdings</h3>
                      <p className="portfolio-section-subtitle">
                        Stocks currently held in this trading account
                      </p>
                    </div>
                  </div>

                  {holdingsLoading ? (
                    <p className="mb-0">Loading holdings...</p>
                  ) : holdings.length === 0 ? (
                    <div className="empty-holdings-state">
                      <h4>No holdings yet</h4>
                      <p>
                        Once stocks are purchased, they will appear here with average
                        buy price, current value, and profit/loss.
                      </p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table portfolio-table align-middle mb-0">
                        <thead>
                          <tr>
                            <th>Stock</th>
                            <th>Shares</th>
                            <th>Avg Price</th>
                            <th>Current Price</th>
                            <th>Market Value</th>
                            <th>Profit/Loss</th>
                          </tr>
                        </thead>
                        <tbody>
                          {holdings.map((stock) => (
                            <tr key={stock.stockSymbol}>
                              <td>
                                <div className="portfolio-stock-cell">
                                  <strong>{stock.stockSymbol}</strong>
                                  <span>{stock.companyName}</span>
                                </div>
                              </td>
                              <td>{stock.quantity}</td>
                              <td>{formatCurrency(stock.averageBuyPrice)}</td>
                              <td>{formatCurrency(stock.currentPrice)}</td>
                              <td>{formatCurrency(stock.currentValue)}</td>
                              <td className={stock.profitLoss >= 0 ? 'profit-text' : 'loss-text'}>
                                {formatCurrency(stock.profitLoss)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              <div className="col-xl-4">
                <div className="portfolio-card mb-4">
                  <div className="portfolio-section-header">
                    <div>
                      <h3 className="portfolio-section-title">Allocation</h3>
                      <p className="portfolio-section-subtitle">
                        Current portfolio weight by holding value
                      </p>
                    </div>
                  </div>

                  {allocation.length === 0 ? (
                    <p className="mb-0">No allocation data available yet.</p>
                  ) : (
                    <div className="allocation-list">
                      {allocation.map((item) => (
                        <div className="allocation-item" key={item.symbol}>
                          <div>
                            <strong>{item.symbol}</strong>
                            <span>{item.companyName}</span>
                          </div>
                          <span>{item.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  )}
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
                    <li>Portfolio values update from the backend holdings endpoint.</li>
                    <li>Current prices are calculated per holding response.</li>
                    <li>Buy and sell activity will affect both balance and holdings.</li>
                    <li>Graphs and historical trends can be layered in later.</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Portfolio