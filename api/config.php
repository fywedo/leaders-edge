<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/vendor/autoload.php';

$dotenvPath = dirname(__DIR__);
if (file_exists($dotenvPath . '/.env')) {
    $dotenv = Dotenv\Dotenv::createImmutable($dotenvPath);
    $dotenv->load();
}

define('DB_HOST',              $_ENV['DB_HOST']              ?? 'localhost');
define('DB_NAME',              $_ENV['DB_NAME']              ?? '');
define('DB_USER',              $_ENV['DB_USER']              ?? '');
define('DB_PASS',              $_ENV['DB_PASS']              ?? '');
define('JWT_SECRET',           $_ENV['JWT_SECRET']           ?? 'change-me');
define('ADMIN_USERNAME',       $_ENV['ADMIN_USERNAME']       ?? 'admin');
define('ADMIN_PASSWORD_HASH',  $_ENV['ADMIN_PASSWORD_HASH']  ?? '');
define('STRIPE_SECRET_KEY',    $_ENV['STRIPE_SECRET_KEY']    ?? '');
define('STRIPE_WEBHOOK_SECRET',$_ENV['STRIPE_WEBHOOK_SECRET'] ?? '');
define('APP_URL',              rtrim($_ENV['APP_URL'] ?? 'https://yourdomain.com', '/'));
define('SMTP_HOST',            $_ENV['SMTP_HOST']            ?? '');
define('SMTP_PORT',            (int)($_ENV['SMTP_PORT']      ?? 465));
define('SMTP_USER',            $_ENV['SMTP_USER']            ?? '');
define('SMTP_PASS',            $_ENV['SMTP_PASS']            ?? '');
define('SMTP_FROM_EMAIL',      $_ENV['SMTP_FROM_EMAIL']      ?? '');
define('SMTP_FROM_NAME',       $_ENV['SMTP_FROM_NAME']       ?? 'Vanguard Executives');
define('PDF_DIR',              dirname(__DIR__) . '/pdfs_private');

// CORS — needed for local dev (frontend on :5173, PHP on :8080)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
