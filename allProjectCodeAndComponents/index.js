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




app.get('/test', (req, res) => {
  res.render("pages/test");
});


async function queryYoutube(query) {
  const API_KEY = 'AIzaSyAUIeq5EabysWpUAIREp5MdMfyydzVoiQk';
  const SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
  
  const params = {
    q: query,
    part: 'snippet',
    type: 'video',
    key: API_KEY,
};

const url = SEARCH_URL + '?' + new URLSearchParams(params);
let result;
await fetch(url)
    .then(response => response.json())
    .then(data => {
     result = data.items; 
    
    })
    .catch(error => console.error(error));
  return result; 
}

async function queryVimeo(query) {
  const accessToken = '6205e05dd3f7a3481af13e0de55e9025'; 
  const searchTerm = query;  // change this to your search term
  const clientId = 'YOUR_CLIENT_ID';
  const clientSecret = 'YOUR_CLIENT_SECRET';
  const apiUrl = `https://api.vimeo.com/videos?query=${searchTerm}`;
  const headers = {
    Authorization: `bearer ${accessToken}`
  };
  let ret; 
  await fetch(apiUrl, {
    method: 'GET',
    headers,
  })
    .then((response) => response.json())
    .then((data) => {
      ret = data.data; 
    })
    .catch((error) => {
      console.error(error);
    });
    return ret;
}

async function queryAllstandard(query) {

  var youtuberesult = await queryYoutube(query).then((res) => {return res}); 
  console.log(youtuberesult)
  var vimeoresults = await queryVimeo(query).then((res) => {return res}); 
  console.log(vimeoresults)
  var combined = []
  //{"title":"","description":"","platform":"","url":"","id":""}
  var count = 0; 
  for(let x =0; x< youtuberesult.length; x++) {
   let turl = "https://www.youtube.com/watch?v=" + youtuberesult[x].id.videoId
   combined.push({ 
       "title" : youtuberesult[x].snippet.title,
       "description": youtuberesult[x].snippet.description,
       "platform": "youtube",
       "url": turl, 
       "id": youtuberesult[x].id.videoId
   });
  }
  for(let y =0; y< vimeoresults.length; y++) {
   combined.push({ 
       "title" : vimeoresults[y].name,
       "description": vimeoresults[y].description,
       "platform": "vimeo",
       "url": vimeoresults[y].link, 
       "id": vimeoresults[y].uri
   });
  }
   return combined; 
}

 
app.get('/results', (req, res) => {
  // res.render('pages/results', { result });

  queryAllstandard('hi').then((result) => {
    console.log(result)
    res.render('pages/results', { result });

  })


  
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








// youtube works 

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