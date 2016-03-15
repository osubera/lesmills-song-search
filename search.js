// LesMills Song Search
// https://github.com/osubera/lesmills-song-search

$(document).ready(function(){

// DOM helpers
  function showCriteriaMessage(msg) {
    $("#criteria").text(msg);
  }
  
  function clearCriteriaMessage() {
    showCriteriaMessage("");
  }
  
  function showFileNameMessage(msg) {
    $("#filename").text(msg);
  }
  
  function clearFileNameMessage() {
    showFileNameMessage("");
  }
  
  function showErrorMessage(msg) {
    $("#error").text(msg);
  }
  
  function clearErrorMessage() {
    showErrorMessage("");
  }
  
  function clearResultHead() {
    $("#result-head").html("");
  }
  
  function clearResult() {
    $("#result").html("");
  }
  
  // ajax common parameters to read json
  var commonParams = {
      dataType: "json",
      mimeType: "text/plain; charset=shift_jis"
  }
  
  // Satatic files
  var fileText = "json/index-text.txt";
  var fileClass = "json/index-class.txt";
  
  // Text data
  var txt = {};
  
  // Multi-language text data
  function loadTexts() {
    showFileNameMessage(fileText);
    //$.ajax(fileText, $.extend({}, commonParams, {context: { hage: "hoge"}})
    $.ajax(fileText, commonParams
    ).done(function(result){
      txt = result;  // async load to outer scope
      //txt = this.hage;
      /*
    }).fail(function(xhr, ajaxOptions, thrownError){
      if(xhr.status != 200) { // Access to restricted URI denied
        showErrorMessage("no files");
      } else if(ajaxOptions == "parsererror") { // JSON.parse error
        showErrorMessage("invalid json");
      } else {
        showErrorMessage(xhr.status + " / " + thrownError);
      }
      */
      }).fail(failMessageHandler
    );
  }
  
  // ajax error handler
  function failMessageHandler(xhr, ajaxOptions, thrownError) {
    var msg = xhr.status + " / " + thrownError;
    var x;
    if(xhr.status != 200) { // Access to restricted URI denied
      x = txt["nofiles"];
    } else if(ajaxOptions == "parsererror") { // JSON.parse error
      x = txt["invalid"];
    }
    if(x) {msg = x; }
    showErrorMessage(msg);
  }
  
  function setupClassSelector() {
    $.ajax({
      dataType: "json",
      url: "json/index-class.txt",
      mimeType: "text/plain; charset=shift_jis"
    }).done(function(result){
      $.each(result, function(i, val){
        $("#class").append('<option value="' + val['class'] +'">' + val['view'] + '</option>');
      });
    }).fail(function(xhr, ajaxOptions, thrownError){
      showErrorMessage(xhr.status + " / " + thrownError);
    });
    $("#choreo").prop("disabled", true);
    $("#order").prop("disabled", true);
  }
  
  function resetSelector(selector) {
    $(selector).each(function(){
      if(this.value != "") {
        this.remove();
      }
    });
  }
  
  function resetChoreoSelector() {
    resetSelector("#choreo option");
  }
  
  function resetOrderSelector() {
    resetSelector("#order option");
  }
  
  function setupSubSelector(selector, url) {
    $.ajax({
      dataType: "json",
      url: url,
      mimeType: "text/plain; charset=shift_jis"
    }).done(function(result){
      $.each(result, function(i, val){
        $(selector).append('<option value="' + val +'">' + val + '</option>');
      });
    }).fail(function(xhr, ajaxOptions, thrownError){
      showErrorMessage(xhr.status + " / " + thrownError);
    });
  }
  
  function setupChoreoSelector(key) {
    if(key == "") {
      $("#choreo").prop("disabled", true);
    } else {
      $("#choreo").prop("disabled", false);
      setupSubSelector("#choreo", "json/" + key + "/index-choreo.txt");
    }
  }
  
  function setupOrderSelector(key) {
    if(key == "") {
      $("#order").prop("disabled", true);
    } else {
      $("#order").prop("disabled", false);
      setupSubSelector("#order", "json/" + key + "/index-song.txt");
    }
  }
  
  function makeFileName(key, choreo) {
    return("json/" + key + "/" + choreo.toLowerCase().replace(/Å_W/g, "") + ".txt");
  }
  
  function appendResultTable(key, choreo, order) {
    var filename = makeFileName(key, choreo);
    showFileNameMessage(filename);
    $.ajax({
      dataType: "json",
      url: filename,
      mimeType: "text/plain; charset=shift_jis"
    }).done(function(result){
      $.each(result, function(i, val){
        $("#result").append("<tr><td>" + val["order"] +"</td><td>" + val["song"] +"</td><td>" + val["artist"] + "</td></tr>");
      });
    }).fail(function(xhr, ajaxOptions, thrownError){
      showErrorMessage(xhr.status + " / " + thrownError);
    });
  }
  
  function searchSongsByChoreo(choreo) {
    clearCriteriaMessage();
    clearResult();
    if(choreo != "") {
      var key = $("#class").val();
      var view = $("#class option:selected").text();
      //$("#criteria").append(key + view + choreo);
      showCriteriaMessage(view + " " + choreo);
      appendResultTable(key, choreo, "");
    }
  }
  
  function searchSongsByOrder(order) {
  }
  
  $("#class").change(function(){
    var selected = $(this).val();
    clearCriteriaMessage();
    clearResult();
    resetChoreoSelector();
    setupChoreoSelector(selected);
    resetOrderSelector();
    setupOrderSelector(selected);
  });
  
  $("#choreo").change(function(){
    var selected = $(this).val();
    searchSongsByChoreo(selected);
  });
  
  $("#order").change(function(){
    var selected = $(this).val();
    searchSongsByOrder(selected);
  });
  
  loadTexts();
  setupClassSelector();

});
