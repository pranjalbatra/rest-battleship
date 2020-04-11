const WATER = '~';
const HIT = '0';
const BLOCKED = '-';
const SUNK = 'X';

const Battleship = require('../models/ships/Battleship')
const Cruiser = require('../models/ships/Cruiser')
const Destroyer = require('../models/ships/Destroyer')
const Submarine = require('../models/ships/Submarine')

const mongoose = require('mongoose')

const gameSchema = mongoose.Schema({
    grid:[{
        type: mongoose.Schema.Types.Mixed,
        required:true
    }],
    ships:{
        type: mongoose.Schema.Types.Mixed
    },
    status:{
        type:String, // pending,running,default
        default:'pending'
    }
})

class BattleshipGame{
    constructor() {
        this.grid = [];
        this.initGrid();
        this.initGrid();
        this.all_ships = {
            battleship:[],
            cruiser:[],
            destroyer:[],
            submarine:[]
        }
        this.remaining_ships = {
            battleship:1,
            cruiser:2,
            destroyer:3,
            submarine:4
        }
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

    static gameValid(game){
        if(!game)
            throw new Error('Game not initialized yet!')
    }
}

const Game = mongoose.model('Game', gameSchema)

module.exports = BattleshipGame