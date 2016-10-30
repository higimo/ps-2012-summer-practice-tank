CREATE TABLE IF NOT EXISTS `game` (
  `id_game`       int(10)     NOT NULL AUTO_INCREMENT,
  `name_game`     varchar(30) COLLATE utf8_bin DEFAULT NULL,
  `data_begin`    time        DEFAULT NULL,
  `count_users`   int(2)      DEFAULT NULL,
  `battle_type`   varchar(20) COLLATE utf8_bin DEFAULT NULL,
  `map_type`      varchar(20) COLLATE utf8_bin DEFAULT NULL,
  `count_of_bots` int(3)      DEFAULT NULL,
  UNIQUE KEY `id_game` (`id_game`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=4;

CREATE TABLE IF NOT EXISTS `player` (
  `id_player`   int(3)      DEFAULT NULL,
  `name_player` varchar(30) COLLATE utf8_bin DEFAULT NULL,
  `frags`       int(4)      DEFAULT NULL,
  `death`       int(4)      DEFAULT NULL,
  `battle_type` varchar(20) COLLATE utf8_bin DEFAULT NULL,
  `data`        varchar(20) COLLATE utf8_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;