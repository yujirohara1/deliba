$(document).ready(function() {
    $('#footable').DataTable({
        bInfo: true,
        bSort: true,
        ajax: {
            url: "/getCustomer_Main", //"/api",
            dataType: "json",
            dataSrc: function ( json ) {
                //console.log(tmpdata);
                //console.log(JSON.parse(json.data));
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
  var str = $(this).val();
  alert(str);
});
