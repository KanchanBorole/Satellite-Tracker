import React, { useState, useRef, useEffect } from 'react';

/**
 * Live Video component for space mission video feeds
 * Supports multiple video sources and controls
 */
function LiveVideo({ satellites, loading, error, onRefresh }) {
    const [selectedVideo, setSelectedVideo] = useState('iss_live');
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.7);
    const [fullscreen, setFullscreen] = useState(false);
    const videoRef = useRef(null);
    const containerRef = useRef(null);

    // Video feed sources
    const videoSources = [
        {
            id: 'iss_live',
            title: 'International Space Station - Live Feed',
            description: 'Real-time view from the International Space Station',
            url: 'https://www.youtube.com/embed/XBPjVzSoepo?autoplay=0&mute=1',
            type: 'iframe',
            status: 'live'
        },
        {
            id: 'earth_from_space',
            title: 'Earth from Space - NASA',
            description: 'Beautiful views of Earth captured from orbit',
            url: 'https://www.youtube.com/embed/RtU_mdL2vBM?autoplay=0&mute=1',
            type: 'iframe',
            status: 'live'
        },
        {
            id: 'spacex_starship',
            title: 'SpaceX Starship Development',
            description: 'Latest updates on Starship development and testing',
            url: 'https://www.youtube.com/embed/L1PqHl_SrCU?autoplay=0&mute=1',
            type: 'iframe',
            status: 'recorded'
        },
        {
            id: 'nasa_live',
            title: 'NASA Live - Official Stream',
            description: 'Official NASA live programming and mission coverage',
            url: 'https://www.youtube.com/embed/21X5lGlDOfg?autoplay=0&mute=1',
            type: 'iframe',
            status: 'live'
        }
    ];

    const currentVideo = videoSources.find(v => v.id === selectedVideo) || videoSources[0];

    // Handle fullscreen toggle
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
            setFullscreen(true);
        } else {
            document.exitFullscreen();
            setFullscreen(false);
        }
    };

    // Listen for fullscreen changes
    useEffect(() => {
        const handleFullscreenChange = () => {
            setFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    // Handle video selection
    const handleVideoSelect = (videoId) => {
        setSelectedVideo(videoId);
        setIsPlaying(false);
    };

    if (loading) {
        return (
            <div className="video-loading">
                <div className="text-center">
                    <div className="spinner-orbit mb-3"></div>
                    <h4>Loading Video Feeds...</h4>
                    <p className="text-muted">Connecting to space mission video sources</p>
                </div>
            </div>
        );
    }

    return (
        <div className="video-container">
            <div className="container-fluid">
                {/* Header */}
                <div className="video-header mb-4">
                    <div className="row align-items-center">
                        <div className="col-md-8">
                            <h2 className="video-title">
                                <i className="fas fa-video me-2"></i>
                                Live Video Feeds
                            </h2>
                            <p className="video-subtitle">
                                Real-time and recorded space mission videos
                            </p>
                        </div>
                        <div className="col-md-4 text-end">
                            <div className="live-indicator">
                                <i className="fas fa-circle text-danger me-1 blink"></i>
                                <span className="text-danger fw-bold">LIVE</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    {/* Video Player */}
                    <div className="col-lg-8 mb-4">
                        <div className="video-player-panel" ref={containerRef}>
                            <div className="video-player-header">
                                <div className="row align-items-center">
                                    <div className="col-md-8">
                                        <h4 className="current-video-title">
                                            {currentVideo.title}
                                        </h4>
                                        <p className="current-video-description">
                                            {currentVideo.description}
                                        </p>
                                    </div>
                                    <div className="col-md-4 text-end">
                                        <div className="video-controls">
                                            <button 
                                                className="btn btn-outline-light btn-sm me-2"
                                                onClick={toggleFullscreen}
                                                title="Toggle Fullscreen"
                                            >
                                                <i className={`fas ${fullscreen ? 'fa-compress' : 'fa-expand'}`}></i>
                                            </button>
                                            <span className={`badge ${
                                                currentVideo.status === 'live' ? 'bg-danger' : 'bg-secondary'
                                            }`}>
                                                {currentVideo.status.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="video-player-wrapper">
                                {currentVideo.type === 'iframe' ? (
                                    <div className="embed-responsive embed-responsive-16by9">
                                        <iframe
                                            className="embed-responsive-item"
                                            src={currentVideo.url}
                                            title={currentVideo.title}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                ) : (
                                    <video
                                        ref={videoRef}
                                        className="video-element"
                                        controls
                                        preload="metadata"
                                        poster="/api/placeholder/800/450"
                                    >
                                        <source src={currentVideo.url} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                )}
                            </div>

                            {/* Video Status Bar */}
                            <div className="video-status-bar">
                                <div className="row align-items-center">
                                    <div className="col-md-6">
                                        <div className="video-stats">
                                            <span className="stat-item">
                                                <i className="fas fa-eye me-1"></i>
                                                Viewing: {currentVideo.title}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-md-6 text-end">
                                        <div className="connection-status">
                                            <i className="fas fa-wifi text-success me-1"></i>
                                            <span className="text-success">Connected</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Video Selection Sidebar */}
                    <div className="col-lg-4 mb-4">
                        <div className="video-selection-panel">
                            <div className="panel-header">
                                <h4 className="panel-title">
                                    <i className="fas fa-list me-2"></i>
                                    Available Feeds
                                </h4>
                            </div>

                            <div className="video-list">
                                {videoSources.map((video) => (
                                    <div 
                                        key={video.id}
                                        className={`video-item ${selectedVideo === video.id ? 'active' : ''}`}
                                        onClick={() => handleVideoSelect(video.id)}
                                    >
                                        <div className="video-thumbnail">
                                            <i className="fas fa-play-circle"></i>
                                            <div className="video-overlay">
                                                <span className={`status-badge ${
                                                    video.status === 'live' ? 'live' : 'recorded'
                                                }`}>
                                                    {video.status === 'live' ? (
                                                        <>
                                                            <i className="fas fa-circle me-1"></i>
                                                            LIVE
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="fas fa-video me-1"></i>
                                                            REC
                                                        </>
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="video-info">
                                            <h6 className="video-name">{video.title}</h6>
                                            <p className="video-desc">{video.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Mission Status Panel */}
                        <div className="mission-status-panel mt-4">
                            <div className="panel-header">
                                <h4 className="panel-title">
                                    <i className="fas fa-satellite me-2"></i>
                                    Mission Status
                                </h4>
                            </div>
                            <div className="status-list">
                                <div className="status-item">
                                    <div className="status-label">ISS Orbit</div>
                                    <div className="status-value text-success">
                                        <i className="fas fa-check-circle me-1"></i>
                                        Nominal
                                    </div>
                                </div>
                                <div className="status-item">
                                    <div className="status-label">Communication</div>
                                    <div className="status-value text-success">
                                        <i className="fas fa-signal me-1"></i>
                                        Strong Signal
                                    </div>
                                </div>
                                <div className="status-item">
                                    <div className="status-label">Video Quality</div>
                                    <div className="status-value text-info">
                                        <i className="fas fa-hd-video me-1"></i>
                                        HD Ready
                                    </div>
                                </div>
                                <div className="status-item">
                                    <div className="status-label">Next Pass</div>
                                    <div className="status-value text-warning">
                                        <i className="fas fa-clock me-1"></i>
                                        12:34 UTC
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="alert alert-warning" role="alert">
                        <h5 className="alert-heading">
                            <i className="fas fa-exclamation-triangle me-2"></i>
                            Connection Issue
                        </h5>
                        <p>{error}</p>
                        <hr />
                        <button className="btn btn-outline-warning" onClick={onRefresh}>
                            <i className="fas fa-sync-alt me-2"></i>
                            Retry Connection
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default LiveVideo;
