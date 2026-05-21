<?php

declare(strict_types=1);

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/middleware.php';

$method = $_SERVER['REQUEST_METHOD'];

function rowToProduct(array $row): array
{
    return [
        'id'          => (int)$row['id'],
        'title'       => $row['title'],
        'description' => $row['description'],
        'productType' => $row['product_type'],
        'isActive'    => (bool)$row['is_active'],
        'price'       => (int)$row['price'],
        'fileUrl'     => $row['file_path'] ?? '',
    ];
}

if ($method === 'GET') {
    if (isset($_GET['id'])) {
        $id = (int)$_GET['id'];
        $row = query('SELECT * FROM products WHERE id = ? AND is_active = 1', [$id])->fetch();
        if (!$row) jsonError('Product not found', 404);
        jsonOk(rowToProduct($row));
    }

    if (isset($_GET['admin'])) {
        requireAuth();
        $rows = query('SELECT * FROM products ORDER BY id ASC')->fetchAll();
        jsonOk(array_map('rowToProduct', $rows));
    }

    // Public: active products only
    $rows = query('SELECT * FROM products WHERE is_active = 1 ORDER BY id ASC')->fetchAll();
    jsonOk(array_map('rowToProduct', $rows));
}

if ($method === 'POST') {
    requireAuth();
    $body = json_decode(file_get_contents('php://input'), true);

    $id          = (int)($body['id'] ?? 0);
    $title       = trim($body['title'] ?? '');
    $description = trim($body['description'] ?? '');
    $productType = $body['productType'] ?? 'Guide';
    $isActive    = isset($body['isActive']) ? (bool)$body['isActive'] : true;
    $price       = (int)($body['price'] ?? 0);
    $fileUrl     = trim($body['fileUrl'] ?? '');

    if ($title === '') jsonError('Title is required');

    $validTypes = ['Compendium', 'Framework', 'Playbook', 'Guide', 'Handbook'];
    if (!in_array($productType, $validTypes, true)) jsonError('Invalid product type');

    if ($id > 0) {
        query(
            'UPDATE products SET title=?, description=?, product_type=?, is_active=?, price=?, file_path=?, updated_at=NOW() WHERE id=?',
            [$title, $description, $productType, $isActive ? 1 : 0, $price, $fileUrl ?: null, $id]
        );
        $row = query('SELECT * FROM products WHERE id = ?', [$id])->fetch();
    } else {
        query(
            'INSERT INTO products (title, description, product_type, is_active, price, file_path) VALUES (?,?,?,?,?,?)',
            [$title, $description, $productType, $isActive ? 1 : 0, $price, $fileUrl ?: null]
        );
        $row = query('SELECT * FROM products WHERE id = ?', [db()->lastInsertId()])->fetch();
    }

    jsonOk(rowToProduct($row));
}

jsonError('Method not allowed', 405);
