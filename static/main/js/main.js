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
  
  
  //var domTableCustomer = $('#tableCustomer').DataTable();


  $("#tableCustomer tbody").on('click',function(event) {
      $("#tableCustomer").removeClass('row_selected');        
      $("#tableCustomer tbody tr").removeClass('row_selected');        
      $("#tableCustomer tbody td").removeClass('row_selected');        
      $(event.target.parentNode).addClass('row_selected');
      
  });
 
  $('#tableCustomer tbody').on( 'click', 'tr', function () {
  
    //顧客テーブルから指定したレコード
    var rowData =   $('#tableCustomer').DataTable().row( this ).data();
    
    //台帳データテーブルを作成
    $("#tableDaicho").DataTable({
        bInfo: true,
        bSort: false,
        destroy: true,
        "processing": true,
        ajax: {
            url: "/getVDaichoA_ByCusotmerId/" + rowData.id + "",
            dataType: "json",
            dataSrc: function ( json ) {
                return JSON.parse(json.data);
            },
            contentType:"application/json; charset=utf-8",
            complete: function () {
                return; 
            }
        },
        columns: [
            { data: 'item_id'     ,width: '12%'},
            { data: 'iname1'      ,width: '41%'},
            { data: 'tanka'       ,width: '12%'},
            { data: 'getu'        ,width: '5%'},
            { data: 'ka'          ,width: '5%'},
            { data: 'sui'         ,width: '5%'},
            { data: 'moku'        ,width: '5%'},
            { data: 'kin'         ,width: '5%'},
            { data: 'dou'         ,width: '5%'},
            { data: 'niti'        ,width: '5%'}
        ],
        language: {
           url: "../static/main/js/japanese.json"
        },
        "scrollY":        "100px",
        "pageLength": 1000,
        searching: false,
        info: false,
        paging: false,
        "order": [ 1, "asc" ],
        "lengthMenu": [100, 300, 500, 1000],
        dom:"<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-6'l><'col-sm-6'f>>"+
            "<'row'<'col-sm-5'i><'col-sm-7'p>>"
    });
    
  } );

  
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
  //var domTableCustomer = $('#tableCustomer').DataTable();
  //
  //domTableCustomer = null;
  //
  //if (domTableCustomer) {
  //    // 二回目以降の描画の場合、初期化が必要
  //    //domTableCustomer.fnDestroy();
  //    domTableCustomer.state.clear();
  //    domTableCustomer.destroy();
  //    $("#tableCustomer tbody > tr").remove();  // $("#result-table tbody").empty();で良い
  //    $("#tableCustomer tbody").empty();
  //}
    
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
  
  
  $('#tableCustomer').DataTable({
      bInfo: true,
      bSort: true,
      destroy: true,
      "processing": true,
      ajax: {
          url: "/getCustomer_Main/" + groupkb + "/" + yukomuko + "",
          dataType: "json",
          dataSrc: function ( json ) {
              return JSON.parse(json.data);
          },
          contentType:"application/json; charset=utf-8",
          complete: function () {
              return; 
          }
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



