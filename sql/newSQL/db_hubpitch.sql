-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Aug 07, 2018 at 12:34 PM
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
-- Table structure for table `hp_pitch_info`
--

DROP TABLE IF EXISTS `hp_pitch_info`;
CREATE TABLE IF NOT EXISTS `hp_pitch_info` (
  `pitch_info_id` int(11) NOT NULL AUTO_INCREMENT,
  `pitch_id` int(11) NOT NULL,
  `pitch_attachment_type` varchar(255) NOT NULL DEFAULT 'others',
  `pitch_attachment_name` text NOT NULL,
  `pitch_attachment_text` text NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`pitch_info_id`),
  KEY `pitch_id` (`pitch_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `hp_pitch_info`
--

INSERT INTO `hp_pitch_info` (`pitch_info_id`, `pitch_id`, `pitch_attachment_type`, `pitch_attachment_name`, `pitch_attachment_text`, `created`, `updated`) VALUES
(1, 7, 'image', 'TESTING', 'adsadsdsaasdaddsadadsadsa', '2018-07-24 05:43:44', NULL),
(2, 7, 'image', 'TESTING', 'adsadsdsaasdaddsadadsadsa', '2018-07-24 05:43:44', NULL),
(3, 8, 'image', 'TESTING', 'TESTING @ 2 adsadsdsaasdaddsadadsadsa', '2018-07-24 05:52:10', NULL),
(4, 8, 'document', 'TESTING', 'TESTING @ 1 adsadsdsaasdaddsadadsadsa', '2018-07-24 05:52:10', NULL),
(5, 9, 'image', 'TESTING', 'TESTING @ 2 adsadsdsaasdaddsadadsadsa', '2018-07-24 06:05:15', NULL),
(6, 9, 'document', 'TESTING', 'TESTING @ 1 adsadsdsaasdaddsadadsadsa', '2018-07-24 06:05:15', NULL),
(7, 13, 'video', 'pitch_153321057258345024.mp4', 'adsaddadadda', '2018-08-02 11:49:32', NULL),
(8, 15, 'video', 'pitch_153321172421549235.mp4', 'asdasdsad', '2018-08-02 12:08:44', NULL),
(9, 18, 'video', 'pitch_153328720152270441.mp4', 'asdasd', '2018-08-03 09:06:41', NULL),
(10, 20, 'video', 'pitch_153328735826926931.mp4', 'asad', '2018-08-03 09:09:18', NULL),
(11, 22, 'image', 'pitch_153328765380764662.png', 'asdasda', '2018-08-03 09:14:13', NULL),
(12, 24, 'video', 'pitch_153328820861335018.mp4', 'asdasdasd', '2018-08-03 09:23:28', NULL),
(13, 32, 'video', 'pitch_153329211489864368.mp4', 'asdasd', '2018-08-03 10:28:34', NULL),
(14, 33, 'video', 'pitch_153329224460651333.mp4', 'asdasd', '2018-08-03 10:30:44', NULL),
(15, 35, 'video', 'pitch_153329246642037421.mp4', 'aass', '2018-08-03 10:34:26', NULL),
(16, 37, 'image', 'pitch_153354013873099239.png', 'asdas', '2018-08-06 07:22:18', NULL),
(17, 38, 'video', 'pitch_153354018806554440.mp4', 'sads', '2018-08-06 07:23:08', NULL);

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
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`pitch_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `hp_pitch_master`
--

INSERT INTO `hp_pitch_master` (`pitch_id`, `user_id`, `company_name`, `is_published`, `created`, `updated`) VALUES
(1, '46263dfe-507c-410e-8701-f5b2ca16336b', 'test2', 'yes', '2018-07-23 10:20:17', NULL),
(2, '46263dfe-507c-410e-8701-f5b2ca16336b', 'test22', 'yes', '2018-07-23 10:20:40', NULL),
(3, '46263dfe-507c-410e-8701-f5b2ca16336b', 'test11', 'yes', '2018-07-23 11:34:16', NULL),
(4, '46263dfe-507c-410e-8701-f5b2ca16336b', 'test1', 'yes', '2018-07-23 11:35:01', NULL),
(5, '46263dfe-507c-410e-8701-f5b2ca16336b', 'test', 'yes', '2018-07-23 11:35:19', NULL),
(6, '46263dfe-507c-410e-8701-f5b2ca16336b', 'test', 'yes', '2018-07-24 05:42:46', NULL),
(7, '46263dfe-507c-410e-8701-f5b2ca16336b', 'test', 'yes', '2018-07-24 05:43:44', NULL),
(8, '46263dfe-507c-410e-8701-f5b2ca16336b', 'test', 'yes', '2018-07-24 05:52:10', NULL),
(9, '46263dfe-507c-410e-8701-f5b2ca16336b', 'test', 'yes', '2018-07-24 06:05:15', NULL),
(10, '46263dfe-507c-410e-8701-f5b2ca16336b', 'asdsad', 'yes', '2018-08-02 11:44:27', NULL),
(11, '46263dfe-507c-410e-8701-f5b2ca16336b', 'adsads', 'yes', '2018-08-02 11:46:59', NULL),
(12, '46263dfe-507c-410e-8701-f5b2ca16336b', 'adadas', 'yes', '2018-08-02 11:49:01', NULL),
(13, '46263dfe-507c-410e-8701-f5b2ca16336b', 'dasdadad', 'yes', '2018-08-02 11:49:32', NULL),
(14, '46263dfe-507c-410e-8701-f5b2ca16336b', 'asdasd', 'yes', '2018-08-02 12:06:57', NULL),
(15, '46263dfe-507c-410e-8701-f5b2ca16336b', 'sadasdasd', 'yes', '2018-08-02 12:08:44', NULL),
(16, '46263dfe-507c-410e-8701-f5b2ca16336b', 'asdasd', 'yes', '2018-08-03 07:24:30', NULL),
(17, '46263dfe-507c-410e-8701-f5b2ca16336b', 'asdasd', 'yes', '2018-08-03 07:26:02', NULL),
(18, '46263dfe-507c-410e-8701-f5b2ca16336b', 'sadas', 'yes', '2018-08-03 09:06:41', NULL),
(19, '46263dfe-507c-410e-8701-f5b2ca16336b', 'sdasdasd', 'yes', '2018-08-03 09:07:19', NULL),
(20, '46263dfe-507c-410e-8701-f5b2ca16336b', 'asdadsasd', 'yes', '2018-08-03 09:09:18', NULL),
(21, '46263dfe-507c-410e-8701-f5b2ca16336b', 'asdadsasdsdasd', 'yes', '2018-08-03 09:10:43', NULL),
(22, '46263dfe-507c-410e-8701-f5b2ca16336b', 'asdasdasd', 'yes', '2018-08-03 09:14:13', NULL),
(23, '46263dfe-507c-410e-8701-f5b2ca16336b', 'asdasdasdas', 'yes', '2018-08-03 09:14:48', NULL),
(24, '46263dfe-507c-410e-8701-f5b2ca16336b', 'sa232', 'yes', '2018-08-03 09:23:28', NULL),
(25, '46263dfe-507c-410e-8701-f5b2ca16336b', 'sa232', 'yes', '2018-08-03 09:23:49', NULL),
(26, '46263dfe-507c-410e-8701-f5b2ca16336b', 'sa232a', 'yes', '2018-08-03 09:24:49', NULL),
(27, '46263dfe-507c-410e-8701-f5b2ca16336b', 'sa232a', 'yes', '2018-08-03 09:26:55', NULL),
(28, '46263dfe-507c-410e-8701-f5b2ca16336b', 'sa232a', 'yes', '2018-08-03 09:41:16', NULL),
(29, '46263dfe-507c-410e-8701-f5b2ca16336b', 'sa232a', 'yes', '2018-08-03 09:44:25', NULL),
(30, '46263dfe-507c-410e-8701-f5b2ca16336b', 'sadadadsasd', 'yes', '2018-08-03 09:45:12', NULL),
(31, '46263dfe-507c-410e-8701-f5b2ca16336b', 'dasd', 'yes', '2018-08-03 10:25:03', NULL),
(32, '46263dfe-507c-410e-8701-f5b2ca16336b', 'dasd', 'yes', '2018-08-03 10:28:34', NULL),
(33, '46263dfe-507c-410e-8701-f5b2ca16336b', 'dasd', 'yes', '2018-08-03 10:30:44', NULL),
(34, '46263dfe-507c-410e-8701-f5b2ca16336b', 'adssds', 'yes', '2018-08-03 10:33:12', NULL),
(35, '46263dfe-507c-410e-8701-f5b2ca16336b', 'aaaa', 'yes', '2018-08-03 10:34:26', NULL),
(37, '46263dfe-507c-410e-8701-f5b2ca16336b', 'asd', 'yes', '2018-08-06 07:22:18', NULL),
(38, '46263dfe-507c-410e-8701-f5b2ca16336b', 'TEST !@@', 'yes', '2018-08-06 07:23:08', NULL);

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

--
-- Dumping data for table `hp_support`
--

INSERT INTO `hp_support` (`support_id`, `user_id`, `support_message`, `status`, `created`, `updated`) VALUES
(1, '46263dfe-507c-410e-8701-f5b2ca16336b', 'addadsad', 'active', '2018-08-07 11:23:30', NULL),
(2, '46263dfe-507c-410e-8701-f5b2ca16336b', 'addadsaddasd', 'active', '2018-08-07 11:43:13', NULL),
(3, '46263dfe-507c-410e-8701-f5b2ca16336b', 'Testing support Service', 'active', '2018-08-07 11:48:49', NULL);

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
('18e1c619-2e99-4146-81dd-3567829d2acf', 'HAD', 'NAROLA', 'local.hubpitch@mailinator.com', 'a8b4fab1bed511ab6850908c72c547c9', 'yes', 'admin', '2018-07-18 09:12:16', NULL),
('1bf3ba5f-0feb-4a6c-89f1-01f88b07b715', 'Hareen', 'Desai', 'hareen1@mailinator.com', 'a8b4fab1bed511ab6850908c72c547c9', 'no', 'user', '2018-07-16 05:35:33', NULL),
('225dcc3f-0d8b-4a9f-9935-a90e877f8007', 'Hareen', 'Desai', 'hareen91@mailinator.com', 'a8b4fab1bed511ab6850908c72c547c9', 'no', 'user', '2018-07-16 06:07:42', NULL),
('46263dfe-507c-410e-8701-f5b2ca16336b', 'Hareen', 'Desai', 'hareen1991@mailinator.com', 'a8b4fab1bed511ab6850908c72c547c9', 'no', 'user', '2018-07-16 06:13:40', NULL),
('9c476a30-e2cb-49d2-b95c-3a52777c2bd1', 'HAD', 'NAROLA', 'had.narola@mailinator.com', 'a8b4fab1bed511ab6850908c72c547c9', 'no', 'user', '2018-07-18 06:40:33', NULL);

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
