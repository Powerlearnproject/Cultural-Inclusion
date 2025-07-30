const Navbar = () => {
  return (
    <nav style={{
      padding: '1rem',
      borderBottom: '1px solid #eee',
      backgroundColor: 'white',
    }}>
      <input 
        type="text" 
        placeholder="Search data, reports, or insights..." 
        style={{
          width: '300px',
          padding: '0.5rem',
          borderRadius: '8px',
          border: '1px solid #ddd'
        }}
      />
    </nav>
  )
}
export default Navbar