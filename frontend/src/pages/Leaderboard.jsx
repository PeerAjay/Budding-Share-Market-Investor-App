import { useEffect, useMemo, useState } from 'react'
import api from '../services/api'
import './Leaderboard.css'

function Leaderboard() {
  const [leaders, setLeaders] = useState([])
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
      setLeaders(response.data || [])
    } catch (err) {
      setError(err?.response?.data || 'Failed to load leaderboard.')
    } finally {
      setLoading(false)
    }
  }

  const topThree = useMemo(() => leaders.slice(0, 3), [leaders])
  const rest = useMemo(() => leaders.slice(3), [leaders])

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
            {error}
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
            <div className="row g-4 mb-4">
              {topThree.map((user, index) => (
                <div className="col-md-4" key={user.rank ?? index}>
                  <div
                    className={`leaderboard-card podium-card podium-card--${index + 1}`}
                  >
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
                    {leaders.map((user, index) => (
                      <tr key={`${user.userName}-${index}`}>
                        <td>
                          <span className="leaderboard-rank-pill">#{user.rank}</span>
                        </td>
                        <td>
                          <div className="leaderboard-user-cell">
                            <div className="leaderboard-user-avatar">
                              {(user.userName || 'U').charAt(0).toUpperCase()}
                            </div>
                            <strong>{user.userName}</strong>
                          </div>
                        </td>
                        <td className="leaderboard-value">
                          {formatCurrency(user.totalValue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {rest.length > 0 && (
              <div className="leaderboard-note mt-4">
                Keep trading and improving your portfolio to climb the rankings.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Leaderboard