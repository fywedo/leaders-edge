<?php

declare(strict_types=1);

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/middleware.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonError('Method not allowed', 405);
}

requireAuth();

$rows = query(
    'SELECT * FROM leads ORDER BY purchased_at DESC'
)->fetchAll();

$leads = array_map(fn(array $row) => [
    'id'              => (int)$row['id'],
    'fullName'        => $row['full_name'],
    'email'           => $row['email'],
    'phone'           => $row['phone'] ?? '',
    'organization'    => $row['organization'],
    'ethicsStatement' => $row['ethics_statement'],
    'productId'       => (int)$row['product_id'],
    'stripeSessionId' => $row['stripe_session_id'],
    'purchasedAt'     => $row['purchased_at'],
], $rows);

jsonOk($leads);
