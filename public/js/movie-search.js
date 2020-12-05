// Variables
let frm = document.getElementById("search-theme-form");

var button = document.getElementById('maximo-button');
button.onclick = function() {
  location.assign('/Login');
}



// These functions just change the dropdowns text.
const changeToTitle = () => {
  $("#dropdown-button").text("Title");
  $("#texter").val("Title");
  frm.action = "/movies";
};
const changeToGenre = () => {
  $("#dropdown-button").text("Genre");
  $("#texter").val("Genre");
  frm.action = "/movies";
};
const changeToYear = () => {
  $("#dropdown-button").text("Year");
  $("#texter").val("Year");
  frm.action = "/movies";
};
const changeToMinRating = () => {
  $("#dropdown-button").text("Minrating (0-5)");
  $("#texter").val("MinRating");
  frm.action = "/movies";
};

const changeToPeople = () => {
  $("#dropdown-button").text("People");
  $("#texter").val("People");
  frm.action = "/people";
};

const changeToUsers = () => {
  $("#dropdown-button").text("Users");
  $("#texter").val("Users");
  frm.action = "/users";
};

const changeToHome = () => {
  frm.action = "/Login";
}

