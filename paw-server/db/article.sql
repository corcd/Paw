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

 Date: 13/04/2019 14:50:38
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for article
-- ----------------------------
DROP TABLE IF EXISTS `article`;
CREATE TABLE `article` (
  `article_id` int(255) unsigned NOT NULL AUTO_INCREMENT,
  `article_author` varchar(50) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `article_create_time` datetime NOT NULL,
  `article_title` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `article_content` varchar(1000) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `article_img_1` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `article_img_2` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `article_img_3` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `article_pop` int(100) unsigned NOT NULL DEFAULT '0' COMMENT '点赞数',
  `article_label` varchar(20) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `article_use_if` int(1) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`article_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=ascii;

SET FOREIGN_KEY_CHECKS = 1;
