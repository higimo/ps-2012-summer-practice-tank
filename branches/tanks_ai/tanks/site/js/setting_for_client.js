var health =
{
    COLOR:  'blue',
    MARGIN: 6,
    HEIGHT: 2
};

var flagCapture =
{
    ALLY_COLOR:  'red',
    ENEMY_COLOR: 'black',
    MARGIN_FOR_ALLY: 6,
    MARGIN_FOR_ENEMY: 9,
    HEIGHT: 2
};

var playerName =
{
    MARGIN:     9,
    CHAR_WIDTH: 9,
    COLOR:      'white',
    SIZE:       11
};

var direction =
{
    'UP':    'up',
    'DOWN':  'down',
    'LEFT':  'left',
    'RIGHT': 'right',

    getAllDirections: function()
    {
        return [this.UP, this.DOWN, this.LEFT, this.RIGHT];
    }
};

var setting = 
{
    GAME_INTERVAL:      8,
    SPECTATOR_ID:       -1,
    MAX_GAMER_NAME_LEN: 16,
    MAX_GAME_NAME_LEN:  21,
    METALL_WALLS:       1,
    MY_TANK_GROUP:      0,
    NUMBER_OF_BRICKS_IN_WIDTH:  0,
    NUMBER_OF_BRICKS_IN_HEIGHT: 0,
    DIRECTION:          direction,
    HEALTH:             health,
    PLAYER_NAME:        playerName,
    FLAG_CAPTURE:       flagCapture,
    SITE_HOST:          $( '#site_host' ).html(),
    NODE_HOST:          $( '#node_host' ).html(),
    NODE_PORT:          $( '#node_port' ).html()
};
