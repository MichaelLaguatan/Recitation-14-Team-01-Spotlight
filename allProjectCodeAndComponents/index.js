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
const json = require('body-parser/lib/types/json');






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

const userData = {
  username: "placeholder"
}

// *****************************************************
// <!-- Section 4 : Authentication Middleware -->
// *****************************************************
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
// <!-- Section 5 : API Routes -->
// *****************************************************


//starting redirect
// add async after '/', before (req, res) when modifying the tags
app.get('/',  async (req, res) => { 
  // res.render('pages/welcome', {page_name:"welcome"});
  try {
    var loggedIn = req.session.user;
    var tags = await allTags();
    console.log("Successfully fetched tags");
    res.render('pages/welcome', { tags, page_name:"welcome", loggedIn });
  } catch (error) {
    console.log('There was an error fetching tags');
    console.log(error);
  }
});

app.get('/welcome', (req,res)=>
{
  res.redirect('/');
})

// "register" page routes
app.get('/register', (req, res) => {
    var loggedIn = req.session.user;
    res.render('pages/register',{page_name:"register", loggedIn,page_name:"login"});
});

// Register
app.post('/register', async (req, res) => {
    const hash = await bcrypt.hash(req.body.password, 10);
    var password = hash;
    var username = req.body.username;
    var loggedIn = req.session.user;
    var insert_data = `
    INSERT INTO users(username, password)
    VALUES ('${username}', '${password}');`;
`12++`
    db.any(insert_data)
    .then(data => {
        res.redirect('/login');
    })
    .catch(err => {
        console.log('Registration failed');
        console.log(err);
        res.render('pages/register.ejs', {loggedIn, message: 'An account with that username already exists.', page_name:'register'});

//         res.render("pages/login.ejs", {
// message: 'Wrong password, please try again',
//         });
    });
});

/*
  Intended Usage: 
  This function will give a table of videos that are tied by the users_to_videos table
  when given a username.
*/
async function queryAccountVideos(username){
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
  return await db.any(query)
    .then(function(data){
      return data;

    })
    .catch(function(err){
      return console.log(err + " (Vincent did a goofy D:)");
    });
}

/*
  Intended Usage:
  This function will give a json file of all the video's tags when given a video_id.
*/
async function queryVideoTags(video_id){
  var query = `
  SELECT 
    tags.name, 
    tags.tag_id 
  FROM videos_to_tags 
  FULL JOIN tags 
  ON videos_to_tags.tag_id = tags.tag_id 
  WHERE videos_to_tags.video_id = '${video_id}';`
  return await db.any(query)
    .then(function(data){
      return data;
    })
    .catch(function(err){
      return console.log(err + " (Vincent did a goofy on queryVideoTags D:)");
    });
}

/*
  Intended Usage:
  This function will give a json file of all the tags that exist in the database.
*/
async function allTags() {
  try {
    const query = 'SELECT tags.tag FROM tags ORDER BY tag ASC;';
    const data = await db.any(query);
    return data.map(tags => tags.tag); // Modify the returned data as needed
  } catch (err) {
    console.log(err + " (Vincent did a goofy on allTags D:)");
    throw err;
  }
}

/*
  Intended Usage:
  This function will give a json file of all the videos (all columns of the videos table) 
  in the database that have a tag matching the input.
*/
async function queryByTags(tag){
  var query = `
  SELECT 
    videos.*
  FROM videos
  FULL JOIN videos_to_tags
  ON videos.video_id = videos_to_tags.video_id
  FULL JOIN tags
  ON videos_to_tags.tag_id = tags.tag_id
  WHERE tags.tag_id = '${tag}';`
  return await db.any(query)
    .then(function(data){
      return data;
    })
    .catch(function(err){
      return console.log(err + " (Vincent did a goofy on queryByTags D:)");
    });
}

