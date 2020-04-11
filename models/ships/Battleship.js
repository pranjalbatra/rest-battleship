const Ship = require('./Ship')

class Battleship extends Ship{
    constructor(){
        super()
        this._id = 'B';
        this._size = 4;
    }
}
module.exports = Battleship