const expect = require('chai').expect;
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
chai.should();

const app = require('../app')


describe('Place a ship before initializing game', () => {
    it('should give an error message that game not initialized',(done) => {
        chai.request(app).post('/api/placeShip').send({ 
            "shipType":"cruiser",
            "square" : "A2",
            "orientation":"horizontal"
        }).end((err, res) => {
            expect(res.body.response).to.equal('Error: Game not initialized yet!');
            expect(res).to.have.status(400);
            done();
        })  
    })
})

describe('Start new game session', () => {
    it('should start a new game', (done) => {     
        chai.request(app).post('/api/start').end( (err, res) => {   
            expect(res.body.response).to.equal('New Game Session has started');
            expect(res).to.have.status(201);
            done();
        })    
    })
})

describe('Place a ship after initializing game', () => {
    it('should successfully place ship on the grid',(done) => {
        chai.request(app).post('/api/placeShip').send({ 
            "shipType":"battleship",
            "square" : "A2",
            "orientation":"horizontal"
        }).end((err, res) => {
            expect(res.body.response).to.equal('Placed a battleship at square A2!');
            expect(res).to.have.status(200);
            done();
        })  
    })
})

describe('Provide incorrect arguments for the request', () => {
    it('should give an error that invalid args. provides',(done) => {
        chai.request(app).post('/api/placeShip').send({ 
            "ship_type":"cruiser",
            "square":""
        }).end((err, res) => {
            expect(res.body.response).to.equal('Error: Invalid Arguments Supplied');
            expect(res).to.have.status(400);
            done();
        })  
    })
})

describe('Provide incorrect ship type', () => {
    it('should give an error that invalid ship type given',(done) => {
        chai.request(app).post('/api/placeShip').send({ 
            "shipType":"spaceship",
            "square":"B4",
            "orientation":"vertical"
        }).end((err, res) => {
            expect(res.body.response).to.equal('Error: Invalid Ship Type!');
            expect(res).to.have.status(400);
            done();
        })  
    })
})

describe('Provide incorrect orientation', () => {
    it('should give an error that invalid orientation given',(done) => {
        chai.request(app).post('/api/placeShip').send({ 
            "shipType":"cruiser",
            "square":"B4",
            "orientation":"Sideways"
        }).end((err, res) => {
            expect(res.body.response).to.equal('Error: Invalid Orientation!');
            expect(res).to.have.status(400);
            done();
        })  
    })
})

describe('Provide incorrect Square Value', () => {
    it('should give an error that invalid square value given',(done) => {
        chai.request(app).post('/api/placeShip').send({ 
            "shipType":"submarine",
            "square":"X11",
            "orientation":"vertical"
        }).end((err, res) => {
            expect(res.body.response).to.equal('Error: Invalid Square Value!');
            expect(res).to.have.status(400);
            done();
        })  
    })
})

describe('Try to place ship overlapping with previous ship', () => {
    it('should give an error that only one ship can occupy in a square',(done) => {
        chai.request(app).post('/api/placeShip').send({ 
            "shipType":"cruiser",
            "square" : "A4",
            "orientation":"horizontal"
        }).end((err, res) => {
            expect(res.body.response).to.equal('Error: Ship overlaps with another one, please choose a different space!');
            expect(res).to.have.status(400);
            done();
        })  
    })
})

describe('Place another battleship', () => {
    it('should give an error. Only one battleship can be used',(done) => {
        chai.request(app).post('/api/placeShip').send({ 
            "shipType":"battleship",
            "square" : "A2",
            "orientation":"horizontal"
        }).end((err, res) => {
            expect(res.body.response).to.equal('Error: You do not have any more battleships remaining!');
            expect(res).to.have.status(400);
            done();
        })  
    })
})

describe('Try to place ship adjacent to a previous ship', () => {
    it('should give an error that two ships must be one square apart in all directions',(done) => {
        chai.request(app).post('/api/placeShip').send({ 
            "shipType":"cruiser",
            "square" : "B2",
            "orientation":"horizontal"
        }).end((err, res) => {
            expect(res.body.response).to.equal('Error: Cannot place ship, must have one square distance between two ships!');
            expect(res).to.have.status(400);
            done();
        })  
    })
})

describe('Try to place ship that goes out of bound', () => {
    it('should give an error that ship will go out of bounds',(done) => {
        chai.request(app).post('/api/placeShip').send({ 
            "shipType":"cruiser",
            "square" : "A10",
            "orientation":"horizontal"
        }).end((err, res) => {
            expect(res.body.response).to.equal('Error: Cannot place ship at this position ,it goes out of bounds!');
            expect(res).to.have.status(400);
            done();
        })  
    })
})

describe('Try to attack before all the ships are placed', () => {
    it('should give an error that all ships need to be placed first',(done) => {
        chai.request(app).post('/api/attack').send({ 
            "square" : "A10"
        }).end((err, res) => {
            expect(res.body.response).to.equal('Error: All the Ships not placed yet!');
            expect(res).to.have.status(400);
            done();
        })  
    })
})



