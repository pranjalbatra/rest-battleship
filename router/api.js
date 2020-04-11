const express = require('express')
const Game = require('../models/BattleshipGame')
const ErrorHandler = require('../ErrorHandler')
const router = express.Router()

var game;

/*
* Create new game board of 10 X 10 Grid with squares ranging from A(1-10) - J(1-10)
*/

router.post('/api/start', (req, res) => {
    // Create a new game
    try {
        game = new Game();
        res.status(201).send({response:"New Game Session has started"})
    } catch (error) {
        const response = ErrorHandler.getErrorResponse(error)
        res.status(400).send({response})
    }
})

/*
* Render the grid 
*/
router.post('/api/renderGrid', (req, res) => {
    try {
        Game.gameValid(game)
        var response = game.renderGrid();
        res.status(200).send(response)
    } catch (error) {
        const response = ErrorHandler.getErrorResponse(error)
        res.status(400).send({response})
    }
})