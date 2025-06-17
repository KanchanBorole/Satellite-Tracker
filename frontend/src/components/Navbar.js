import React from 'react';

/**
 * Navigation component for Mission Board Dashboard
 * Provides navigation between different views and system status
 */
function Navbar({ currentView, onNavigate, satelliteCount = 0 }) {
    
    const navItems = [
        { key: 'home', label: 'Home', icon: 'fas fa-home' },
        { key: 'dashboard', label: 'Dashboard', icon: 'fas fa-chart-line' },
        { key: 'history', label: 'Satellite History', icon: 'fas fa-history' },
        { key: 'videos', label: 'Live Videos', icon: 'fas fa-video' }
    ];

    return (
        <nav className="navbar navbar-expand-lg navbar-dark mission-navbar">
            <div className="container-fluid">
                {/* Brand */}
                <button className="navbar-brand d-flex align-items-center btn btn-link text-decoration-none" onClick={() => onNavigate('home')}>
                    <i className="fas fa-satellite me-2 brand-icon"></i>
                    <span className="brand-text">Mission Board</span>
                </button>

                {/* Mobile menu toggle */}
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Navigation items */}
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        {navItems.map(item => (
                            <li key={item.key} className="nav-item">
                                <button
                                    className={`nav-link btn btn-link ${
                                        currentView === item.key ? 'active' : ''
                                    }`}
                                    onClick={() => onNavigate(item.key)}
                                >
                                    <i className={`${item.icon} me-1`}></i>
                                    {item.label}
                                </button>
                            </li>
                        ))}
                    </ul>

                    {/* Status indicators */}
                    <div className="navbar-nav">
                        <div className="nav-item d-flex align-items-center me-3">
                            <span className="status-indicator">
                                <i className="fas fa-circle text-success me-1"></i>
                                System Online
                            </span>
                        </div>
                        
                        <div className="nav-item d-flex align-items-center me-3">
                            <span className="satellite-count">
                                <i className="fas fa-satellite me-1"></i>
                                {satelliteCount} Satellites
                            </span>
                        </div>

                        <div className="nav-item">
                            <span className="mission-time">
                                <i className="fas fa-clock me-1"></i>
                                <span id="mission-clock">
                                    {new Date().toLocaleTimeString('en-US', { 
                                        hour12: false,
                                        timeZone: 'UTC'
                                    })} UTC
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

// Update mission clock every second
setInterval(() => {
    const clockElement = document.getElementById('mission-clock');
    if (clockElement) {
        clockElement.textContent = new Date().toLocaleTimeString('en-US', { 
            hour12: false,
            timeZone: 'UTC'
        }) + ' UTC';
    }
}, 1000);

export default Navbar;
