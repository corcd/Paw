/*
 Navicat Premium Data Transfer

 Source Server         : mysql
 Source Server Type    : MySQL
 Source Server Version : 80015
 Source Host           : localhost:3306
 Source Schema         : paw

 Target Server Type    : MySQL
 Target Server Version : 80015
 File Encoding         : 65001

 Date: 13/04/2019 14:50:55
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for lbs
-- ----------------------------
DROP TABLE IF EXISTS `lbs`;
CREATE TABLE `lbs` (
  `lbs_id` int(255) unsigned NOT NULL AUTO_INCREMENT,
  `lbs_lng` decimal(65,6) unsigned NOT NULL,
  `lbs_lat` decimal(65,6) unsigned NOT NULL,
  `lbs_title` varchar(200) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `lbs_author` varchar(50) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `lbs_content` varchar(2000) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `lbs_geohash` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `lbs_animal` int(1) unsigned DEFAULT NULL,
  `lbs_create_time` datetime NOT NULL,
  `lbs_use_if` int(1) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`lbs_id`)
) ENGINE=InnoDB AUTO_INCREMENT=176 DEFAULT CHARSET=ascii;

SET FOREIGN_KEY_CHECKS = 1;
