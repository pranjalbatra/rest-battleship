const WATER = '~';
const HIT = '0';
const BLOCKED = '-';
const SUNK = 'X';

const mongoose = require('mongoose')

const gameSchema = mongoose.Schema({
    grid:[{
        type: mongoose.Schema.Types.Mixed,
        required:true
    }],
    status:{
        type:String, // pending,running,default
        default:'pending'
    }
})


class BattleshipGame{
    constructor() {
        this.grid = [];
        this.initGrid();
        // Save to DB
        let obj = {
            grid:this.grid,
            ships:this.all_ships
        }
        this.dbObj = new Game(obj);
        this.dbObj.save();
    }

    initGrid(){
        for(var i = 0; i < 10 ; i++){
            this.grid[i] = [];
            for(var j = 0; j < 10 ; j++){
                this.grid[i][j] = {
                    _id:String.fromCharCode(65+i)+(j+1),
                    _val:WATER
                }
            }
        }
    }

    renderGrid(){
        let str = '';
        for(var i = 0; i < 10; i++){
            for(var j = 0; j < 10; j++){
                str += ` ${this.grid[i][j]._val} `;
            }
            str +='\n';
        }
        return str;
    }
}

const Game = mongoose.model('Game', gameSchema)

module.exports = BattleshipGame