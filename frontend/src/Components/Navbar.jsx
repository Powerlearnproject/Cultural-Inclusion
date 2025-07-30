import './Navbar.css'

const Navbar = ({ user, onLogout }) => {
  const getRoleDisplay = (role) => {
    switch (role) {
      case 'admin':
        return '👑 Administrator'
      case 'data_entry':
        return '📝 Data Entry Officer'
      default:
        return '👤 User'
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-icon">🌍</span>
        <h1>InclusiTrack</h1>
        <span className="brand-subtitle">Cultural Inclusion</span>
      </div>
      
      <div className="navbar-user">
        {user && (
          <div className="user-info">
            <div className="user-details">
              <span className="user-name">{user.name}</span>
              <span className="user-role">{getRoleDisplay(user.role)}</span>
            </div>
            <div className="user-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <button className="logout-btn" onClick={onLogout}>
              🚪 Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar