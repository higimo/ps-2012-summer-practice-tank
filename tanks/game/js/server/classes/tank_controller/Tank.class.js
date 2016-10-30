settings = require( '../../GameSettings' );

var Tank = function( ai )
{
    this.point     = { x: 0, y: 0 };
    this.dimension = { width: settings.TANK_SIZE, height: settings.TANK_SIZE };
    this.health    = 100;
    this.speed     = 1;
    this.moves     = false;
    this.image     = null;
    this.route     = 'right';
    this.shot      = { speed: 400, recharge: 0 };
    this.group     = null;
    this.menu      = { gamerCount: 0, frag: 0, dead: 0, mark: 0 };
    this.attack    = false;
    this.tankName  = null;
    this.ai = ai;
    this.friendlyKills = 0;
    this.directInBottleneck = { isBottleneck: false, route: null };
};

Tank.prototype.isBot = function()
{
	return (this.ai != null)
};

module.exports = Tank;