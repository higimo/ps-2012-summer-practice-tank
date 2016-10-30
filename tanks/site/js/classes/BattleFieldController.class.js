var BattleFieldController = function()
{
    this.dimension = null;
    this.gamerId = null;
    this.myGroup = null;
};

BattleFieldController.prototype.start = function( data )
{
    if ( this.gamerId !== null)
    {
        return;
    }
    this.dimension = data.formedBattleField.walls[0][0].dimension;
    this.gamerId = data.gamerId;
    this.myGroup = data.formedBattleField.tanks[this.gamerId].group;

    var slimData =
    {
        width: data.formedBattleField.walls[0].length,
        height: data.formedBattleField.walls.length,
        walls: data.formedBattleField.walls
    };
    BattleField.init( slimData );
};

BattleFieldController.prototype.update = function( data )
{
    var slimData =
    {
        myPosition: this._calculatePosition( data.tanks[this.gamerId].point ),
        enemies: this._extractEnemiesData( data.tanks ),
        flagPosition: this._calculatePosition( data.informationAboutCaptureFlagGame.flag.point ),
        weapons: this._extractWeaponsData( data.weapons )
    };
    BattleField.update( slimData );
};

BattleFieldController.prototype._extractEnemiesData = function( tanks )
{
    var enemies = [];
    for ( var i = 0; i < tanks.length; ++i )
    {
        if ( tanks[i].group != this.myGroup )
        {
            var enemy =
            {
                position: this._calculatePosition( tanks[i].point ),
                health: tanks[i].health
            };
            enemies.push( enemy );
        }
    }
    return enemies;
};

BattleFieldController.prototype._extractWeaponsData = function( weapons )
{
    var weaponsData = [];
    for ( var i = 0; i < weapons.length; ++i )
    {
        if ( weapons[i].damage > 0 )
        {
            var weapon =
            {
                position: this._calculatePosition( weapons[i].point ),
                route: weapons[i].route
            };
            weaponsData.push( weapon );
        }
    }
    return weaponsData;
};

BattleFieldController.prototype._calculatePosition = function( point )
{
    return {
        row: Math.round( point.y / this.dimension.height ),
        column: Math.round( point.x / this.dimension.width )
    };
};
