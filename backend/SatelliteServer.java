import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.util.List;

/**
 * HTTP Server for Mission Board Dashboard satellite data
 * Provides REST API endpoints for satellite information
 */
public class SatelliteServer {
    private HttpServer server;
    private SatelliteData satelliteData;

    public SatelliteServer(int port) throws IOException {
        server = HttpServer.create(new InetSocketAddress("0.0.0.0", port), 0);
        satelliteData = new SatelliteData();
        setupRoutes();
    }

    private void setupRoutes() {
        // CORS-enabled handler for satellite data
        server.createContext("/satellites", new SatelliteHandler());
        
        // Health check endpoint
        server.createContext("/health", new HealthHandler());
        
        server.setExecutor(null);
    }

    public void start() {
        server.start();
    }

    public void stop() {
        server.stop(0);
    }

    /**
     * Handler for /satellites endpoint
     */
    private class SatelliteHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            // Add CORS headers
            exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");

            String method = exchange.getRequestMethod();

            if ("OPTIONS".equals(method)) {
                exchange.sendResponseHeaders(200, 0);
                exchange.close();
                return;
            }

            if ("GET".equals(method)) {
                try {
                    String jsonResponse = satelliteData.getSatellitesAsJson();
                    
                    exchange.getResponseHeaders().add("Content-Type", "application/json");
                    exchange.sendResponseHeaders(200, jsonResponse.getBytes().length);
                    
                    OutputStream os = exchange.getResponseBody();
                    os.write(jsonResponse.getBytes());
                    os.close();
                    
                } catch (Exception e) {
                    String errorResponse = "{\"error\": \"Failed to retrieve satellite data: " + e.getMessage() + "\"}";
                    exchange.getResponseHeaders().add("Content-Type", "application/json");
                    exchange.sendResponseHeaders(500, errorResponse.getBytes().length);
                    
                    OutputStream os = exchange.getResponseBody();
                    os.write(errorResponse.getBytes());
                    os.close();
                }
            } else {
                String errorResponse = "{\"error\": \"Method not allowed\"}";
                exchange.sendResponseHeaders(405, errorResponse.getBytes().length);
                
                OutputStream os = exchange.getResponseBody();
                os.write(errorResponse.getBytes());
                os.close();
            }
        }
    }

    /**
     * Handler for /health endpoint
     */
    private class HealthHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().add("Content-Type", "application/json");
            
            String healthResponse = "{\"status\": \"healthy\", \"timestamp\": \"" + 
                java.time.Instant.now().toString() + "\"}";
            
            exchange.sendResponseHeaders(200, healthResponse.getBytes().length);
            
            OutputStream os = exchange.getResponseBody();
            os.write(healthResponse.getBytes());
            os.close();
        }
    }
}
