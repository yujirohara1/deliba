$(document).ready(function() {

  var select = $('#selGroupKb');
  $.getJSON("/getMstSetting_Main", function(json) {
    list = JSON.parse(json.data);
    $.each(list, function(i, item) {
        var option = $('<option>').text(item.param_val1).val(item.param_no);
        select.append(option);
    });
  });
  
  createCustomerTables_Main();
  
});
  
$("#selGroupKb").change(function(){
    createCustomerTables_Main();
});



$("#chkYuko").change(function(){
  if($("#chkYuko").prop("checked") == false){
    if($("#chkMuko").prop("checked") == false){
      $("#chkMuko").prop("checked",true);
    }
  }
  createCustomerTables_Main();
});

$("#chkMuko").change(function(){
  if($("#chkMuko").prop("checked") == false){
    if($("#chkYuko").prop("checked") == false){
      $("#chkYuko").prop("checked",true);
    }
  }
    createCustomerTables_Main();
});





function createCustomerTables_Main(){
  
  var groupkb = $("#selGroupKb").val();
  if(groupkb == undefined) {
    groupkb = 100;
  }
  
  var yukomuko;
  var Yuko = $("#chkYuko").prop('checked');
  var Muko = $("#chkMuko").prop('checked');
  if(Yuko && Muko){
    yukomuko = 2;
  } else if (Yuko){
    yukomuko = 1;
  } else if (Muko){
    yukomuko = 0;
  }
  
  
  $('#footable').DataTable({
      bInfo: true,
      bSort: true,
      destroy: true,
      ajax: {
          url: "/getCustomer_Main/" + groupkb + "/" + yukomuko + "",
          dataType: "json",
          dataSrc: function ( json ) {
              return JSON.parse(json.data);
          },
          contentType:"application/json; charset=utf-8",
      },
      columns: [
          { data: 'id'     ,width: '25%'},
          { data: 'list'   ,width: '25%'},
          { data: 'name1'  ,width: '50%'}
      ],
      language: {
         url: "../static/main/js/japanese.json"
      },
      "scrollY":        "500px",
      "pageLength": 1000,
      "order": [ 1, "asc" ],
      "lengthMenu": [100, 300, 500, 1000],
      dom:"<'row'<'col-sm-12'tr>>" +
          "<'row'<'col-sm-6'l><'col-sm-6'f>>"+
          "<'row'<'col-sm-5'i><'col-sm-7'p>>"
  });
}