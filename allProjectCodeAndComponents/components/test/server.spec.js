// Imports the index.js file to be tested.
const server = require('../index'); //TO-DO Make sure the path to your index.js is correctly added
// Importing libraries

// Chai HTTP provides an interface for live integration testing of the API's.
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
const {assert, expect} = chai;

describe('Server!', () => {
  // Sample test case given to test / endpoint.
  it('Returns the default welcome message', done => {
    chai
      .request(server)
      .get('/welcome')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equals('success');
        assert.strictEqual(res.body.message, 'Welcome!');
        done();
      });
  });


  

  // ===========================================================================
  // TO-DO: Part A Login unit test case

  //We are checking POST /add_user API by passing the user info in the correct order. This test case should pass and return a status 200 along with a "Success" message.
  //Positive cases

//test register to be able to test /login correctly later
it('positive : /register', done => {
  chai
    .request(server)
    .post('/register')
    .send({username: "John Doe", password: "coolPassword"})
    .end((err, res) => {
      expect(res).to.have.status(200);
      expect(res).to.redirect;
      done();
    });
});
//not able to register since it is the same username/primary key
it('negative : /register', done => {
chai
  .request(server)
  .post('/register')
  .send({username: "John Doe", password: "coolPassword"})
  .end((err, res) => {
    expect(res).to.have.status(200);
    expect(res).to.redirect;
    done();
  });
});

it('positive : /login', done => {
  chai
    .request(server)
    .post('/login')
    .send({username: "John Doe", password: "coolPassword"})
    .end((err, res) => {
      expect(res).to.have.status(200);
      expect(res).to.redirect;
      done();
    });
});

it('negative : /login', done => {
chai
  .request(server)
  .post('/login')
  .send({username: "John Doe", password: "badPassword"})
  .end((err, res) => {
    expect(res).to.have.status(200);
    expect(res).to.redirect;
    done();
  });
});




  










  
});