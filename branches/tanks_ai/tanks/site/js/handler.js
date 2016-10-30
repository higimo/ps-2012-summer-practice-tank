/**
 * Creates event handler for invoking listener method.
 */
function handler( listener, methodName )
{
    return function()
    {
        return listener[methodName].apply( listener, arguments );
    };
}
