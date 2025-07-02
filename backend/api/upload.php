<?php
// backend/api/upload.php

require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode(['error' => 'No valid file uploaded']);
        exit;
    }

    $file = $_FILES['image'];
    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    $maxSize = 5 * 1024 * 1024; // 5MB

    // Validate file type
    if (!in_array($file['type'], $allowedTypes)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid file type. Only JPEG, PNG, GIF, and WebP allowed']);
        exit;
    }

    // Validate file size
    if ($file['size'] > $maxSize) {
        http_response_code(400);
        echo json_encode(['error' => 'File too large. Maximum size is 5MB']);
        exit;
    }

    // Generate unique filename
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uniqid('img_') . '.' . $extension;
    $uploadPath = '../uploads/' . $filename;

    // Move uploaded file
    if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
        // Escape values for database
        $filename_escaped = mysqli_real_escape_string($conn, $filename);
        $original_name_escaped = mysqli_real_escape_string($conn, $file['name']);
        $file_path_escaped = mysqli_real_escape_string($conn, $uploadPath);
        $file_size = intval($file['size']);
        $mime_type_escaped = mysqli_real_escape_string($conn, $file['type']);
        
        // Insert into database
        $query = "INSERT INTO images (filename, original_name, file_path, file_size, mime_type) 
                  VALUES ('$filename_escaped', '$original_name_escaped', '$file_path_escaped', $file_size, '$mime_type_escaped')";
        
        if (mysqli_query($conn, $query)) {
            $imageId = mysqli_insert_id($conn);
            echo json_encode([
                'success' => true,
                'message' => 'Image uploaded successfully',
                'image' => [
                    'id' => $imageId,
                    'filename' => $filename,
                    'original_name' => $file['name'],
                    'file_size' => $file['size'],
                    'mime_type' => $file['type']
                ]
            ]);
        } else {
            unlink($uploadPath); // Delete file if DB insert fails
            http_response_code(500);
            echo json_encode(['error' => 'Database error: ' . mysqli_error($conn)]);
        }
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to upload file']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}

// Close connection
mysqli_close($conn);
?>