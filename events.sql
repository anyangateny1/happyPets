-- MySQL dump 10.13  Distrib 8.0.32, for Linux (x86_64)
--
-- Host: localhost    Database: happyPets
-- ------------------------------------------------------
-- Server version	8.0.32-0ubuntu0.22.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- ------------------------------------------------------
-- Table structure for table `announcements`
-- ------------------------------------------------------

DROP TABLE IF EXISTS `announcements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `announcements` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- Dumping data for table `announcements`
LOCK TABLES `announcements` WRITE;
/*!40000 ALTER TABLE `announcements` DISABLE KEYS */;
INSERT INTO `announcements` VALUES
(1,'Important Update','We have changed our adoption policy. Please review it before proceeding.','2024-06-12 23:51:41'),
(2,'Volunteer Opportunity','Join us for our upcoming volunteer training session on Saturday at 10 AM.','2024-06-12 23:51:41'),
(3,'Pet Adoption Event','Visit our shelter this weekend to meet our adorable pets looking for forever homes.','2024-06-12 23:51:41'),
(4,'PLEASE','YES!','2024-06-13 00:44:20'),
(5,'ROBERT JOHNSON IS A MANAGER','ALICE SMITH IS NOT AND WON’T BE ABLE TO SEE THIS CREATE ANNOUNCEMENT THING','2024-06-13 00:47:49');
/*!40000 ALTER TABLE `announcements` ENABLE KEYS */;
UNLOCK TABLES;

-- ------------------------------------------------------
-- Table structure for table `events`
-- ------------------------------------------------------

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `image` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `details` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- Dumping data for table `events`
LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES
(1,'../images/fundraiser.jpg','Fundraiser Event','Details about Fundraiser Event'),
(2,'../images/barbecue.jpg','Barbecue Event','Details about Barbecue Event'),
(3,'../images/rundog.jpg','Pet Marathon','Details about Pet Marathon'),
(4,'../images/pubcrawl.jpg','Pubcrawl','Details about Pubcrawl');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

-- ------------------------------------------------------
-- Table structure for table `menu_items`
-- ------------------------------------------------------

DROP TABLE IF EXISTS `menu_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(50) DEFAULT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `link` varchar(100) DEFAULT NULL,
  `role` varchar(20) DEFAULT NULL,
  `position` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- Dumping data for table `menu_items`
LOCK TABLES `menu_items` WRITE;
/*!40000 ALTER TABLE `menu_items` DISABLE KEYS */;
INSERT INTO `menu_items` VALUES
(1,'Edit Profile','fa-solid fa-user-pen','#','Member',1),
(2,'Announcements','fa-solid fa-bullhorn','#','Member',2),
(3,'View Members','fa-solid fa-users-rectangle','#','Manager',3),
(4,'Manage Faculties','fa-solid fa-people-roof','#','Admin',5),
(5,'Manage Events','fa-solid fa-calendar-check','/Menu/manageEvents.html','Manager',4);
/*!40000 ALTER TABLE `menu_items` ENABLE KEYS */;
UNLOCK TABLES;

-- ------------------------------------------------------
-- Table structure for table `faculties`
-- ------------------------------------------------------

DROP TABLE IF EXISTS `faculties`;
CREATE TABLE `faculties` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `members_count` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table `faculties`
LOCK TABLES `faculties` WRITE;
/*!40000 ALTER TABLE `faculties` DISABLE KEYS */;
INSERT INTO `faculties` VALUES
(1, 'Animal Care', 12),
(2, 'Dog Training', 9),
(3, 'Foster Care', 17),
(4, 'Animal Rescue', 8),
(5, 'Gardening and Maintenance', 3);
/*!40000 ALTER TABLE `faculties` ENABLE KEYS */;
UNLOCK TABLES;

-- ------------------------------------------------------
-- Table structure for table `users`
-- ------------------------------------------------------

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,  -- Ensure this line exists
  `role` enum('Admin', 'Manager', 'Member') NOT NULL,
  `faculty_id` int,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`faculty_id`) REFERENCES `faculties`(`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table `users`
LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES
(1, 'John', 'Doe', 'john.doe@example.com', '$2b$10$7RIIpFn9dNN8EYT2FQnStOt7Q7.C8KPC1EiwhgHlRVosOSEE08lj2', 'Admin', 1),
(2, 'Jane', 'Smith', 'jane.smith@example.com', '$2b$10$7RIIpFn9dNN8EYT2FQnStOt7Q7.C8KPC1EiwhgHlRVosOSEE08lj2', 'Manager', 1),
(3, 'Emily', 'Jones', 'emily.jones@example.com', '$2b$10$7RIIpFn9dNN8EYT2FQnStOt7Q7.C8KPC1EiwhgHlRVosOSEE08lj2', 'Member', 2),
(4, 'Michael', 'Brown', 'michael.brown@example.com', '$2b$10$7RIIpFn9dNN8EYT2FQnStOt7Q7.C8KPC1EiwhgHlRVosOSEE08lj2', 'Member', 3),
(5, 'Sarah', 'Davis', 'sarah.davis@example.com', '$2b$10$7RIIpFn9dNN8EYT2FQnStOt7Q7.C8KPC1EiwhgHlRVosOSEE08lj2', 'Manager', 4);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

-- ------------------------------------------------------
-- Table structure for table `eventsRSVP`
-- ------------------------------------------------------

DROP TABLE IF EXISTS `eventsRSVP`;
CREATE TABLE `eventsRSVP` (
  `user_id` int NOT NULL,
  `event_id` int NOT NULL,
  PRIMARY KEY (`user_id`, `event_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`event_id`) REFERENCES `events`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ------------------------------------------------------
-- Final cleanup
-- ------------------------------------------------------

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;



