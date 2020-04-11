const Ship = require('./Ship')

class Destroyer extends Ship{
    constructor(){
        super()
        this._id = 'D';
        this._size = 2;
    }
}
module.exports = Destroyer