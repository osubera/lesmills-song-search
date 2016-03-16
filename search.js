// LesMills Song Search
// https://github.com/osubera/lesmills-song-search

$(document).ready(function(){

/*############################
DOM helpers
############################*/

  function showCriteria1Message(msg) {
    $("#criteria1").text(msg);
  }
  
  function showCriteria2Message(msg) {
    $("#criteria2").text(msg);
  }
  
  function clearCriteriaMessage() {
    showCriteria1Message("");
    showCriteria2Message("");
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
  
  function clearResult() {
    $("#result").html("");
  }
  
  function toggleResultHead() {
    var show, hide;
    switch(csm.status) {
      case csm.byChoreo: show = ".by-choreo"; hide = ".by-order"; break;
      case csm.byOrder: hide = ".by-choreo"; show = ".by-order"; break;
    }
    if(!show && !hide) {
      $("#result-head").css("display", "none");
    } else {
      $(show).css("display", "inline");
      $(hide).css("display", "none");
      $("#result-head").css("display", "table-header-group");
    }
  }
  
  function toggleSubSelectorsDisabled(disable) {
    $("#choreo").prop("disabled", disable);
    $("#order").prop("disabled", disable);
  }

/*############################
Variables, Constants and helpers
############################*/

  // ajax common parameters to read json
  var commonParams = {
      dataType: "json",
      mimeType: "text/plain; charset=shift_jis"
  }
  
  // Current search method
  var csm = {
    none: 0,
    byChoreo: 1,
    byOrder: 2,
    status: 0
  }
  
  function setCurrentSearchMethod(which) {
    csm.status = which;
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
    if(x) {msg = x; }
    showErrorMessage(msg);
  }
  
  function setupClassSelector() {
    toggleSubSelectorsDisabled(true);
    showFileNameMessage(fileClass);
    $.ajax(fileClass, commonParams
    ).done(function(result){
      $.each(result, function(i, val){
        $("#class").append('<option value="' + val['class'] +'">' + val['view'] + '</option>');
      });
    }).fail(failMessageHandler
    );
  }
  
  function setupSubSelector(selector, url) {
    setCurrentSearchMethod(csm.none);
    showFileNameMessage(url);
    $.ajax(url, commonParams
    ).done(function(result){
      $.each(result, function(i, val){
        $(selector).append('<option value="' + val +'">' + val + '</option>');
      });
    }).fail(failMessageHandler
    );
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
  
  function setupChoreoSelector(key) {
    if(key != "") {
      setupSubSelector("#choreo", "json/" + key + "/index-choreo.txt");
    }
  }
  
  function setupOrderSelector(key) {
    if(key != "") {
      setupSubSelector("#order", "json/" + key + "/index-song.txt");
    }
  }
  
  function makeFileName(key, choreo) {
    return("json/" + key + "/" + choreo.toLowerCase().replace(/＼W/g, "") + ".txt");
  }
  
  function appendResultTable(key, choreo, order) {
    var filename = makeFileName(key, choreo);
    showFileNameMessage(filename);
    $.ajax(filename, $.extend({}, commonParams, {
      context: { key: key, choreo: choreo, order: order }
      })
    ).done(function(result){
      var choreo = this.choreo;
      $.each(result, function(i, val){
        var orderOrChoreo;
        if(csm.status == csm.byOrder) {
          orderOrChoreo = choreo;
        } else {
          orderOrChoreo = val["order"];
        }
        $("#result").append("<tr><td>" + orderOrChoreo +"</td><td>" + val["song"] +"</td><td>" + val["artist"] + "</td></tr>");
      });
    }).fail(failMessageHandler
    );
  }
  
  function searchSongsByChoreo(choreo) {
    clearCriteriaMessage();
    clearResult();
    if(choreo != "") {
      setCurrentSearchMethod(csm.byChoreo);
      var key = $("#class").val();
      var view = $("#class option:selected").text();
      showCriteria1Message(view);
      showCriteria2Message(choreo);
      toggleResultHead();
      appendResultTable(key, choreo, "");
    }
  }
  
  function searchSongsByOrder(order) {
    clearCriteriaMessage();
    clearResult();
    if(choreo != "") {
      setCurrentSearchMethod(csm.byOrder);
      var key = $("#class").val();
      var view = $("#class option:selected").text();
      showCriteria1Message(view);
      showCriteria2Message(order);
      toggleResultHead();
      // ここで渡す choreo を作るためにリストからループさせるが、
      // そのネタになる choreo list を、
      // selector load のタイミングで、
      // 永続変数として作っておく。
      appendResultTable(key, choreo, order);
    }
  }

/*############################
Ajax Event hanlers
############################*/

  $("#class").change(function(){
    var selected = $(this).val();
    clearCriteriaMessage();
    clearResult();
    resetChoreoSelector();
    setupChoreoSelector(selected);
    resetOrderSelector();
    setupOrderSelector(selected);
    toggleSubSelectorsDisabled(selected == "");
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
