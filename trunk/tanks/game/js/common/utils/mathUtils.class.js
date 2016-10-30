var MathUtils = function() {};

MathUtils.prototype.getRandomRealNumber = function( min, max ) 
{
    return Math.random() * ( max - min ) + min;
};

MathUtils.prototype.getRandomInteger = function( min, max )
{
    return Math.round( this.getRandomRealNumber(  min, max ) );
};
    
module.exports = new MathUtils();