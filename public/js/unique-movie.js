let movie_id = $("#unique-movie-thing").html();

/**
 * @description determine if an array contains one or more items from another array.
 * @param {array} haystack the array to search.
 * @param {array} arr the array providing items to check for in the haystack.
 * @return {boolean} true|false if haystack contains at least one item from arr.
 */
const findOne = function (haystack, arr) {
  return arr.some(function (v) {
    return haystack.indexOf(v) >= 0;
  });
};
// returns random values in an array
function getRandom(arr, n) {
  var result = new Array(n),
    len = arr.length,
    taken = new Array(len);
  if (n > len)
    throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
    var x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}

const addRelatedMovied = (arr) => {
  let outputVariable = "";
  let smallerSimilarMovies;
  if (arr.length == 1) {
    smallerSimilarMovies = getRandom(arr, 1);
  } else if (arr.length == 2) {
    smallerSimilarMovies = getRandom(arr, 2);
  } else if (arr.length == 3) {
    smallerSimilarMovies = getRandom(arr, 3);
  } else if (arr.length == 4) {
    smallerSimilarMovies = getRandom(arr, 4);
  } else if (arr.length == 5) {
    smallerSimilarMovies = getRandom(arr, 5);
  } else {
    smallerSimilarMovies = getRandom(arr, 6);
  }

  for (let i = 0; i < smallerSimilarMovies.length; i++) {
    outputVariable += `<div class="col-md-2">
        <img src="${smallerSimilarMovies[i].data.Poster}">
                            <form action="/movies/:">
                      <input type="text" id="movie_id" name="movie_id" value="${smallerSimilarMovies[i].index}">
                      <button class="btn btn-info" role="button" href="#">
                        Go
                      </button>
                    </form>
      </div>`;
  }

  return outputVariable;
};

