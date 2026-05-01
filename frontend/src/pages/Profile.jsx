function Profile() {
  const identity = localStorage.getItem('identity')

  return (
    <div className="container py-5">
      <div className="card shadow-sm border-0" style={{ maxWidth: '720px' }}>
        <div className="card-body p-4">
          <h1 className="mb-4">Profile</h1>

          <div className="mb-3">
            <strong>Logged in as:</strong> {identity || 'Unknown user'}
          </div>

          <div className="mb-3">
            <strong>Status:</strong> Logged in
          </div>

          <div className="mb-3">
            <strong>Account type:</strong> Standard User
          </div>

          <hr className="my-4" />

          <h4 className="mb-3">Coming Soon</h4>
          <p className="mb-2">Profile details from the database</p>
          <p className="mb-2">Trading account summary</p>
          <p className="mb-0">Portfolio and activity overview</p>
        </div>
      </div>
    </div>
  )
}

export default Profile