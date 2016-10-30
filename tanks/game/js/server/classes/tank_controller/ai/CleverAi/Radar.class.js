var settings = require( '../../../../GameSettings' );

var Radar = function( battleField, indexTankAi )
{
    this.battleField = battleField;
    this.indexTankAi = indexTankAi;
    this.route       = false;
    this.radiusOfVisibilityArea        = 9;
    this.visibilityArea                = null;
    this.isRadarHasEnemyOrFlag         = false;
    this.sizeOfVisibilityArea          = 2*this.radiusOfVisibilityArea + 1;
    this.maxLenghtRoad                 = this.sizeOfVisibilityArea *  this.sizeOfVisibilityArea;
    this.coordinateRadarBeginningOnMap = new this._Coordinate(); 
    this.coordinateEnemy               = new this._Coordinate();
    this.typesOfUnit                   = {
        enemy: 'enemy',
        ally: 'ally',
        wall: 'wall',
        empty: 'empty',
        road: 'road',
        flag: 'flag'
    };
};

Radar.prototype._Coordinate = function()
{
    this.x = 0;
    this.y = 0;
};

Radar.prototype.updateRadar = function()
{
    this.changeRadar = false;
    if ( !this.visibilityArea || this._changeTankAiPosition() )
    {
        this.changeRadar = true;
        this._getRadar();
    }
};

Radar.prototype.isCaptureFlag = function()
{
    return ( this.visibilityArea[this.radiusOfVisibilityArea][this.radiusOfVisibilityArea] == this.typesOfUnit.flag );
};

Radar.prototype.hasEnemyOrFlag = function()
{
    return this.isRadarHasEnemyOrFlag;
};

Radar.prototype.getRouteToGoal = function()
{
    if ( this.changeRadar )
    {
        this.route =  this._getNewRoute();
    }
    return this.route;
};

Radar.prototype._changeTankAiPosition = function()
{
    var radarPosition = this._getCoordinateRadarOnMap();
    return radarPosition.x != this.coordinateRadarBeginningOnMap.x || radarPosition.y != this.coordinateRadarBeginningOnMap.y;
};

Radar.prototype._getNewRoute = function()
{
    if ( this._noteRoadToEnemy() )
    {
        this._noteRoadBack();
        return this._getRouteToLabel( this.typesOfUnit.road );
    }
    return false;
};

Radar.prototype._noteRoadToEnemy = function()
{
    var countStep = 0;
    this._labelTankAiSquareAsZeroStep();
    this.isGoalFound = false;
    while (! this.isGoalFound && countStep < this.maxLenghtRoad )
    {
        this._noteNextStepWaveAlgorithm( ++countStep );
    }
    return this.isGoalFound;
};

Radar.prototype._labelTankAiSquareAsZeroStep = function()
{
    this.visibilityArea[this.radiusOfVisibilityArea][this.radiusOfVisibilityArea] = 0;
};

Radar.prototype._noteRoadBack = function()
{
    var lastCoordinate = this.coordinateEnemy;
    var lastLabel = this.visibilityArea[this.coordinateEnemy.x][this.coordinateEnemy.y];
    var countStep = 0;
    while ( lastLabel != 0 && countStep < this.maxLenghtRoad )
    {
        countStep++;
        lastCoordinate = this._searchForLabel( lastLabel--, lastCoordinate );
    }
};

Radar.prototype._searchForLabel = function( label, coordinate )
{
    var upSquare = ( this._isCoordinateNotOutOfBounds(coordinate.x - 1) && this._isCoordinateNotOutOfBounds(coordinate.y) ) ? this.visibilityArea[coordinate.x - 1][coordinate.y]: this.typesOfUnit.wall;
    var downSquare = ( this._isCoordinateNotOutOfBounds(coordinate.x + 1) && this._isCoordinateNotOutOfBounds(coordinate.y) ) ? this.visibilityArea[coordinate.x + 1][coordinate.y]: this.typesOfUnit.wall;
    var rightSquare = ( this._isCoordinateNotOutOfBounds(coordinate.x) && this._isCoordinateNotOutOfBounds(coordinate.y + 1) ) ? this.visibilityArea[coordinate.x][coordinate.y + 1]: this.typesOfUnit.wall;
    var leftSquare = ( this._isCoordinateNotOutOfBounds(coordinate.x) && this._isCoordinateNotOutOfBounds(coordinate.y - 1) ) ? this.visibilityArea[coordinate.x][coordinate.y - 1]: this.typesOfUnit.wall;
    switch ( label )
    {
        case upSquare:
            --coordinate.x;
        break;
        case downSquare:
            ++coordinate.x;
        break;
        case rightSquare:
            ++coordinate.y;
            break;
        case leftSquare:
            --coordinate.y;
            break;
    }
    this.visibilityArea[coordinate.x][coordinate.y] = this.typesOfUnit.road;
    return coordinate;
};

