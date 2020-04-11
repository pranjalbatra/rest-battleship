const Ship = require('./Ship')

class Cruiser extends Ship{
    constructor(){
        super()
        this._id = 'C';
        this._size = 3;
    }
}
module.exports = Cruiser