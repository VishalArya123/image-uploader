<?php
// backend/api/update-image.php

require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] == 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['id']) || empty($input['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Image ID is required']);
        exit;
    }
    
    $imageId = intval($input['id']);
    $newName = isset($input['original_name']) ? trim($input['original_name']) : '';
    
    if (empty($newName)) {
        http_response_code(400);
        echo json_encode(['error' => 'New name is required']);
        exit;
    }
    
    // Check if image exists
    $checkQuery = "SELECT id FROM images WHERE id = $imageId";
    $checkResult = mysqli_query($conn, $checkQuery);
    
    if (!$checkResult || mysqli_num_rows($checkResult) == 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Image not found']);
        exit;
    }
    
    // Escape the new name for database
    $newName_escaped = mysqli_real_escape_string($conn, $newName);
    
    // Update image name
    $updateQuery = "UPDATE images SET original_name = '$newName_escaped' WHERE id = $imageId";
    
    if (mysqli_query($conn, $updateQuery)) {
        // Get updated image details
        $getQuery = "SELECT * FROM images WHERE id = $imageId";
        $getResult = mysqli_query($conn, $getQuery);
        
        if ($getResult && mysqli_num_rows($getResult) > 0) {
            $updatedImage = mysqli_fetch_assoc($getResult);
            
            echo json_encode([
                'success' => true,
                'message' => 'Image updated successfully',
                'image' => [
                    'id' => $updatedImage['id'],
                    'filename' => $updatedImage['filename'],
                    'original_name' => $updatedImage['original_name'],
                    'file_size' => $updatedImage['file_size'],
                    'mime_type' => $updatedImage['mime_type'],
                    'uploaded_at' => $updatedImage['uploaded_at'],
                    'url' => 'http://localhost/image-upload-platform/backend/uploads/' . $updatedImage['filename']
                ]
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to retrieve updated image']);
        }
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update image: ' . mysqli_error($conn)]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}

// Close connection
mysqli_close($conn);
?>