Radar.prototype._getRouteToLabel = function( label )
{
    var route = false;
    var upSquare = this.visibilityArea[this.radiusOfVisibilityArea - 1][this.radiusOfVisibilityArea];
    var downSquare = this.visibilityArea[this.radiusOfVisibilityArea + 1][this.radiusOfVisibilityArea];
    var rightSquare = this.visibilityArea[this.radiusOfVisibilityArea][this.radiusOfVisibilityArea + 1];
    var leftSquare = this.visibilityArea[this.radiusOfVisibilityArea][this.radiusOfVisibilityArea - 1];
    if ( upSquare    == label )  route = settings.DIRECTION.UP;
    if ( downSquare  == label )  route = settings.DIRECTION.DOWN;
    if ( rightSquare == label )  route = settings.DIRECTION.RIGHT;
    if ( leftSquare  == label )  route = settings.DIRECTION.LEFT;
    return route;
};

Radar.prototype._noteNextStepWaveAlgorithm = function( label )
{
    for ( var i = 0; i < this.sizeOfVisibilityArea; i++ )
    {
        for ( var j = 0; j < this.sizeOfVisibilityArea; j++ )
        {
            this._relabelFourNearestSquares( i, j, label );
        }
    }
};

Radar.prototype._relabelFourNearestSquares = function( i, j, label )
{        
    if ( this.visibilityArea[i][j] == label - 1 )
    {
        this._relabelSquareIfNotOutOfBounds( i + 1, j, label );
        this._relabelSquareIfNotOutOfBounds( i - 1, j, label );
        this._relabelSquareIfNotOutOfBounds( i, j + 1, label );
        this._relabelSquareIfNotOutOfBounds( i, j - 1, label );
    }
};

Radar.prototype._relabelSquareIfNotOutOfBounds = function( indexI, indexJ, label )
{ 
    if ( this._isCoordinateNotOutOfBounds(indexI) && this._isCoordinateNotOutOfBounds(indexJ) )
    {
        this._relabelSquare( indexI, indexJ, label );
    }
};

Radar.prototype._relabelSquare = function( indexI, indexJ, label )
{
    var square = this.visibilityArea[indexI][indexJ];

    if ( square == this.typesOfUnit.flag || square == this.typesOfUnit.enemy )
    {
        this._noteGoalOnVisibilityArea( indexI, indexJ );
        this.visibilityArea[indexI][indexJ] = label;
    }

    if ( square == this.typesOfUnit.empty || label < square )
    {
        this.visibilityArea[indexI][indexJ] = label;
    }
};

Radar.prototype._noteGoalOnVisibilityArea = function( indexI, indexJ )
{
    this.isGoalFound = true;
    this.coordinateEnemy.x = indexI;
    this.coordinateEnemy.y = indexJ;

};

Radar.prototype._isCoordinateNotOutOfBounds = function( index )
{
    return (index >= 0 && index < this.sizeOfVisibilityArea )
};

Radar.prototype._getRadar = function()
{
    this._initializationVisibilityArea();
    this._setCoordinateRadarOnMap();
    if ( this.battleField.typeOfGame == settings.GAME_TYPES.FLAG_CAPTURE ||
        this.battleField.typeOfGame == settings.GAME_TYPES.AI )
    {
        this._noteFlagAreaOnVisibilityArea();
    }
    this._noteWallsOnVisibilityArea();
    this._noteTanksOnVisibilityArea();

};

Radar.prototype._noteWallsOnVisibilityArea = function()
{
    for ( var i = 0; i < this.sizeOfVisibilityArea; i++ )
    {
        for ( var j = 0; j < this.sizeOfVisibilityArea; j++ )
        {
            if ( this._isUnitAvailable( this.battleField.walls, i + this.coordinateRadarBeginningOnMap.y, j + this.coordinateRadarBeginningOnMap.x) && !this.battleField.walls[i + this.coordinateRadarBeginningOnMap.y][j + this.coordinateRadarBeginningOnMap.x].isGrass() )
            {
                this.visibilityArea[i][j] = this.typesOfUnit.wall;
            }
        }
    }
};

Radar.prototype._noteTanksOnVisibilityArea = function()
{
    for ( var i = 0; i < this.battleField.tanks.length; i++ )
    {
        if ( this.battleField.tanks[i].health > 0 && i != this.indexTankAi )
        {
            this._noteOneTankOnVisibilityArea( this.battleField.tanks[i] );
        }  
    }
};

Radar.prototype._isUnitAvailable = function( walls, coordinateX, coordinateY )
{   
    return ( coordinateX >= 0 && coordinateX < walls.length ) && ( coordinateY >= 0 && coordinateY < walls[0].length);
};

