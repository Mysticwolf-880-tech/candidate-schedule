CREATE DATABASE  IF NOT EXISTS `candidate_interviews` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `candidate_interviews`;
-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: candidate_interviews
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `location_master`
--

DROP TABLE IF EXISTS `location_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `location_master` (
  `id` int NOT NULL AUTO_INCREMENT,
  `location_name` varchar(100) NOT NULL,
  `added_by` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `location_name` (`location_name`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `location_master`
--

LOCK TABLES `location_master` WRITE;
/*!40000 ALTER TABLE `location_master` DISABLE KEYS */;
INSERT INTO `location_master` VALUES (32,'Badlapur','Sunil','2025-06-10 09:55:27'),(33,'Dombivali','Sunil','2025-06-10 09:55:27'),(34,'Kalyan','Sunil','2025-06-10 09:55:27'),(35,'Chembur','Sunil','2025-06-10 09:55:27'),(36,'Ghansoli','Sunil','2025-06-10 09:55:27'),(37,'Nahur','Sunil','2025-06-10 09:55:27'),(38,'Mumbra','Sunil','2025-06-10 09:55:27'),(39,'Vikroli','Sunil','2025-06-10 09:55:27'),(40,'Mulund','Sunil','2025-06-10 09:55:27'),(41,'mankhurd','Sunil','2025-06-10 09:55:27'),(42,'wadala','Sunil','2025-06-10 09:55:27'),(43,'sion','Sunil','2025-06-10 09:55:27'),(44,'thane','Sunil','2025-06-10 09:55:27'),(45,'vashi','Sunil','2025-06-10 09:55:27'),(46,'Ghatkopar','Sunil','2025-06-10 09:55:27'),(47,'kurla','Sunil','2025-06-10 09:55:27'),(48,'vasai','Sunil','2025-06-10 09:55:28'),(49,'airoli','Sunil','2025-06-10 09:55:28'),(50,'panvel','Sunil','2025-06-10 09:55:28'),(51,'ulhasnagar','Sunil','2025-06-10 09:55:28'),(52,'navi mumbai','Sunil','2025-06-10 09:55:28'),(53,'bhiwandi','Sunil','2025-06-10 09:55:28'),(54,'shahapur','Sunil','2025-06-10 09:55:28'),(55,'','Sunil','2025-06-10 09:55:28'),(56,'vikhroli','Sunil','2025-06-10 09:55:28'),(57,'Thakurli','Sunil','2025-06-10 09:55:28'),(58,'Ambarnath','Sunil','2025-06-10 09:55:28'),(59,'Pune(telephonic)','Sunil','2025-06-10 09:55:28');
/*!40000 ALTER TABLE `location_master` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-11 16:13:36
