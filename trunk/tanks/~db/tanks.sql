CREATE TABLE IF NOT EXISTS `game` (
  `game_id`       int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`          varchar(30) COLLATE utf8_bin DEFAULT NULL,
  `begin_date`    time        DEFAULT NULL,
  `user_count`    int(2)      DEFAULT NULL,
  `type`          varchar(20) COLLATE utf8_bin DEFAULT NULL,
  `map_type`      varchar(20) COLLATE utf8_bin DEFAULT NULL,
  `bot_count`     int(3)      DEFAULT NULL,
  `is_broken`     int(1)      DEFAULT 0,
  UNIQUE KEY `game_id` (`game_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE IF NOT EXISTS `top_player` (
  `top_player_id` int(3)      DEFAULT NULL,
  `name`          varchar(30) COLLATE utf8_bin DEFAULT NULL,
  `mark`          float(4)      DEFAULT 0.0,
  `frags`         int(4)      DEFAULT NULL,
  `death`         int(4)      DEFAULT NULL,
  `game_type`   varchar(20) COLLATE utf8_bin DEFAULT NULL,
  `data`          varchar(20) COLLATE utf8_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;