<?php

declare(strict_types=1);

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/middleware.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonError('Method not allowed', 405);
}

requireAuth();

if (empty($_FILES['file'])) {
    jsonError('No file uploaded');
}

$file = $_FILES['file'];

if ($file['error'] !== UPLOAD_ERR_OK) {
    jsonError('Upload error: ' . $file['error']);
}

// Validate MIME type
$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime  = $finfo->file($file['tmp_name']);
if ($mime !== 'application/pdf') {
    jsonError('Only PDF files are allowed');
}

// Max 50 MB
if ($file['size'] > 50 * 1024 * 1024) {
    jsonError('File size exceeds 50 MB limit');
}

if (!is_dir(PDF_DIR)) {
    mkdir(PDF_DIR, 0755, true);
}

// Sanitize filename and make it unique
$originalName = pathinfo($file['name'], PATHINFO_FILENAME);
$safeName     = preg_replace('/[^a-z0-9\-_]/', '-', strtolower($originalName));
$safeName     = trim(preg_replace('/-+/', '-', $safeName), '-');
$filename     = $safeName . '-' . bin2hex(random_bytes(4)) . '.pdf';
$destination  = PDF_DIR . '/' . $filename;

if (!move_uploaded_file($file['tmp_name'], $destination)) {
    jsonError('Failed to save file', 500);
}

jsonOk(['filePath' => $filename]);
