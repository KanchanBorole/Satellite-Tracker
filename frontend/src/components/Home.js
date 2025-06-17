import React from 'react';

/**
 * Home component - Landing page for Mission Board Dashboard
 * Displays mission overview and quick stats
 */
function Home({ satellites, loading, error, onRefresh, onNavigate }) {
    
    // Calculate statistics
    const stats = {
        total: satellites.length,
        active: satellites.filter(s => s.status === 'Active').length,
        orbits: [...new Set(satellites.map(s => s.orbit_type))].length,
        lastUpdate: new Date().toLocaleString()
    };

    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container">
                    <div className="row align-items-center min-vh-100">
                        <div className="col-lg-6">
                            <div className="hero-content">
                                <h1 className="hero-title">
                                    Mission Board
                                    <span className="hero-subtitle">Dashboard</span>
                                </h1>
                                <p className="hero-description">
                                    Real-time satellite tracking and mission management system. 
                                    Monitor orbital assets, track mission progress, and analyze 
                                    space operations data.
                                </p>
                                
                                <div className="hero-actions">
                                    <button 
                                        className="btn btn-primary btn-lg me-3"
                                        onClick={() => onNavigate('dashboard')}
                                    >
                                        <i className="fas fa-chart-line me-2"></i>
                                        View Dashboard
                                    </button>
                                    <button 
                                        className="btn btn-outline-light btn-lg"
                                        onClick={onRefresh}
                                        disabled={loading}
                                    >
                                        <i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-sync-alt'} me-2`}></i>
                                        Refresh Data
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-lg-6">
                            <div className="hero-visual">
                                <div className="orbital-animation">
                                    <div className="orbit orbit-1">
                                        <div className="satellite sat-1">
                                            <i className="fas fa-satellite"></i>
                                        </div>
                                    </div>
                                    <div className="orbit orbit-2">
                                        <div className="satellite sat-2">
                                            <i className="fas fa-space-shuttle"></i>
                                        </div>
                                    </div>
                                    <div className="orbit orbit-3">
                                        <div className="satellite sat-3">
                                            <i className="fas fa-rocket"></i>
                                        </div>
                                    </div>
                                    <div className="earth">
                                        <i className="fas fa-globe"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission Statistics */}
            <section className="stats-section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-3 col-6 mb-4">
                            <div className="stat-card">
                                <div className="stat-icon">
                                    <i className="fas fa-satellite"></i>
                                </div>
                                <div className="stat-content">
                                    <h3 className="stat-number">{stats.total}</h3>
                                    <p className="stat-label">Total Satellites</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-md-3 col-6 mb-4">
                            <div className="stat-card">
                                <div className="stat-icon text-success">
                                    <i className="fas fa-check-circle"></i>
                                </div>
                                <div className="stat-content">
                                    <h3 className="stat-number">{stats.active}</h3>
                                    <p className="stat-label">Active Missions</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-md-3 col-6 mb-4">
                            <div className="stat-card">
                                <div className="stat-icon text-info">
                                    <i className="fas fa-orbit"></i>
                                </div>
                                <div className="stat-content">
                                    <h3 className="stat-number">{stats.orbits}</h3>
                                    <p className="stat-label">Orbit Types</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-md-3 col-6 mb-4">
                            <div className="stat-card">
                                <div className="stat-icon text-warning">
                                    <i className="fas fa-clock"></i>
                                </div>
                                <div className="stat-content">
                                    <h3 className="stat-number">24/7</h3>
                                    <p className="stat-label">Monitoring</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Status */}
            <section className="status-section">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="status-panel">
                                <h3 className="status-title">
                                    <i className="fas fa-tachometer-alt me-2"></i>
                                    System Status
                                </h3>
                                
                                {error ? (
                                    <div className="alert alert-danger">
                                        <i className="fas fa-exclamation-triangle me-2"></i>
                                        {error}
                                    </div>
                                ) : (
                                    <div className="status-grid">
                                        <div className="status-item">
                                            <span className="status-label">Data Connection</span>
                                            <span className="status-value text-success">
                                                <i className="fas fa-check-circle me-1"></i>
                                                Connected
                                            </span>
                                        </div>
                                        
                                        <div className="status-item">
                                            <span className="status-label">Last Update</span>
                                            <span className="status-value text-info">
                                                <i className="fas fa-sync-alt me-1"></i>
                                                {stats.lastUpdate}
                                            </span>
                                        </div>
                                        
                                        <div className="status-item">
                                            <span className="status-label">Tracking Mode</span>
                                            <span className="status-value text-warning">
                                                <i className="fas fa-satellite me-1"></i>
                                                Real-time
                                            </span>
                                        </div>
                                        
                                        <div className="status-item">
                                            <span className="status-label">Mission Status</span>
                                            <span className="status-value text-success">
                                                <i className="fas fa-rocket me-1"></i>
                                                Operational
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;
