$(document).ready(function(){

  function setupClassSelector() {
    $.ajax({
      dataType: "json",
      url: "json/index-class.txt",
      mimeType: "text/plain; charset=shift_jis",
      success: function(result){
        $.each(result, function(i, val){
          $("#class").append('<option value="' + val['class'] +'">' + val['view'] + '</option>');
        });
      }
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
      mimeType: "text/plain; charset=shift_jis",
      success: function(result){
        $.each(result, function(i, val){
          $(selector).append('<option value="' + val +'">' + val + '</option>');
        });
      }
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
  
  function clearResultTable() {
    $("#criteria").text("");
    $("#result").html("");
  }
  
  function makeFileName(key, choreo) {
    "json/" + key + "/" + choreo.toLowerCase();
  }
  
  function appendResultTable(key, choreo, order) {
    $.ajax({
      dataType: "json",
      url: makeFileName(key, choreo),
      mimeType: "text/plain; charset=shift_jis",
      success: function(result){
        $.each(result, function(i, val){
          $("#class").append('<option value="' + val['class'] +'">' + val['view'] + '</option>');
        });
      }
    });
  }
  
  function searchSongsByChoreo(choreo) {
    clearResultTable();
    if(choreo != "") {
      var key = $("#class").val();
      var view = $("#class option:selected").text();
      //$("#criteria").append(key + view + choreo);
      $("#criteria").text(view + " " + choreo);
      appendResultTable(key, choreo, "");
    }
  }
  
  function searchSongsByOrder(order) {
  }
  
  $("#class").change(function(){
    var selected = $(this).val();
    clearResultTable();
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

  setupClassSelector();

});
