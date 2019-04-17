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

 Date: 13/04/2019 14:50:46
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for interest
-- ----------------------------
DROP TABLE IF EXISTS `interest`;
CREATE TABLE `interest` (
  `inte_id` int(255) unsigned NOT NULL AUTO_INCREMENT,
  `inte_username` varchar(50) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `inte_dog` int(65) unsigned DEFAULT NULL,
  `inte_cat` int(65) unsigned DEFAULT NULL,
  `inte_bird` int(65) unsigned DEFAULT NULL,
  `inte_use_if` int(1) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`inte_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=ascii;

SET FOREIGN_KEY_CHECKS = 1;
