import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import './Dashboard.css'

function Dashboard() {
  const navigate = useNavigate()
  const identity = localStorage.getItem('identity') || 'Investor'

  const [accounts, setAccounts] = useState([])
  const [selectedAccountId, setSelectedAccountId] = useState('')
  const [holdings, setHoldings] = useState([])
  const [accountsLoading, setAccountsLoading] = useState(true)
  const [holdingsLoading, setHoldingsLoading] = useState(false)
  const [openingAccount, setOpeningAccount] = useState(false)
  const [newAccountName, setNewAccountName] = useState('')
  const [showCreateAccountForm, setShowCreateAccountForm] = useState(false)
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
        setSelectedAccountId((prev) =>
          prev && accountList.some((account) => String(account.id) === String(prev))
            ? prev
            : String(accountList[0].id)
        )
      } else {
        setSelectedAccountId('')
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
    const trimmedName = newAccountName.trim()

    if (!trimmedName) {
      setError('Please enter an account name.')
      return
    }

    setOpeningAccount(true)
    setError('')
    setSuccessMessage('')

    try {
      const response = await api.post('/dashboard/accounts', {
        accountName: trimmedName
      })

      const createdAccount = response.data

      setSuccessMessage('Trading account created successfully.')
      setNewAccountName('')
      setShowCreateAccountForm(false)

      await fetchAccounts()

      if (createdAccount?.id) {
        setSelectedAccountId(String(createdAccount.id))
      }
    } catch (err) {
      setError(err?.response?.data || 'Failed to create trading account.')
    } finally {
      setOpeningAccount(false)
      setTimeout(() => setSuccessMessage(''), 2500)
    }
  }

  const handleRefresh = async () => {
    if (selectedAccountId) {
      await fetchHoldings(selectedAccountId)
    } else {
      await fetchAccounts()
    }
  }

  const selectedAccount = useMemo(() => {
    return (
      accounts.find(
        (account) => String(account.id) === String(selectedAccountId)
      ) || null
    )
  }, [accounts, selectedAccountId])

  const accountBalance = selectedAccount
    ? parseFloat(selectedAccount.balance)
    : 0

  const holdingsValue = holdings.reduce(
    (sum, item) => sum + (item.currentValue || 0),
    0
  )

  const totalProfitLoss = holdings.reduce(
    (sum, item) => sum + (item.profitLoss || 0),
    0
  )

  const totalPortfolioValue = accountBalance + holdingsValue

  const topHolding = useMemo(() => {
    if (!holdings.length) return null

    return [...holdings].sort(
      (a, b) => (b.profitLoss || 0) - (a.profitLoss || 0)
    )[0]
  }, [holdings])

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

  const stats = [
    {
      title: 'Available Balance',
      value: formatCurrency(accountBalance),
      note: 'Cash ready to trade'
    },
    {
      title: 'Holdings Value',
      value: formatCurrency(holdingsValue),
      note: 'Current market value'
    },
    {
      title: 'Total Portfolio Value',
      value: formatCurrency(totalPortfolioValue),
      note: 'Balance + holdings'
    },
    {
      title: 'Profit / Loss',
      value: formatCurrency(totalProfitLoss),
      note: totalProfitLoss >= 0 ? 'Overall gain' : 'Overall loss',
      positive: totalProfitLoss >= 0
    }
  ]

  return (
    <div className="dashboard-page">
      <div className="container py-5">
        <div className="dashboard-hero">
          <div>
            <p className="dashboard-eyebrow">Welcome back</p>
            <h1 className="dashboard-title">{identity}&apos;s Dashboard</h1>
            <p className="dashboard-subtitle">
              View your trading accounts, portfolio balance, and current holdings
              from your connected backend data.
            </p>
          </div>

          <div className="dashboard-hero-badge">
            Account Status
            <span>{accounts.length > 0 ? `${accounts.length} Account${accounts.length > 1 ? 's' : ''}` : 'Not Opened'}</span>
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
          <div className="dashboard-card empty-state-card">
            <h3 className="section-title mb-2">Loading dashboard...</h3>
            <p className="section-subtitle mb-0">
              Please wait while your account data is being loaded.
            </p>
          </div>
        ) : accounts.length === 0 ? (
          <div className="dashboard-card empty-state-card">
            <h2 className="section-title mb-3">No Trading Account Yet</h2>
            <p className="section-subtitle mb-4">
              Create your first trading account to start tracking your balance,
              portfolio value, and holdings.
            </p>

            <div className="create-account-inline">
              <input
                type="text"
                className="form-control dashboard-input"
                placeholder="Enter account name"
                value={newAccountName}
                onChange={(e) => setNewAccountName(e.target.value)}
              />
              <button
                type="button"
                className="dashboard-btn"
                onClick={handleCreateAccount}
                disabled={openingAccount}
              >
                {openingAccount ? 'Creating...' : 'Open Trading Account'}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="dashboard-card account-picker-card mb-4">
              <div className="section-header">
                <div>
                  <h3 className="section-title">Trading Accounts</h3>
                  <p className="section-subtitle">
                    Select an account to view dashboard information or create another account
                  </p>
                </div>

                <button
                  type="button"
                  className="dashboard-btn dashboard-btn--secondary"
                  onClick={() => setShowCreateAccountForm((prev) => !prev)}
                >
                  {showCreateAccountForm ? 'Cancel' : 'Add Trading Account'}
                </button>
              </div>

              <div className="row align-items-end">
                <div className="col-md-6">
                  <label className="form-label dashboard-label">Account</label>
                  <select
                    className="form-select dashboard-select"
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

              {showCreateAccountForm && (
                <div className="create-account-panel mt-4">
                  <label className="form-label dashboard-label">New account name</label>
                  <div className="create-account-inline">
                    <input
                      type="text"
                      className="form-control dashboard-input"
                      placeholder="Example: Growth Portfolio"
                      value={newAccountName}
                      onChange={(e) => setNewAccountName(e.target.value)}
                    />
                    <button
                      type="button"
                      className="dashboard-btn"
                      onClick={handleCreateAccount}
                      disabled={openingAccount}
                    >
                      {openingAccount ? 'Creating...' : 'Create Account'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="row g-4 mb-4">
              {stats.map((card) => (
                <div className="col-md-6 col-xl-3" key={card.title}>
                  <div className="dashboard-card stat-card">
                    <p className="stat-label">{card.title}</p>
                    <h3 className="stat-value">{card.value}</h3>
                    <span
                      className={
                        card.title === 'Profit / Loss'
                          ? card.positive
                            ? 'stat-change positive'
                            : 'stat-change negative'
                          : 'stat-change'
                      }
                    >
                      {card.note}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="row g-4">
              <div className="col-xl-8">
                <div className="dashboard-card mb-4">
                  <div className="section-header">
                    <div>
                      <h3 className="section-title">Current Holdings</h3>
                      <p className="section-subtitle">
                        Holdings currently attached to this account
                      </p>
                    </div>

                    <button
                      className="dashboard-btn"
                      type="button"
                      onClick={() => navigate('/portfolio')}
                    >
                      View Full Portfolio
                    </button>
                  </div>

                  {holdingsLoading ? (
                    <p className="mb-0">Loading holdings...</p>
                  ) : holdings.length === 0 ? (
                    <div className="empty-holdings-state">
                      <h4>No holdings yet</h4>
                      <p>
                        When shares are purchased, your holdings will appear here
                        with current price and profit/loss data.
                      </p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table dashboard-table align-middle mb-0">
                        <thead>
                          <tr>
                            <th>Stock</th>
                            <th>Shares</th>
                            <th>Avg Price</th>
                            <th>Current Price</th>
                            <th>Total Value</th>
                            <th>Profit/Loss</th>
                          </tr>
                        </thead>
                        <tbody>
                          {holdings.map((item) => (
                            <tr key={item.stockSymbol}>
                              <td>
                                <div className="dashboard-stock-cell">
                                  <strong>{item.stockSymbol}</strong>
                                  <span>{item.companyName}</span>
                                </div>
                              </td>
                              <td>{item.quantity}</td>
                              <td>{formatCurrency(item.averageBuyPrice)}</td>
                              <td>{formatCurrency(item.currentPrice)}</td>
                              <td>{formatCurrency(item.currentValue)}</td>
                              <td
                                className={
                                  item.profitLoss >= 0 ? 'positive' : 'negative'
                                }
                              >
                                {formatCurrency(item.profitLoss)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className="dashboard-card">
                  <div className="section-header">
                    <div>
                      <h3 className="section-title">Portfolio Snapshot</h3>
                      <p className="section-subtitle">
                        Visual placeholder for portfolio analytics
                      </p>
                    </div>
                  </div>

                  <div className="dashboard-chart-placeholder">
                    <div className="chart-line"></div>
                    <div className="chart-line chart-line--two"></div>
                    <div className="chart-line chart-line--three"></div>
                    <p>Portfolio analytics chart can be connected later</p>
                  </div>
                </div>
              </div>

              <div className="col-xl-4">
                <div className="dashboard-card mb-4">
                  <div className="section-header">
                    <div>
                      <h3 className="section-title">Account Details</h3>
                      <p className="section-subtitle">
                        Summary of this trading account
                      </p>
                    </div>
                  </div>

                  <div className="watchlist">
                    <div className="watchlist-item">
                      <div>
                        <h4>Account Name</h4>
                        <p>{selectedAccount?.accountName || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="watchlist-item">
                      <div>
                        <h4>Account ID</h4>
                        <p>#{selectedAccount?.id || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="watchlist-item">
                      <div>
                        <h4>Total Accounts</h4>
                        <p>{accounts.length}</p>
                      </div>
                    </div>

                    <div className="watchlist-item">
                      <div>
                        <h4>Top Performer</h4>
                        <p>
                          {topHolding
                            ? `${topHolding.stockSymbol} (${formatCurrency(
                                topHolding.profitLoss
                              )})`
                            : 'No holdings yet'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="dashboard-card mb-4">
                  <div className="section-header">
                    <div>
                      <h3 className="section-title">Allocation</h3>
                      <p className="section-subtitle">
                        Current portfolio distribution
                      </p>
                    </div>
                  </div>

                  {allocation.length === 0 ? (
                    <p className="mb-0">No allocation data available yet.</p>
                  ) : (
                    <div className="watchlist">
                      {allocation.map((stock) => (
                        <div className="watchlist-item" key={stock.symbol}>
                          <div>
                            <h4>{stock.symbol}</h4>
                            <p>{stock.companyName}</p>
                          </div>
                          <div className="watchlist-price">
                            <strong>{stock.percentage}%</strong>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="dashboard-card">
                  <div className="section-header">
                    <div>
                      <h3 className="section-title">Quick Actions</h3>
                      <p className="section-subtitle">
                        Useful actions for your account
                      </p>
                    </div>
                  </div>

                  <div className="quick-actions">
                    <button
                      type="button"
                      className="dashboard-btn w-100"
                      onClick={() => navigate('/portfolio')}
                    >
                      Open Portfolio
                    </button>

                    <button
                      type="button"
                      className="dashboard-btn dashboard-btn--secondary w-100"
                      onClick={handleRefresh}
                    >
                      Refresh Data
                    </button>

                    <button
                      type="button"
                      className="dashboard-btn dashboard-btn--secondary w-100"
                      onClick={() => navigate('/profile')}
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Dashboard