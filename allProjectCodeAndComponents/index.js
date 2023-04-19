const express = require('express'); // To build an application server or API
const app = express();

app.get('/welcome', (req, res) => {
  res.json({status: 'success', message: 'Welcome!'});
});


// // *****************************************************
// // <!-- Section 1 : Import Dependencies -->
// // *****************************************************

const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server
const bodyParser = require('body-parser');
const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.
const bcrypt = require('bcrypt'); //  To hash passwords
const axios = require('axios'); // To make HTTP requests from our server. We'll learn more about it in Part B.

// // *****************************************************
// // <!-- Section 2 : Connect to DB -->
// // *****************************************************

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

// // *****************************************************
// // <!-- Section 3 : App Settings -->
// // *****************************************************

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






// // "register" page routs

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
        res.redirect('/register');
    });
});













// "login" page routs

app.get('/login', (req, res) => {
    res.render("pages/login");
    //res.json({status: 'success', message: 'Logged in successfully'});
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
            console.log("Logged in successfully");
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

























// "home" page routs

app.get('/home', (req, res) => {
    res.render("pages/home");
});










// "pastVideos" page routs

app.get('/pastVideos', (req, res) => {
  res.render("pages/pastVideos");
});

// "profile" page routes
app.get('/profile', (req, res) => {
  res.render("pages/profile", {user: userData});
});

app.post('/usernameChange', (req, res) => {
  const username = req.body.username;
  const query = `update users set username = '${username}' where username = '${user.username}';`;
  db.any(query)
  .then(data => {
    userData.username = username;
    res.render("pages/profile", {message: 'username changed succesfully', user: userData});
  })
  .catch(err => {
    res.render("pages/profile", {message: 'username changed succesfully', user: userData});
  });
});

app.post('/passwordChange', async (req, res) => {
  const hash = await bcrypt.hash(req.body.newPassword, 10);
  const query = `update users set password = '${hash}' where username = '${userData.username}';`;
  db.any(query)
  .then(data => {
    res.render("pages/profile", {message: 'Password changed succesfully', user: userData});
  })
  .catch(err => {
    res.render("pages/profile", {message: 'Password changed failed', user: userData});
  });
});





// logout routs

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.render("pages/login", {
    message: 'logged out successfully',
  });
});








app.get('/welcome', (req, res) => {
  res.json({status: 'success', message: 'Welcome!'});
});


















// *****************************************************
// <!-- Section 5 : Start Server-->
// *****************************************************
// starting the server and keeping the connection open to listen for more requests
module.exports = app.listen(3000);
console.log('Server is listening on port 3000');