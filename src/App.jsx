// App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import heroImage from './assets/card4.jpeg';

import CreateNew from './pages/CreateNew';
import YourDesigns from './pages/YourDesigns.jsx';
import Profile from './pages/Profile';

function Home({ loaded }) {
  return (
    <main className="hero-section">
      <img
        src={heroImage}
        alt="Hero"
        className={`zoom-in-image ${loaded ? 'animate' : ''}`}
      />
      <div className="hero-text">
        Start your Tattoo Journey
      </div>
    </main>
  );
}

function App() {
  const [loaded, setLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="logo">
            <Link to="/">
              <img src="/logo.png" alt="INKNATION" />
            </Link>
          </div>
          <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </div>
          <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <li><Link to="/create">Create New</Link></li>
            <li><Link to="/designs">Your Designs</Link></li>
            <li><Link to="/profile">Profile</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Home loaded={loaded} />} />
          <Route path="/create" element={<CreateNew />} />
          <Route path="/designs" element={<YourDesigns />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
