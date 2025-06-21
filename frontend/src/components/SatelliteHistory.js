import React, { useState, useEffect } from 'react';

/**
 * Satellite History component
 * Displays detailed satellite information with filtering and search capabilities
 */
function SatelliteHistory({ satellites, loading, error, onRefresh }) {
    const [filteredSatellites, setFilteredSatellites] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrbit, setSelectedOrbit] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Get unique orbit types and statuses for filters
    const orbitTypes = [...new Set(satellites.map(s => s.orbit_type))];
    const statuses = [...new Set(satellites.map(s => s.status))];

    // Filter and sort satellites
    useEffect(() => {
        let filtered = satellites.filter(satellite => {
            const matchesSearch = satellite.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                satellite.orbit_type.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesOrbit = selectedOrbit === 'all' || satellite.orbit_type === selectedOrbit;
            const matchesStatus = selectedStatus === 'all' || satellite.status === selectedStatus;
            
            return matchesSearch && matchesOrbit && matchesStatus;
        });

        // Sort satellites
        filtered.sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];

            if (sortBy === 'launch_date') {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        setFilteredSatellites(filtered);
        setCurrentPage(1); // Reset to first page when filters change
    }, [satellites, searchTerm, selectedOrbit, selectedStatus, sortBy, sortOrder]);

    // Pagination
    const totalPages = Math.ceil(filteredSatellites.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedSatellites = filteredSatellites.slice(startIndex, startIndex + itemsPerPage);

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    const getSortIcon = (field) => {
        if (sortBy !== field) return 'fas fa-sort';
        return sortOrder === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
    };

    const getStatusBadgeClass = (status) => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'badge bg-success';
            case 'inactive':
                return 'badge bg-secondary';
            case 'decommissioned':
                return 'badge bg-danger';
            default:
                return 'badge bg-warning';
        }
    };

    if (loading) {
        return (
            <div className="history-loading">
                <div className="text-center">
                    <div className="spinner-orbit mb-3"></div>
                    <h4>Loading Satellite History...</h4>
                    <p className="text-muted">Retrieving satellite database records</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="history-error">
                <div className="container">
                    <div className="alert alert-danger" role="alert">
                        <h4 className="alert-heading">
                            <i className="fas fa-exclamation-triangle me-2"></i>
                            Data Loading Error
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
        <div className="history-container">
            <div className="container-fluid">
                {/* Header */}
                <div className="history-header mb-4">
                    <div className="row align-items-center">
                        <div className="col-md-8">
                            <h2 className="history-title">
                                <i className="fas fa-history me-2"></i>
                                Satellite History
                            </h2>
                            <p className="history-subtitle">
                                Complete database of tracked satellites and missions
                            </p>
                        </div>
                        <div className="col-md-4 text-end">
                            <button 
                                className="btn btn-outline-light" 
                                onClick={onRefresh}
                                disabled={loading}
                            >
                                <i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-sync-alt'} me-2`}></i>
                                Refresh Data
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="filters-panel mb-4">
                    <div className="row">
                        <div className="col-md-4 mb-3">
                            <div className="input-group">
                                <span className="input-group-text">
                                    <i className="fas fa-search"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search satellites..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="col-md-2 mb-3">
                            <select
                                className="form-select"
                                value={selectedOrbit}
                                onChange={(e) => setSelectedOrbit(e.target.value)}
                            >
                                <option value="all">All Orbits</option>
                                {orbitTypes.map(orbit => (
                                    <option key={orbit} value={orbit}>{orbit}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-2 mb-3">
                            <select
                                className="form-select"
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                            >
                                <option value="all">Status</option>
                                {statuses.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-4 mb-3">
                            <div className="result-info">
                                Showing {paginatedSatellites.length} of {filteredSatellites.length} satellites
                                {filteredSatellites.length !== satellites.length && 
                                    ` (filtered from ${satellites.length} total)`
                                }
                            </div>
                        </div>
                    </div>
                </div>

                {/* Satellites Table */}
                <div className="table-panel">
                    <div className="table-responsive">
                        <table className="table table-dark table-hover satellite-table">
                            <thead>
                                <tr>
                                    <th 
                                        className="sortable-header" 
                                        onClick={() => handleSort('name')}
                                    >
                                        Name <i className={getSortIcon('name')}></i>
                                    </th>
                                    <th 
                                        className="sortable-header" 
                                        onClick={() => handleSort('launch_date')}
                                    >
                                        Launch Date <i className={getSortIcon('launch_date')}></i>
                                    </th>
                                    <th 
                                        className="sortable-header" 
                                        onClick={() => handleSort('orbit_type')}
                                    >
                                        Orbit Type <i className={getSortIcon('orbit_type')}></i>
                                    </th>
                                    <th 
                                        className="sortable-header" 
                                        onClick={() => handleSort('status')}
                                    >
                                        Status <i className={getSortIcon('status')}></i>
                                    </th>
                                    <th>Mission Duration</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedSatellites.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4">
                                            <i className="fas fa-search me-2"></i>
                                            No satellites found matching your criteria
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedSatellites.map((satellite, index) => {
                                        const launchDate = new Date(satellite.launch_date);
                                        const missionDuration = Math.floor((new Date() - launchDate) / (1000 * 60 * 60 * 24));
                                        
                                        return (
                                            <tr key={satellite.id}>
                                                <td>
                                                    <div className="satellite-name-cell">
                                                        <i className="fas fa-satellite me-2 text-info"></i>
                                                        <strong>{satellite.name}</strong>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="date-cell">
                                                        {launchDate.toLocaleDateString()}
                                                        <small className="text-muted d-block">
                                                            {launchDate.getFullYear()}
                                                        </small>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="orbit-cell">
                                                        <i className="fas fa-orbit me-1"></i>
                                                        {satellite.orbit_type}
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={getStatusBadgeClass(satellite.status)}>
                                                        {satellite.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="duration-cell">
                                                        {missionDuration.toLocaleString()} days
                                                        <small className="text-muted d-block">
                                                            {(missionDuration / 365).toFixed(1)} years
                                                        </small>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <button 
                                                            className="btn btn-sm btn-outline-info me-1"
                                                            title="View Details"
                                                        >
                                                            <i className="fas fa-eye"></i>
                                                        </button>
                                                        <button 
                                                            className="btn btn-sm btn-outline-primary"
                                                            title="Track Satellite"
                                                        >
                                                            <i className="fas fa-crosshairs"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="pagination-container">
                            <nav>
                                <ul className="pagination pagination-dark justify-content-center">
                                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                        <button 
                                            className="page-link"
                                            onClick={() => setCurrentPage(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        >
                                            <i className="fas fa-chevron-left"></i>
                                            Previous
                                        </button>
                                    </li>
                                    
                                    {[...Array(totalPages)].map((_, index) => {
                                        const pageNum = index + 1;
                                        if (
                                            pageNum === 1 || 
                                            pageNum === totalPages || 
                                            (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
                                        ) {
                                            return (
                                                <li 
                                                    key={pageNum} 
                                                    className={`page-item ${currentPage === pageNum ? 'active' : ''}`}
                                                >
                                                    <button 
                                                        className="page-link"
                                                        onClick={() => setCurrentPage(pageNum)}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                </li>
                                            );
                                        }
                                        return null;
                                    })}
                                    
                                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                        <button 
                                            className="page-link"
                                            onClick={() => setCurrentPage(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                        >
                                            Next
                                            <i className="fas fa-chevron-right"></i>
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SatelliteHistory;
