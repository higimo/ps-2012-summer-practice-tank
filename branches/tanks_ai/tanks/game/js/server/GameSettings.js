var AiSettings = require( './AiSettings' );

var Map =
{
    'COUNT_BRICK_I': 14,
    'COUNT_BRICK_J': 24,
    'CELL_WIDTH': 40,
    'CELL_HEIGHT': 40,
    'DEFAULT_MAP': 'default',
    'RANDOM_MAP': 'random',
    "FLAG_DEFAULT_MAP": 'flag_default',
    "FLAG_RANDOM_MAP": 'flag_random'
};

Map.FIELD_WIDTH = Map.COUNT_BRICK_J * Map.CELL_WIDTH;
Map.FIELD_HEIGHT = Map.COUNT_BRICK_I * Map.CELL_WIDTH;

var gameTypes =
{
    'FLAG_CAPTURE': 'flag',
    'TIMER': 'timer',
    'AI': 'ai'
};

var aiTypes =
{
    'SIMPLE': 'simple',
    'CLEVER': 'clever'
};

var direction =
{
    'UP': 'up',
    'DOWN': 'down',
    'LEFT': 'left',
    'RIGHT': 'right'
};

var groups =
{
    'FIRST': 0,
    'SECOND': 1
};

var weaponSize =
{
    height: 6,
    width: 24
};

var settings =
{
    //GAME_TIME: 300000, //5 минут
    GAME_TIME: 120000, //2 минуты
    GAME_INTERVAL: 8,
    MAX_GAMER: 15,
    UPDATE_GAME: 30,
    MAP_PARAMS: Map,
    TANK_SPEED: 1,
    TANK_SIZE: 36,
    MAX_GAMES: 5,
    CLEAN_INTERVAL: 2000,
    TYPE_AI: aiTypes.CLEVER,
    DIRECTION: direction,
    EMPTY_SPACE: 2,
    ROCKET: 'rocket',
    TANK: 'tank',
    GROUPS: groups,
    TIME_LIFE_EXPLOSION: 350,
    MAX_EXPLOSION: 40,
    MIN_EXPLOSION: 20,
    GAME_TYPES: gameTypes,
    VIEW_USER: -1,
    TIME_FOR_FLAG_CAPTURE: 1000, // миллисекунд
    WEAPONS_DIMENSION: weaponSize,
    AI: AiSettings
};

module.exports = settings; 