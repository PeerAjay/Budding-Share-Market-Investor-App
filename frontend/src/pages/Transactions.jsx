import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import './Transactions.css'

function Transactions() {
  const navigate = useNavigate()
  const identity = localStorage.getItem('identity') || 'Investor'

  const [accounts, setAccounts] = useState([])
  const [selectedAccountId, setSelectedAccountId] = useState('')
  const [transactions, setTransactions] = useState([])
  const [accountsLoading, setAccountsLoading] = useState(true)
  const [transactionsLoading, setTransactionsLoading] = useState(false)
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAccounts()
  }, [])

  useEffect(() => {
    if (selectedAccountId) {
      fetchTransactions(selectedAccountId)
    } else {
      setTransactions([])
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

  const filteredTransactions = useMemo(() => {
    if (typeFilter === 'ALL') return transactions
    return transactions.filter((tx) => tx.type === typeFilter)
  }, [transactions, typeFilter])

  const summary = useMemo(() => {
    const totalTrades = filteredTransactions.length
    const totalBrokerage = filteredTransactions.reduce(
      (sum, tx) => sum + (tx.brokerageFee || 0),
      0
    )
    const buyTrades = filteredTransactions.filter((tx) => tx.type === 'BUY').length
    const sellTrades = filteredTransactions.filter((tx) => tx.type === 'SELL').length

    return {
      totalTrades,
      totalBrokerage,
      buyTrades,
      sellTrades
    }
  }, [filteredTransactions])

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
    <div className="transactions-page">
      <div className="container py-5">
        <div className="transactions-hero">
          <div>
            <p className="transactions-eyebrow">Transaction History</p>
            <h1 className="transactions-title">{identity}&apos;s Transactions</h1>
            <p className="transactions-subtitle">
              Review your recorded buy and sell activity across your trading accounts.
            </p>
          </div>

          <div className="transactions-badge">
            Records
            <span>{filteredTransactions.length} Shown</span>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger mb-4" role="alert">
            {error}
          </div>
        )}

        {accountsLoading ? (
          <div className="transactions-card empty-state-card">
            <h3 className="transactions-section-title mb-2">Loading accounts...</h3>
            <p className="transactions-section-subtitle mb-0">
              Please wait while your account data is being loaded.
            </p>
          </div>
        ) : accounts.length === 0 ? (
          <div className="transactions-card empty-state-card">
            <h2 className="transactions-section-title mb-3">No Trading Account Yet</h2>
            <p className="transactions-section-subtitle mb-4">
              Create a trading account first before viewing transaction history.
            </p>

            <button
              type="button"
              className="transactions-btn"
              onClick={() => navigate('/dashboard')}
            >
              Go to Dashboard
            </button>
          </div>
        ) : (
          <>
            <div className="transactions-card mb-4">
              <div className="transactions-controls">
                <div className="transactions-control-group">
                  <label className="form-label transactions-label">Account</label>
                  <select
                    className="form-select transactions-select"
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

                <div className="transactions-control-group">
                  <label className="form-label transactions-label">Filter</label>
                  <select
                    className="form-select transactions-select"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <option value="ALL">All</option>
                    <option value="BUY">Buy</option>
                    <option value="SELL">Sell</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="row g-4 mb-4">
              <div className="col-md-6 col-xl-3">
                <div className="transactions-card summary-card">
                  <p className="summary-label">Total Trades</p>
                  <h3 className="summary-value">{summary.totalTrades}</h3>
                  <span className="summary-note">Filtered records</span>
                </div>
              </div>

              <div className="col-md-6 col-xl-3">
                <div className="transactions-card summary-card">
                  <p className="summary-label">Buy Trades</p>
                  <h3 className="summary-value">{summary.buyTrades}</h3>
                  <span className="summary-note">Purchase activity</span>
                </div>
              </div>

              <div className="col-md-6 col-xl-3">
                <div className="transactions-card summary-card">
                  <p className="summary-label">Sell Trades</p>
                  <h3 className="summary-value">{summary.sellTrades}</h3>
                  <span className="summary-note">Sell activity</span>
                </div>
              </div>

              <div className="col-md-6 col-xl-3">
                <div className="transactions-card summary-card">
                  <p className="summary-label">Brokerage Total</p>
                  <h3 className="summary-value">
                    {formatCurrency(summary.totalBrokerage)}
                  </h3>
                  <span className="summary-note">Recorded fees</span>
                </div>
              </div>
            </div>

            <div className="transactions-card">
              <div className="transactions-section-header">
                <div>
                  <h3 className="transactions-section-title">Recorded Transactions</h3>
                  <p className="transactions-section-subtitle">
                    Buy and sell records for the selected trading account
                  </p>
                </div>
              </div>

              {transactionsLoading ? (
                <p className="mb-0">Loading transactions...</p>
              ) : filteredTransactions.length === 0 ? (
                <div className="empty-transactions-state">
                  <h4>No transactions found</h4>
                  <p>
                    Once you buy or sell shares, those records will appear here.
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table transactions-table align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Stock</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Brokerage</th>
                        <th>Total Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.map((tx) => (
                        <tr key={tx.id}>
                          <td>{formatDateTime(tx.timestamp)}</td>
                          <td>
                            <span
                              className={
                                tx.type === 'BUY'
                                  ? 'transaction-pill buy-pill'
                                  : 'transaction-pill sell-pill'
                              }
                            >
                              {tx.type}
                            </span>
                          </td>
                          <td>
                            <div className="transaction-stock-cell">
                              <strong>{tx.stockSymbol}</strong>
                              <span>{tx.companyName}</span>
                            </div>
                          </td>
                          <td>{tx.quantity}</td>
                          <td>{formatCurrency(tx.priceAtTransaction)}</td>
                          <td>{formatCurrency(tx.brokerageFee)}</td>
                          <td>{formatCurrency(tx.totalValue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Transactions