<?php

declare(strict_types=1);

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

function requireAuth(): void
{
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (!str_starts_with($header, 'Bearer ')) {
        jsonError('Unauthorized', 401);
    }
    $token = substr($header, 7);
    try {
        JWT::decode($token, new Key(JWT_SECRET, 'HS256'));
    } catch (\Throwable) {
        jsonError('Unauthorized', 401);
    }
}

function isAuthed(): bool
{
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (!str_starts_with($header, 'Bearer ')) return false;
    $token = substr($header, 7);
    try {
        JWT::decode($token, new Key(JWT_SECRET, 'HS256'));
        return true;
    } catch (\Throwable) {
        return false;
    }
}
