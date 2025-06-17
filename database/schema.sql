-- Mission Board Dashboard Database Schema
-- Satellite tracking and mission data storage

-- Create database (uncomment if needed)
-- CREATE DATABASE mission_board_dashboard;
-- USE mission_board_dashboard;

-- Satellites table for storing satellite information
CREATE TABLE IF NOT EXISTS satellites (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE,
    launch_date DATE NOT NULL,
    orbit_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Unknown',
    altitude_km DECIMAL(10,2) NULL,
    inclination_deg DECIMAL(5,2) NULL,
    period_minutes DECIMAL(8,2) NULL,
    operator VARCHAR(255) NULL,
    country VARCHAR(100) NULL,
    mission_type VARCHAR(100) NULL,
    mass_kg DECIMAL(8,2) NULL,
    power_watts DECIMAL(8,2) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_status (status),
    INDEX idx_orbit_type (orbit_type),
    INDEX idx_launch_date (launch_date),
    INDEX idx_operator (operator)
);

-- Mission tracking table
CREATE TABLE IF NOT EXISTS missions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    mission_name VARCHAR(255) NOT NULL,
    launch_date DATE NOT NULL,
    mission_status VARCHAR(50) NOT NULL DEFAULT 'Planned',
    launch_site VARCHAR(255) NULL,
    rocket_type VARCHAR(100) NULL,
    payload_count INT DEFAULT 0,
    mission_duration_days INT NULL,
    cost_millions DECIMAL(10,2) NULL,
    success_rate DECIMAL(5,2) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_mission_status (mission_status),
    INDEX idx_launch_date (launch_date)
);

-- Satellite telemetry data table
CREATE TABLE IF NOT EXISTS satellite_telemetry (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    satellite_id INT NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    latitude DECIMAL(10,8) NULL,
    longitude DECIMAL(11,8) NULL,
    altitude_km DECIMAL(10,2) NULL,
    velocity_kmh DECIMAL(10,2) NULL,
    battery_level DECIMAL(5,2) NULL,
    temperature_c DECIMAL(6,2) NULL,
    signal_strength DECIMAL(5,2) NULL,
    operational_status VARCHAR(50) DEFAULT 'Normal',
    
    FOREIGN KEY (satellite_id) REFERENCES satellites(id) ON DELETE CASCADE,
    INDEX idx_satellite_timestamp (satellite_id, timestamp),
    INDEX idx_timestamp (timestamp)
);

-- Ground stations table
CREATE TABLE IF NOT EXISTS ground_stations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    station_name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    elevation_m DECIMAL(8,2) NULL,
    frequency_range VARCHAR(100) NULL,
    antenna_diameter_m DECIMAL(5,2) NULL,
    operational_status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_location (location),
    INDEX idx_operational_status (operational_status)
);

-- Insert sample data
INSERT INTO satellites (name, launch_date, orbit_type, status, altitude_km, inclination_deg, operator, country, mission_type) VALUES
('International Space Station', '1998-11-20', 'Low Earth Orbit', 'Active', 408.0, 51.6, 'NASA/Roscosmos', 'International', 'Research'),
('Hubble Space Telescope', '1990-04-24', 'Low Earth Orbit', 'Active', 547.0, 28.5, 'NASA', 'USA', 'Astronomy'),
('James Webb Space Telescope', '2021-12-25', 'Sun-Earth L2', 'Active', 1500000.0, 0.0, 'NASA/ESA/CSA', 'International', 'Astronomy'),
('Starlink-1007', '2019-05-23', 'Low Earth Orbit', 'Active', 550.0, 53.0, 'SpaceX', 'USA', 'Communications'),
('GPS III SV01', '2018-12-23', 'Medium Earth Orbit', 'Active', 20200.0, 55.0, 'US Space Force', 'USA', 'Navigation'),
('Sentinel-1A', '2014-04-03', 'Sun-synchronous', 'Active', 693.0, 98.2, 'ESA', 'Europe', 'Earth Observation'),
('GOES-16', '2016-11-19', 'Geostationary', 'Active', 35786.0, 0.0, 'NOAA', 'USA', 'Weather'),
('Terra', '1999-12-18', 'Sun-synchronous', 'Active', 705.0, 98.2, 'NASA', 'USA', 'Earth Observation'),
('Aqua', '2002-05-04', 'Sun-synchronous', 'Active', 705.0, 98.2, 'NASA', 'USA', 'Earth Observation'),
('Landsat 8', '2013-02-11', 'Sun-synchronous', 'Active', 705.0, 98.2, 'NASA/USGS', 'USA', 'Earth Observation');

INSERT INTO missions (mission_name, launch_date, mission_status, launch_site, rocket_type, payload_count) VALUES
('ISS Expedition 1', '2000-10-31', 'Completed', 'Baikonur Cosmodrome', 'Soyuz-U', 3),
('STS-125 (Hubble Servicing)', '2009-05-11', 'Completed', 'Kennedy Space Center', 'Space Shuttle Atlantis', 1),
('Artemis 1', '2022-11-16', 'Completed', 'Kennedy Space Center', 'SLS Block 1', 1),
('Crew Dragon Demo-2', '2020-05-30', 'Completed', 'Kennedy Space Center', 'Falcon 9', 2),
('Perseverance Mars Rover', '2020-07-30', 'Active', 'Cape Canaveral', 'Atlas V 541', 1);

INSERT INTO ground_stations (station_name, location, latitude, longitude, elevation_m, operational_status) VALUES
('Deep Space Network - Goldstone', 'California, USA', 35.4275, -116.8906, 1036, 'Active'),
('Deep Space Network - Madrid', 'Spain', 40.4270, -4.2495, 834, 'Active'),
('Deep Space Network - Canberra', 'Australia', -35.4019, 148.9819, 692, 'Active'),
('Kennedy Space Center', 'Florida, USA', 28.5721, -80.6480, 3, 'Active'),
('Johnson Space Center', 'Texas, USA', 29.5586, -95.0936, 16, 'Active');

-- Create views for common queries
CREATE VIEW active_satellites AS
SELECT 
    id, name, launch_date, orbit_type, status, 
    altitude_km, operator, country, mission_type
FROM satellites 
WHERE status = 'Active';

CREATE VIEW satellite_summary AS
SELECT 
    orbit_type,
    COUNT(*) as satellite_count,
    AVG(altitude_km) as avg_altitude_km
FROM satellites 
WHERE status = 'Active'
GROUP BY orbit_type;

-- Create indexes for performance
CREATE INDEX idx_satellites_composite ON satellites(status, orbit_type, launch_date);
CREATE INDEX idx_telemetry_recent ON satellite_telemetry(satellite_id, timestamp DESC);
