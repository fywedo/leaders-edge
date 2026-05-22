<?php

declare(strict_types=1);

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';

use Stripe\Stripe;
use Stripe\Webhook;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;

Stripe::setApiKey(STRIPE_SECRET_KEY);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonError('Method not allowed', 405);
}

$payload   = file_get_contents('php://input');
$sigHeader = $_SERVER['HTTP_STRIPE_SIGNATURE'] ?? '';

try {
    $event = Webhook::constructEvent($payload, $sigHeader, STRIPE_WEBHOOK_SECRET);
} catch (\Throwable $e) {
    jsonError('Webhook signature invalid', 400);
}

if ($event->type !== 'checkout.session.completed') {
    jsonOk(['received' => true]);
}

$session = $event->data->object;

if ($session->payment_status !== 'paid') {
    jsonOk(['received' => true]);
}

$meta            = $session->metadata->toArray();
$productId       = (int)($meta['productId'] ?? 0);
$fullName        = $meta['fullName'] ?? 'Customer';
$email           = $meta['email'] ?? '';
$phone           = $meta['phone'] ?? '';
$organization    = ($meta['organization'] ?? '') !== '' ? $meta['organization'] : null;
$ethicsStatement = ($meta['ethicsStatement'] ?? '') !== '' ? $meta['ethicsStatement'] : null;
$sessionId       = $session->id;

// Skip if already saved (idempotency)
$existing = query('SELECT id FROM leads WHERE stripe_session_id = ?', [$sessionId])->fetch();
if ($existing) {
    jsonOk(['received' => true]);
}

$product = $productId > 0
    ? query('SELECT * FROM products WHERE id = ?', [$productId])->fetch()
    : null;

$token   = bin2hex(random_bytes(32));
$expires = date('Y-m-d H:i:s', strtotime('+48 hours'));

query(
    'INSERT INTO leads (full_name, email, phone, organization, ethics_statement, product_id, stripe_session_id, download_token, token_expires_at) VALUES (?,?,?,?,?,?,?,?,?)',
    [$fullName, $email, $phone, $organization, $ethicsStatement, $productId, $sessionId, $token, $expires]
);

// Send purchase confirmation to customer
if ($email !== '' && SMTP_HOST !== '') {
    sendPurchaseEmail($email, $fullName, $product['title'] ?? 'your product', $token);
}

// Notify admin
if (SMTP_HOST !== '') {
    sendAdminNotificationEmail($fullName, $email, $phone, $organization ?? '', $product['title'] ?? 'Unknown product');
}

jsonOk(['received' => true]);

function sendPurchaseEmail(string $to, string $name, string $productTitle, string $token): void
{
    $downloadUrl = APP_URL . '/api/download.php?token=' . $token;

    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host       = SMTP_HOST;
        $mail->SMTPAuth   = true;
        $mail->Username   = SMTP_USER;
        $mail->Password   = SMTP_PASS;
        $mail->SMTPSecure = SMTP_PORT === 465 ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = SMTP_PORT;

        $mail->setFrom(SMTP_FROM_EMAIL, SMTP_FROM_NAME);
        $mail->addAddress($to, $name);
        $mail->Subject = 'Your Vanguard Executives Purchase — Download Ready';

        $firstName = explode(' ', trim($name))[0];
        $mail->isHTML(true);
        $mail->Body = emailHtml($firstName, $productTitle, $downloadUrl);
        $mail->AltBody = emailText($firstName, $productTitle, $downloadUrl);

        $mail->send();
    } catch (\Throwable) {
        // Non-fatal — lead is saved, email failure should not break the webhook response
    }
}

