<?php

declare(strict_types=1);

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';

use Stripe\Stripe;
use Stripe\Checkout\Session;

Stripe::setApiKey(STRIPE_SECRET_KEY);

$method = $_SERVER['REQUEST_METHOD'];

// GET ?session_id=xxx — verify payment and return download token
if ($method === 'GET') {
    $sessionId = trim($_GET['session_id'] ?? '');
    if ($sessionId === '') jsonError('session_id is required');

    // Check leads table first (webhook may have already fired)
    $lead = query(
        'SELECT l.*, p.title as product_title FROM leads l LEFT JOIN products p ON p.id = l.product_id WHERE l.stripe_session_id = ?',
        [$sessionId]
    )->fetch();

    if ($lead && $lead['download_token'] && $lead['token_expires_at'] > date('Y-m-d H:i:s')) {
        jsonOk([
            'paid'          => true,
            'downloadToken' => $lead['download_token'],
            'productTitle'  => $lead['product_title'] ?? '',
        ]);
    }

    // Fallback: verify directly with Stripe (webhook may be delayed)
    try {
        $session = Session::retrieve($sessionId);
    } catch (\Throwable $e) {
        jsonError('Could not verify session', 502);
    }

    if ($session->payment_status !== 'paid') {
        jsonOk(['paid' => false]);
    }

    // Webhook was delayed — create the lead now
    $meta            = $session->metadata->toArray();
    $productId       = (int)($meta['productId'] ?? 0);
    $fullName        = $meta['fullName'] ?? 'Customer';
    $email           = $meta['email'] ?? '';
    $phone           = $meta['phone'] ?? '';
    $organization    = $meta['organization'] !== '' ? $meta['organization'] : null;
    $ethicsStatement = $meta['ethicsStatement'] !== '' ? $meta['ethicsStatement'] : null;

    $product = $productId > 0
        ? query('SELECT * FROM products WHERE id = ?', [$productId])->fetch()
        : null;

    $token   = bin2hex(random_bytes(32));
    $expires = date('Y-m-d H:i:s', strtotime('+48 hours'));

    // Upsert: ignore duplicate if webhook fired between our two checks
    $existing = query('SELECT id FROM leads WHERE stripe_session_id = ?', [$sessionId])->fetch();
    if (!$existing) {
        query(
            'INSERT INTO leads (full_name, email, phone, organization, ethics_statement, product_id, stripe_session_id, download_token, token_expires_at) VALUES (?,?,?,?,?,?,?,?,?)',
            [$fullName, $email, $phone, $organization, $ethicsStatement, $productId, $sessionId, $token, $expires]
        );
    } else {
        $token = query('SELECT download_token FROM leads WHERE stripe_session_id = ?', [$sessionId])->fetchColumn();
    }

    jsonOk([
        'paid'          => true,
        'downloadToken' => $token,
        'productTitle'  => $product['title'] ?? '',
    ]);
}

// POST — create Stripe Checkout session
if ($method === 'POST') {
    $body            = json_decode(file_get_contents('php://input'), true);
    $productId       = (int)($body['productId'] ?? 0);
    $fullName        = trim($body['fullName'] ?? '');
    $email           = trim($body['email'] ?? '');
    $phone           = trim($body['phone'] ?? '');
    $organization    = trim($body['organization'] ?? '');
    $ethicsStatement = mb_substr(trim($body['ethicsStatement'] ?? ''), 0, 500);

    if ($productId === 0 || $fullName === '' || $email === '' || $phone === '') {
        jsonError('productId, fullName, email and phone are required');
    }

    $product = query('SELECT * FROM products WHERE id = ? AND is_active = 1', [$productId])->fetch();
    if (!$product) jsonError('Product not found', 404);

    try {
        $session = Session::create([
            'ui_mode'              => 'embedded',
            'payment_method_types' => ['card'],
            'line_items'           => [[
                'price_data' => [
                    'currency'     => 'usd',
                    'unit_amount'  => (int)$product['price'],
                    'product_data' => [
                        'name'        => $product['title'],
                        'description' => $product['description'],
                    ],
                ],
                'quantity' => 1,
            ]],
            'mode'        => 'payment',
            'metadata'    => [
                'productId'       => (string)$productId,
                'fullName'        => $fullName,
                'email'           => $email,
                'phone'           => $phone,
                'organization'    => $organization,
                'ethicsStatement' => $ethicsStatement,
            ],
            'customer_email' => $email,
            'return_url'     => APP_URL . '/success?session_id={CHECKOUT_SESSION_ID}',
        ]);
    } catch (\Throwable $e) {
        jsonError('Could not create checkout session: ' . $e->getMessage(), 502);
    }

    jsonOk(['clientSecret' => $session->client_secret]);
}

jsonError('Method not allowed', 405);
