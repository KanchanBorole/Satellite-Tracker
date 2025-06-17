import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import SatelliteHistory from './components/SatelliteHistory';
import LiveVideo from './components/LiveVideo';

/**
 * Main App component for Mission Board Dashboard
 * Handles routing and global state management
 */
function App() {
    const [currentView, setCurrentView] = useState('home');
    const [satellites, setSatellites] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // API configuration
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

    /**
     * Fetch satellite data from backend API
     */
    const fetchSatellites = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch(`${API_BASE_URL}/satellites`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.satellites && Array.isArray(data.satellites)) {
                setSatellites(data.satellites);
            } else {
                throw new Error('Invalid data format received from server');
            }
            
        } catch (err) {
            console.error('Failed to fetch satellites:', err);
            setError(`Failed to load satellite data: ${err.message}`);
            setSatellites([]);
        } finally {
            setLoading(false);
        }
    };

    // Load satellites on component mount
    useEffect(() => {
        fetchSatellites();
    }, []);

    /**
     * Handle navigation between views
     */
    const handleNavigation = (view) => {
        setCurrentView(view);
        
        // Refresh data when navigating to dashboard or history
        if (view === 'dashboard' || view === 'history') {
            fetchSatellites();
        }
    };

    /**
     * Render current view based on navigation state
     */
    const renderCurrentView = () => {
        const commonProps = {
            satellites,
            loading,
            error,
            onRefresh: fetchSatellites
        };

        switch (currentView) {
            case 'home':
                return <Home {...commonProps} />;
            case 'dashboard':
                return <Dashboard {...commonProps} />;
            case 'history':
                return <SatelliteHistory {...commonProps} />;
            case 'videos':
                return <LiveVideo {...commonProps} />;
            default:
                return <Home {...commonProps} />;
        }
    };

    return (
        <div className="App">
            <Navbar 
                currentView={currentView} 
                onNavigate={handleNavigation}
                satelliteCount={satellites.length}
            />
            
            <main className="app-main">
                {renderCurrentView()}
            </main>
            
            {/* Global error toast */}
            {error && (
                <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1050 }}>
                    <div className="toast show" role="alert">
                        <div className="toast-header bg-danger text-white">
                            <i className="fas fa-exclamation-triangle me-2"></i>
                            <strong className="me-auto">Error</strong>
                            <button 
                                type="button" 
                                className="btn-close btn-close-white" 
                                onClick={() => setError(null)}
                            ></button>
                        </div>
                        <div className="toast-body bg-dark text-white">
                            {error}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