/*
  Intended Usage:
  This function will add to the table "videos" a set of inputted data.
  Said data is (string, int, string, string)
  Furthermore, this will return the video's id.
*/
function addVideo(title, platform, description, link){
  var movie_id = 0;
  var videoQuery = `INSERT INTO videos (title, platform, description, link) VALUES ('${title}', '${platform}', '${description}', '${link}') RETURNING *;`;
  db.any(videoQuery)
  .then(function(data){
    movie_id = data[0].video_id;
    var userQuery = `INSERT INTO users_to_videos (username, movie_id) VALUES ('${userData.username}', ${movie_id}) RETURNING *;`;
    db.any(userQuery)
    .then(function(data){
      return;
    })
    .catch(function(err){
      return console.log(err);
    });
  })
  .catch(function(err){
    return console.log(err + " (Vincent did a goofy on addVideo D:)");
  });
}
/*
  Intended Usage:
  This function will add to both the tables "videos_to_tags" and "tags" a set of inputted data.
  Update: The function will query "tags" before insertting, and if the tag already exists, simple associate the video with that tag.
*/
async function addTag(tag, video_id){
  console.log("Received video_id: " + video_id);
  var existingQuery = `SELECT tag_id FROM tags WHERE tag = $1;`
  var secondQuery = `INSERT INTO videos_to_tags (video_id, tag_id) VALUES ($1, $2);`
  db.any(existingQuery, [tag])
    .then(function(data){
      if(data[0] == null)
      {
        console.log("tag_id for " + [tag] + " doesn't exist");
        var query = `INSERT INTO tags (tag) VALUES ($1) RETURNING *;`
        db.any(query, [tag])
          .then(function(data){      
            db.any(secondQuery, [video_id, data[0].tag_id])
              .then(function(){
                return;
              })
              .catch(function(err){
                return console.log(err + " (addTag secondQuery)");
              });      
          })
          .catch(function(err){
            return console.log(err + " (addTag query)");
          });
      }
      else
      {
        console.log( tag + " exists with the id: " + data[0].tag_id);
        db.any(secondQuery, [video_id, data[0].tag_id])
          .then(function(){
            return;
          })
          .catch(function(err){
            return console.log(err + " (addTag secondQuery)");
          });
      }
    })
    .catch(function(err){
      return console.log(err + " (addTag existingQuery)");
    })


  
}


/*
  Intended Usage:
  For personal purposes, this function lets Vincent test if the add functions work where they'll later manually test the SQL to see if those work.
  docker exec -it allprojectcodeandcomponents-db-1 psql -U postgres
  because of how the code works, the front end will need to use async/await on these function calls if they care about the output of the function.
*/
async function testAdd(){
  //either of the following implementations work.
  
  //this one may be better for the style of "video page" and "add tag" feature we were talking about
  //var receivedId = await addVideo("Best Video Ever", 0, "Shoutouts to my 2 subscribers", "https://bestvideoever.com");
  addTag("Comedy", 0);

  //this one is better if we know the tag ahead of time and just want to automagically tag stuff based on API dev's work.
  //addTag("Tragedy", await addVideo("Worst Video Ever", 1, "How do I have 1,000,000 subscribers?", "https://worstvideoever.com"));

  
  addTag("Tragedy", 1);
  addTag("Action", 2);
  addTag("Drama", 3);
  addTag("Sci-Fi", 4);
  addTag("Adventure", 5);
  addTag("Fantasy", 6);
  addTag("Crime", 7);
  addTag("Mystery", 8);
  addTag("Romance", 9);
  addTag("Horror", 10);
  addTag("Animation", 11);
  addTag("Family", 12);
  addTag("Thriller", 13);
  addTag("History", 14);
  addTag("Biography", 15);
  addTag("Musical", 16);
  addTag("Music", 17);
  addTag("Sport", 18);
  addTag("War", 19);
  addTag("Western", 20);
  addTag("Documentary", 21);
  addTag("Short", 22);
  addTag("Experimental", 23);
  addTag("Independent", 24);
  addTag("Foreign", 25);
  addTag("Silent", 26);
  addTag("Classic", 27);
  addTag("Superhero", 28)
}

app.get('/test', (req, res)=> {
  testAdd();
  loggedIn = req.session.user;
  res.redirect('/');
  // result = "scary";
  // req.body.q = "scary";
  // queryAllstandard(req.body.q).then((result) => {
  //   lastSearch = result;
  //   res.render('pages/home', {loggedIn, result,page_name:"home",query:req.body.q});
  // });
  
});

app.get('/redtest', (req, res)=> {
  res.redner('pages/home', { page_name:"home",query:req.body.q});
});
// "login" page routes
app.get('/login', (req, res) => {
    var loggedIn = req.session.user;
    res.render("pages/login",{page_name:"login", loggedIn});
    //res.json({status: 'success', message: 'Logged in successfully'});
});

app.post('/login', (req, res) => {
    var username = req.body.username;
    var loggedIn = req.session.user;
    db.one(`SELECT * FROM users WHERE username='${username}' LIMIT 1;`)
    .then(async user => {
        // check if password from request matches with password in DB
        const match = await bcrypt.compare(req.body.password, user.password);

        if(match){
            req.session.user = user;
            userData.username = username;
            req.session.save();
            res.redirect('/');
            console.log('User Login Successful')
        }else{
            //throw Error("Incorrect username or password");
            console.log("Incorrect username or password")
            res.render("pages/login", { 
              loggedIn, message: 'Incorrect username or password, please try again', page_name:"login"
            });
        }
       

    })
    .catch(err => {
        console.log(err);
        res.render("pages/register.ejs", {loggedIn, 
          message: 'User does not exist.', page_name: "register"

        });
    });
});

app.get('/test', (req, res) => {
  res.render("pages/test",{page_name:"test"});
});

