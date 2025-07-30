import './Sidebar.css'

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <h2>Cultural Inclusion</h2>
      <p className="subtitle">Data for Impact</p>
      <nav>
        <ul>
          <li className="active">Dashboard</li>
          <li>Data Entry</li>
          <li>Insights</li>
          <li>Cohorts</li>
          <li>Export</li>
        </ul>
      </nav>
      <div className="impact-card">
        <h4>📊 Impact Stats</h4>
        <p>Empowering decisions through inclusive data analysis</p>
      </div>
    </aside>
  )
}
export default Sidebar