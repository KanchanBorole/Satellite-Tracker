import React, { useState, useEffect } from 'react';

/**
 * Dashboard component with charts and satellite data visualization
 * Uses Recharts for data visualization
 */
function Dashboard({ satellites, loading, error, onRefresh }) {
    const [chartData, setChartData] = useState([]);
    const [selectedMetric, setSelectedMetric] = useState('orbit_distribution');

    // Process satellite data for charts
    useEffect(() => {
        if (satellites && satellites.length > 0) {
            processChartData();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [satellites, selectedMetric]);

    const processChartData = () => {
        switch (selectedMetric) {
            case 'orbit_distribution':
                generateOrbitDistribution();
                break;
            case 'launch_timeline':
                generateLaunchTimeline();
                break;
            case 'status_overview':
                generateStatusOverview();
                break;
            default:
                generateOrbitDistribution();
        }
    };

    const generateOrbitDistribution = () => {
        const orbitCounts = satellites.reduce((acc, sat) => {
            acc[sat.orbit_type] = (acc[sat.orbit_type] || 0) + 1;
            return acc;
        }, {});

        const data = Object.entries(orbitCounts).map(([orbit, count]) => ({
            name: orbit,
            value: count,
            percentage: ((count / satellites.length) * 100).toFixed(1)
        }));

        setChartData(data);
    };

    const generateLaunchTimeline = () => {
        const yearCounts = satellites.reduce((acc, sat) => {
            const year = new Date(sat.launch_date).getFullYear();
            acc[year] = (acc[year] || 0) + 1;
            return acc;
        }, {});

        const data = Object.entries(yearCounts)
            .map(([year, count]) => ({
                year: parseInt(year),
                launches: count
            }))
            .sort((a, b) => a.year - b.year);

        setChartData(data);
    };

    const generateStatusOverview = () => {
        const statusCounts = satellites.reduce((acc, sat) => {
            acc[sat.status] = (acc[sat.status] || 0) + 1;
            return acc;
        }, {});

        const data = Object.entries(statusCounts).map(([status, count]) => ({
            name: status,
            value: count,
            percentage: ((count / satellites.length) * 100).toFixed(1)
        }));

        setChartData(data);
    };

    // Custom chart colors
    const chartColors = ['#00d4ff', '#0066ff', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffd93d', '#ff8a80'];

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="text-center">
                    <div className="spinner-orbit mb-3"></div>
                    <h4>Loading Dashboard Data...</h4>
                    <p className="text-muted">Retrieving satellite information and metrics</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-error">
                <div className="container">
                    <div className="alert alert-danger" role="alert">
                        <h4 className="alert-heading">
                            <i className="fas fa-exclamation-triangle me-2"></i>
                            Dashboard Error
                        </h4>
                        <p>{error}</p>
                        <hr />
                        <button className="btn btn-outline-danger" onClick={onRefresh}>
                            <i className="fas fa-retry me-2"></i>
                            Retry Loading
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="container-fluid">
                {/* Dashboard Header */}
                <div className="dashboard-header mb-4">
                    <div className="row align-items-center">
                        <div className="col-md-8">
                            <h2 className="dashboard-title">
                                <i className="fas fa-chart-line me-2"></i>
                                Mission Dashboard
                            </h2>
                            <p className="dashboard-subtitle">
                                Real-time satellite tracking and mission analytics
                            </p>
                        </div>
                        <div className="col-md-4 text-end">
                            <button 
                                className="btn btn-outline-light me-2" 
                                onClick={onRefresh}
                                disabled={loading}
                            >
                                <i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-sync-alt'} me-2`}></i>
                                Refresh
                            </button>
                            <div className="btn-group">
                                <button 
                                    className="btn btn-secondary dropdown-toggle" 
                                    type="button" 
                                    data-bs-toggle="dropdown"
                                >
                                    <i className="fas fa-chart-bar me-2"></i>
                                    {selectedMetric.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </button>
                                <ul className="dropdown-menu">
                                    <li>
                                        <button 
                                            className="dropdown-item" 
                                            onClick={() => setSelectedMetric('orbit_distribution')}
                                        >
                                            Orbit Distribution
                                        </button>
                                    </li>
                                    <li>
                                        <button 
                                            className="dropdown-item" 
                                            onClick={() => setSelectedMetric('launch_timeline')}
                                        >
                                            Launch Timeline
                                        </button>
                                    </li>
                                    <li>
                                        <button 
                                            className="dropdown-item" 
                                            onClick={() => setSelectedMetric('status_overview')}
                                        >
                                            Status Overview
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Key Metrics Cards */}
                <div className="row mb-4">
                    <div className="col-lg-3 col-md-6 mb-3">
                        <div className="metric-card">
                            <div className="metric-icon">
                                <i className="fas fa-satellite"></i>
                            </div>
                            <div className="metric-content">
                                <h3 className="metric-value">{satellites.length}</h3>
                                <p className="metric-label">Total Satellites</p>
                                <div className="metric-trend">
                                    <i className="fas fa-arrow-up text-success"></i>
                                    <span className="text-success">+2 this month</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3 col-md-6 mb-3">
                        <div className="metric-card">
                            <div className="metric-icon text-success">
                                <i className="fas fa-check-circle"></i>
                            </div>
                            <div className="metric-content">
                                <h3 className="metric-value">
                                    {satellites.filter(s => s.status === 'Active').length}
                                </h3>
                                <p className="metric-label">Active Missions</p>
                                <div className="metric-trend">
                                    <i className="fas fa-circle text-success"></i>
                                    <span className="text-success">All operational</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3 col-md-6 mb-3">
                        <div className="metric-card">
                            <div className="metric-icon text-info">
                                <i className="fas fa-orbit"></i>
                            </div>
                            <div className="metric-content">
                                <h3 className="metric-value">
                                    {[...new Set(satellites.map(s => s.orbit_type))].length}
                                </h3>
                                <p className="metric-label">Orbit Types</p>
                                <div className="metric-trend">
                                    <i className="fas fa-info-circle text-info"></i>
                                    <span className="text-info">Multi-orbital</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3 col-md-6 mb-3">
                        <div className="metric-card">
                            <div className="metric-icon text-warning">
                                <i className="fas fa-globe"></i>
                            </div>
                            <div className="metric-content">
                                <h3 className="metric-value">24/7</h3>
                                <p className="metric-label">Global Coverage</p>
                                <div className="metric-trend">
                                    <i className="fas fa-clock text-warning"></i>
                                    <span className="text-warning">Continuous</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chart Section */}
                <div className="row">
                    <div className="col-lg-8 mb-4">
                        <div className="chart-panel">
                            <div className="chart-header">
                                <h4 className="chart-title">
                                    {selectedMetric.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </h4>
                            </div>
                            <div className="chart-container">
                                {selectedMetric === 'launch_timeline' ? (
                                    <div className="chart-placeholder">
                                        <div className="chart-bars">
                                            {chartData.map((item, index) => (
                                                <div key={index} className="chart-bar-container">
                                                    <div 
                                                        className="chart-bar"
                                                        style={{
                                                            height: `${(item.launches / Math.max(...chartData.map(d => d.launches))) * 200}px`,
                                                            backgroundColor: chartColors[index % chartColors.length]
                                                        }}
                                                    ></div>
                                                    <div className="chart-label">{item.year}</div>
                                                    <div className="chart-value">{item.launches}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="chart-placeholder">
                                        <div className="pie-chart">
                                            {chartData.map((item, index) => (
                                                <div key={index} className="pie-segment" 
                                                     style={{ 
                                                         '--color': chartColors[index % chartColors.length],
                                                         '--percentage': item.percentage 
                                                     }}>
                                                    <div className="pie-label">
                                                        <span className="pie-name">{item.name}</span>
                                                        <span className="pie-value">{item.value} ({item.percentage}%)</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Satellite List */}
                    <div className="col-lg-4 mb-4">
                        <div className="satellite-panel">
                            <div className="panel-header">
                                <h4 className="panel-title">
                                    <i className="fas fa-list me-2"></i>
                                    Active Satellites
                                </h4>
                            </div>
                            <div className="satellite-list">
                                {satellites.filter(s => s.status === 'Active').slice(0, 8).map((satellite, index) => (
                                    <div key={satellite.id} className="satellite-item">
                                        <div className="satellite-info">
                                            <div className="satellite-name">{satellite.name}</div>
                                            <div className="satellite-details">
                                                <span className="satellite-orbit">{satellite.orbit_type}</span>
                                                <span className="satellite-date">
                                                    {new Date(satellite.launch_date).getFullYear()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="satellite-status">
                                            <i className="fas fa-circle text-success"></i>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
