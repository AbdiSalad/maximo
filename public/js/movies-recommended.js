// This will display movies depending on what movie genres
// the person has peaked interest in.

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

const getAverageRating = (movie) => {
  let averageRating;
  if (movie.Ratings.length < 1) {
    // This means that there was no rating added yet
    // so we give it an average movie rating of 0
    averageRating = 0;
  } else {
    // lets find the average
    let ratingSum = 0;
    for (let z = 0; z < movie.Ratings.length; z++) {
      ratingSum += parseInt(movie.Ratings[z]);
    }

    averageRating = ratingSum / movie.Ratings.length;
  }
  return averageRating;
};

// We do some fetch request.
fetch(`../json/movie-data.json`)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    let output = "";

    let recommendedMovies = getRandom(data, 8);
    let recommendedMoviesObject = [];

    for (let i = 0; i < recommendedMovies.length; i++) {
      for (let j = 0; j < data.length; j++) {
        if (data[j].Title === recommendedMovies[i].Title) {
          recommendedMoviesObject.push({
            movie: recommendedMovies[i],
            index: j,
          });

          break;
        }
      }
    }

    for (let i = 0; i < recommendedMoviesObject.length; i++) {
      let averageRating = getAverageRating(recommendedMoviesObject[i].movie);

      output += `
        <div class="col-md-3">
            <div class="well text-center">
              <img class="img-poster" src="${recommendedMoviesObject[i].movie.Poster}">
              <form action="/movies/:">
                <input type="text" id="movie_id" name="movie_id" value="${recommendedMoviesObject[i].index}">
                <button class="btn btn-info" role="button" href="#">
                  Go
                </button>
              </form>
            
            






            
            </div>
        </div>
        `;
    }

    $("#movies").html(output);
  })
  .catch((err) => {
    console.log(err);
  });


