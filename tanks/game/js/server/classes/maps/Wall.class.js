var Wall = function()
{
    this.point     = { x: 0, y: 0 };
    this.dimension = { width: 40, height: 40 };
    this.image     = null;
    this.type      = 0;
};

Wall.prototype.isGrass = function()
{
    if ( this.type == 0 )
    {
        return true;
    }
    return false;
};

module.exports = Wall;