//returns a promise to the data that youtube returns must use async for this one 
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
//returns a promise to the data that vimeo returns must use async for this one 
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
// returns all data from all websites in a standard form as seen below 
//{"title":"","description":"","platform":"","url":"","id":""}
async function queryAllstandard(query) {

  var youtuberesult = await queryYoutube(query).then((res) => {return res}); 
  var vimeoresults = await queryVimeo(query).then((res) => {return res}); 
  var combined = []
  

  if(youtuberesult) {
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
  }
  if(vimeoresults) {
    for(let y =0; y< vimeoresults.length; y++) {
    combined.push({ 
        "title" : vimeoresults[y].name,
        "description": vimeoresults[y].description,
        "platform": "vimeo",
        "url": vimeoresults[y].link, 
        "id": vimeoresults[y].uri
    });
    }
  }
   return combined; 
}
// youtube works 

// "home" page routs
app.post('/home', (req, res) => {
  var loggedIn = req.session.user;
  if(req.body.q != undefined && req.body.q != "" && req.body.q != " ") {
    queryAllstandard(req.body.q).then((result) => {
      lastSearch = result;
      res.render('pages/home', {loggedIn, result,page_name:"home",query:req.body.q});
    })
  } else {
    console.log("not defined")
    let result = lastSearch; 
    res.render('pages/home', {loggedIn, result, page_name:"home",query:req.body.q});
  }



});
app.get('/home', (req, res) => {
  var loggedIn = req.session.user;
  let result = []; 
    res.render("pages/home.ejs",{loggedIn, result,page_name:"home",query:"" });
});

app.post('/details', (req, res) => {
  let result = JSON.parse(req.body.b);
  const query = `SELECT * FROM videos WHERE videos.title = '${result.title}' LIMIT 1;`;
  var loggedIn = req.session.user;
  db.one(query)
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
  if (result.platform == 'youtube')
  {
    console.log("Reached this point {YOUTUBE}, havent crashed");
    addVideo(result.title, 1, result.description, result.url);
  } else if (result.platform == 'vimeo') {
    console.log("Reached this point {VIMEO}, havent crashed");
    addVideo(result.title, 2, result.description, result.url);
  }
  });

  res.render('pages/details', {loggedIn, result,page_name:"details" });
})

// "profile" page routes
app.get('/profile', (req, res) => {

  const loggedIn = req.session.user;
  if(!loggedIn) 
  {
    res.render('pages/login', {loggedIn, message: 'You are not logged in.', page_name:"login"});
  }
  else
  {
    res.render("pages/profile", {loggedIn, user: userData,page_name:"profile"});
  }
   

});

app.post('/usernameChange', (req, res) => {
  const username = req.body.username;
  const query = `update users set username = '${username}' where username = '${userData.username}';`;
  db.any(query)
  .then(data => {
    userData.username = username;
    res.render("pages/profile", {message: 'username changed succesfully', user: userData,page_name:"profile"});
  })
  .catch(err => {
    res.render("pages/profile", {message: 'username change failed', user: userData,page_name:"profile"});
  });
});

app.post('/passwordChange', async (req, res) => {
  const hash = await bcrypt.hash(req.body.newPassword, 10);
  const query = `update users set password = '${hash}' where username = '${userData.username}';`;
  db.any(query)
  .then(data => {
    res.render("pages/profile", {message: 'Password changed succesfully', user: userData,page_name:"profile"});
  })
  .catch(err => {
    res.render("pages/profile", {message: 'Password changed failed', user: userData,page_name:"profile"});
  });
});

// logout routes
app.get("/logout", (req, res) => {

  if(req.session.user)
  {
    var loggedIn = req.session.user;
    console.log("User logged out successfully")
    req.session.destroy();
    res.render("pages/login.ejs", {
      message: 'logged out successfully',
      page_name:"login",
      loggedIn
    });
  }
  else
  {
    res.render('pages/login', {loggedIn, message: 'You are not logged in.', 
    page_name:"login"});
  }

});

//PastVideos routes
app.get('/pastVideos', (req, res) => {

  var query = `SELECT * FROM videos FULL JOIN users_to_videos 
  ON users_to_videos.movie_id = videos.video_id 
  WHERE users_to_videos.username = '${userData.username}';`;
  db.any(query)
    .then((videos) => {
      res.render('pages/pastVideos', {videos, page_name:"history"});
    })
    .catch((err) =>{
      res.render('pages/pastVideos', {videos: [], page_name:"history"});
  });
});



//Lab11 unit testing route
app.get('/welcometest', (req, res) => {
  res.json({status: 'success', message: 'Welcome!'});
});

// *****************************************************
// <!-- Section 6 : Start Server-->
// *****************************************************
// starting the server and keeping the connection open to listen for more requests
module.exports = app.listen(3000);
console.log('Server is listening on port 3000');
