<?php

declare(strict_types=1);

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonError('Method not allowed', 405);
}

$token = trim($_GET['token'] ?? '');
if ($token === '') jsonError('Token is required');

$lead = query(
    'SELECT l.*, p.file_path, p.title FROM leads l JOIN products p ON p.id = l.product_id WHERE l.download_token = ?',
    [$token]
)->fetch();

if (!$lead) {
    jsonError('Invalid or expired download link', 404);
}

if ($lead['token_expires_at'] < date('Y-m-d H:i:s')) {
    jsonError('This download link has expired. Please contact support.', 410);
}

$filePath = PDF_DIR . '/' . basename((string)$lead['file_path']);

if (!$lead['file_path'] || !file_exists($filePath)) {
    jsonError('File not available yet. Please contact support.', 404);
}

// Stream the file
$filename = basename($filePath);
header('Content-Type: application/pdf');
header('Content-Disposition: attachment; filename="' . $filename . '"');
header('Content-Length: ' . filesize($filePath));
header('Cache-Control: no-cache, no-store, must-revalidate');
readfile($filePath);
exit;