function emailHtml(string $name, string $product, string $url): string
{
    return <<<HTML
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:Georgia,serif;background:#0f1b2d;color:#e8dcc8;margin:0;padding:40px 20px;">
  <div style="max-width:560px;margin:0 auto;background:#162236;border-radius:12px;padding:40px;border-top:3px solid #c9943a;">
    <h1 style="font-size:24px;color:#c9943a;margin-top:0;">Thank you, {$name}!</h1>
    <p style="font-size:16px;line-height:1.6;">Your purchase of <strong>{$product}</strong> is confirmed. Your download link is ready below — it expires in <strong>48 hours</strong>, so save the file once downloaded.</p>
    <div style="text-align:center;margin:32px 0;">
      <a href="{$url}" style="background:#c9943a;color:#0f1b2d;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block;">Download Now</a>
    </div>
    <p style="font-size:13px;color:#8a9ab5;line-height:1.6;">If the button doesn't work, copy and paste this link:<br><a href="{$url}" style="color:#c9943a;word-break:break-all;">{$url}</a></p>
    <hr style="border:none;border-top:1px solid #2a3a52;margin:32px 0;">
    <p style="font-size:13px;color:#8a9ab5;margin:0;">Vanguard Executives &mdash; Premium Leadership Resources</p>
  </div>
</body>
</html>
HTML;
}

function emailText(string $name, string $product, string $url): string
{
    return "Thank you, {$name}!\n\nYour purchase of {$product} is confirmed.\n\nDownload link (valid 48 hours):\n{$url}\n\nSave the file after downloading.\n\n— Vanguard Executives";
}

function sendAdminNotificationEmail(string $fullName, string $email, string $phone, string $organization, string $productTitle): void
{
    $adminEmail = 'support@vanguardexec.com';
    $purchasedAt = date('Y-m-d H:i:s T');

    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host       = SMTP_HOST;
        $mail->SMTPAuth   = true;
        $mail->Username   = SMTP_USER;
        $mail->Password   = SMTP_PASS;
        $mail->SMTPSecure = SMTP_PORT === 465 ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = SMTP_PORT;

        $mail->setFrom(SMTP_FROM_EMAIL, SMTP_FROM_NAME);
        $mail->addAddress($adminEmail);
        $mail->Subject = "New Purchase: {$productTitle} — {$fullName}";

        $org = $organization !== '' ? htmlspecialchars($organization) : '<em>—</em>';

        $mail->isHTML(true);
        $mail->Body = <<<HTML
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:Georgia,serif;background:#0f1b2d;color:#e8dcc8;margin:0;padding:40px 20px;">
  <div style="max-width:560px;margin:0 auto;background:#162236;border-radius:12px;padding:40px;border-top:3px solid #c9943a;">
    <h1 style="font-size:20px;color:#c9943a;margin-top:0;">New Purchase</h1>
    <table style="width:100%;border-collapse:collapse;font-size:15px;line-height:1.7;">
      <tr><td style="color:#8a9ab5;padding:6px 0;width:130px;">Product</td><td style="color:#e8dcc8;"><strong>{$productTitle}</strong></td></tr>
      <tr><td style="color:#8a9ab5;padding:6px 0;">Name</td><td style="color:#e8dcc8;">{$fullName}</td></tr>
      <tr><td style="color:#8a9ab5;padding:6px 0;">Email</td><td style="color:#e8dcc8;"><a href="mailto:{$email}" style="color:#c9943a;">{$email}</a></td></tr>
      <tr><td style="color:#8a9ab5;padding:6px 0;">Phone</td><td style="color:#e8dcc8;">{$phone}</td></tr>
      <tr><td style="color:#8a9ab5;padding:6px 0;">Organization</td><td style="color:#e8dcc8;">{$org}</td></tr>
      <tr><td style="color:#8a9ab5;padding:6px 0;">Purchased at</td><td style="color:#e8dcc8;">{$purchasedAt}</td></tr>
    </table>
    <hr style="border:none;border-top:1px solid #2a3a52;margin:32px 0;">
    <p style="font-size:13px;color:#8a9ab5;margin:0;">Vanguard Executives &mdash; Admin Notification</p>
  </div>
</body>
</html>
HTML;
        $mail->AltBody = "New Purchase\n\nProduct: {$productTitle}\nName: {$fullName}\nEmail: {$email}\nPhone: {$phone}\nOrganization: {$organization}\nPurchased at: {$purchasedAt}";

        $mail->send();
    } catch (\Throwable) {
        // Non-fatal
    }
}
