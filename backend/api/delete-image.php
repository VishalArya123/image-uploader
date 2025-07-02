<?php
// backend/api/delete-image.php

require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['id']) || empty($input['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Image ID is required']);
        exit;
    }
    
    $imageId = intval($input['id']);
    
    // First, get the image details
    $query = "SELECT * FROM images WHERE id = $imageId";
    $result = mysqli_query($conn, $query);
    
    if (!$result || mysqli_num_rows($result) == 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Image not found']);
        exit;
    }
    
    $image = mysqli_fetch_assoc($result);
    
    // Delete from database
    $deleteQuery = "DELETE FROM images WHERE id = $imageId";
    
    if (mysqli_query($conn, $deleteQuery)) {
        // Delete physical file
        $filePath = '../uploads/' . $image['filename'];
        if (file_exists($filePath)) {
            unlink($filePath);
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Image deleted successfully'
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to delete image from database: ' . mysqli_error($conn)]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}

// Close connection
mysqli_close($conn);
?>