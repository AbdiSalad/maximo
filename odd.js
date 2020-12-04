const PORT = 9000;
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

const data = fs.readFileSync("./public/json/movie-data.json");
let movies = JSON.parse(data);

for (let i = 0; i < movies.length; i++) {
  movies[i].Ratings = [];
}

fs.writeFile(
  "./public/json/movie-data.json",
  JSON.stringify(movies, null, 2),
  finished
);

function finished(err) {
  console.log("all set");
}

// This is some file that was tweaking with the movie-data.json
