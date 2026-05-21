-- Leaders Edge database schema
-- Run once via phpMyAdmin or SSH after creating the database in cPanel

CREATE TABLE IF NOT EXISTS products (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  title        VARCHAR(255) NOT NULL,
  description  TEXT NOT NULL,
  price        INT NOT NULL DEFAULT 0,
  product_type ENUM('Compendium','Framework','Playbook','Guide','Handbook') NOT NULL DEFAULT 'Guide',
  is_active    TINYINT(1) NOT NULL DEFAULT 1,
  file_path    VARCHAR(500) DEFAULT NULL,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS leads (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  full_name         VARCHAR(255) NOT NULL,
  email             VARCHAR(255) NOT NULL,
  product_id        INT NOT NULL,
  stripe_session_id VARCHAR(255) NOT NULL,
  download_token    VARCHAR(64) DEFAULT NULL,
  token_expires_at  DATETIME DEFAULT NULL,
  purchased_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_session (stripe_session_id)
);

CREATE TABLE IF NOT EXISTS faqs (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  question      TEXT NOT NULL,
  answer        TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0
);
