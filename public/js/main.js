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
  fetch(`../json/movie-data.json`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      // console.log(data)

      let output = '';
      for (let i=0; i < data.length; i++) {
        // console.log('what is up')
        if (data[i].Title.toUpperCase().indexOf(searchText.toUpperCase()) != -1) {
          console.log(data[i]);
            output += `
              <div class="col-md-3">
                <div class="well text-center">
                  <img class="img-poster" src="${data[i].Poster}">
                  <h5 style="color:yellow;">${data[i].Title}</h5>
                  <a data-toggle="collapse" href="#collapseExample${i}" class="btn btn-primary" role="button" aria-expanded="false" aria-controls="collapseExample">
                    Movie Details
                  </a>

                  <div class="collapse" id="collapseExample${i}">
                    <div class="card card-body">
                      <p>${data[i].Plot}<p>
                      <p class="">${data[i].Ratings[0].Source} ${data[i].Type} rating: ${data[i].Ratings[0].Value}<p>
                      <p class="">${data[i].Ratings[1].Source} ${data[i].Type} rating: ${data[i].Ratings[1].Value}<p>
                      <p>Maximo rating: null<p>
                      <p class="">Runtime: ${data[i].Runtime}<p>
                      <p class="">Release year: ${data[i].Year}<p>
                      <a class="btn btn-success" role="button" href="#">
                        More Info
                      </a>

                    </div>
                </div>
                </div>
              </div>
            `;
        }
      }

      $('#movies').html(output);

    })
    .catch((err) =>{
      console.log(err);
    })
}
