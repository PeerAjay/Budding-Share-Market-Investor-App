import { useEffect, useMemo, useState } from 'react'
import api from '../services/api'
import './Leaderboard.css'

function Leaderboard() {
  const identity = localStorage.getItem('identity') || 'Investor'

  const [leaders, setLeaders] = useState([])
  const [yourRank, setYourRank] = useState(0)
  const [yourTotalValue, setYourTotalValue] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await api.get('/leaderboard')
      const payload = response.data || {}

      setLeaders(payload.leaderboard || [])
      setYourRank(payload.yourRank ?? 0)
      setYourTotalValue(payload.yourTotalValue ?? 0)
    } catch (err) {
      setError(err?.response?.data || 'Failed to load leaderboard.')
    } finally {
      setLoading(false)
    }
  }

  const topThree = useMemo(() => leaders.slice(0, 3), [leaders])

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(value || 0)

  return (
    <div className="leaderboard-page">
      <div className="container py-5">
        <div className="leaderboard-hero">
          <div>
            <p className="leaderboard-eyebrow">Leaderboard</p>
            <h1 className="leaderboard-title">Top Investors</h1>
            <p className="leaderboard-subtitle">
              Compare user portfolio performance and see who is leading the
              simulated market.
            </p>
          </div>

          <div className="leaderboard-badge">
            Players
            <span>{leaders.length} Ranked</span>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger mb-4" role="alert">
            {typeof error === 'string' ? error : 'Failed to load leaderboard.'}
          </div>
        )}

        {loading ? (
          <div className="leaderboard-card empty-state-card">
            <h3 className="leaderboard-section-title mb-2">Loading leaderboard...</h3>
            <p className="leaderboard-section-subtitle mb-0">
              Please wait while rankings are being loaded.
            </p>
          </div>
        ) : leaders.length === 0 ? (
          <div className="leaderboard-card empty-state-card">
            <h2 className="leaderboard-section-title mb-3">No leaderboard data yet</h2>
            <p className="leaderboard-section-subtitle mb-0">
              Rankings will appear here once user account data is available.
            </p>
          </div>
        ) : (
          <>
            <div className="leaderboard-card your-rank-card mb-4">
              <div className="your-rank-card__left">
                <p className="leaderboard-eyebrow mb-2">Your Position</p>
                <h3 className="leaderboard-section-title mb-1">
                  {identity}&apos;s Current Ranking
                </h3>
                <p className="leaderboard-section-subtitle mb-0">
                  This is your current place on the leaderboard based on total value.
                </p>
              </div>

              <div className="your-rank-card__right">
                <div className="your-rank-box">
                  <span className="your-rank-box__label">Rank</span>
                  <strong className="your-rank-box__value">
                    {yourRank > 0 ? `#${yourRank}` : 'N/A'}
                  </strong>
                </div>

                <div className="your-rank-box">
                  <span className="your-rank-box__label">Total Value</span>
                  <strong className="your-rank-box__value">
                    {formatCurrency(yourTotalValue)}
                  </strong>
                </div>
              </div>
            </div>

            <div className="row g-4 mb-4">
              {topThree.map((user, index) => (
                <div className="col-md-4" key={user.rank ?? index}>
                  <div className={`leaderboard-card podium-card podium-card--${index + 1}`}>
                    <div className="podium-rank">#{user.rank}</div>
                    <div className="podium-avatar">
                      {(user.userName || 'U').charAt(0).toUpperCase()}
                    </div>
                    <h3 className="podium-name">{user.userName}</h3>
                    <p className="podium-value">{formatCurrency(user.totalValue)}</p>
                    <span className="podium-label">
                      {index === 0
                        ? 'Top Investor'
                        : index === 1
                        ? 'Second Place'
                        : 'Third Place'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="leaderboard-card">
              <div className="leaderboard-section-header">
                <div>
                  <h3 className="leaderboard-section-title">Full Rankings</h3>
                  <p className="leaderboard-section-subtitle">
                    All ranked users based on total portfolio value
                  </p>
                </div>

                <button
                  type="button"
                  className="leaderboard-refresh-btn"
                  onClick={fetchLeaderboard}
                >
                  Refresh
                </button>
              </div>

              <div className="table-responsive">
                <table className="table leaderboard-table align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>User</th>
                      <th>Total Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaders.map((user, index) => {
                      const isCurrentUser =
                        user.userName?.toLowerCase() === identity.toLowerCase()

                      return (
                        <tr
                          key={`${user.userName}-${index}`}
                          className={isCurrentUser ? 'leaderboard-row--current' : ''}
                        >
                          <td>
                            <span className="leaderboard-rank-pill">#{user.rank}</span>
                          </td>
                          <td>
                            <div className="leaderboard-user-cell">
                              <div className="leaderboard-user-avatar">
                                {(user.userName || 'U').charAt(0).toUpperCase()}
                              </div>
                              <div className="leaderboard-user-meta">
                                <strong>{user.userName}</strong>
                                {isCurrentUser && (
                                  <span className="leaderboard-current-user-tag">
                                    You
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="leaderboard-value">
                            {formatCurrency(user.totalValue)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="leaderboard-note mt-4">
              Keep trading and improving your portfolio to climb the rankings.
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Leaderboard