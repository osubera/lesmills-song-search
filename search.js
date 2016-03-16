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
  
  function clearCriteriaMessages() {
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

  function getCurrentChoreos() {
    var x = [];
    $("#choreo option").each(function() {
      x.push($(this).val());
    });
    return(x.filter(
      function(element, index, array) {return(element != "");}
    ));
  }
  
  function unselectChoreoSelector() {
    $("#choreo").val("");
  }
  
  function unselectOrderSelector() {
    $("#order").val("");
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
    $.ajax(fileText, commonParams
    ).done(function(result){
      txt = result;  // async load to outer scope
    }).fail(failMessageHandler
    );
  }

/*############################
HTML helpers
############################*/

  function makeHtmlOption(value, text) {
    return('<option value="' + value +'">' + text + '</option>');
  }
  
  function makeHtmlTrTd(tds) {
    var tr = "";
    for(var i = 0; i < tds.length; i++) {
      tr = tr + '<td>' + tds[i] + '</td>';
    }
    return('<tr>' + tr +'</tr>');
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
    clearErrorMessage();
    toggleSubSelectorsDisabled(true);
    showFileNameMessage(fileClass);
    $.ajax(fileClass, commonParams
    ).done(function(result){
      $.each(result, function(i, val){
        $("#class").append(makeHtmlOption(val['class'], val['view']));
      });
    }).fail(failMessageHandler
    );
  }
  
  function setupSubSelector(selector, url) {
    clearErrorMessage();
    setCurrentSearchMethod(csm.none);
    showFileNameMessage(url);
    $.ajax(url, commonParams
    ).done(function(result){
      $.each(result, function(i, val){
        $(selector).append(makeHtmlOption(val, val));
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
    return("json/" + key + "/" + choreo.toLowerCase().replace(/\W/g, "") + ".txt");
  }
  
  function makeSongList(result) {
    var choreo = this.choreo;
    var order = this.order;
    $.each(result, function(i, val){
      if(csm.status == csm.byOrder) {
        if(val["order"] == order) {
          $("#result").append(makeHtmlTrTd([choreo, val["song"], val["artist"]]));
        }
      } else {  // byChoreo
        $("#result").append(makeHtmlTrTd([val["order"], val["song"], val["artist"]]));
      }
    });
  }
  
  function appendResultTable(key, choreo, order) {
    clearErrorMessage();
    var filename = makeFileName(key, choreo);
    showFileNameMessage(filename);
    $.ajax(filename, $.extend({}, commonParams, {
      context: { key: key, choreo: choreo, order: order }
      })
    ).done(makeSongList
    ).fail(failMessageHandler
    );
  }
  
  function searchSongsByChoreo(choreo) {
    clearCriteriaMessages();
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
    clearCriteriaMessages();
    clearResult();
    if(choreo != "") {
      setCurrentSearchMethod(csm.byOrder);
      var key = $("#class").val();
      var view = $("#class option:selected").text();
      showCriteria1Message(view);
      showCriteria2Message(order);
      toggleResultHead();
      var choreos = getCurrentChoreos();
      for(var i = 0; i < choreos.length; i++) {
        appendResultTable(key, choreos[i], order);
      }
    }
  }

/*############################
Ajax Event hanlers
############################*/

  $("#class").change(function(){
    var selected = $(this).val();
    clearCriteriaMessages();
    clearResult();
    resetChoreoSelector();
    setupChoreoSelector(selected);
    resetOrderSelector();
    setupOrderSelector(selected);
    toggleSubSelectorsDisabled(selected == "");
  });
  
  $("#choreo").change(function(){
    var selected = $(this).val();
    unselectOrderSelector();
    searchSongsByChoreo(selected);
  });
  
  $("#order").change(function(){
    var selected = $(this).val();
    unselectChoreoSelector();
    searchSongsByOrder(selected);
  });
  
/*############################
Main
############################*/

  loadTexts();
  setupClassSelector();

});
