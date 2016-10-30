var settings   = require( '../GameSettings' );

var Rocket = function()
{
    this.point     = { x: 0, y: 0 };  // Передается при выстреле как положние танка по x,y
    this.dimension = { width: settings.WEAPONS_DIMENSION.width, height: settings.WEAPONS_DIMENSION.height };
    this.speed     = 3;
    this.image     = null;
    this.damage    = 20;
    this.route     = 'right';
    this.fire      = null;
    this.tankId    = null;
};

module.exports = Rocket;