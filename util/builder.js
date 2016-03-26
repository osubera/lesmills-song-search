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
  
  function addKey(n, val) {
    if(!val) { val = new Array(n); }
    var x = [];
    var y = "";
    var ex = makeHtmlButtonExchangeKey();
    if(countKey() > 0) { y = ex }
    for(var i=0; i < n; i++) {
      x.push(makeHtmlInputKey(val[i]));
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
  
  function makeHtmlInputKey(val) {
    if(!val) { val = ""; }
    return('<input type="text" value="' + val + '"/>');
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

  function makeJsonOneRowHash(data, notlast) {
    var json = "{";
    var x = data.split(getDelimiter());
    var keys = getKeys();
    for(var k=0; k < keys.length; k++) {
      if(x[k]) {
        json += (',"' + keys[k] + '": "' + x[k] + '"');
      }
    }
    json += "},";
    return(json);
  }
  
  function makeJsonRowsArray(data) {
    var json = "";
    json += ("[");
    for(var r=0; r < data.length; r++) {
      if(data[r].trim().length == 0) { continue; }
      json += "\n";
      json += makeJsonOneRowHash(data[r]);
    }
    /* because the text includes blank lines, the last record is unknown. 
      so, the last comma is to be deleted at this point */
    json = json.slice(0, -1);
    json += "\n]\n";
    return(json);
  }
  
  function delimToJson(delim) {
    var data = delim.split("\n");
    return(makeJsonRowsArray(data));
  }
  
  function makeUnityKeys(data) {
    var keys = {};
    for(var i=0; i < data.length; i++) {
      for(var key in data[i]) {
        keys[key] = true;
      }
    }
    return(keys);
  }
  
  function showKeys(keys) {
    var oldLength = countKey();
    var newLength = keys.length;
    var lengthen = newLength -oldLength;
    if(lengthen < 0) {
       keys.push(new Array(-lengthen)); 
    }
    $("#keyboxes input").each(function(i, element){
      element.value = keys[i];
    });
    if(lengthen >0) {
      keys.splice(0, oldLength);
      addKey(lengthen, keys); 
    }
  }
  
  function makeDelimOneRow(data, keys) {
    var delim = "";
    var d = getDelimiter();
    var first = true;
    for(var key in keys) {
      if(first) { first = false; }
      else { delim += d; }
      var x = data[key];
      if(x) {
        delim += x;
      }
    }
    delim += "\n"
    return(delim);
  }
  
  function makeDelimRows(data) {
    var delim = "";
    var keys = makeUnityKeys(data);
    showKeys(Object.keys(keys));
    for(var r=0; r < data.length; r++) {
      delim += makeDelimOneRow(data[r], keys);
    }
    return(delim);
  }
  
  function delimFromJson(json) {
    var result = "";
    try {
      result = JSON.parse(json);
    }
    catch(err) {
      return(err.message);
    }
    return(makeDelimRows(result));
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
  
  enableWatchAddKey(true);
  
  $("#addkey").click(function(){
    addKey(1);
  });
  
  $("#tojson").click(function(){
    $("#json").val(delimToJson($("#csv").val()));
  });

  $("#fromjson").click(function(){
    $("#csv").val(delimFromJson($("#json").val()));
  });


/*############################
Main
############################*/

  $.when(loadTexts()).done(function(){
    setupKeyBoxes(3);
  });

});
