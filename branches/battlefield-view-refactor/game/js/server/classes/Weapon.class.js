var Rocket = function()
{
    this.point     = { x: 0, y: 0 };  // Передается при выстреле как положние танка по x,y
    this.dimension = { width: 24, height: 6 };
    this.speed     = 3;
    this.image     = null;
    this.damege    = 20;
    this.route     = 'right';
    this.fire      = null;
    this.tankId    = null;
};

module.exports = Rocket;