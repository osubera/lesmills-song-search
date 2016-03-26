// Json Builder
// https://github.com/osubera/lesmills-song-search

$(document).ready(function(){

/*############################
DOM helpers
############################*/

  function showErrorMessage(msg) {
    $("#error").text(msg);
  }
  
  function clearErrorMessage() {
    showErrorMessage("");
  }
  
  // initialize key boxes
  function setupKeyBoxes(n) {
    addKey(n);
  }
  
  function countKey() {
    return($("#keyboxes input").length);
  }
  
  function getKeys() {
    return(
      $("#keyboxes input").map(function(){
        return this.value;
      }).get().filter(function(element){
        return(element != "");
      })
    );
  }
  
  function addKey(n) {
    var x = [];
    var y = "";
    var ex = makeHtmlButtonExchangeKey();
    if(countKey() > 0) { y = ex }
    for(var i=0; i<n; i++) {
      x.push(makeHtmlInputKey());
    }
    y += x.join(ex);
//     $.when($("#keyboxes").append(y)).done(
//     $("#keyboxes button").click(onExchangeKey);
//     );
    $("#keyboxes").append(y);
//     $("#keyboxes button").click(onExchangeKey);
  }

/*############################
HTML helpers
############################*/

  function makeHtmlButtonExchangeKey() {
    return('<button type="button">' + txt.exchangekey + '</button>');
  }
  
  function makeHtmlInputKey() {
    return('<input type="text" />');
  }

/*############################
Variables, Constants and helpers
############################*/

  // ajax common parameters to read json
  var commonParams = {
      dataType: "json",
      mimeType: "text/plain; charset=shift_jis"
  }
  
  // Satatic files
  var fileText = "builder-text.txt";
  
  // Text data
  var txt = {};
  
  // Multi-language text data
  function loadTexts() {
    return(
      $.ajax(fileText, commonParams
      ).done(function(result){
        txt = result;  // async load to outer scope
      }).fail(failMessageHandler
      )
    );
  }

/*############################
Ajax helpers
############################*/

  // ajax error handler
  function failMessageHandler(xhr, ajaxOptions, thrownError) {
    var msg = xhr.status + " / " + thrownError;
    var x;
    if(xhr.status != 200) { // Access to restricted URI denied
      x = txt["nofiles"];
    } else if(ajaxOptions == "parsererror") { // JSON.parse error
      x = txt["invalid"];
    }
    console.log(this.url);
    console.log(msg);
    if(x) {msg = x; }
    showErrorMessage(this.url + " / " + msg );
  }

/*############################
Ajax Event hanlers
############################*/

  /* this handler is dynamically attached at addKey */
  function onExchangeKey() {
    var b = $(this).prev();
    var a = $(this).next();
    var swap = b.val();
    b.val(a.val());
    a.val(swap);
  }
  
 // mutaion ÇégÇ§ÅI function
  
//   $("#keyboxes button").ready(function(){
//     $(this).click(console.log("hoge"));
//   });
  
  $("#addkey").click(function(){
    addKey(1);
  });

/*############################
Main
############################*/

  $.when(loadTexts()).done(function(){
    setupKeyBoxes(3);
  });

});
