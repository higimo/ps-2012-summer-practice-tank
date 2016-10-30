var Map = {  
    'COUNT_BRICK_I': 14,
    'COUNT_BRICK_J': 24,
    'CELL_WIDTH':    40,
    'CELL_HEIGHT':   40,
    'WALL':          1,
    'GRASS':         0
}  

Map.FIELD_WIDTH  = Map.COUNT_BRICK_J * Map.CELL_WIDTH;
Map.FIELD_HEIGHT = Map.COUNT_BRICK_I * Map.CELL_WIDTH;

var settings = {
    GAME_TYPE:      'timer',
    GAME_TIME:      300000, //5 минут
    GAME_INTERVAL:  8,
    MAX_GAMER:      8,
    UPDATE_GAME:    30,
    MAP_PARAMS:     Map,
    NO_SPACE:      -1,
    TANK_SPEED:     1,
    TANK_SIZE:      36,
    MAX_GAMES:      5,
    CLEAN_INTERVAL: 2000,
    MAX_PLAYERS:    20,
    HOST:           '127.0.0.1',
    PORT:           '3306',
    USER:           'tank_sql',
    PASSWORD:       'Am,72zLo',
    DATABASE:       'tanks',
    TYPE_AI:        'clever'
};

module.exports = settings;