Radar.prototype._noteOneTankOnVisibilityArea = function( tank )
{
    var coordinateTank = this._getObjectCoordinates( tank );

    if ( this._isObjectInVisibilityArea( coordinateTank ) )
    {
        coordinateTank.x -= this.coordinateRadarBeginningOnMap.x;
        coordinateTank.y -= this.coordinateRadarBeginningOnMap.y;
        if ( tank.group == this.battleField.tanks[this.indexTankAi].group )
        {
            this.visibilityArea[coordinateTank.y][coordinateTank.x] =  this.typesOfUnit.ally;
        }
        else
        {
            this._noteEnemyOnVisibilityArea( coordinateTank );
        }
    }
};

Radar.prototype._noteEnemyOnVisibilityArea = function( coordinate )
{
    this.isRadarHasEnemyOrFlag = true;
    this.coordinateEnemy = coordinate;
    this.visibilityArea[coordinate.y][coordinate.x] = this.typesOfUnit.enemy;
};

Radar.prototype._noteFlagAreaOnVisibilityArea = function()
{
    var flagRadar = this.battleField.gameRulesChecker.flagRadar;
    for ( var i = 0; i < flagRadar.size; i++ )
    {
        for ( var j = 0; j < flagRadar.size; j++ )
        {
            var coordinates = this._getObjectCoordinates( flagRadar );
            coordinates.x += i;
            coordinates.y += j;
            if ( this._isObjectInVisibilityArea( coordinates ) )
            {
                coordinates.x -= this.coordinateRadarBeginningOnMap.x;
                coordinates.y -= this.coordinateRadarBeginningOnMap.y;
                this.visibilityArea[coordinates.y][coordinates.x] = this.typesOfUnit.flag;
            }
        }
    }
};


Radar.prototype._isObjectInVisibilityArea = function( coordinates )
{
    var isIngestedHorizontal = ( coordinates .x >= this.coordinateRadarBeginningOnMap.x && coordinates .x <= this.coordinateRadarBeginningOnMap.x + this.sizeOfVisibilityArea );
    var isIngestedVertical = ( coordinates .y >= this.coordinateRadarBeginningOnMap.y && coordinates .y <= this.coordinateRadarBeginningOnMap.y + this.sizeOfVisibilityArea );
    var isNotViolatedBoundariesHorizontal = ( coordinates .x - this.coordinateRadarBeginningOnMap.x < this.sizeOfVisibilityArea );
    var isNotViolatedBoundariesVertical = ( coordinates .y - this.coordinateRadarBeginningOnMap.y < this.sizeOfVisibilityArea );
    return ( isIngestedHorizontal && isIngestedVertical && isNotViolatedBoundariesHorizontal && isNotViolatedBoundariesVertical )
};

Radar.prototype._initializationVisibilityArea = function()
{
    this.isRadarHasEnemyOrFlag  = false;
    this.visibilityArea = new Array();
    for ( var i = 0; i < this.sizeOfVisibilityArea; i++ )
    {
        this.visibilityArea[i] = new Array();
        for ( var j = 0; j < this.sizeOfVisibilityArea; j++ )
        {
            this.visibilityArea[i][j] = this.typesOfUnit.empty;
        }
    }
};

Radar.prototype._setCoordinateRadarOnMap = function()
{
    var coordinateRadarBeginningOnMap = this._getCoordinateRadarOnMap();
    this.coordinateRadarBeginningOnMap.x = coordinateRadarBeginningOnMap.x;
    this.coordinateRadarBeginningOnMap.y = coordinateRadarBeginningOnMap.y;
};

Radar.prototype._getCoordinateRadarOnMap = function()
{
    var currentTank = this.battleField.tanks[this.indexTankAi];
    var coordinateRadarBeginningOnMap = this._getObjectCoordinates( currentTank );
    coordinateRadarBeginningOnMap.y -= this.radiusOfVisibilityArea;
    coordinateRadarBeginningOnMap.x -= this.radiusOfVisibilityArea;
    return coordinateRadarBeginningOnMap;
};

Radar.prototype._getObjectCoordinates = function( object )
{
    var coordinate = new this._Coordinate();
    coordinate.x = object.point.x / settings.MAP_PARAMS.CELL_WIDTH;
    coordinate.y = object.point.y / settings.MAP_PARAMS.CELL_HEIGHT;
    //округляем, т.к. координаты целые числа, вычитаем 0.5 для получения всегда меньшего целого числа
    coordinate.x = Math.round(coordinate.x - 0.5); 
    coordinate.y = Math.round(coordinate.y - 0.5);
    return coordinate;
};

module.exports = Radar;