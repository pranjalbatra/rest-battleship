# rest-battleship

Implementation of RESTful APIs for the game 'BATTLESHIP' using Node.js and MongoDB.

Download or clone, and install the dependencies using `npm install`.

Start using `npm start`

Run tests using `npm run test`
(The complete game scenario is in the file test/full_game_test.js)

Note: Make sure `mongod` is running on your local machine, or use MongoDB Atlas.

Configure the .env file if required.

.env
```
PORT=5000
MONGO='mongodb://localhost/battleship'
```

Note: All APIs are post APIs

### API Endpoints

1. URL: /api/start  - Creates a new game session

2. URL: /api/placeShip - Places a single ship on the board. 
    REQUEST: {
      shipType: 'cruiser', // Contains ship type (battleship, cruiser, destroyer, submarine) - Not case sensitive
      square:'A1', // Contains square value ( A - J X 1 - 10 ) - Not case sensitive
      orientation:'vertical' // Must be either horizontal or vertical - Not case sensitive
    }
    
3. URL: /api/attack - To attack on the board. 
    REQUEST: {
      square:'J4'
    }

4. URL: /api/status - Returns an object containing grid info and individual ship status

5. URL: /api/renderGrid - Returns a string depicting the grid 
```
- C C C - ~ ~ ~ ~ ~
- - - - - ~ ~ ~ ~ ~
- - - ~ ~ ~ ~ ~ ~ ~
- B - ~ ~ ~ ~ ~ ~ ~
- B - ~ - - - - - ~
- B - ~ - S S S - ~
- B - ~ - - - - - ~
- - - ~ ~ ~ ~ ~ ~ ~
~ ~ ~ ~ ~ ~ ~ ~ ~ ~
~ ~ ~ ~ ~ ~ ~ ~ ~ ~
```

### Game Rules

There are two players in this game, Defender and Attacker.

The game is played with a fleet of the following ships: 1x Battleship, 2x Cruisers, 3x Destroyers
and 4x Submarines.

Ship Sizes:

Battleship: 4
Cruisers: 3
Destroyers: 2
Submarines: 3

Ships are placed on a game board. A game board is a 10x10 grid where each grid cell is
identified by unique coordinates. Each ship occupies a number of consecutive squares on the
grid, arranged either horizontally or vertically.

The number of squares for each ship is determined by the type of the ship. Ship placements
cannot overlap or be next to each other. Only one ship can occupy any given square in the grid.
Ships should have at least one square between them in all directions.

A defender must setup a game board and place all available ships on it. An attacker must then
find and destroy all ships on the board. After all ships have been placed by the Defender, the

Attacker will start to attack by announcing a target square in the grid to which it is going to
shoot. After the attacker has sunk all the ships placed by the defender, the game is over.
    



