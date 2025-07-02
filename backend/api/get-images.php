<?php
// backend/api/get-images.php

require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $query = "SELECT * FROM images ORDER BY uploaded_at DESC";
    $result = mysqli_query($conn, $query);
    
    if ($result) {
        $images = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $images[] = [
                'id' => $row['id'],
                'filename' => $row['filename'],
                'original_name' => $row['original_name'],
                'file_path' => $row['file_path'],
                'file_size' => $row['file_size'],
                'mime_type' => $row['mime_type'],
                'uploaded_at' => $row['uploaded_at'],
                'url' => 'http://localhost/image-upload-platform/backend/uploads/' . $row['filename']
            ];
        }
        
        echo json_encode([
            'success' => true,
            'images' => $images,
            'count' => count($images)
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . mysqli_error($conn)]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}

// Close connection
mysqli_close($conn);
?>