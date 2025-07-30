import ChartCard from "../Components/ChartCard"

const Dashboard = () => {
  return (
    <div>
      <h1>Impact Dashboard</h1>
      <p style={{ color: '#555', marginBottom: '1.5rem' }}>
        Real-time insights into community empowerment and inclusion initiatives
      </p>

      {/* Stats Cards */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <div className="stat-card">
          <h2>1,384</h2>
          <p>Total Beneficiaries</p>
        </div>
        <div className="stat-card">
          <h2>25</h2>
          <p>Active Programs</p>
        </div>
        <div className="stat-card">
          <h2>12,847</h2>
          <p>Data Points</p>
        </div>
        <div className="stat-card">
          <h2>94%</h2>
          <p>Impact Score</p>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <ChartCard title="Community Demographics" chartType="doughnut" />
        <ChartCard title="Monthly Growth" chartType="line" />
      </div>
    </div>
  )
}

export default Dashboard