// We do some fetch request.
fetch(`../json/movie-data.json`)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    let desiredObject = data[movie_id];
    let genres = desiredObject.Actors.split(",");
    let similarMovies = [];
    for (let i = 0; i < data.length; i++) {
      let genresOf = data[i].Actors.split(",");
      // let directorOf = data[i].Director;
      // let writersOf = data[i].Writer.split(",");
      // test for genres
      if (findOne(genresOf, genres)) {
        if (desiredObject != data[i])
          similarMovies.push({
            data: data[i],
            index: i,
          });
      }
    }
    let outputVariable = "";
    if (similarMovies.length > 0) {
      outputVariable = addRelatedMovied(similarMovies);
    } else {
      outputVariable += '<p class="text-muted">No related movies<p>';
    }

    let output = "";
    let comments = "";
    let rating;

    // Add to the comments
    // if (comments.length < 1) {
    //   comments += '<h3>Be the first to comment now!</h3>'
    // } else { 
    //   for (let i = 0; i < desiredObject.Comments.length; i++) {
    //     comments += "<p>";
    //     comments += desiredObject.Comments[i];
    //     comments += "</p>";
    //   }
    // }
    for (let i = 0; i < desiredObject.Comments.length; i++) {
      comments += "<p>";
      comments += desiredObject.Comments[i];
      comments += "</p>";
    }
  

    if (desiredObject.Ratings.length < 1) {
      rating = 0;
    } else {
      // get the average rating
      let ratingSum = 0;
      for (let i = 0; i < desiredObject.Ratings.length; i++) {
        ratingSum += parseInt(desiredObject.Ratings[i]);
      }

      rating = ratingSum / desiredObject.Ratings.length;
    }

    // Now lets do some cool stuff. lets set up routes for that director, actors, ratings
    let directorNew = desiredObject.Director.split(',');
    let actorsNew = desiredObject.Actors.split(',');
    let genresNew = desiredObject.Genre.split(',');

    
    


    // For directors
    let directorHtml = '<div>';
    directorHtml += `  <a class="btn btn-primary" data-toggle="collapse" href="#collapseDirectors" role="button" aria-expanded="false" aria-controls="collapseExample">
    Director(s)/edit:
  </a>`;    
    directorHtml += `<div class="collapse" id="collapseDirectors">`;
    directorHtml += `<form action="/add-director">`
    directorHtml += `<input style="display: none;" name="id" type='text' value='${movie_id}'>`
    directorHtml += `<input  type='text' name='name' placeholder="name" required>`
    directorHtml += `<button type="submit">Add</button>`
    directorHtml += `</form>`
    directorHtml += `</div>`
    for (let i = 0; i <directorNew.length; i++) { 
      directorHtml += '<div>';
      directorHtml += `<form action="/people">
                      <input
                        style="display: none"
                        type="text"
                        name="texter"
                        id="texter"
                        value="People"
                      </input>
                      <input
                        style="display: none"
                        type="text"
                        name="search"
                        id="search"
                        value='${directorNew[i]}'
                      </input>
                        <button class="good-looking" type="submit">${directorNew[i]}</button>
                      </form>`;
      directorHtml += "</div>";
    }
    directorHtml += "</div>";


    let actorHtml = '<div>';
    directorHtml += `  <a class="btn btn-primary" data-toggle="collapse" href="#collapseActors" role="button" aria-expanded="false" aria-controls="collapseExample">
    Actors(s)/edit:
  </a>`;    
    actorHtml += `<div class="collapse" id="collapseActors">`;
    actorHtml += `<form action="/add-actor">`
    actorHtml += `<input style="display: none;" name="id" type='text' value='${movie_id}'>`
    actorHtml += `<input  type='text' name='name' placeholder="name" required>`
    actorHtml += `<button type="submit">Add</button>`
    actorHtml += `</form>`
    actorHtml += `</div>`
    for (let i = 0; i <actorsNew.length; i++) { 
      actorHtml += '<div>';
      actorHtml += `<form action="/people">
                      <input
                        style="display: none"
                        type="text"
                        name="texter"
                        id="texter"
                        value="People"
                      </input>
                      <input
                        style="display: none"
                        type="text"
                        name="search"
                        id="search"
                        value='${actorsNew[i]}'
                      </input>
                        <button class="good-looking" type="submit">${actorsNew[i]}</button>
                      </form>`;
      actorHtml += "</div>";
    }
    actorHtml += "</div>";


    // for genres
    let genresHtml = '';
    genresHtml += '<div>';
    genresHtml += "<span>Genres(s): </span>"
        for (let i = 0; i <genresNew.length; i++) { 
      genresHtml += '<div>';
      genresHtml += `<form action="/movies">
                      <input
                        style="display: none"
                        type="text"
                        name="texter"
                        id="texter"
                        value="Genre"
                      </input>
                      <input
                        style="display: none"
                        type="text"
                        name="search"
                        id="search"
                        value='${genresNew[i]}'
                      </input>
                        <button class="good-looking" type="submit">${genresNew[i]}</button>
                      </form>`;
      genresHtml += "</div>";
    }
    genresHtml += "</div>";




    output += `
            <div class="unique-movie-size">
              <div class="well text-center">
                <div class="responsive-image">
                  <img src="${desiredObject.Poster}">
                </div>
                <h5 style="color:yellow;">${desiredObject.Title}</h5>
                  <div style="color:yellow; class="card card-body">
                    <p>${desiredObject.Plot}<p>
                    <p>Maximo rating: ${Math.round(rating)}<p>
                    <p class="">Runtime: ${desiredObject.Runtime}<p>
                    <p class="">Release year: ${desiredObject.Year}<p>
                      ${directorHtml}
                      ${actorHtml}
                      ${genresHtml}
                    <p class="">Rated: ${desiredObject.Rated}<p>
                    <p class="">Movie language: ${desiredObject.Language}<p>
                  </div>
                  <hr>
                  <h3 style="color: white;" class="text">Similar movies</h3>
                  <div class='similar-movies'>
                      <div class="card card-body">
                        <div class="row justify-content-center">
                          ${outputVariable}
                        </div>
                      </div>
                  </div>

                  <div>
                    <form class="my-4" action="/add-comment" method="POST">
                      <h4 style="color: white;">Comments</h4>
                      <hr>

                      <div class="form-group">
                        <textarea class="form-control" id="comment" name="comment" rows="3"></textarea>
                        <input style="display:none" type='text' name="id" value='${movie_id}'>
                        <input style="display:none" type='text' name='title' value='${desiredObject.Title}'>
                        <div class="d-flex flex-row-reverse my-2">
                          <button type="submit" class="btn btn-secondary">Add comment</button>
                        </div>


                      </div>

                      
                    </form>

                    <div class="comment-box text-justify">
                      ${comments}
                    </div>

                  </div>
              </div>
            </div>

          `;

    $("#movies").html(output);

    $("#title").val(desiredObject.Title);
  })
  .catch((err) => {
    console.log(err);
  });
