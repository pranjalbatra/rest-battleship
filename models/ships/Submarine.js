const Ship = require('./Ship')

class Submarine extends Ship{
    constructor(){
        super()
        this._id = 'S';
        this._size = 3;
    }
}
module.exports = Submarine