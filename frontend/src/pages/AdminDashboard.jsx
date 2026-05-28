import { useEffect, useMemo, useState } from 'react'
import api from '../services/api'
import './AdminDashboard.css'

function AdminDashboard() {
  const identity = localStorage.getItem('identity') || 'Admin'

  const [users, setUsers] = useState([])
  const [stocks, setStocks] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [accounts, setAccounts] = useState([])
  const [transactions, setTransactions] = useState([])
  const [selectedUserId, setSelectedUserId] = useState('')
  const [selectedAccountId, setSelectedAccountId] = useState('')
  const [loading, setLoading] = useState(true)
  const [transactionsLoading, setTransactionsLoading] = useState(false)
  const [refreshingStocks, setRefreshingStocks] = useState(false)
  const [actionLoadingKey, setActionLoadingKey] = useState('')
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [warnings, setWarnings] = useState([])

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
    setWarnings([])

    const results = await Promise.allSettled([
      api.get('/admin/users'),
      api.get('/stocks'),
      api.get('/leaderboard'),
      api.get('/dashboard/accounts')
    ])

    const [usersRes, stocksRes, leaderboardRes, accountsRes] = results
    const nextWarnings = []

    if (usersRes.status === 'fulfilled') {
      setUsers(usersRes.value.data || [])
    } else {
      const status = usersRes.reason?.response?.status
      if (status === 403) {
        setError('Admin access denied. Sign in with an admin account to use this page.')
      } else {
        setError(usersRes.reason?.response?.data || 'Failed to load admin users.')
      }
      setUsers([])
    }

    if (stocksRes.status === 'fulfilled') {
      setStocks(stocksRes.value.data || [])
    } else {
      nextWarnings.push('Stock registry could not be loaded.')
      setStocks([])
    }

    if (leaderboardRes.status === 'fulfilled') {
      setLeaderboard(leaderboardRes.value.data?.leaderboard || [])
    } else {
      nextWarnings.push('Leaderboard preview is currently unavailable.')
      setLeaderboard([])
    }

    if (accountsRes.status === 'fulfilled') {
      const accountsData = accountsRes.value.data || []
      setAccounts(accountsData)
    } else {
      nextWarnings.push('Trading account data could not be loaded.')
      setAccounts([])
      setSelectedAccountId('')
    }

    setWarnings(nextWarnings)
    setLoading(false)
  }

  const fetchTransactions = async (accountId) => {
    setTransactionsLoading(true)

    try {
      const response = await api.get(`/transactions/account/${accountId}`)
      setTransactions(response.data || [])
    } catch (err) {
      setTransactions([])
      setWarnings((prev) => {
        const message = 'Recent transactions could not be loaded for the selected account.'
        return prev.includes(message) ? prev : [...prev, message]
      })
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
      setError(err?.response?.data || 'Failed to refresh stock prices.')
    } finally {
      setRefreshingStocks(false)
      setTimeout(() => setSuccessMessage(''), 2500)
    }
  }

  const handleToggleBanUser = async (user) => {
    const isBanned = Boolean(user.banned)
    const endpoint = isBanned
      ? `/admin/users/${user.id}/unban`
      : `/admin/users/${user.id}/ban`

    setActionLoadingKey(`user-${user.id}`)
    setError('')
    setSuccessMessage('')

    try {
      await api.put(endpoint)
      setSuccessMessage(
        isBanned
          ? `${user.username} has been unbanned successfully.`
          : `${user.username} has been banned successfully.`
      )
      await fetchAdminData()
    } catch (err) {
      setError(err?.response?.data || 'Failed to update user status.')
    } finally {
      setActionLoadingKey('')
      setTimeout(() => setSuccessMessage(''), 2500)
    }
  }

  const handleDeleteUser = async (user) => {
    const confirmed = window.confirm(
      `Delete user "${user.username}"? This action cannot be undone.`
    )
    if (!confirmed) return

    setActionLoadingKey(`delete-user-${user.id}`)
    setError('')
    setSuccessMessage('')

    try {
      await api.delete(`/admin/users/${user.id}`)
      setSuccessMessage(`${user.username} has been deleted successfully.`)
      await fetchAdminData()
    } catch (err) {
      setError(err?.response?.data || 'Failed to delete user.')
    } finally {
      setActionLoadingKey('')
      setTimeout(() => setSuccessMessage(''), 2500)
    }
  }

  const handleDeleteStock = async (stock) => {
    const confirmed = window.confirm(
      `Delete stock "${stock.symbol}" from the tracked registry?`
    )
    if (!confirmed) return

    setActionLoadingKey(`delete-stock-${stock.symbol}`)
    setError('')
    setSuccessMessage('')

    try {
      await api.delete(`/admin/stocks/${stock.symbol}`)
      setSuccessMessage(`${stock.symbol} has been deleted successfully.`)
      setStocks((prev) => prev.filter((item) => item.symbol !== stock.symbol))
    } catch (err) {
      setError(err?.response?.data || 'Failed to delete stock.')
    } finally {
      setActionLoadingKey('')
      setTimeout(() => setSuccessMessage(''), 2500)
    }
  }

  const filteredAccounts = useMemo(() => {
    if (!selectedUserId) return accounts
    const user = users.find((u) => String(u.id) === String(selectedUserId))
    if (!user) return accounts
    return accounts.filter((a) => a.ownerEmail === user.email)
  }, [accounts, users, selectedUserId])

  const selectedAccount = useMemo(() => {
    return filteredAccounts.find((account) => String(account.id) === String(selectedAccountId)) || null
  }, [filteredAccounts, selectedAccountId])

  const totalUsers = users.length
  const bannedUsers = users.filter((user) => user.banned).length
  const adminUsers = users.filter((user) => user.role === 'ROLE_ADMIN').length
  const totalBalance = accounts.reduce((sum, account) => sum + Number(account.balance || 0), 0)
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
              Manage users, review platform activity, and maintain tracked market
              data from one place.
            </p>
          </div>

          <div className="admin-badge">
            Signed In
            <span>{identity}</span>
          </div>
        </div>

        <div className="admin-banner mb-4">
          Admin actions use protected backend endpoints. If your account is not an
          admin account, these actions will be blocked by the server.
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

        {warnings.length > 0 && (
          <div className="alert alert-warning mb-4" role="alert">
            <strong>Some sections could not be loaded:</strong>
            <ul className="mb-0 mt-2">
              {warnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
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
                  <p className="summary-label">Total Users</p>
                  <h3 className="summary-value">{totalUsers}</h3>
                  <span className="summary-note">All registered accounts</span>
                </div>
              </div>

              <div className="col-md-6 col-xl-3">
                <div className="admin-card summary-card">
                  <p className="summary-label">Banned Users</p>
                  <h3 className="summary-value">{bannedUsers}</h3>
                  <span className="summary-note">Restricted from access</span>
                </div>
              </div>

              <div className="col-md-6 col-xl-3">
                <div className="admin-card summary-card">
                  <p className="summary-label">Tracked Stocks</p>
                  <h3 className="summary-value">{stocks.length}</h3>
                  <span className="summary-note">Available in stock registry</span>
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
              <div className="col-xl-7">
                <div className="admin-card">
                  <div className="admin-section-header">
                    <div>
                      <h3 className="admin-section-title">User Management</h3>
                      <p className="admin-section-subtitle">
                        Review account roles, banned status, and admin actions
                      </p>
                    </div>
                  </div>

                  {users.length === 0 ? (
                    <p className="mb-0">No users available.</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table admin-table align-middle mb-0">
                        <thead>
                          <tr>
                            <th>User</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Created</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((user) => (
                            <tr key={user.id}>
                              <td>
                                <div className="admin-user-cell">
                                  <strong>{user.username}</strong>
                                  <span>{user.email}</span>
                                </div>
                              </td>
                              <td>
                                <span
                                  className={
                                    user.role === 'ROLE_ADMIN'
                                      ? 'admin-role-pill admin-role-pill--admin'
                                      : 'admin-role-pill'
                                  }
                                >
                                  {user.role === 'ROLE_ADMIN' ? 'Admin' : 'User'}
                                </span>
                              </td>
                              <td>
                                <span
                                  className={
                                    user.banned
                                      ? 'admin-status-pill admin-status-pill--banned'
                                      : 'admin-status-pill admin-status-pill--active'
                                  }
                                >
                                  {user.banned ? 'Banned' : 'Active'}
                                </span>
                              </td>
                              <td>{formatDateTime(user.createdAt)}</td>
                              <td>
                                <div className="admin-action-buttons">
                                  <button
                                    type="button"
                                    className="admin-btn admin-btn--small admin-btn--secondary"
                                    onClick={() => handleToggleBanUser(user)}
                                    disabled={
                                      actionLoadingKey === `user-${user.id}` ||
                                      user.role === 'ROLE_ADMIN'
                                    }
                                  >
                                    {actionLoadingKey === `user-${user.id}`
                                      ? 'Updating...'
                                      : user.banned
                                        ? 'Unban'
                                        : 'Ban'}
                                  </button>

                                  <button
                                    type="button"
                                    className="admin-btn admin-btn--small admin-btn--danger"
                                    onClick={() => handleDeleteUser(user)}
                                    disabled={
                                      actionLoadingKey === `delete-user-${user.id}` ||
                                      user.role === 'ROLE_ADMIN'
                                    }
                                  >
                                    {actionLoadingKey === `delete-user-${user.id}`
                                      ? 'Deleting...'
                                      : 'Delete'}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div className="admin-highlight mt-4">
                    Admin accounts are protected from ban and delete actions by the backend.
                  </div>
                </div>
              </div>

              <div className="col-xl-5">
                <div className="admin-card h-100">
                  <div className="admin-section-header">
                    <div>
                      <h3 className="admin-section-title">System Actions</h3>
                      <p className="admin-section-subtitle">
                        Quick admin utilities and platform summary
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
                    <h4 className="admin-mini-title">Platform Snapshot</h4>
                    <ul className="admin-note-list">
                      <li>{adminUsers} admin account(s) currently registered</li>
                      <li>{accounts.length} personal trading account(s) visible in this session</li>
                      <li>{formatCurrency(totalBalance)} combined balance across loaded accounts</li>
                      <li>{stocks.length} tracked stock(s) currently in the system</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-4 mb-4">
              <div className="col-xl-7">
                <div className="admin-card">
                  <div className="admin-section-header">
                    <div>
                      <h3 className="admin-section-title">Stock Management</h3>
                      <p className="admin-section-subtitle">
                        Review tracked stocks and remove them from the registry
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
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stocks.map((stock) => (
                            <tr key={stock.stock_id || stock.symbol}>
                              <td>
                                <strong>{stock.symbol}</strong>
                              </td>
                              <td>{stock.companyName}</td>
                              <td>{formatCurrency(stock.currentPrice)}</td>
                              <td>
                                <button
                                  type="button"
                                  className="admin-btn admin-btn--small admin-btn--danger"
                                  onClick={() => handleDeleteStock(stock)}
                                  disabled={actionLoadingKey === `delete-stock-${stock.symbol}`}
                                >
                                  {actionLoadingKey === `delete-stock-${stock.symbol}`
                                    ? 'Deleting...'
                                    : 'Delete'}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div className="admin-highlight mt-4">
                    Deleting a stock removes it from the tracked market registry.
                  </div>
                </div>
              </div>

              <div className="col-xl-5">
                <div className="admin-card h-100">
                  <div className="admin-section-header">
                    <div>
                      <h3 className="admin-section-title">Leaderboard Preview</h3>
                      <p className="admin-section-subtitle">
                        Top ranked investors by total value
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

                  {users.length > 0 && (
                    <div className="mb-3">
                      <label className="form-label admin-label">Select user</label>
                      <select
                        className="form-select admin-select"
                        value={selectedUserId}
                        onChange={(e) => {
                          setSelectedUserId(e.target.value)
                          setSelectedAccountId('')
                          setTransactions([])
                        }}
                      >
                        <option value="">All users</option>
                        {users.filter((u) => u.role !== 'ROLE_ADMIN').map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.username} ({user.email})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {filteredAccounts.length > 0 && (
                    <div className="mb-3">
                      <label className="form-label admin-label">Select trading account</label>
                      <select
                        className="form-select admin-select"
                        value={selectedAccountId}
                        onChange={(e) => setSelectedAccountId(e.target.value)}
                      >
                        <option value="">-- Choose an account --</option>
                        {filteredAccounts.map((account) => (
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

              <div className="col-xl-7">
                <div className="admin-card">
                  <div className="admin-section-header">
                    <div>
                      <h3 className="admin-section-title">Admin Notes</h3>
                      <p className="admin-section-subtitle">
                        Current backend-supported admin capabilities
                      </p>
                    </div>
                  </div>

                  <div className="admin-note-box">
                    <ul className="admin-note-list">
                      <li>View all registered users</li>
                      <li>Ban and unban standard users</li>
                      <li>Delete standard users and tracked stocks</li>
                      <li>Refresh stock prices from the market data provider</li>
                      <li>Preview leaderboard and recent account activity</li>
                    </ul>
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

export default AdminDashboard