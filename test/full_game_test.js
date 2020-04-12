const expect = require('chai').expect;
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
chai.should();

const app = require('../app')


describe('Start new game session', () => {
    it('should start a new game', (done) => {     
        chai.request(app).post('/api/start').end( (err, res) => {   
            expect(res.body.response).to.equal('New Game Session has started');
            expect(res).to.have.status(201);
            done();
        })    
    })
})

var placeShipRequests = [
    {	
        "shipType":"battleship",
        "square" : "B1",
        "orientation":"horizontal"
    },
    
    {	
        "shipType":"cruiser",
        "square" : "B7",
        "orientation":"vertical"
    },
    
    {	
        "shipType":"cruiser",
        "square" : "C10",
        "orientation":"vertical"
    },
    
    {	
        "shipType":"destroyer",
        "square" : "J4",
        "orientation":"horizontal"
    },
    
    {	
        "shipType":"destroyer",
        "square" : "D2",
        "orientation":"horizontal"
    },
    
    {	
        "shipType":"destroyer",
        "square" : "D5",
        "orientation":"vertical"
    },
    
    {	
        "shipType":"submarine",
        "square" : "F1",
        "orientation":"vertical"
    },
    
    {	
        "shipType":"submarine",
        "square" : "G6",
        "orientation":"horizontal"
    },
    
    {	
        "shipType":"submarine",
        "square" : "J8",
        "orientation":"horizontal"
    },
    
    {	
        "shipType":"submarine",
        "square" : "F3",
        "orientation":"vertical"
    }
]

var attackRequests = [
    {	
        "square" : "F3"
    },
    {	
        "square" : "F2"
    },
    {	
        "square" : "F1"
    },
    {	
        "square" : "J3"
    },
    {	
        "square" : "G1"
    },
    {	
        "square" : "H1"
    },
    {	
        "square" : "G3"
    },
    {	
        "square" : "H3"
    },
    {	
        "square" : "B4"
    },
    {	
        "square" : "B5"
    },
    {	
        "square" : "B3"
    },
    {	
        "square" : "B2"
    },
    {	
        "square" : "B1"
    },
    {	
        "square" : "J10"
    },
    {	
        "square" : "J9"
    },
    {	
        "square" : "J8"
    },
    {	
        "square" : "D2"
    },
    {	
        "square" : "D3"
    },
    {	
        "square" : "J5"
    },
    {	
        "square" : "J6"
    },
    {	
        "square" : "J4"
    },
    {	
        "square" : "B6"
    },
    {	
        "square" : "B5"
    },
    {	
        "square" : "B7"
    },
    {	
        "square" : "C7"
    },
    {	
        "square" : "D7"
    },
    {	
        "square" : "D5"
    },
    {	
        "square" : "E5"
    },
    {	
        "square" : "C10"
    },
    {	
        "square" : "D10"
    },
    {	
        "square" : "E10"
    },
    {	
        "square" : "G5"
    },
    {	
        "square" : "G6"
    },
    {	
        "square" : "G7"
    },
    {	
        "square" : "G8"
    }
]

function placeShip(i){
    if(i < placeShipRequests.length){
        describe('Place ship', () => {
            it('should place the ship', (done) => {  
                chai.request(app).post('/api/placeShip').send(placeShipRequests[i]).end((err, res) => {
                    if(i == placeShipRequests.length - 1){
                        done()
                        attack(0);
                    }else{
                        done()
                        placeShip(++i);
                    }
                })  
            })
        })
    }
}
function attack(i){
    if(i < attackRequests.length){
        describe('Attack', () => {
            it('should attack', (done) => {  
                chai.request(app).post('/api/attack').send(attackRequests[i]).end((err, res) => {
                    console.log(res.body.response)
                    if(i == attackRequests.length - 1){
                        done()
                        expect(res.body.response).to.equal('Win! You have completed the game in 35 moves. You missed 7 shots.');
                    }else{
                        done()
                        attack(++i);
                    }
                })  
            })
        })
    }
}
placeShip(0);
