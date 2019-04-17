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

 Date: 13/04/2019 14:50:18
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for model
-- ----------------------------
DROP TABLE IF EXISTS `model`;
CREATE TABLE `model` (
  `model_id` int(255) unsigned NOT NULL AUTO_INCREMENT,
  `model_username` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `model_label` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `model_label_long` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `model_label_short` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `model_use_if` int(1) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`model_id`)
) ENGINE=InnoDB DEFAULT CHARSET=ascii;

SET FOREIGN_KEY_CHECKS = 1;
