<?php

declare(strict_types=1);

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';

use Firebase\JWT\JWT;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonError('Method not allowed', 405);
}

$body = json_decode(file_get_contents('php://input'), true);
$username = trim($body['username'] ?? '');
$password = $body['password'] ?? '';

if ($username === '' || $password === '') {
    jsonError('Username and password are required');
}

if ($username !== ADMIN_USERNAME || !password_verify($password, ADMIN_PASSWORD_HASH)) {
    jsonError('Invalid credentials', 401);
}

$payload = [
    'sub' => $username,
    'iat' => time(),
    'exp' => time() + 60 * 60 * 8, // 8-hour session
];

$token = JWT::encode($payload, JWT_SECRET, 'HS256');

jsonOk(['token' => $token]);
