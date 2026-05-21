import { useEffect, useMemo, useState } from 'react'
import api from '../services/api'
import './AdminDashboard.css'

function AdminDashboard() {
  const identity = localStorage.getItem('identity') || 'Admin'

  const [stocks, setStocks] = useState([])
  const [accounts, setAccounts] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [transactions, setTransactions] = useState([])
  const [selectedAccountId, setSelectedAccountId] = useState('')
  const [loading, setLoading] = useState(true)
  const [transactionsLoading, setTransactionsLoading] = useState(false)
  const [refreshingStocks, setRefreshingStocks] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    fetchAdminData()
  }, [])

  useEffect(() => {
    if (selectedAccountId) {
      fetchTransactions(selectedAccountId)
    } else {
      setTransactions([])
    }
  }, [selectedAccountId])

  const fetchAdminData = async () => {
    setLoading(true)
    setError('')

    try {
      const [stocksRes, leaderboardRes, accountsRes] = await Promise.all([
        api.get('/stocks'),
        api.get('/leaderboard'),
        api.get('/dashboard/accounts')
      ])

      const stocksData = stocksRes.data || []
      const leaderboardData = leaderboardRes.data?.leaderboard || []
      const accountsData = accountsRes.data || []

      setStocks(stocksData)
      setLeaderboard(leaderboardData)
      setAccounts(accountsData)

      if (accountsData.length > 0) {
        setSelectedAccountId((prev) =>
          prev && accountsData.some((account) => String(account.id) === String(prev))
            ? prev
            : String(accountsData[0].id)
        )
      } else {
        setSelectedAccountId('')
      }
    } catch (err) {
      setError(err?.response?.data || 'Failed to load admin dashboard data.')
    } finally {
      setLoading(false)
    }
  }

  const fetchTransactions = async (accountId) => {
    setTransactionsLoading(true)
    setError('')

    try {
      const response = await api.get(`/transactions/account/${accountId}`)
      setTransactions(response.data || [])
    } catch (err) {
      setError(err?.response?.data || 'Failed to load transactions.')
    } finally {
      setTransactionsLoading(false)
    }
  }

  const handleRefreshStocks = async () => {
    setRefreshingStocks(true)
    setError('')
    setSuccessMessage('')

    try {
      await api.post('/stocks/refresh')
      setSuccessMessage('Stock prices refreshed successfully.')
      await fetchAdminData()
    } catch (err) {
      setError(err?.response?.data || 'Failed to refresh stocks.')
    } finally {
      setRefreshingStocks(false)
      setTimeout(() => setSuccessMessage(''), 2500)
    }
  }

  const selectedAccount = useMemo(() => {
    return accounts.find((account) => String(account.id) === String(selectedAccountId)) || null
  }, [accounts, selectedAccountId])

  const totalBalance = useMemo(() => {
    return accounts.reduce((sum, account) => sum + Number(account.balance || 0), 0)
  }, [accounts])

  const topStock = useMemo(() => {
    if (!stocks.length) return null
    return [...stocks].sort((a, b) => Number(b.currentPrice || 0) - Number(a.currentPrice || 0))[0]
  }, [stocks])

  const leader = leaderboard[0] || null
  const recentTransactions = transactions.slice(0, 5)

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(value || 0)

  const formatDateTime = (value) => {
    if (!value) return 'N/A'
    return new Date(value).toLocaleString()
  }

  return (
    <div className="admin-page">
      <div className="container py-5">
        <div className="admin-hero">
          <div>
            <p className="admin-eyebrow">Admin Control Centre</p>
            <h1 className="admin-title">Admin Dashboard</h1>
            <p className="admin-subtitle">
              Monitor core platform data, review trading activity, and manage
              market information from one place.
            </p>
          </div>

          <div className="admin-badge">
            Signed In
            <span>{identity}</span>
          </div>
        </div>

        <div className="admin-banner mb-4">
          This is a frontend admin dashboard using currently available backend
          endpoints. Full admin-only role gating can be connected later.
        </div>

        {error && (
          <div className="alert alert-danger mb-4" role="alert">
            {typeof error === 'string' ? error : 'Something went wrong.'}
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success mb-4" role="alert">
            {successMessage}
          </div>
        )}

        {loading ? (
          <div className="admin-card empty-state-card">
            <h3 className="admin-section-title mb-2">Loading admin dashboard...</h3>
            <p className="admin-section-subtitle mb-0">
              Please wait while platform data is being loaded.
            </p>
          </div>
        ) : (
          <>
            <div className="row g-4 mb-4">
              <div className="col-md-6 col-xl-3">
                <div className="admin-card summary-card">
                  <p className="summary-label">Tracked Stocks</p>
                  <h3 className="summary-value">{stocks.length}</h3>
                  <span className="summary-note">Available in market list</span>
                </div>
              </div>

              <div className="col-md-6 col-xl-3">
                <div className="admin-card summary-card">
                  <p className="summary-label">Trading Accounts</p>
                  <h3 className="summary-value">{accounts.length}</h3>
                  <span className="summary-note">Accounts visible to this user</span>
                </div>
              </div>

              <div className="col-md-6 col-xl-3">
                <div className="admin-card summary-card">
                  <p className="summary-label">Combined Balance</p>
                  <h3 className="summary-value">{formatCurrency(totalBalance)}</h3>
                  <span className="summary-note">Across loaded accounts</span>
                </div>
              </div>

              <div className="col-md-6 col-xl-3">
                <div className="admin-card summary-card">
                  <p className="summary-label">Current Leader</p>
                  <h3 className="summary-value">{leader?.userName || 'N/A'}</h3>
                  <span className="summary-note">
                    {leader ? formatCurrency(leader.totalValue) : 'No leaderboard data'}
                  </span>
                </div>
              </div>
            </div>

            <div className="row g-4 mb-4">
              <div className="col-xl-5">
                <div className="admin-card h-100">
                  <div className="admin-section-header">
                    <div>
                      <h3 className="admin-section-title">System Actions</h3>
                      <p className="admin-section-subtitle">
                        Quick platform-level actions and admin notes
                      </p>
                    </div>
                  </div>

                  <div className="admin-action-list">
                    <button
                      type="button"
                      className="admin-btn"
                      onClick={handleRefreshStocks}
                      disabled={refreshingStocks}
                    >
                      {refreshingStocks ? 'Refreshing Stocks...' : 'Refresh Stock Prices'}
                    </button>

                    <button
                      type="button"
                      className="admin-btn admin-btn--secondary"
                      onClick={fetchAdminData}
                    >
                      Reload Dashboard Data
                    </button>
                  </div>

                  <div className="admin-note-box mt-4">
                    <h4 className="admin-mini-title">Current Admin Scope</h4>
                    <ul className="admin-note-list">
                      <li>Monitor stocks and recent prices</li>
                      <li>Review account data and transactions</li>
                      <li>Preview leaderboard standings</li>
                      <li>Prepare UI for future admin-only features</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-xl-7">
                <div className="admin-card h-100">
                  <div className="admin-section-header">
                    <div>
                      <h3 className="admin-section-title">Leaderboard Preview</h3>
                      <p className="admin-section-subtitle">
                        Top users ranked by current total value
                      </p>
                    </div>
                  </div>

                  {leaderboard.length === 0 ? (
                    <p className="mb-0">No leaderboard data available.</p>
                  ) : (
                    <div className="admin-list">
                      {leaderboard.slice(0, 5).map((item) => (
                        <div className="admin-list-item" key={item.rank}>
                          <div className="admin-list-item__left">
                            <span className="admin-rank-pill">#{item.rank}</span>
                            <div>
                              <strong>{item.userName}</strong>
                              <span>Ranked investor</span>
                            </div>
                          </div>
                          <strong>{formatCurrency(item.totalValue)}</strong>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-xl-7">
                <div className="admin-card">
                  <div className="admin-section-header">
                    <div>
                      <h3 className="admin-section-title">Stock Registry</h3>
                      <p className="admin-section-subtitle">
                        Snapshot of tracked stocks and their current prices
                      </p>
                    </div>
                  </div>

                  {stocks.length === 0 ? (
                    <p className="mb-0">No stock data available.</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table admin-table align-middle mb-0">
                        <thead>
                          <tr>
                            <th>Symbol</th>
                            <th>Company</th>
                            <th>Current Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stocks.slice(0, 8).map((stock) => (
                            <tr key={stock.stock_id || stock.symbol}>
                              <td>
                                <strong>{stock.symbol}</strong>
                              </td>
                              <td>{stock.companyName}</td>
                              <td>{formatCurrency(stock.currentPrice)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {topStock && (
                    <div className="admin-highlight mt-4">
                      Highest priced tracked stock right now: <strong>{topStock.symbol}</strong>{' '}
                      at {formatCurrency(topStock.currentPrice)}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-xl-5">
                <div className="admin-card">
                  <div className="admin-section-header">
                    <div>
                      <h3 className="admin-section-title">Recent Transactions</h3>
                      <p className="admin-section-subtitle">
                        Activity from the selected trading account
                      </p>
                    </div>
                  </div>

                  {accounts.length > 0 && (
                    <div className="mb-3">
                      <label className="form-label admin-label">Select account</label>
                      <select
                        className="form-select admin-select"
                        value={selectedAccountId}
                        onChange={(e) => setSelectedAccountId(e.target.value)}
                      >
                        {accounts.map((account) => (
                          <option key={account.id} value={account.id}>
                            {account.accountName} - #{account.id}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="admin-account-meta mb-3">
                    <span>Selected Account</span>
                    <strong>{selectedAccount?.accountName || 'N/A'}</strong>
                  </div>

                  {transactionsLoading ? (
                    <p className="mb-0">Loading transactions...</p>
                  ) : recentTransactions.length === 0 ? (
                    <p className="mb-0">No transactions found for this account.</p>
                  ) : (
                    <div className="admin-transaction-list">
                      {recentTransactions.map((item) => (
                        <div className="admin-transaction-item" key={item.id}>
                          <div>
                            <strong>
                              {item.type} {item.stockSymbol}
                            </strong>
                            <span>{formatDateTime(item.timestamp)}</span>
                          </div>
                          <div className="admin-transaction-meta">
                            <strong>{formatCurrency(item.totalValue)}</strong>
                            <span>{item.quantity} shares</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard