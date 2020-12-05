const PORT = 3000;
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");
const fetch = require("node-fetch");
const app = express();
const session = require("express-session");
const bodyParser = require("body-parser");
const expressLayouts = require("express-ejs-layouts");
const { dir } = require("console");
//const popup = require('popups');

// Some function to the mind the most occuring element
function mode(array)
{
    if(array.length == 0)
        return null;
    var modeMap = {};
    var maxEl = array[0], maxCount = 1;
    for(var i = 0; i < array.length; i++)
    {
        var el = array[i];
        if(modeMap[el] == null)
            modeMap[el] = 1;
        else
            modeMap[el]++;  
        if(modeMap[el] > maxCount)
        {
            maxEl = el;
            maxCount = modeMap[el];
        }
    }
    return maxEl;
}

//Body parser converts data into JSON format
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connecing Database
var mongoose = require("mongoose");
const { stringify } = require("querystring");
mongoose.Promise = global.Promise;
mongoose.connect(
  "mongodb://localhost:27017/maximo",
  { useNewUrlParser: true },
  (err) => {
    if (!err) {
      console.log("MongoDB Connection Succeeded.");
    } else {
      console.log("Error in DB connection : " + err);
    }
  }
);

// Defining our schema
var userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  contributing_user: Boolean,
  following: [
    {
      type: String,
    },
  ],
  followers: [
    {
      type: String,
    },
  ],
  peopleFollowing: [
    {
      type: String,
    },
  ],
  comments: [
    {
      comment: String,
      id: String,
      title: String,
    },
  ],
  ratings: [
    {
      rating: String,
      id: String,
      title: String
    },
  ],
  notifications: [
    {
      message: String,
      username: String
    },
  ],
  genreLiked: [
    {
      type: String,
    }
  ]
});

// Creating Model
var User = mongoose.model("User", userSchema, "user");

function insertUser(req, res) {
  User.find({}, (err, data) => {
    let userExists = false;
    for (let i = 0; i < data.length; i++) {
      if (
        data[i].email.toUpperCase() === req.body.email.toUpperCase() ||
        data[i].username.toUpperCase() === req.body.username.toUpperCase()
      ) {
        userExists = true;
      }
    }

    if (!userExists) {
      try {
        var user = new User();
        user.username = req.body.username;
        user.email = req.body.email;
        user.password = req.body.password;
        user.contributing_user = false;
        user.followers = [];
        user.followers = [];
        user.peopleFollowing = [];
        user.comments = [];
        user.ratings = [];
        user.notifications = [];
        user.genreLiked = [];
        user.save();
        // If everything goes well. new user gets added to the array. we redirect
        // the user to the login page
        res.redirect("/Login");
      } catch {
        // If there is an error, we redirect the user back to the same page.
        res.redirect("/Register");
      }
    } else {
      res.redirect("/Register");
    }
  });
}

// An array to store user information
let userOnline = null; 
let userSearched = null;
let personSearched = null;

// People stuff. Populating it.
let people = [];
// get people from the people.json file
const peopleData = fs.readFileSync("./public/json/people.json");
let peopleDataReal = JSON.parse(peopleData)

for (let i = 0; i < peopleDataReal.length; i++) { 
  people.push(peopleDataReal[i])
}

const data = fs.readFileSync("./public/json/movie-data.json");
let movies = JSON.parse(data);
for (let i = 0; i < movies.length; i++) {
  let actors = movies[i].Actors.split(",");
  let directors = movies[i].Director.split(",");
  // let writers = movies[i].Writer.split(/[,]+/);

  for (let i = 0; i < actors.length; i++) {
    if (!people.includes(actors[i])) {
      people.push(actors[i]);
    }
  }

  for (let i = 0; i < directors.length; i++) {
    if (!people.includes(directors[i])) {
      people.push(directors[i]);
    }
  }
}



// Create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false });

// THINGS WE NEED
app.use(cors());
app.use(expressLayouts);
app.use(express.static("public"));
// app.use('/css', express.static(__dirname + 'public/css'));
app.set("views", path.join(__dirname, "views"));
app.set("sub-files", path.join(__dirname, "sub-fles"));

app.set("view engine", "ejs");
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

// This route does nothing
app.route("/").get((req, res) => {});

// LOGIN ROUTE
app
  .route("/Login")
  .get((req, res) => {
    if (userOnline != null) {
      res.redirect("/Profile");
    } else {
      res.sendFile(__dirname + "/public/index.html");
    }
  })
  .post(urlencodedParser, (req, res) => {
    // now, lets check if a username and password is in an the array of users.
    User.find({}, (err, users) => {
      let bool = false;
      try {
        for (let i = 0; i < users.length; i++) {
          if (
            users[i].password.toUpperCase() ===
              req.body.password.toUpperCase() &&
            users[i].username.toUpperCase() === req.body.username.toUpperCase()
          ) {
            userOnline = users[i];
            bool = true;
            res.redirect("/Profile");
            break;
          }
        }
        // if the password or username was wrong, we bring them back here
        if (bool === false) {
          res.redirect("/Login");
        }
      } catch {
        res.redirect("/Login");
      }
    });
  
  });
// REGISTER ROUTE
app
  .route("/Register")
  .get((req, res) => {
    res.render("sign-up");
  })
  .post(urlencodedParser, (req, res) => {
    insertUser(req, res);
  });

// RESET PASSWORD ROUTE
app.route("/Reset-Password").get((req, res) => {
  res.sendFile(__dirname + "/public/sub-files/forgot-pass.html");
});

// MOVIE ROUTE
app
  .route("/movies")
  .get((req, res) => {
    if (userOnline != null) {
      res.render("movies", {
        userOnline: userOnline,
        texter: req.query.texter,
        search: req.query.search,
      });
    } else {
      res.redirect("/Login");
    }
  })
  .post(urlencodedParser, (req, res) => {
    let title = req.body.Title;
    let actors = req.body.Actors.split(",");
    let genres = req.body.Genres;
    let languages = req.body.Languages;
    let runtime = req.body.Runtime;
    let releaseYear = req.body.releaseyear;
    let rated = req.body.Rated;
    let plot = req.body.Plot;
    let image = req.body.Image;
    let dir = req.body.dir;

    for (let i = 0; i < actors.length; i++) {
      if (!people.includes(actors[i])) {
        people.push(actors[i]);
      }
    }

    if (!people.includes(dir)) {
      people.push(dir);
    }

    // now we just add to the database

    let movieObject = {
      Actors: req.body.Actors,
      Title: req.body.Title,
      Genre: req.body.Genres,
      Language: req.body.Languages,
      Rated: req.body.Rated,
      Plot: req.body.Plot,
      Poster: req.body.Image,
      Runtime: req.body.Runtime,
      Year: req.body.releaseyear,
      Director: req.body.dir,
      Writer: "",
      Comments: [],
      Ratings: [],
    };

    movies.push(movieObject);

    fs.writeFile(
      "./public/json/movie-data.json",
      JSON.stringify(movies, null, 2),
      finished
    );
    res.redirect("/Profile");

    function finished(err) {}
  });

// UNIQUE MOVIE ROUTE
app.route("/movies/:").get((req, res) => {
  if (userOnline != null) {
    // now lets find the users most liked movie genre
    res.render("unique-movie", {
      userOnline: userOnline,
      movie_id: req.query.movie_id,
    });
  } else {
    res.redirect("/Login");
  }
});

// PEOPLE ROUTE
app
  .route("/People")
  .get((req, res) => {

    if (userOnline != null) {
      let bool = false;
      for (let i = 0; i < people.length; i++) { 
        if (people[i].toUpperCase() == req.query.search.toUpperCase()) { 
          bool = true;
          personSearched = people[i];
          if (userOnline.peopleFollowing.includes(personSearched)) {
            res.render("person", {
              follow: "unfollow",
              username: userOnline.username,
              name: personSearched,
            });
          } else { 
                      res.render("person", {
            follow: "follow",
            username: userOnline.username,
            name: personSearched,
          });
          }
        }
      }

      if (!bool) { 
        res.redirect("/Profile");
      }
    } else { 
      res.redirect("/Login");
    }

    // if (userOnline != null) {
    //   if (!people.includes(req.query.search)) {
    //     res.redirect("/Profile");
    //   } else {
    //     let index = people.indexOf(req.query.search);
    //     personSearched = req.query.search;
    //     if (userOnline.peopleFollowing.includes(req.query.search)) {
    //       res.render("person", {
    //         follow: "unfollow",
    //         username: userOnline.username,
    //         name: req.query.search,
    //       });
    //     } else {
    //       res.render("person", {
    //         follow: "follow",
    //         username: userOnline.username,
    //         name: req.query.search,
    //       });
    //     }
    //   }
    // } else {
    //   res.redirect("/Login");
    // }
  })
  .post(urlencodedParser, (req, res) => {
    if (req.body.follow === "follow") {
      userOnline.peopleFollowing.push(personSearched);
    } else {
      index = userOnline.peopleFollowing.indexOf(personSearched);
      userOnline.peopleFollowing.splice(index, 1);
    }

    userOnline.save();
    res.redirect("/Profile");
  });

// USERS ROUTE
app
  .route("/users")
  .get((req, res) => {
    if (userOnline != null) {
      if (req.query.hasOwnProperty('index')) { 
        userOnline.notifications.splice(req.query.index, 1);
        userOnline.save();
        userOnline = userOnline;
      }

      if (req.query.search == null) {
        res.redirect('/Profile')
      } else { 
              const usernameUpper = req.query.search.toUpperCase();
      
      

      if (req.query.search.toUpperCase() === userOnline.username.toUpperCase()) {
        res.redirect("/Profile");
      } else {
        User.find({}, (err, users) => {
          let bool = false;
          for (let i = 0; i < users.length; i++) {
            if (users[i].username.toUpperCase() === req.query.search.toUpperCase()) {
              userSearched = users[i];
              bool = true;
              if (userOnline.following.includes(users[i].username)) {
                res.render("user-view", {
                  follow: "unfollow",
                  username: userOnline.username,
                  foundUser: users[i],
                });
              } else {
                res.render("user-view", {
                  follow: "follow",
                  username: userOnline.username,
                  foundUser: users[i],
                });
              }
            }
          }
          if (bool === false) {
            res.redirect("/Profile");
          }
        });
      }
      }

    } else {
      res.redirect("/Login");
    }
  })
  .post(urlencodedParser, (req, res) => {
    if (req.body.follow === "follow") {
      userSearched.followers.push(userOnline.username);
      userSearched.notifications.push(
        {
          message: `You have just been followed by ${userOnline.username}`,
          username: `${userOnline.username}`
        }
      )
      userOnline.following.push(userSearched.username);
    } else {
      let index = userSearched.followers.indexOf(userOnline.username);
      userSearched.followers.splice(index, 1);

      index = userOnline.following.indexOf(userSearched.username);
      userOnline.following.splice(index, 1);
    }

    userSearched.save();
    userOnline.save();
    res.redirect("/Profile");
  });



app
  .route('/users/:')
  .get((req, res) => { 

    if (userOnline == null) {
      res.redirect('/Login')
    } else { 
      let userId = req.query.search;
    
      User.findOne({ _id: req.query.search }, (err, data) => { 
        if (err) {
          res.redirect('/Profile')
        } else { 

          res.render('real-user-view', {
            userOnline: userOnline,
            user: data,
          })
        }

      })
      }

  })
// PROFILE ROUTE
app
  .route("/Profile")
  .get((req, res) => {
    if (userOnline == null) {
      res.redirect("/Login");
    } else {
      // lets find the users more liked genre
      let favouriteGenre;
      if (userOnline.genreLiked.length === 0) {
        favouriteGenre = "$$$";
      } else { 
        // lets find the favourite genre.
        favouriteGenre = mode(userOnline.genreLiked);
      }
      if (!userOnline.contributing_user) {
        // We go to the normal user profile page
        res.render("normal-user", {
          userOnline: userOnline,
          favouriteGenre: favouriteGenre,
        });
      } else {
        // We go to the contributing user profile page
        res.render("contributing-user", {
            userOnline: userOnline,
            favouriteGenre: favouriteGenre,
          }
        );
      }
    }
  })
  .post(urlencodedParser, (req, res) => {
    if (req.body.contributing_user === "contributing_user") {
      userOnline.contributing_user = true;
    } else {
      userOnline.contributing_user = false;
    }

    userOnline.save();
    res.redirect("/Profile");
  });

// LOGOUT ROUTE
app.route("/Logout").get((req, res) => {
  if (userOnline != null) {
    userOnline = null;
    res.redirect("/Login");
  } else {
    res.redirect("/Login");
  }
});

app.route("/add-movie").get((req, res) => {
  if (userOnline === null) {
    res.redirect("/Login");
  } else {
    // that means the user is online
    if (!userOnline.contributing_user) {
      res.redirect("/Profile");
    } else {
      res.render("movie-add", userOnline);
    }
  }
});

app
  .route("/add-person")
  .get((req, res) => {
    if (userOnline === null) {
      res.redirect("/Login");
    } else {
      // that means the user is online
      if (!userOnline.contributing_user) {
        res.redirect("/Profile");
      } else {
        res.render("person-add", userOnline);
      }
    }
  })
  .post(urlencodedParser, (req, res) => {
    if (!people.includes(req.body.name)) {
      people.push(req.body.name);

      // lets add the person to the json file as well.
      peopleDataReal.push(req.body.name);

      fs.writeFile(
        "./public/json/people.json",
        JSON.stringify(peopleDataReal, null, 2),
        finished
      );
      res.redirect("/Profile");
      
      function finished(err) { }
    } else { 
      res.redirect("/Profile");
    }
    
  });

app.route("/add-comment").post(urlencodedParser, (req, res) => {
  let comment = req.body.comment;
  let movieId = req.body.id;
  let movieTitle = req.body.title;

  let commentObj = {
    id: movieId,
    comment: comment,
    title: movieTitle,
  };

  userOnline.comments.push(commentObj);
  userOnline.save();


  for (let i = 0; i < userOnline.followers.length; i++) { 
    // lets find the user.
    User.find({ username: userOnline.followers[i] }, (err, user) => {

      let notificationObj = {
        message: `${userOnline.username} commented on a movie`,
        username: `${userOnline.username}`
      }
      let fakeUser = user[i];

      fakeUser.notifications.push(notificationObj )

      fakeUser.save();

    });
  }

  movies[movieId].Comments.push(req.body.comment); // We added a comment to this movie

  fs.writeFile(
    "./public/json/movie-data.json",
    JSON.stringify(movies, null, 2),
    finished
  );
  res.redirect("/Profile");

  function finished(err) {}
});

app.route("/rating").post(urlencodedParser, (req, res) => {
  let rating = req.body.rating;
  let movieId = req.body.id;
  let title = req.body.title;

  ratingObj = {
    rating: rating,
    id: movieId,
    title: title,
  };
  
  userOnline.ratings.push(ratingObj);
  if (rating >= 4) { 
    let movieObj = movies[movieId];
    let genres = movieObj.Genre.split(',');
    for (let i = 0; i < genres.length; i++) { 
      userOnline.genreLiked.push(genres[i])
    }
  }
  userOnline.save();


  for (let i = 0; i < userOnline.followers.length; i++) { 
    // lets find the user.
    User.find({ username: userOnline.followers[i] }, (err, user) => {

      let notificationObj = {
        message: `${userOnline.username} added a movie rating`,
        username: `${userOnline.username}`
      }
      let fakeUser = user[i];

      fakeUser.notifications.push(notificationObj )

      fakeUser.save();

    });
  }
  // Lets add the rating to the movie ratings
  movies[movieId].Ratings.push(req.body.rating); // We added a comment to this movie

  fs.writeFile(
    "./public/json/movie-data.json",
    JSON.stringify(movies, null, 2),
    finished
  );
  res.redirect("/Profile");

  function finished(err) {}
});
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
