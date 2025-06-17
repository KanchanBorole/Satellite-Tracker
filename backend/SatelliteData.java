import java.util.ArrayList;
import java.util.List;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

/**
 * Data access layer for satellite information
 * Provides satellite data for the Mission Board Dashboard
 */
public class SatelliteData {
    private List<Satellite> satellites;
    private DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public SatelliteData() {
        initializeSatelliteData();
    }

    /**
     * Initialize satellite data with current operational satellites
     */
    private void initializeSatelliteData() {
        satellites = new ArrayList<>();
        
        // Add operational satellites with real data
        satellites.add(new Satellite(1, "International Space Station", "1998-11-20", "Low Earth Orbit", "Active"));
        satellites.add(new Satellite(2, "Hubble Space Telescope", "1990-04-24", "Low Earth Orbit", "Active"));
        satellites.add(new Satellite(3, "James Webb Space Telescope", "2021-12-25", "Sun-Earth L2", "Active"));
        satellites.add(new Satellite(4, "Starlink-1007", "2019-05-23", "Low Earth Orbit", "Active"));
        satellites.add(new Satellite(5, "GPS III SV01", "2018-12-23", "Medium Earth Orbit", "Active"));
        satellites.add(new Satellite(6, "Sentinel-1A", "2014-04-03", "Sun-synchronous", "Active"));
        satellites.add(new Satellite(7, "GOES-16", "2016-11-19", "Geostationary", "Active"));
        satellites.add(new Satellite(8, "Terra", "1999-12-18", "Sun-synchronous", "Active"));
        satellites.add(new Satellite(9, "Aqua", "2002-05-04", "Sun-synchronous", "Active"));
        satellites.add(new Satellite(10, "Landsat 8", "2013-02-11", "Sun-synchronous", "Active"));
    }

    /**
     * Get all satellites as JSON string
     */
    public String getSatellitesAsJson() {
        StringBuilder json = new StringBuilder();
        json.append("{\n");
        json.append("  \"satellites\": [\n");
        
        for (int i = 0; i < satellites.size(); i++) {
            Satellite sat = satellites.get(i);
            json.append("    {\n");
            json.append("      \"id\": ").append(sat.getId()).append(",\n");
            json.append("      \"name\": \"").append(sat.getName()).append("\",\n");
            json.append("      \"launch_date\": \"").append(sat.getLaunchDate()).append("\",\n");
            json.append("      \"orbit_type\": \"").append(sat.getOrbitType()).append("\",\n");
            json.append("      \"status\": \"").append(sat.getStatus()).append("\"\n");
            json.append("    }");
            
            if (i < satellites.size() - 1) {
                json.append(",");
            }
            json.append("\n");
        }
        
        json.append("  ],\n");
        json.append("  \"total_count\": ").append(satellites.size()).append(",\n");
        json.append("  \"last_updated\": \"").append(java.time.Instant.now().toString()).append("\"\n");
        json.append("}");
        
        return json.toString();
    }

    /**
     * Inner class representing a satellite
     */
    private static class Satellite {
        private int id;
        private String name;
        private String launchDate;
        private String orbitType;
        private String status;

        public Satellite(int id, String name, String launchDate, String orbitType, String status) {
            this.id = id;
            this.name = name;
            this.launchDate = launchDate;
            this.orbitType = orbitType;
            this.status = status;
        }

        public int getId() { return id; }
        public String getName() { return name; }
        public String getLaunchDate() { return launchDate; }
        public String getOrbitType() { return orbitType; }
        public String getStatus() { return status; }
    }
}
