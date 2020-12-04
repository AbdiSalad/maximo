let nameValue = $("#name").text();

const nameOutput = (dataObject, nameValue) => {
  let output = "";
  // We return stuff;
  //   return "<h1>My name is jeff<h1>";
  for (let i = 0; i < dataObject.length; i++) {
    // console.log('what is up')
    // Old if block "dataObject[i].Title.toUpperCase().indexOf(searchValue.toUpperCase()) != -1"
    // Second if block "dataObject[i].Title.toUpperCase().includes(searchValue.toUpperCase())"
    if (
      dataObject[i].Director.includes(nameValue) ||
      dataObject[i].Actors.includes(nameValue) ||
      dataObject[i].Writer.includes(nameValue)
    ) {
      console.log(dataObject[i]);
      output += `
            <div class="col-md-3">
              <div class="well text-center">
                <img class="img-poster" src="${dataObject[i].Poster}">
                <h5 style="color:yellow";>${dataObject[i].Title}</h5>
                <a data-toggle="collapse" href="#collapseExample${i}" class="btn btn-primary" role="button" aria-expanded="false" aria-controls="collapseExample">
                  Movie Details
                </a>
                <div class="collapse" id="collapseExample${i}">
                  <div class="card card-body">
                    <p>${dataObject[i].Plot}<p>
                    <p>Maximo rating: 0<p>
                    <p class="">Runtime: ${dataObject[i].Runtime}<p>
                    <p class="">Release year: ${dataObject[i].Year}<p>
                    <form action="/movies/:">
                      <input type="text" id="movie_id" name="movie_id" value="${i}">
                      <button class="btn btn-success" role="button" href="#">
                        More Info
                      </button>
                    </form>
                  </div>
              </div>
              </div>
            </div>
          `;
    }
  }

  return output;
};

// We do some fetch request.
fetch(`../json/movie-data.json`)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log(data);
    let output = "";

    output = nameOutput(data, nameValue);

    $("#movies").html(output);
  })
  .catch((err) => {
    console.log(err);
  });
