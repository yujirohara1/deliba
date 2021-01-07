$(document).ready(function() {
    createCustomerTables_Main(100);
});

$(document).ready(function() {

  var select = $('#selGroupKb');
  $.getJSON("/getMstSetting_Main", function(json) {
    list = JSON.parse(json.data);
    $.each(list, function(i, item) {
        var option = $('<option>').text(item.param_val1).val(item.param_no);
        select.append(option);
    });
  });
});
  
$("#selGroupKb").change(function(){
    createCustomerTables_Main($(this).val());
});





function createCustomerTables_Main(groupkb){
  $('#footable').DataTable({
      bInfo: true,
      bSort: true,
      destroy: true,
      ajax: {
          url: "/getCustomer_Main/" + groupkb + "",
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
      "lengthMenu": [100, 300, 500, 1000],
      dom:"<'row'<'col-sm-12'tr>>" +
          "<'row'<'col-sm-6'l><'col-sm-6'f>>"+
          "<'row'<'col-sm-5'i><'col-sm-7'p>>"
  });
}