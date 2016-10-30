var settings    = require( '../../../GameSettings' );

var Flag = function()
{
    this.dimension = {
        width: settings.TANK_SIZE,
        height: settings.TANK_SIZE
    };
    this.point = {
        x: settings.MAP_PARAMS.FIELD_WIDTH / 2 - this.dimension.width / 2,
        y: settings.MAP_PARAMS.FIELD_HEIGHT / 2 - this.dimension.height / 2
    };
};

module.exports = Flag;