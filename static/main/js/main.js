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
  createDaichoTables_Main(0);
  
  //var domTableCustomer = $('#tableCustomer').DataTable();


  $('#tableCustomer tbody').on( 'click', 'tr', function () {
    //顧客テーブルから指定したレコード
    var rowData =   $('#tableCustomer').DataTable().row( this ).data();
    $('#subAtitle')[0].innerText = rowData.id + "," + rowData.name1 + " " + "へ追加する商品を選択してください。";
    createDaichoTables_Main(rowData.id);
  } );
});










$('#btnDaichoAdd').on('click', function() {
  var sendParam = $(".row_selected.customer").find("td:eq(0)").text() + "," +
                  $(".row_selected.addDaicho").find("td:eq(0)").text() + "," +
                  $("#inpDaichoAddMon").val() + "," +
                  $("#inpDaichoAddTue").val() + "," +
                  $("#inpDaichoAddWed").val() + "," +
                  $("#inpDaichoAddThu").val() + "," +
                  $("#inpDaichoAddFri").val() + "," +
                  $("#inpDaichoAddSat").val() + "," +
                  $("#inpDaichoAddSun").val() ;
  $.ajax({
      type: "GET",
      url: "/updAddDaicho/" + sendParam + "",
      success: function(data) {
          $("#modalAddDaichoMessageArea").append("更新しました。");
          setTimeout('$("#modalAddDaichoMessageArea")[0].innerText="";', 3000);
      },
      error: function(data){
          alert("エラー：" + data.statusText);
      }
  })
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


/*
|| 台帳追加サブ画面のテーブル作成
*/
function createItemTables_DaichoSub(){
    
  $('#tableAddDaicho').DataTable({
      bInfo: false,
      bSort: true,
      destroy: true,
      "processing": true,
      ajax: {
          url: "/getItem_Daicho",
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
          { data: 'id'     ,width: '10%'},
          { data: 'code'   ,width: '10%'},
          { data: 'name1'  ,width: '45%'},
          { data: 'tanka'  ,width: '10%' ,className: 'dt-body-right' ,render: function (data, type, row) { return (data*1).toLocaleString();} },
          { data: null     ,width: '25%' ,render: 
              function (data, type, row) { 
                  //row.id が $('#tableDaicho').DataTable().rows().data() に含まれるかどうか検査
                  var rows = $('#tableDaicho').DataTable().rows().data();
                  for(var i=0; i<rows.length; i++){
                      if(rows[i].item_id == row.id){
                          var ret = ""
                          if(rows[i].getu != 0){ ret = ret + "月" + rows[i].getu + "　" ;}
                          if(rows[i].ka   != 0){ ret = ret + "火" + rows[i].ka   + "　" ;}
                          if(rows[i].sui  != 0){ ret = ret + "水" + rows[i].sui  + "　" ;}
                          if(rows[i].moku != 0){ ret = ret + "木" + rows[i].moku + "　" ;}
                          if(rows[i].kin  != 0){ ret = ret + "金" + rows[i].kin  + "　" ;}
                          if(rows[i].dou  != 0){ ret = ret + "土" + rows[i].dou  + "　" ;}
                          if(rows[i].niti != 0){ ret = ret + "日" + rows[i].niti + "　" ;}
                          return ret;
                      }
                  }
                  return "";
              }
          }
      ],
      language: {
         url: "../static/main/js/japanese.json"
      },
      "scrollY":"400px",
      order: [[ 4, "desc" ],[ 1, "asc" ],[ 3, "asc" ]],
      "pageLength": 1000,
      paging: false,
      "lengthMenu": [100, 300, 500, 1000],
      dom:"<'row'<'col-sm-6'l><'col-sm-6'f>>"+
          "<'row'<'col-sm-12'tr>>" +
          "<'row'<'col-sm-5'i><'col-sm-7'p>>",
      "fnRowCallback": function( nRow, row, iDisplayIndex, iDisplayIndexFull ) {
          var rows = $('#tableDaicho').DataTable().rows().data();
          for(var i=0; i<rows.length; i++){
              if(rows[i].item_id == row.id){
                  //$('td:eq(2)', nRow).html( '<b>1</b>' );
                  nRow.style.backgroundColor = "#ffefe0";
              }
          }
      }
  }).columns.adjust().draw();
}



/*
|| 台帳サブ画面起動[直後]イベント
*/
$('#modalAddDaicho').on("shown.bs.modal", function (e) {
    createItemTables_DaichoSub();
});


/*
|| 台帳サブ画面起動[直前]イベント
*/
$('#modalAddDaicho').on("show.bs.modal", function (e) {
    var a = $('#tableAddDaicho').dataTable({
       destroy: true
   });
   a.fnClearTable();
});


/*
|| メイン中央の台帳テーブルを作成
*/
function createDaichoTables_Main(customerId){
    //台帳データテーブルを作成
    $("#tableDaicho").DataTable({
        bInfo: true,
        bSort: false,
        destroy: true,
        "processing": true,
        ajax: {
            url: "/getVDaichoA_ByCusotmerId/" + customerId + "",
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
            { data: 'tanka'       ,width: '12%'   ,className: 'dt-body-right'  ,render: function (data, type, row) { return (data*1).toLocaleString();} },
            { data: 'getu'        ,width: '5%'    ,className: 'dt-body-center' ,render: function (data, type, row) { return (data==0 ? '' : data);} },
            { data: 'ka'          ,width: '5%'    ,className: 'dt-body-center' ,render: function (data, type, row) { return (data==0 ? '' : data);} },
            { data: 'sui'         ,width: '5%'    ,className: 'dt-body-center' ,render: function (data, type, row) { return (data==0 ? '' : data);} },
            { data: 'moku'        ,width: '5%'    ,className: 'dt-body-center' ,render: function (data, type, row) { return (data==0 ? '' : data);} },
            { data: 'kin'         ,width: '5%'    ,className: 'dt-body-center' ,render: function (data, type, row) { return (data==0 ? '' : data);} },
            { data: 'dou'         ,width: '5%'    ,className: 'dt-body-center' ,render: function (data, type, row) { return (data==0 ? '' : data);} },
            { data: 'niti'        ,width: '5%'    ,className: 'dt-body-center' ,render: function (data, type, row) { return (data==0 ? '' : data);} }
        ],
        language: {
           url: "../static/main/js/japanese.json"
        },
        "scrollY":        "100px",
        "pageLength": 1000,
        searching: false,
        info: false,
        paging: false,
        "order": [ 0, "asc" ],
        "lengthMenu": [100, 300, 500, 1000],
        dom:"<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-6'l><'col-sm-6'f>>"+
            "<'row'<'col-sm-5'i><'col-sm-7'p>>"
    });
}

function fncNumOnly(){
    var inp = $(event.srcElement).val();
    inp = inp.replace("０","0");
    inp = inp.replace("１","1");
    inp = inp.replace("２","2");
    inp = inp.replace("３","3");
    inp = inp.replace("４","4");
    inp = inp.replace("５","5");
    inp = inp.replace("６","6");
    inp = inp.replace("７","7");
    inp = inp.replace("８","8");
    inp = inp.replace("９","9");
    $(event.srcElement).val(inp.replace(/[^0-9]+/i,''));
}

/*
|| メイン左の顧客テーブルを作成
*/
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
          { data: 'list'   ,width: '25%' ,  className: 'dt-body-center'},
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



$("#tableCustomer tbody").on('click',function(event) {
    $("#tableCustomer").removeClass('row_selected customer');        
    $("#tableCustomer tbody tr").removeClass('row_selected customer');        
    $("#tableCustomer tbody td").removeClass('row_selected customer');        
    $(event.target.parentNode).addClass('row_selected customer');
    
});

$("#tableDaicho tbody").on('click',function(event) {
    $("#tableDaicho").removeClass('row_selected daicho');        
    $("#tableDaicho tbody tr").removeClass('row_selected daicho');        
    $("#tableDaicho tbody td").removeClass('row_selected daicho');        
    $(event.target.parentNode).addClass('row_selected daicho');
    
});


$("#tableAddDaicho tbody").on('click',function(event) {
    $("#tableAddDaicho").removeClass('row_selected addDaicho');        
    $("#tableAddDaicho tbody tr").removeClass('row_selected addDaicho');        
    $("#tableAddDaicho tbody td").removeClass('row_selected addDaicho');        
    $(event.target.parentNode).addClass('row_selected addDaicho');
    
});

