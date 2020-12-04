// http://www.omdbapi.com/?apikey=[yourkey]&
const key = '9e8fdc9';

$(document).ready(() => {
  $('#searchForm').on('submit', (e) => {
    let searchText = $('#searchText').val();
    getMovies(searchText);
    e.preventDefault();
  });
});

function getMovies(searchText){
  fetch(`http://www.omdbapi.com/?apikey=${key}&s=${searchText}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let movies = data.Search;
      console.log(movies);
      let output = '';

      $.each(movies, (index, movie) => {
        output += `
          <div class="col-md-3">
            <div class="well text-center">
              <img class="img-poster" src="${movie.Poster}">
              <h5 style="color:yellow;>${movie.Title}</h5>
              <a onclick="movieSelected('${movie.imdbID}')" class="btn btn-primary" href='#'>Movie Details</a>
            </div>
          </div>
        `;
      });

      $('#movies').html(output);

    })
    .catch((err) =>{
      console.log(err);
    })
}
