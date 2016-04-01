  // Json Builder
// https://github.com/osubera/lesmills-song-search

/*############################
Jquery Select Text Range
thanks to Mark Bayazit for this useful function
http://programanddesign.com/js/jquery-select-text-range/
############################*/
$.fn.selectRange = function(start, end) {
    return this.each(function() {
        if(this.setSelectionRange) {
            this.focus();
            this.setSelectionRange(start, end);
        } else if(this.createTextRange) {
            var range = this.createTextRange();
            range.collapse(true);
            range.moveEnd('character', end);
            range.moveStart('character', start);
            range.select();
        }
    });
};

$(document).ready(function(){

/*############################
Calculator
############################*/

  function positionByRowCol(text, row, col) {
    // both row and col start at 1, while position starts at 0.
    var x = text.split("\n");
    var pos = col - 1;
    
    if(row > x.length) {
      pos = text.length;
      console.log("out of Row range");
    }
    else {
      for(var i=0; i < row - 1; i++) {
        pos += (x[i].length + 1);
      }
    }
    
    if(pos > text.length) {
      pos = text.length;
      console.log("out of Column range");
    }
  
    return(pos);
  }

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
  function setupKeyBoxes(n, val) {
    addKey(n, val);
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
  
  function getDelimiterEx() {
    var d = getDelimiter();
    if($("#regexp").val() == "regexp") {
      return(new RegExp(d));
    }
    else { // sstring
      return(d);
    }
  }
  
  function loadDefaultVals() {
    $.each(txt.val, function(key, val){
      $("#" + key).val(val);
    });
  }
  
  function loadDefaultTexts() {
    $.each(txt.text, function(key, val){
      $("#" + key).text(val);
    });
  }
  
  function loadInstruction() {
    $("#instruction").html(makeHtmlList(txt.instruction));
  }
  
  function toggleUndoInfo() {
    var x = $("#undoinfo");
    if(x.css("display") == "none") {
      x.fadeIn();
    }
    else {
      x.fadeOut();
    }
  }
  function toggleUndoSwitch() {
    $("#undo").toggleClass("on");
  }
  
  function setDelimCounter() {
    $("#delimcounter").text($("#delimiter").val().length);
  }
  
  function remember(selector) {
    $("#whose").text(selector);
    $("#remember").val($(selector).val());
    enableUndo();
  }
  
  function undo() {
    $($("#whose").text()).val($("#remember").val());
    $("#remember").val("");
    $("#whose").val("");
    toggleUndoInfo();
    toggleUndoSwitch();
    disableUndo();
  }
  
  function enableUndo() {
    $("#undo").prop("disabled", false);
  }
  
  function disableUndo() {
    $("#undo").prop("disabled", true);
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
  
  function makeHtmlList(val) {
    return(val.map(function(v){
      return('<li>' + v + '</li>');
    }).join(""));
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
  
  // json strings
  var arrayBegin = "[\n";
  var arrayEnd = "\n]\n";
  var hashBegin = " ".repeat(2) + "{\n" + " ".repeat(4);
  var hashEnd = "\n" + " ".repeat(2) + "}";
  var hashColon = '": "';
  var hashQuot = '"';
  var stringQuot = '"';
  var colDelimiter = ",\n" + " ".repeat(4);
  var rowDelimiter = ",\n";
  
  // csv strings
  var delimRowSplitter = "\n";

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

  function escapeSpecialChars(x) {
    switch($('input[name=escyen]:checked').val()) {
      case "zen":
        x = x.replace(/\\/g,txt.zenyen);
        break;
      case "esc":
        x = x.replace(/\\/g,'\\\\');
        break;
      case "del":
        x = x.replace(/\\/g,'');
        break;
      default: /* case nop */
        break;
    }
    switch($('input[name=escquote]:checked').val()) {
      case "zen":
        x = x.replace(/"/g,txt.zenquot);
        break;
      case "esc":
        x = x.replace(/"/g,'\\"');
        break;
      case "del":
        x = x.replace(/"/g,'');
        break;
      default: /* case nop */
        break;
    }
    return(x);
  }
  
  function makeJsonOneRowString(data) {
    var json = stringQuot + escapeSpecialChars(data) + stringQuot;
    return(json);
  }
  
  function makeJsonOneRowHash(data) {
    var x = data.split(getDelimiterEx());
    var keyval = getKeys().map(function(key, index){
      var v = x[index];
      if(v) { return(hashQuot + key + hashColon + escapeSpecialChars(v) + hashQuot); }
      else { return(null); }
     }).filter(function(element){
      return(element);
     });
    var json = hashBegin + keyval.join(colDelimiter) +  hashEnd;
    return(json);
  }
  
  function makeJsonOneRow(data) {
    if(getKeys().length == 0) { return(makeJsonOneRowString(data)); }
    else { return(makeJsonOneRowHash(data)); }
  }
  
  function makeJsonRowsArray(data) {
    var rows = data.map(function(row){
      if(row.trim().length == 0) { return(null); }
      else { return(makeJsonOneRow(row)); }
    }).filter(function(element){
      return(element);
    });
    var json = arrayBegin + rows.join(rowDelimiter) + arrayEnd;
    return(json);
  }
  
  function delimToJson(delim) {
    var data = delim.split(delimRowSplitter);
    return(makeJsonRowsArray(data));
  }
  
  function makeUnityKeys(data) {
    var keys = {};
    for(var i=0; i < data.length; i++) {
      if(typeof data[i] == "string") {
        return([]);
      }
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
    for(var i=lengthen; i < 0; i++) {
      keys.push("");
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
    var row = [];
    if(typeof data == "string") {
      row.push(data);
    }
    for(var key in keys) {
      var x = data[key];
      row.push(x);
    }
    var delim = row.join(getDelimiter());
    return(delim);
  }
  
  function makeDelimRows(data) {
    var keys = makeUnityKeys(data);
    showKeys(Object.keys(keys));
    var rows = data.map(function(row){
      return(makeDelimOneRow(row, keys));
    });
    var delim = rows.join(delimRowSplitter) + delimRowSplitter;
    return(delim);
  }
  
  function delimFromJson(json) {
    var result = "";
    try {
      result = JSON.parse(json);
    }
    catch(err) {
      var e=err.message;
      var x = /line +(\d+) +column +(\d+)/.exec(e);
      if(x) {
        var position = positionByRowCol($("#json").val(), x[1], x[2]);
        $("#json").selectRange(position, position);
    }
      return(e);
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
    remember("#json");
    $("#json").val(delimToJson($("#csv").val()));
  });
  
  $("#fromjson").click(function(){
    remember("#csv");
    $("#csv").val(delimFromJson($("#json").val()));
  });
  
  $("#undo").click(function(){
    toggleUndoSwitch();
    toggleUndoInfo();
  });
  
  $("#delimiter").on("change keyup paste",function(){
    setDelimCounter();
  });
  
  $("#confirmundo").click(function(){
    undo();
  });


/*############################
Main
############################*/

  $.when(loadTexts()).done(function(){
    setupKeyBoxes(3, txt.initkeys);
    loadDefaultVals();
    loadDefaultTexts();
    loadInstruction();
    setDelimCounter();
  });
  disableUndo();


});
