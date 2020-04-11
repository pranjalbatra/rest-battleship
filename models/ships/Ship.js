class Ship{
    constructor(){
       this._id = '';
       this._size = 0;
       this._squares = [];
       this._hits = []; // square where it's a hit
       this._status = 'pending'; // can be pending,active or sunk
    }

    addSquare(square){
        this._squares.push(square)
    }

    addHit(square){
        this._hits.push(square)
    }

    changeStatus(status){
        this._status = status;
    }


}
module.exports = Ship