<?php

declare(strict_types=1);

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/middleware.php';

$method = $_SERVER['REQUEST_METHOD'];

function rowToFaq(array $row): array
{
    return [
        'id'           => (int)$row['id'],
        'question'     => $row['question'],
        'answer'       => $row['answer'],
        'displayOrder' => (int)$row['display_order'],
    ];
}

if ($method === 'GET') {
    $rows = query('SELECT * FROM faqs ORDER BY display_order ASC, id ASC')->fetchAll();
    jsonOk(array_map('rowToFaq', $rows));
}

if ($method === 'POST') {
    requireAuth();
    $body = json_decode(file_get_contents('php://input'), true);

    $id           = (int)($body['id'] ?? 0);
    $question     = trim($body['question'] ?? '');
    $answer       = trim($body['answer'] ?? '');
    $displayOrder = (int)($body['displayOrder'] ?? 0);

    if ($question === '' || $answer === '') jsonError('Question and answer are required');

    if ($id > 0) {
        query(
            'UPDATE faqs SET question=?, answer=?, display_order=? WHERE id=?',
            [$question, $answer, $displayOrder, $id]
        );
        $row = query('SELECT * FROM faqs WHERE id = ?', [$id])->fetch();
    } else {
        query(
            'INSERT INTO faqs (question, answer, display_order) VALUES (?,?,?)',
            [$question, $answer, $displayOrder]
        );
        $row = query('SELECT * FROM faqs WHERE id = ?', [db()->lastInsertId()])->fetch();
    }

    jsonOk(rowToFaq($row));
}

if ($method === 'DELETE') {
    requireAuth();
    $id = (int)($_GET['id'] ?? 0);
    if ($id === 0) jsonError('ID is required');
    query('DELETE FROM faqs WHERE id = ?', [$id]);
    jsonOk(['deleted' => true]);
}

jsonError('Method not allowed', 405);
