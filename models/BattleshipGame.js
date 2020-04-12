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
    moves:{
        type:Number,
        default:0
    },
    misses:{
        type:Number,
        default:0
    },
    status:{
        type:String, // pending - while board is being set up,running - when board is set up,finished - when attacker wins
        default:'pending'
    }
})

class BattleshipGame{
    constructor() {
        this.ALL_SHIPS_PLACED = 0; // SET to 1 when all ships are placed
        this.TOTAL_MOVES = 0;
        this.TOTAL_MISSES = 0;
        this.GAME_OVER = 0;
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
                    _val:WATER,
                    _ship_type:'',
                    _ship_index:-1
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

    placeShip(shipType,square,orientation){
        // Check if all ships are placed already
        if(this.ALL_SHIPS_PLACED == 1){
            throw new Error('All the ships are already placed!');
        }
        //Check if all arguments are present
        if(!shipType || !square || !orientation){
            throw new Error('Invalid Arguments Supplied')
        }

        square = square.toUpperCase();
        shipType = shipType.toLowerCase();
        orientation = orientation.toLowerCase();

        switch(orientation){
            case 'horizontal':
            case 'vertical':
                break;
            default:
                throw new Error('Invalid Orientation!');
        }

        let coords = this.getCoords(square);

        let ship;
        switch(shipType){
            case 'battleship':
                ship = new Battleship();
                break;
            case 'cruiser':
                ship = new Cruiser();
                break;
            case 'destroyer':
                ship = new Destroyer();
                break;
            case 'submarine':
                ship = new Submarine();
                break;
            default:
                throw new Error('Invalid Ship Type!');
        }

        // Check if this ship type is remaining in fleet
        if(this.remaining_ships[shipType] == 0)
            throw new Error('You do not have any more '+shipType+'s remaining!');

        // 1st iteration (mode == 0) to check for any errors and abort, 
        //2nd iteration (mode == 1) to insert ship after no errors are found in the 1st

        for (var mode = 0 ; mode < 2; mode ++){
            for(var i = 0; i < ship._size; i++){
                var x = coords.i + ((orientation == 'vertical') ? i : 0 );
                var y = coords.j + ((orientation == 'horizontal') ? i : 0 );
                if(mode == 0){
                    // check if ship will go out of bounds
                    if(this.checkOutOfBounds(x,y) == 1){
                        throw new Error('Cannot place ship at this position ,it goes out of bounds!');
                    }
                    // now check if ship can be placed or not
                    if(this.grid[x][y]._val != WATER){
                        if(this.grid[x][y]._ship_type != '' && this.grid[x][y]._ship_index != -1){
                            throw new Error('Ship overlaps with another one, please choose a different space!');
                        }
                    }
                    // now check if space is blocked due to a nearby ship
                     if(this.grid[x][y]._val == BLOCKED){
                        throw new Error('Cannot place ship, must have one square distance between two ships!');
                    }
                }
                if(mode == 1){
                    //place the ship
                    this.grid[x][y]._val = ship._id;
                    this.grid[x][y]._ship_type = shipType;
                    this.grid[x][y]._ship_index = this.all_ships[shipType].length;
                    ship.addSquare(this.grid[x][y]._id);
                }
            }
            //Reduce remaining_ships, add this ship to all_ships and change ship status
            if(mode == 1){
                ship.changeStatus('active');
                //block one square space from all sides
                this.blockSquares(coords.i,coords.j,x,y);
                //add ship in list and reduce remaining count
                this.all_ships[shipType].push(ship);
                this.remaining_ships[shipType]--;
                // Check if all ships placed
                let rem = 0;
                var self = this;
                Object.keys(this.remaining_ships).map(function(key, index) {
                    if(self.remaining_ships[key] != 0){
                        rem++;
                    } 
                });
                if(rem == 0)
                    this.ALL_SHIPS_PLACED = 1;
            }
        }
        // Save to DB
        this.dbObj.ships = {};
        this.dbObj.grid = [];
        this.dbObj.ships = JSON.parse(JSON.stringify(this.all_ships));
        this.dbObj.grid = JSON.parse(JSON.stringify(this.grid));
        if(this.ALL_SHIPS_PLACED){
            this.dbObj.status = 'running';
        }
        this.dbObj.save();
        let resp = `Placed a ${shipType} at square ${square}!`;
        return resp;

    }

    blockSquares(i,j,x,y){
        for(var m = i - 1; m <= x + 1; m++){
            for(var n = j - 1 ; n <= y + 1; n++){
                if(this.checkOutOfBounds(m,n) == 0){
                    if(this.grid[m][n]._val == WATER){
                        this.grid[m][n]._val = BLOCKED
                    }
                }
            }
        }
    }

    getCoords(square){
        let letter = square[0];
        let num = letter.charCodeAt(0);
        let invalid = 0;
        if(num < 65 || num > 74){
            invalid = 1;
        }
        let number = square.slice(1);
        if(number < 1 || number > 10){
            invalid = 1;
        }
        let i = num - 65;
        let j = number - 1;
        if(invalid == 1){
            throw new Error('Invalid Square Value!');
        }else{
            return {i,j}
        }
    }

    checkOutOfBounds(i,j){
        let out = 0;
        if(typeof this.grid[i] == 'undefined'){
            out = 1;
            return out;
        }
        if(typeof this.grid[i][j] == 'undefined'){
            out = 1;
        }
        return out;
    }

    getStatus(){
        let ren = this.renderGrid()
        let obj = {
            grid:this.grid,
            grid_render:ren,
            ships:this.all_ships
        }
        return obj
    }

    attack(square){
        if(this.ALL_SHIPS_PLACED == 0)
            throw new Error('All the Ships not placed yet!')
        if(this.GAME_OVER == 1)
            throw new Error('Game has finished!')
        if(!square)
            throw new Error('Missing square value!')
        square = square.toUpperCase();
        let coords = this.getCoords(square);
        var output = '';
        this.TOTAL_MOVES++;
        let i = this.grid[coords.i][coords.j]._ship_index;
        let t = this.grid[coords.i][coords.j]._ship_type
        if(i != -1 && t != ''){
            // if already hit this spot
            if(this.grid[coords.i][coords.j]._val == HIT || this.grid[coords.i][coords.j]._val == SUNK){
                output = 'You have already attacked here!';
            }
            this.grid[coords.i][coords.j]._val = HIT;
            this.all_ships[t][i].addHit(square);
            // check if all hit then sink the ship
            let _hits = this.all_ships[t][i]._hits;
            let _squares = this.all_ships[t][i]._squares;
            let sunk = 1;
            for(let i = 0; i < _squares.length; i++){
                if(!_hits.includes(_squares[i])){
                    sunk = 0;
                    break;
                }
            }
            if(sunk == 1){
                this.all_ships[t][i].changeStatus('sunk');
                for(let i = 0; i < _squares.length; i++){
                    let co = this.getCoords(_squares[i]);
                    this.grid[co.i][co.j]._val = SUNK;
                }
                //Check if all ships have sunk
                let allSunk = 1;
                var self = this;
                Object.keys(this.all_ships).map(function(key, index) {
                    let arr = self.all_ships[key];
                    let len = arr.length; 
                    for(var i = 0; i < len; i++){
                        if(arr[i]._status != 'sunk'){
                            allSunk = 0;
                            break;
                        }
                    }
                });
                if(allSunk == 1){
                    this.GAME_OVER = 1; 
                    output = `Win! You have completed the game in ${this.TOTAL_MOVES} moves. You missed ${this.TOTAL_MISSES} shots.`
                }else{
                    output = `You just sank a ${t}`;
                }
            }else{
                output = `Hit`;
            }
        }else{
            this.TOTAL_MISSES++;
            output = `Miss`;
        }

        this.dbObj.ships = {};
        this.dbObj.grid = [];
        this.dbObj.ships = JSON.parse(JSON.stringify(this.all_ships));
        this.dbObj.grid = JSON.parse(JSON.stringify(this.grid));
        this.dbObj.moves = this.TOTAL_MOVES;
        this.dbObj.misses = this.TOTAL_MISSES;
        if(this.GAME_OVER){
            this.dbObj.status = 'finished';
        }
        this.dbObj.save();
        return output;
    }
}

const Game = mongoose.model('Game', gameSchema)

module.exports = BattleshipGame