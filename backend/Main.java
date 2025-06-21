import java.io.IOException;

/**
 * Main entry point for the Mission Board Dashboard backend server
 */
public class Main {
    public static void main(String[] args) {
        try {
            int port = 8080;
            SatelliteServer server = new SatelliteServer(port);
            server.start();
            System.out.println("Mission Board Dashboard server started on port " + port);
            System.out.println("Access the /satellites endpoint at: http://localhost:" + port + "/satellites");
            
            // Keep the server running
            Runtime.getRuntime().addShutdownHook(new Thread(() -> {
                System.out.println("Shutting down server...");
                server.stop();
            }));
            
        } catch (IOException e) {
            System.err.println("Failed to start server: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
