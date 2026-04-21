function Dashboard({ onDashboardAction }) {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Dashboard Page</h1>
      <p>Placeholder page for now.</p>
      <button onClick={onDashboardAction}>Call Dashboard Function</button>
    </div>
  )
}

export default Dashboard