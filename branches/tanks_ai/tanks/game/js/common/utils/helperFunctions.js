var helperFunctions =
{
    getArrayFromObject: function( object )
    {
        var values = [];
        for ( var key in object )
        {
            values.push( object[key] );
        }
        return values;
    }
};

module.exports = helperFunctions;
