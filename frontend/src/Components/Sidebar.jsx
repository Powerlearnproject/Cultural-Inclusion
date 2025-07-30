import './Sidebar.css'

const Sidebar = ({ currentPage, setCurrentPage }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'data-entry', label: 'Data Entry', icon: '📝' },
    { id: 'insights', label: 'Insights', icon: '🔍' },
    { id: 'cohorts', label: 'Cohorts', icon: '👥' },
    { id: 'reports', label: 'Reports', icon: '📋' }
  ]

  return (
    <aside className="sidebar">
      <h2>Cultural Inclusion</h2>
      <p className="subtitle">Data for Impact</p>
      <nav>
        <ul>
          {menuItems.map(item => (
            <li 
              key={item.id}
              className={currentPage === item.id ? 'active' : ''}
              onClick={() => setCurrentPage(item.id)}
            >
              <span className="menu-icon">{item.icon}</span>
              {item.label}
            </li>
          ))}
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