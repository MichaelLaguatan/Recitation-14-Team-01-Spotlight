// *****************************************************
// <!-- Section 1 : Import Dependencies -->
// *****************************************************

const express = require('express'); // To build an application server or API
const app = express();
const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server
const bodyParser = require('body-parser');
const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.
const bcrypt = require('bcrypt'); //  To hash passwords
const axios = require('axios'); // To make HTTP requests from our server. We'll learn more about it in Part B.
const { queryResult } = require('pg-promise');

// *****************************************************
// <!-- Section 2 : Connect to DB -->
// *****************************************************

// database configuration
const dbConfig = {
  host: 'db', // the database server
  port: 5432, // the database port
  database: process.env.POSTGRES_DB, // the database name
  user: process.env.POSTGRES_USER, // the user account to connect with
  password: process.env.POSTGRES_PASSWORD, // the password of the user account
};

const db = pgp(dbConfig);

// test your database
db.connect()
  .then(obj => {
    console.log('Database connection successful'); // you can view this message in the docker compose logs
    obj.done(); // success, release the connection;
  })
  .catch(error => {
    console.log('ERROR:', error.message || error);
  });

// *****************************************************
// <!-- Section 3 : App Settings -->
// *****************************************************

app.set('view engine', 'ejs'); // set the view engine to EJS
app.use(bodyParser.json()); // specify the usage of JSON for parsing request body.

// initialize session variables
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
  })
);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);


// // Authentication Middleware.
// const auth = (req, res, next) => {
//   if (!req.session.user) {
//     // Default to login page.
//     return res.redirect('/login');
//   }
//   next();
// };

// // Authentication Required
// app.use(auth);









// *****************************************************
// <!-- Section 4 : API Routes -->
// *****************************************************

// TODO - Include your API routes here





// default rout

app.get('/', (req, res) => {
    res.redirect('/login');
});






// "register" page routs

app.get('/register', (req, res) => {
    res.render('pages/register');
});

// Register
app.post('/register', async (req, res) => {
    //hash the password using bcrypt library
    const hash = await bcrypt.hash(req.body.password, 10);
    
   
    // To-DO: Insert username and hashed password into 'users' table
    
    var password = hash;
    var username = req.body.username;

    var insert_data = `
    INSERT INTO users(username, password)
    VALUES ('${username}', '${password}');`;
`12++`
    db.any(insert_data)
    .then(data => {
        res.redirect('/login');
    })
    .catch(err => {
        console.log('Fs in the chat');
        console.log(err);
        res.redirect('/register');
    });
});



/*
  Intended Usage: 
  This function will give a table of videos that are tied by the users_to_videos table
  when given a username.
*/
function queryAccountVideos(username){
  var output;
  var query = `
  SELECT 
    videos.video_id, 
    videos.title, 
    videos.release, 
    videos.views, 
    videos.url  
  FROM users_to_videos 
  FULL JOIN videos 
  ON users_to_videos.video_id = videos.video_id 
  WHERE users_to_videos.username = '${username}';`
  db.any(query)
    .then(function(data){ 
      output = data; 
      return;
    })
    .catch(function(err){
      output = null;
      return console.log(err + " (Vincent did a goofy D:)");
    });
  return output;
}

/*
  Intended Usage:
  This function will give a table of all the video's tags when given a video_id.
*/
function queryVideoTags(video_id){
  var output;
  var query = `
  SELECT 
    tags.name, 
    tags.tag_id 
  FROM videos_to_tags 
  FULL JOIN tags 
  ON videos_to_tags.tag_id = tags.tag_id 
  WHERE videos_to_tags.video_id = '${video_id}';`
  db.any(query)
    .then(function(data){ 
      output = data; 
      return;
    })
    .catch(function(err){
      output = null;
      return console.log(err + " (Vincent did a goofy D:)");
    });
  return output;
}








// "login" page routs

app.get('/login', (req, res) => {
    res.render("pages/login");
});

app.post('/login', (req, res) => {

    var username = req.body.username;

    db.one(`SELECT * FROM users WHERE username='${username}' LIMIT 1;`)
    .then(async user => {
        // check if password from request matches with password in DB
        const match = await bcrypt.compare(req.body.password, user.password);

        if(match){
            req.session.user = user;
            req.session.save();
            res.redirect('/home');
        }else{
            //throw Error("Incorrect username or password");
            console.log("Incorrect username or password")
            res.redirect('/login');
        }
       

    })
    .catch(err => {
        console.log(err);
        res.redirect('/register');
    });
});
















// Authentication Middleware

const auth = (req, res, next) => {
  if (!req.session.user) {
    // Default to login page.
    return res.redirect('/login');
    
  }
  next();
};

// Authentication Required
app.use(auth);










// "home" page routs

app.get('/home', (req, res) => {
    res.render("pages/home");
});










// "pastVideos" page routs

app.get('/pastVideos', (req, res) => {
  res.render("pages/pastVideos");
});





// logout routs

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.render("pages/login", {
    message: 'logged out successfully',
  });
});

















// *****************************************************
// <!-- Section 5 : Start Server-->
// *****************************************************
// starting the server and keeping the connection open to listen for more requests
app.listen(3000);
console.log('Server is listening on port 3000');