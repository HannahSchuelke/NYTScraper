// GRAB ARTICLES AS JSON
$.getJSON("/articles", function (data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    $("#articles").append("<results'" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</div>");
  };
});

// CLICKING THE NOTE BUTTON
$(document).on("click", ".note", function () {
  // Empty the note section (this is commented out as)
  
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  console.log(thisId)
  updateNotesDiv(thisId)
});


const updateNotesDiv = function(thisId){
  // empty

  if(thisId){
  $("#savedNote").empty();

  // GET REQUEST TO CHANGE THE NOTE, WHEN NOTE ARE ENTERED
  $.ajax({
    method: "GET",
    url: "/notes/" + thisId,
    // data: {
    // Value taken from title input
    // title: $("#titleinput").val(),
    // Value taken from note textarea
    // body: $("#bodyinput").val()
    // }
  })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      // Empty the note section (this is commented out as)
      // $("#note").empty();

      // for loop
      if(data){
        for (let i in data) {
          $("#savedNote").append("<h5>" + data[i].title + "</h5>");
          $("#savedNote").append("<h5>" + data[i].body + "</h5>");
        }
      }

      $("#savedNote").append("<input id='titleinput' name='title' placeholder='Please enter the title'></input>"+
      "<textarea id='bodyinput' name='body' placeholder='Please enter the notes'></textarea>"+
      "<button data-id='" + thisId + "' id='submit'>Submit</button>");

      // if there's a note for the article
      // if (data.note) {
      //   // Place the body of the note in the body textarea
      //   $("#bodyinput").val(data.note.body);
      // }
    });
  }
}

// CLICKING SAVE NOTE BUTTON
$(document).on("click", "#submit", function () {
  // Grab the id/article from the button
  var thisId = $(this).attr("data-id");
  console.log(thisId);

  // RUN POST REQUEST TO CHANGE THE NOTE
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value from note area
      title: $("#titleinput").val(),
      body: $("#bodyinput").val(),
      newsId: thisId
    }
  })
    .then(function (data) {
      console.log(data);
    });
  // Remove values entered in the input/textarea for note 
  $("#titleinput").val("");
  $("#bodyinput").val("");
  updateNotesDiv(thisId)
});


// TRIGGER SEARCH SCRAPE BUTTON REQUEST
$(document).on("click", "#search", function () {
  $.ajax({
    url: '/scrape',
    type: 'GET',
  })
    .then(function (results) {
      console.log(results)
      alert(results.message)
      console.log(results.Articledb)
      // appending results here
      for (let i in results.Articledb) {
        let headline = results.Articledb[i].headline
        let link = results.Articledb[i].link
        let summary = results.Articledb[i].summary
        let id = results.Articledb[i]._id
        let newsDiv = `
          <a href='`+ link + `'><div>` + headline + `</div></a>` + `<button class="note" data-id="` + id + `">note</button>
          <div>`+ summary + `</div>
          `
        $("#newsResults").append(newsDiv)
      }
    })
})