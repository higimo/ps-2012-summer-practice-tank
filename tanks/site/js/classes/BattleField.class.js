var BattleField =
{
    _size:
    {
        height: null,
        width: null
    },
    _field: null,
    _myPosition: null,
    _enemies: new Array(),
    _flagPosition: null,
    _weapons: new Array(),

    init: function( data )
    {
        this._size.height = data.height;
        this._size.width = data.width;
        this._field = data.walls;
    },

    update: function( data )
    {
        this._myPosition = data.myPosition;
        this._enemies = data.enemies;
        this._flagPosition = data.flagPosition;
        this._weapons = data.weapons;
    },

    getSize: function()
    {
        return jQuery.extend( {}, this._size );
    },

    getMyPosition: function()
    {
        return this._myPosition;
    },

    isWall: function( row, column )
    {
        return !this._isValidCell( row, column ) ||
            this._field[row][column].type == '1';
    },

    isEnemy: function( row, column )
    {
        for ( var i = 0; i < this._enemies.length; ++i )
        {
            if ( this._enemies[i].position.row == row &&
                this._enemies[i].position.column == column )
            {
                return true;
            }
        }
        return false;
    },

    isEmpty: function( row, column )
    {
        return !this.isWall( row, column ) && !this.isEnemy( row, column );
    },

    getFlagPosition: function()
    {
        return this._flagPosition;
    },

    getEnemies: function()
    {
        return this._enemies;
    },

    isFireFromAbove: function()
    {
        for ( var i = 0; i < this._weapons.length; ++i )
        {
            if ( this._weapons[i].position.column == this._myPosition.column &&
                this._weapons[i].position.row < this._myPosition.row &&
                this._weapons[i].route == setting.DIRECTION.DOWN &&
                this._isEmptySpaceBetween( this._weapons[i].position, this._myPosition ) )
            {
                return true;
            }
        }
        return false;
    },

    isFireFromRight: function()
    {
        for ( var i = 0; i < this._weapons.length; ++i )
        {
            if ( this._weapons[i].position.row == this._myPosition.row &&
                this._weapons[i].position.column > this._myPosition.column &&
                this._weapons[i].route == setting.DIRECTION.LEFT &&
                this._isEmptySpaceBetween( this._weapons[i].position, this._myPosition ) )
            {
                return true;
            }
        }
        return false;
    },

    isFireFromBelow: function()
    {
        for ( var i = 0; i < this._weapons.length; ++i )
        {
            if ( this._weapons[i].position.column == this._myPosition.column &&
                this._weapons[i].position.row > this._myPosition.row &&
                this._weapons[i].route == setting.DIRECTION.UP &&
                this._isEmptySpaceBetween( this._weapons[i].position, this._myPosition ) )
            {
                return true;
            }
        }
        return false;
    },

    isFireFromLeft: function()
    {
        for ( var i = 0; i < this._weapons.length; ++i )
        {
            if ( this._weapons[i].position.row == this._myPosition.row &&
                this._weapons[i].position.column < this._myPosition.column &&
                this._weapons[i].route == setting.DIRECTION.RIGHT &&
                this._isEmptySpaceBetween( this._weapons[i].position, this._myPosition ) )
            {
                return true;
            }
        }
        return false;
    },

    _isValidCell: function( row, column )
    {
        return row >= 0 && row < this._field.length &&
            column >= 0 && column < this._field[0].length;
    },

    _isMyPosition: function( row, column )
    {
        return row == this._myPosition.row && column == this._myPosition.column;
    },

    _isEmptySpaceBetween: function( position1, position2 )
    {
        if ( position1.row == position2.row )
        {
            var col1 = position1.column;
            var col2 = position2.column;
            for ( var i = Math.min( col1, col2 ) + 1; i < Math.max( col1, col2 ); ++i )
            {
                if ( !this.isEmpty( position1.row, i ) )
                {
                    return false;
                }
            }
            return true;
        }
        else if ( position1.column == position2.column )
        {
            var row1 = position1.row;
            var row2 = position2.row;
            for ( var i = Math.min( row1, row2 ) + 1; i < Math.max( row1, row2 ); ++i )
            {
                if ( !this.isEmpty( position1.column, i ) )
                {
                    return false;
                }
            }
            return true;
        }

        return false;
    }
};
