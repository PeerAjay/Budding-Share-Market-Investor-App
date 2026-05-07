import { useState, useEffect } from 'react'
import api from '../services/api'
import './Market.css'

const AVATAR_COLORS = ['#4f46e5', '#0284c7', '#059669', '#f59e0b', '#dc2626', '#7c3aed', '#0891b2']

function Market() {
    const [stocks, setStocks] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [selIdx, setSelIdx] = useState(0)
    const [qty, setQty] = useState('')
    const [accounts, setAccounts] = useState([])
    const [selAccount, setSelAccount] = useState('')

    useEffect(() => {
        api.get('/stocks')
            .then(res => {
                setStocks(res.data || [])
                setSelIdx(0)
            })
            .catch(() => setError('Failed to load stocks.'))
            .finally(() => setLoading(false))

        api.get('/dashboard/accounts')
            .then(res => {
                const accs = res.data || []
                setAccounts(accs)
                if (accs.length > 0) setSelAccount(accs[0].id)
            })
            .catch(() => {})
    }, [])

    const AVATAR_BG = (symbol) => AVATAR_COLORS[(symbol?.charCodeAt(0) || 0) % AVATAR_COLORS.length]

    if (loading) return <div className="mkt-page"><div className="mkt-container"><p className="text-muted mt-4">Loading market data...</p></div></div>
    if (error) return <div className="mkt-page"><div className="mkt-container"><div className="alert alert-danger mt-4">{error}</div></div></div>
    if (stocks.length === 0) return <div className="mkt-page"><div className="mkt-container"><p className="text-muted mt-4">No stocks available.</p></div></div>

    const sel = stocks[selIdx]
    const est = qty && !isNaN(parseFloat(qty)) && sel?.currentPrice
        ? (parseFloat(qty) * sel.currentPrice).toFixed(2)
        : '0.00'

    return (
        <div className="mkt-page">
            <div className="mkt-container">

                <div className="mkt-hdr">
                    <h1 className="mkt-title">Market Trade Center</h1>
                    <p className="mkt-sub">Manage your assets and execute trades in real-time.</p>
                </div>

                <div className="mkt-layout">

                    <div className="mkt-left">

                        <div className="mkt-card mkt-card--sel">
                            <div className="mkt-lbl mkt-lbl--sel">SELECTED STOCK</div>
                            <div className="mkt-sel-row">
                                <div className="mkt-av" style={{ background: AVATAR_BG(sel.symbol) }}>{sel.symbol}</div>
                                <div className="mkt-sel-body">
                                    <div className="mkt-sel-name">{sel.companyName}</div>
                                    <div className="mkt-sel-price">${sel.currentPrice != null ? sel.currentPrice.toFixed(2) : '—'} <span className="mkt-sel-meta">per share · ASX Listed</span></div>
                                    <select
                                        className="form-select mkt-stock-sel"
                                        value={selIdx}
                                        onChange={e => setSelIdx(Number(e.target.value))}
                                    >
                                        {stocks.map((s, i) => (
                                            <option key={s.symbol} value={i}>
                                                {s.symbol} — {s.companyName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="mkt-trade">
                            <div className="mkt-trade-ttl">Trade Execution: {sel.companyName}</div>
                            <div className="mkt-tgrid mkt-tgrid--top">
                                <div>
                                    <div className="mkt-tlbl">SELECT ACCOUNT</div>
                                    <select
                                        className="form-select mkt-tsel"
                                        value={selAccount}
                                        onChange={e => setSelAccount(e.target.value)}
                                    >
                                        {accounts.length === 0
                                            ? <option value="">No accounts found</option>
                                            : accounts.map(acc => (
                                                <option key={acc.id} value={acc.id}>
                                                    {acc.accountName} (Balance: ${acc.balance != null ? Number(acc.balance).toFixed(2) : '0.00'})
                                                </option>
                                            ))
                                        }
                                    </select>
                                </div>
                                <div className="mkt-est">
                                    <div className="mkt-est-lbl">Estimated Cost</div>
                                    <div className="mkt-est-val">${est}</div>
                                </div>
                            </div>
                            <div className="mkt-tgrid mkt-tgrid--bot">
                                <div>
                                    <div className="mkt-tlbl">QUANTITY</div>
                                    <div className="mkt-qty-wrap">
                                        <input
                                            type="number"
                                            className="form-control mkt-qty-inp"
                                            placeholder="0.00"
                                            min={0}
                                            value={qty}
                                            onChange={e => setQty(e.target.value)}
                                        />
                                        <span className="mkt-qty-sfx">SHARES</span>
                                    </div>
                                </div>
                                <div className="mkt-tbtns">
                                    <button className="mkt-buy">Buy</button>
                                    <button className="mkt-sell">Sell</button>
                                </div>
                            </div>
                        </div>

                        <div className="mkt-tbl-wrap">
                            <div className="mkt-tbl-hdr">All Stocks</div>
                            <div className="table-responsive">
                                <table className="table mkt-dtbl align-middle mb-0">
                                    <thead>
                                        <tr>
                                            <th>TICKER</th>
                                            <th>COMPANY</th>
                                            <th>PRICE</th>
                                            <th>24H CHANGE</th>
                                            <th>ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stocks.map((s, i) => (
                                            <tr key={s.symbol} className={i === selIdx ? 'mkt-tr-sel' : ''} onClick={() => setSelIdx(i)} style={{ cursor: 'pointer' }}>
                                                <td><span className="mkt-ticker">{s.symbol}</span></td>
                                                <td className="mkt-tco">{s.companyName}</td>
                                                <td className="mkt-tpr">${s.currentPrice != null ? s.currentPrice.toFixed(2) : '—'}</td>
                                                <td><span className="mkt-tch">—</span></td>
                                                <td>
                                                    <button type="button" className="mkt-alz" onClick={e => { e.stopPropagation(); setSelIdx(i) }}>
                                                        + Add Stock
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>

                    <div className="mkt-sidebar">
                        <div className="mkt-hcard">
                            <div className="mkt-hd">
                                <h3 className="mkt-ht">My Holdings</h3>
                            </div>
                            <hr className="mkt-divider" />
                            <div className="mkt-hrows">
                                <div className="mkt-hrow">
                                    <span className="mkt-hl">QUANTITY</span>
                                    <strong className="mkt-hv">—</strong>
                                </div>
                                <div className="mkt-hrow">
                                    <span className="mkt-hl">AVERAGE COST</span>
                                    <strong className="mkt-hv">—</strong>
                                </div>
                                <div className="mkt-hrow">
                                    <span className="mkt-hl">CURRENT VALUE</span>
                                    <strong className="mkt-hv">—</strong>
                                </div>
                            </div>
                            <hr className="mkt-divider" />
                            <div className="mkt-hft">
                                <a href="/portfolio" className="mkt-plink">View Full Portfolio Details</a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Market