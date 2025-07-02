<?php
// backend/index.php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<pre>";
echo "REQUEST_URI: " . $_SERVER['REQUEST_URI'] . "\n";
echo "METHOD: " . $_SERVER['REQUEST_METHOD'] . "\n";
echo "</pre>";


require_once 'config/database.php';

// Simple API router
$request = $_SERVER['REQUEST_URI'];
$path = parse_url($request, PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Remove base path if needed
$basePath = '/image-upload-platform/backend';
$path = str_replace($basePath, '', $path);
// $scriptName = dirname($_SERVER['SCRIPT_NAME']);
// $path = str_replace($scriptName, '', $path);


// Route to appropriate API endpoint
switch ($path) {
    case '/api/upload.php':
    case '/api/upload':
        require 'api/upload.php';
        break;
        
    case '/api/get-images.php':
    case '/api/get-images':
        require 'api/get-images.php';
        break;
        
    case '/api/delete-image.php':
    case '/api/delete-image':
        require 'api/delete-image.php';
        break;
        
    case '/api/update-image.php':
    case '/api/update-image':
        require 'api/update-image.php';
        break;
        
    case '/':
    case '':
        // Basic info page
        ?>
        <!DOCTYPE html>
        <html>
        <head>
            <title>Image Upload Platform - Backend</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
                .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                h1 { color: #333; }
                .endpoint { background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #007bff; }
                .method { font-weight: bold; color: #007bff; }
                .status { padding: 10px; background: #d4edda; color: #155724; border-radius: 5px; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>📸 Image Upload Platform - Backend API</h1>
                
                <div class="status">
                    ✅ Backend is running successfully!
                </div>
                
                <h2>Available Endpoints:</h2>
                
                <div class="endpoint">
                    <div class="method">POST</div>
                    <strong>/api/upload.php</strong><br>
                    Upload a new image
                </div>
                
                <div class="endpoint">
                    <div class="method">GET</div>
                    <strong>/api/get-images.php</strong><br>
                    Retrieve all images
                </div>
                
                <div class="endpoint">
                    <div class="method">DELETE</div>
                    <strong>/api/delete-image.php</strong><br>
                    Delete an image
                </div>
                
                <div class="endpoint">
                    <div class="method">PUT</div>
                    <strong>/api/update-image.php</strong><br>
                    Update image details
                </div>
                
                <h2>Database Status:</h2>
                <?php
                if ($conn) {
                    echo '<div class="status">✅ Database connection successful!</div>';
                    
                    // Check if images table exists
                    $result = mysqli_query($conn, "SHOW TABLES LIKE 'images'");
                    if ($result && mysqli_num_rows($result) > 0) {
                        echo '<div class="status">✅ Images table exists!</div>';
                        
                        // Count images
                        $countResult = mysqli_query($conn, "SELECT COUNT(*) as count FROM images");
                        if ($countResult) {
                            $row = mysqli_fetch_assoc($countResult);
                            echo '<div class="status">📊 Total images in database: ' . $row['count'] . '</div>';
                        }
                    } else {
                        echo '<div style="padding: 10px; background: #f8d7da; color: #721c24; border-radius: 5px; margin: 20px 0;">❌ Images table not found! Please create the database table.</div>';
                    }
                } else {
                    echo '<div style="padding: 10px; background: #f8d7da; color: #721c24; border-radius: 5px; margin: 20px 0;">❌ Database connection failed!</div>';
                }
                ?>
                
                <h2>Uploads Directory:</h2>
                <?php
                $uploadsDir = __DIR__ . '/uploads/';
                if (is_dir($uploadsDir)) {
                    if (is_writable($uploadsDir)) {
                        echo '<div class="status">✅ Uploads directory exists and is writable!</div>';
                        $files = glob($uploadsDir . '*');
                        echo '<div class="status">📁 Files in uploads directory: ' . count($files) . '</div>';
                    } else {
                        echo '<div style="padding: 10px; background: #fff3cd; color: #856404; border-radius: 5px; margin: 20px 0;">⚠️ Uploads directory exists but is not writable!</div>';
                    }
                } else {
                    echo '<div style="padding: 10px; background: #f8d7da; color: #721c24; border-radius: 5px; margin: 20px 0;">❌ Uploads directory does not exist!</div>';
                }
                ?>
            </div>
        </body>
        </html>
        <?php
        break;
        
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint not found']);
        break;
}

// Close connection if it exists
if (isset($conn) && $conn) {
    mysqli_close($conn);
}
?>