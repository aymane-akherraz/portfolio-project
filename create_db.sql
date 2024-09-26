-- Drop database
DROP DATABASE IF EXISTS blogs_db;

-- Create database + user if doesn't exist
CREATE DATABASE IF NOT EXISTS blogs_db;
CREATE USER IF NOT EXISTS 'user'@'localhost';
SET PASSWORD FOR 'user'@'localhost' = 'user_pwd';
GRANT ALL ON blogs_db.* TO 'user'@'localhost';
GRANT SELECT ON performance_schema.* TO 'user'@'localhost';
FLUSH PRIVILEGES;

USE blogs_db;

-- Table structure for table `users`
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(128) NOT NULL,
    `email` varchar(50) NOT NULL UNIQUE,
    `password` varchar(128) NOT NULL,
    PRIMARY KEY (`id`)
);

-- Table structure for table `blogs`
DROP TABLE IF EXISTS `blogs`;
CREATE TABLE `blogs` (
    `id` int NOT NULL AUTO_INCREMENT,
    `author_id` int NOT NULL,
    `title` varchar(128) NOT NULL,
    `summary` varchar(255) NOT NULL,
    `content` TEXT NOT NULL,
    `img` varchar(128) NULL,
    `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    CONSTRAINT `blog_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES users (`id`)
);

