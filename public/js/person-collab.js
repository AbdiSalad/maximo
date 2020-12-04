// Everything from the previous js file exists here

// lets find people who frequently worked with nameValue
const findMostWorkedWith = (dataObject, nameValue) => {
  let output = "";

  let workedWith = [];
  for (let i = 0; i < dataObject.length; i++) {
    let director = dataObject[i].Director.split(",")
    let actors = dataObject[i].Actors.split(",");


    if (director.includes(nameValue) || actors.includes(nameValue)) {
      console.log(director)
          console.log(actors)
      for (let j = 0; j < director.length; j++) { 
        if (director[j] != nameValue) { 
          workedWith.push(director[j])
        }
      }
      for (let z = 0; z < actors.length; z++) { 
        if (actors[z] != nameValue) { 
          workedWith.push(actors[z])
        }
      }
    }
  }

  console.log(`${nameValue} worked with`, workedWith);
  output += "<ul>";
  if (workedWith.length <= 5) {
    for (let i = 0; i < workedWith.length; i++) {
      output += `<form action="/People">
                    <input 
                      style="display: none"
                      name="search"
                      value="${workedWith[i]}"
                      ></input>
                    <button class="good-looking" type="submit">${workedWith[i]}</button>
                  </form>`
      // output += "<li>" + workedWith[i] + "</li>";
    }
  } else {
    // let's break it down. then.
    for (let i = 0; i < 5; i++) {
            output += `<form action="/People">
                    <input 
                      style="display: none"
                      name="search"
                      value="${workedWith[i]}"
                      ></input>
                    <button class="good-looking" type="submit">${workedWith[i]}</button>
                  </form>`
      // output += "<li>" + workedWith[i] + "</li>";
    }
  }

  output += "</ul>";
  return output;

  // This is a pretty mediocre function. needs a fix by deadline
};
// We do some fetch request.
fetch(`../json/movie-data.json`)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log(data);
    let output = findMostWorkedWith(data, nameValue);

    $("#people-worked").html(output);
  })
  .catch((err) => {
    console.log(err);
  });
