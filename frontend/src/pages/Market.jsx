import { useState, useEffect } from 'react'
import api from '../services/api'
import './Market.css'

const AVATAR_COLORS = ['#4f46e5', '#0284c7', '#059669', '#f59e0b', '#dc2626', '#7c3aed', '#0891b2']
const BROKERAGE_FEE = 10

function Market() {
    const [stocks, setStocks] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [selIdx, setSelIdx] = useState(0)
    const [qty, setQty] = useState('')
    const [accounts, setAccounts] = useState([])
    const [selAccount, setSelAccount] = useState('')
    const [buying, setBuying] = useState(false)
    const [selling, setSelling] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [refreshMsg, setRefreshMsg] = useState('')
    const [holdings, setHoldings] = useState([])

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
            .catch(() => { })
    }, [])

    useEffect(() => {
        if (!selAccount) return
        api.get(`/portfolio/${selAccount}/holdings`)
            .then(res => setHoldings(res.data || []))
            .catch(() => setHoldings([]))
    }, [selAccount])

    const AVATAR_BG = (symbol) => AVATAR_COLORS[(symbol?.charCodeAt(0) || 0) % AVATAR_COLORS.length]

    if (loading) return <div className="mkt-page"><div className="mkt-container"><p className="text-muted mt-4">Loading market data...</p></div></div>
    if (error) return <div className="mkt-page"><div className="mkt-container"><div className="alert alert-danger mt-4">{error}</div></div></div>

    const sel = stocks.length > 0 ? stocks[selIdx] : null
    const qtyValue = Number.parseInt(qty, 10)
    const hasValidQty = Number.isInteger(qtyValue) && qtyValue > 0
    const est = hasValidQty && sel?.currentPrice != null
        ? (qtyValue * sel.currentPrice + BROKERAGE_FEE).toFixed(2)
        : '0.00'

    const handleRefresh = async () => {
        setRefreshing(true)
        setRefreshMsg('')
        try {
            await api.post('/stocks/refresh')
            const res = await api.get('/stocks')
            setStocks(res.data || [])
            if (selAccount) {
                const hRes = await api.get(`/portfolio/${selAccount}/holdings`)
                setHoldings(hRes.data || [])
            }
            setRefreshMsg('Stocks updated successfully.')
            setTimeout(() => setRefreshMsg(''), 3000)
        } catch {
            setRefreshMsg('Failed to refresh stocks.')
            setTimeout(() => setRefreshMsg(''), 3000)
        } finally {
            setRefreshing(false)
        }
    }

    const handleSell = async () => {
        setError('')
        setSuccessMessage('')

        if (!selAccount) {
            setError('Select a trading account first.')
            return
        }

        if (!hasValidQty) {
            setError('Enter a valid share quantity.')
            return
        }

        if (!sel?.symbol) {
            setError('Select a stock to sell.')
            return
        }

        const holding = holdings.find(h => h.stockSymbol === sel.symbol)
        if (!holding || holding.quantity < qtyValue) {
            setError(`You don't have enough shares of ${sel.symbol} to sell.`)
            return
        }

        setSelling(true)

        try {
            await api.post('/transactions/sell', {
                accountId: Number(selAccount),
                stockSymbol: sel.symbol,
                quantity: qtyValue
            })

            setSuccessMessage(`Sold ${qtyValue} share${qtyValue === 1 ? '' : 's'} of ${sel.symbol}.`)
            setQty('')

            const refreshedAccounts = await api.get('/dashboard/accounts')
            const accs = refreshedAccounts.data || []
            setAccounts(accs)

            const updatedAccount = accs.find(acc => String(acc.id) === String(selAccount))
            if (updatedAccount) {
                setSelAccount(String(updatedAccount.id))
            }

            const refreshedHoldings = await api.get(`/portfolio/${selAccount}/holdings`)
            setHoldings(refreshedHoldings.data || [])
        } catch (err) {
            setError(err?.response?.data || 'Failed to sell shares.')
        } finally {
            setSelling(false)
            setTimeout(() => setSuccessMessage(''), 2500)
        }
    }

    const handleBuy = async () => {
        setError('')
        setSuccessMessage('')

        if (!selAccount) {
            setError('Select a trading account first.')
            return
        }

        if (!hasValidQty) {
            setError('Enter a valid share quantity.')
            return
        }

        if (!sel?.symbol) {
            setError('Select a stock to buy.')
            return
        }

        const selectedAccount = accounts.find(acc => String(acc.id) === String(selAccount))
        const estimatedCost = qtyValue * (sel.currentPrice || 0) + BROKERAGE_FEE

        if (selectedAccount?.balance != null && Number(selectedAccount.balance) < estimatedCost) {
            setError('Insufficient balance for this trade.')
            return
        }

        setBuying(true)

        try {
            await api.post('/transactions/buy', {
                accountId: Number(selAccount),
                stockSymbol: sel.symbol,
                quantity: qtyValue
            })

            setSuccessMessage(`Bought ${qtyValue} share${qtyValue === 1 ? '' : 's'} of ${sel.symbol}.`)
            setQty('')

            const refreshedAccounts = await api.get('/dashboard/accounts')
            const accs = refreshedAccounts.data || []
            setAccounts(accs)

            const updatedAccount = accs.find(acc => String(acc.id) === String(selAccount))
            if (updatedAccount) {
                setSelAccount(String(updatedAccount.id))
            }

            const refreshedHoldings = await api.get(`/portfolio/${selAccount}/holdings`)
            setHoldings(refreshedHoldings.data || [])
        } catch (err) {
            setError(err?.response?.data || 'Failed to buy shares.')
        } finally {
            setBuying(false)
            setTimeout(() => setSuccessMessage(''), 2500)
        }
    }

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
                            {sel ? (
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
                            ) : (
                                <div className="mkt-empty-sel">
                                    <p className="mkt-empty-sel-txt">No stocks available</p>
                                    <p className="mkt-empty-sel-hint">Click <strong>↻ Refresh</strong> in the table below to load market data.</p>
                                </div>
                            )}
                        </div>

                        <div className="mkt-trade" style={!sel ? { opacity: 0.4, pointerEvents: 'none' } : {}}>
                            <div className="mkt-trade-ttl">Trade Execution: {sel ? sel.companyName : '—'}</div>
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
                                    <button className="mkt-buy" type="button" onClick={handleBuy} disabled={buying || !selAccount || !hasValidQty}>
                                        {buying ? 'Buying...' : 'Buy'}
                                    </button>
                                    <button className="mkt-sell" type="button" onClick={handleSell} disabled={selling || !selAccount || !hasValidQty}>
                                        {selling ? 'Selling...' : 'Sell'}
                                    </button>
                                </div>
                            </div>
                            {(error || successMessage) && (
                                <div className="mt-3">
                                    {error && <div className="alert alert-danger mb-0" role="alert">{error}</div>}
                                    {successMessage && <div className="alert alert-success mb-0" role="alert">{successMessage}</div>}
                                </div>
                            )}
                        </div>

                        <div className="mkt-tbl-wrap">
                            <div className="mkt-tbl-hdr">
                                <span>All Stocks</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                    {refreshMsg && (
                                        <span className={`mkt-refresh-msg${refreshMsg.includes('successfully') ? ' mkt-refresh-msg--ok' : ' mkt-refresh-msg--err'}`}>
                                            {refreshMsg}
                                        </span>
                                    )}
                                    <button className="mkt-refresh-btn" type="button" onClick={handleRefresh} disabled={refreshing}>
                                        {refreshing ? 'Refreshing...' : 'Refresh'}
                                    </button>
                                </div>
                            </div>
                            <div className="table-responsive">
                                <table className="table mkt-dtbl align-middle mb-0">
                                    <thead>
                                        <tr>
                                            <th>TICKER</th>
                                            <th>COMPANY</th>
                                            <th>PRICE</th>
                                            <th>ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stocks.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="mkt-empty-row">
                                                    No market data available. Click <strong>↻ Refresh</strong> to fetch the latest stock prices.
                                                </td>
                                            </tr>
                                        ) : stocks.map((s, i) => (
                                            <tr key={s.symbol} className={i === selIdx ? 'mkt-tr-sel' : ''} onClick={() => setSelIdx(i)} style={{ cursor: 'pointer' }}>
                                                <td><span className="mkt-ticker">{s.symbol}</span></td>
                                                <td className="mkt-tco">{s.companyName}</td>
                                                <td className="mkt-tpr">${s.currentPrice != null ? s.currentPrice.toFixed(2) : '—'}</td>
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
                                {sel && <span className="mkt-ht-sub">{sel.symbol}</span>}
                            </div>
                            <hr className="mkt-divider" />
                            {(() => {
                                const h = sel ? holdings.find(x => x.stockSymbol === sel.symbol) : null
                                return (
                                    <div className="mkt-hrows">
                                        <div className="mkt-hrow">
                                            <span className="mkt-hl">QUANTITY</span>
                                            <strong className="mkt-hv">{h ? h.quantity : '—'}</strong>
                                        </div>
                                        <div className="mkt-hrow">
                                            <span className="mkt-hl">AVERAGE COST</span>
                                            <strong className="mkt-hv">{h?.averageBuyPrice != null ? `$${h.averageBuyPrice.toFixed(2)}` : '—'}</strong>
                                        </div>
                                        <div className="mkt-hrow">
                                            <span className="mkt-hl">CURRENT VALUE</span>
                                            <strong className="mkt-hv">{h?.currentValue != null ? `$${h.currentValue.toFixed(2)}` : '—'}</strong>
                                        </div>
                                        <div className="mkt-hrow">
                                            <span className="mkt-hl">PROFIT / LOSS</span>
                                            <strong className={`mkt-hv${h?.currentPrice != null && h?.averageBuyPrice != null ? ((h.currentPrice - h.averageBuyPrice) >= 0 ? ' mkt-hv--pos' : ' mkt-hv--neg') : ''}`}>
                                                {h?.currentPrice != null && h?.averageBuyPrice != null ? (() => {
                                                    const diff = h.currentPrice - h.averageBuyPrice
                                                    const pct = (diff / h.averageBuyPrice) * 100
                                                    return `${diff >= 0 ? '+' : ''}${diff.toFixed(2)} (${pct >= 0 ? '+' : ''}${pct.toFixed(2)}%)`
                                                })() : '—'}
                                            </strong>
                                        </div>
                                        <div className="mkt-hrow">
                                            <span className="mkt-hl">TOTAL RETURN</span>
                                            <strong className={`mkt-hv${h?.profitLoss != null ? (h.profitLoss >= 0 ? ' mkt-hv--pos' : ' mkt-hv--neg') : ''}`}>
                                                {h?.profitLoss != null ? `${h.profitLoss >= 0 ? '+' : ''}${h.profitLoss.toFixed(2)}` : '—'}
                                            </strong>
                                        </div>
                                    </div>
                                )
                            })()}
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