-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jul 18, 2018 at 12:10 PM
-- Server version: 5.7.19
-- PHP Version: 7.1.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hubpitch_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `hp_users`
--

DROP TABLE IF EXISTS `hp_users`;
CREATE TABLE IF NOT EXISTS `hp_users` (
  `user_id` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `is_payment` enum('yes','no') NOT NULL DEFAULT 'no',
  `role` enum('admin','user') NOT NULL DEFAULT 'user',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `hp_users`
--

INSERT INTO `hp_users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `is_payment`, `role`, `created`, `updated`) VALUES
('18e1c619-2e99-4146-81dd-3567829d2acf', 'HAD', 'NAROLA', 'admin.hubpitch@mailinator.com', 'a8b4fab1bed511ab6850908c72c547c9', 'yes', 'admin', '2018-07-18 09:12:16', NULL),
('1bf3ba5f-0feb-4a6c-89f1-01f88b07b715', 'Hareen', 'Desai', 'hareen1@mailinator.com', 'a8b4fab1bed511ab6850908c72c547c9', 'no', 'user', '2018-07-16 05:35:33', NULL),
('225dcc3f-0d8b-4a9f-9935-a90e877f8007', 'Hareen', 'Desai', 'hareen91@mailinator.com', 'a8b4fab1bed511ab6850908c72c547c9', 'no', 'user', '2018-07-16 06:07:42', NULL),
('46263dfe-507c-410e-8701-f5b2ca16336b', 'Hareen', 'Desai', 'hareen1991@mailinator.com', 'a8b4fab1bed511ab6850908c72c547c9', 'no', 'user', '2018-07-16 06:13:40', NULL),
('9c476a30-e2cb-49d2-b95c-3a52777c2bd1', 'HAD', 'NAROLA', 'had.narola@mailinator.com', 'a8b4fab1bed511ab6850908c72c547c9', 'no', 'user', '2018-07-18 06:40:33', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `hp_users_reset_token`
--

DROP TABLE IF EXISTS `hp_users_reset_token`;
CREATE TABLE IF NOT EXISTS `hp_users_reset_token` (
  `token_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(255) NOT NULL,
  `token_value` text NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`token_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=latin1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
