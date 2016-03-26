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
    $("#keyboxes").append(y);
  }
  
  function getDelimiter() {
    return($("#delimiter").val());
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
Converter
############################*/

  function makeJsonOneRowHash(data, first) {
    var json = ",{";
    if(first) { json = "{"; }
    var x = data.split(getDelimiter());
    var keys = getKeys();
    for(var k=0; k < keys.length; k++) {
      if(x[k]) {
        json += (',"' + keys[k] + '": "' + x[k] + '"');
      }
    }
    json += "}\n";
    return(json);
  }
  
  function makeJsonRowsArray(data) {
    var json = "";
    json += ("[");
    for(var r=0; r < data.length; r++) {
      if(data[r].trim().length == 0) { continue; }
      json += makeJsonOneRowHash(data[r], r == 0);
    }
    json += "]\n";
    return(json);
  }
  
  function delimToJson(delim) {
    var data = delim.split("\n");
    return(makeJsonRowsArray(data));
  }
  
  function delimFromJson(json) {
    var delim = "";
    var result = "";
    try {
      result = JSON.parse(json);
    }
    catch(err) {
      return(err.message);
    }
    //delim = JSON.stringify(result);
    var keys = {};
    for(var i=0; i < result.length; i++) {
      for(var key in result[i]) {
        keys[key] = true;
      }
    }
    //delim = JSON.stringify(keys);
    for(var i=0; i < result.length; i++) {
      var first = true;
      for(var key in keys) {
        var x = result[i][key];
        if(first) {
          first = false;
        } else {
          delim += ', '
        }
        if(x) {
          //delim += '"'
          delim += x;
          //delim += '"'
        }
      }
      delim += "\n"
    }
    //var result = $.parseJSON(json);
    //$.each(result, function(i,r){
    //});
    return(delim);
  }

/*############################
Event hanlers
############################*/

  /* this handler is dynamically attached after addKey */
  function onExchangeKey() {
    var b = $(this).prev();
    var a = $(this).next();
    var swap = b.val();
    b.val(a.val());
    a.val(swap);
  }
  
  /* watch new key insert */
  var watchAddKey;
  
  function enableWatchAddKey(start) {
    if(start) {
      watchAddKey = new MutationObserver(function(mutations){
        mutations.forEach(function(mutation){
          var nodes = mutation.addedNodes;
          for(var i=0; i < nodes.length; i++) {
            if(nodes[i].tagName.toUpperCase() != "BUTTON") { continue; }
            nodes[i].addEventListener("click", onExchangeKey);
          }
        });
      });
      watchAddKey.observe(
        document.getElementById("keyboxes"), {childList: true}
      );
    }
    else {
      watchAddKey.disconnect();
    }
  }
  
  $("#addkey").click(function(){
    addKey(1);
  });
  enableWatchAddKey(true);

/*############################
Main
############################*/

  $.when(loadTexts()).done(function(){
    setupKeyBoxes(3);
  });

});
