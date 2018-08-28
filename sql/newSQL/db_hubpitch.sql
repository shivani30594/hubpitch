-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Aug 28, 2018 at 03:08 PM
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
-- Table structure for table `hp_email_log`
--

DROP TABLE IF EXISTS `hp_email_log`;
CREATE TABLE IF NOT EXISTS `hp_email_log` (
  `email_log_id` int(11) NOT NULL,
  `pitch_id` int(11) NOT NULL,
  `sender_name` varchar(255) NOT NULL,
  `receiver_email_address` varchar(255) NOT NULL,
  `email_body` text NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`email_log_id`),
  KEY `pitch_id` (`pitch_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `hp_pitch_analytics`
--

DROP TABLE IF EXISTS `hp_pitch_analytics`;
CREATE TABLE IF NOT EXISTS `hp_pitch_analytics` (
  `pitch_analytics` int(11) NOT NULL AUTO_INCREMENT,
  `pitch_id` int(11) NOT NULL,
  `pitch_view_counter` int(11) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`pitch_analytics`),
  KEY `pitch_id` (`pitch_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `hp_pitch_info`
--

DROP TABLE IF EXISTS `hp_pitch_info`;
CREATE TABLE IF NOT EXISTS `hp_pitch_info` (
  `pitch_info_id` int(11) NOT NULL AUTO_INCREMENT,
  `pitch_id` int(11) NOT NULL,
  `pitch_attachment_type` varchar(255) NOT NULL DEFAULT 'others',
  `pitch_attachment_name` text NOT NULL,
  `pitch_attachment_text` text NOT NULL,
  `average_view` int(11) DEFAULT '0' COMMENT 'average viewing time in seconds  ',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`pitch_info_id`),
  KEY `pitch_id` (`pitch_id`)
) ENGINE=InnoDB AUTO_INCREMENT=129 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `hp_pitch_manager`
--

DROP TABLE IF EXISTS `hp_pitch_manager`;
CREATE TABLE IF NOT EXISTS `hp_pitch_manager` (
  `pitch_manager_id` int(11) NOT NULL AUTO_INCREMENT,
  `pitch_id` int(11) NOT NULL,
  `url_token` text NOT NULL,
  `allow_notification` enum('true','false') NOT NULL DEFAULT 'true',
  `allow_messaging` enum('true','false') NOT NULL DEFAULT 'true',
  `allow_share` enum('true','false') NOT NULL DEFAULT 'true',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`pitch_manager_id`),
  KEY `pitch_id` (`pitch_id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `hp_pitch_master`
--

DROP TABLE IF EXISTS `hp_pitch_master`;
CREATE TABLE IF NOT EXISTS `hp_pitch_master` (
  `pitch_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(255) NOT NULL,
  `company_name` varchar(255) NOT NULL,
  `is_published` enum('yes','no') NOT NULL DEFAULT 'yes',
  `share_times` int(11) NOT NULL DEFAULT '0' COMMENT 'Number Of Time This pitch share via email',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`pitch_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=146 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `hp_support`
--

DROP TABLE IF EXISTS `hp_support`;
CREATE TABLE IF NOT EXISTS `hp_support` (
  `support_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(255) NOT NULL,
  `support_message` text NOT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`support_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

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

-- --------------------------------------------------------

--
-- Table structure for table `hp_users_info`
--

DROP TABLE IF EXISTS `hp_users_info`;
CREATE TABLE IF NOT EXISTS `hp_users_info` (
  `users_info_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(255) NOT NULL,
  `company_name` varchar(255) NOT NULL,
  `notification_1` enum('yes','no') NOT NULL DEFAULT 'no',
  `notification_2` enum('yes','no') NOT NULL DEFAULT 'no',
  `notification_3` enum('yes','no') NOT NULL DEFAULT 'no',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL,
  PRIMARY KEY (`users_info_id`),
  UNIQUE KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `hp_email_log`
--
ALTER TABLE `hp_email_log`
  ADD CONSTRAINT `hp_email_log_ibfk_1` FOREIGN KEY (`pitch_id`) REFERENCES `hp_pitch_master` (`pitch_id`);

--
-- Constraints for table `hp_pitch_analytics`
--
ALTER TABLE `hp_pitch_analytics`
  ADD CONSTRAINT `hp_pitch_analytics_ibfk_1` FOREIGN KEY (`pitch_id`) REFERENCES `hp_pitch_master` (`pitch_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `hp_pitch_info`
--
ALTER TABLE `hp_pitch_info`
  ADD CONSTRAINT `hp_pitch_info_ibfk_1` FOREIGN KEY (`pitch_id`) REFERENCES `hp_pitch_master` (`pitch_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `hp_pitch_master`
--
ALTER TABLE `hp_pitch_master`
  ADD CONSTRAINT `hp_pitch_master_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `hp_users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `hp_support`
--
ALTER TABLE `hp_support`
  ADD CONSTRAINT `hp_support_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `hp_users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
