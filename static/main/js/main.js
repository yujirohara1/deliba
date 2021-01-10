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
  createSeikyuTables_Main(362,202011);
  
  //var domTableCustomer = $('#tableCustomer').DataTable();


});

$('#btnDaichoAdd').on('click', function() {
  var customerid = $(".row_selected.customer").find("td:eq(0)").text();
  var sendParam = customerid + "," +
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
          $("#modalAddDaichoMessageArea").append("<p style='color:red'>更新しました。</p>");
          setTimeout('$("#modalAddDaichoMessageArea")[0].innerText="";', 3000);
      },
      error: function(data){
          alert("エラー：" + data.statusText);
      }
  });
  createDaichoTables_Main(customerid);
  createItemTables_DaichoSub();
});




function getAllYoubiByNentuki(nen, tuki){
    var ret=[];
    var dayOfWeekStr = [ "日", "月", "火", "水", "木", "金", "土" ];
    
    for(i=1; i<=31; i++){
        var d = new Date(nen + '/' + tuki + '/' +  ('00'+i).slice(-2));
        ret.push(dayOfWeekStr[d.getDay()]);
    }
    
    return ret;
}




/*
|| メイン下部の請求テーブルを作成
*/
function createSeikyuTables_Main(customerId, nentuki){
    var youbiWa = getAllYoubiByNentuki((nentuki+"").substr(0,4), (nentuki+"").substr(4,2));
    
    //台帳データテーブルを作成
    $("#tableSeikyu").DataTable({
        bInfo: false,
        bSort: false,
        destroy: true,
        "processing": true,
        ajax: {
            url: "/getVSeikyuA_ByCusotmerIdAndTuki/" + customerId + "/" + nentuki + "",
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
            { data: 'item_id'     ,width: '7%'},
            { data: 'item_name1'  ,width: '34%'},
            { data: 'price'          ,width: '7%'   ,className: 'dt-body-right'  ,render: function (data, type, row) { return (data*1).toLocaleString();} },
            { data: 'quantity_d01', title: youbiWa[0]  ,width: '2%'    ,className: 'dt-body-center' ,render: function (data, type, row) { return (data==0 ? '' : data);} },
            { data: 'quantity_d02', title: youbiWa[1]  ,width: '2%'    ,className: 'dt-body-center' ,render: function (data, type, row) { return (data==0 ? '' : data);} },
            { data: 'quantity_d03', title: youbiWa[2]  ,width: '2%'    ,className: 'dt-body-center' ,render: function (data, type, row) { return (data==0 ? '' : data);} },
            { data: 'quantity_d04', title: youbiWa[3]  ,width: '2%'    ,className: 'dt-body-center' ,render: function (data, type, row) { return (data==0 ? '' : data);} },
            { data: 'quantity_d05', title: youbiWa[4]  ,width: '2%'    ,className: 'dt-body-center' ,render: function (data, type, row) { return (data==0 ? '' : data);} },
            { data: 'quantity_d06', title: youbiWa[5]  ,width: '2%'    ,className: 'dt-body-center' ,render: function (data, type, row) { return (data==0 ? '' : data);} },
            { data: 'quantity_d07', title: youbiWa[6]  ,width: '2%'    ,className: 'dt-body-center' ,render: function (data, type, row) { return (data==0 ? '' : data);} },
            { data: 'quantity_d08', title: youbiWa[7]  ,width: '2%'    ,className: 'dt-body-center' ,render: function (data, type, row) { return (data==0 ? '' : data);} },
            { data: 'quantity_d09', title: youbiWa[8]  ,width: '2%'    ,className: 'dt-body-center' ,render: function (data, type, row) { return (data==0 ? '' : data);} },
            { data: 'quantity_d10', title: youbiWa[9]  ,width: '2%'    ,className: 'dt-body-center' ,render: function (data, type, row) { return (data==0 ? '' : data);} },
            { data: 'quantity_d11', title: youbiWa[10]  ,width: '2%'    ,className: 'dt-body-center' ,render: function (data, type, row) { return (data==0 ? '' : data);} },
            { data: 'quantity_d12', title: youbiWa[11]  ,width: '2%'    ,className: 'dt-body-center' ,render: function (data, type, row) { return (data==0 ? '' : data);} },
            { data: 'quantity_d13', title: youbiWa[12]  ,width: '2%'    ,className: 'dt-body-center' ,render: function (data, type, row) { return (data==0 ? '' : data);} },
            { data: 'quantity_d14', title: youbiWa[13]  ,width: '2%'    ,className: 'dt-body-center' ,render: function (data, type, row) { return (data==0 ? '' : data);} },
            { data: 'quantity_d15', title: youbiWa[14]  ,width: '2%'    ,className: 'dt-body-center' ,render: function (data, type, row) { return (data==0 ? '' : data);} },
            { data: 'quantity_d16', title: youbiWa[15]  ,width: '2%'    ,className: 'dt-body-center' ,render: function (data, type, row) { return (data==0 ? '' : data);} },
            { data: 'quantity_d17', title: youbiWa[16]  ,width: '2%'    ,className: 'dt-body-center' ,render: function (data, type, row) { return (data==0 ? '' : data);} },
            { data: 'quantity_d18', title: youbiWa[17]  ,width: '2%'    ,className: 'dt-body-center' ,render: function (data, type, row) { return (data==0 ? '' : data);} },
            { data: 'quantity_d19', title: youbiWa[18]  ,width: '2%'    ,className: 'dt-body-center' ,render: function (data, type, row) { return (data==0 ? '' : data);} },
            { data: 'quantity_d20', title: youbiWa[19]  ,width: '2%'    ,className: 'dt-body-center' ,render: function (data, type, row) { return (data==0 ? '' : data);} },
            { data: 'quantity_d21', title: youbiWa[20]  ,width: '2%'    ,className: 'dt-body-center' ,render: function (data, type, row) { return (data==0 ? '' : data);} },
            { data: 'quantity_d22', title: youbiWa[21]  ,width: '2%'    ,className: 'dt-body-center' ,render: function (data, type, row) { return (data==0 ? '' : data);} },
            { data: 'quantity_d23', title: youbiWa[22]  ,width: '2%'    ,className: 'dt-body-center' ,render: function (data, type, row) { return (data==0 ? '' : data);} },
            { data: 'quantity_d24', title: youbiWa[23]  ,width: '2%'    ,className: 'dt-body-center' ,render: function (data, type, row) { return (data==0 ? '' : data);} },
            { data: 'quantity_d25', title: youbiWa[24]  ,width: '2%'    ,className: 'dt-body-center' ,render: function (data, type, row) { return (data==0 ? '' : data);} },
            { data: 'quantity_d26', title: youbiWa[25]  ,width: '2%'    ,className: 'dt-body-center' ,render: function (data, type, row) { return (data==0 ? '' : data);} },
            { data: 'quantity_d27', title: youbiWa[26]  ,width: '2%'    ,className: 'dt-body-center' ,render: function (data, type, row) { return (data==0 ? '' : data);} },
            { data: 'quantity_d28', title: youbiWa[27]  ,width: '2%'    ,className: 'dt-body-center' ,render: function (data, type, row) { return (data==0 ? '' : data);} },
            { data: 'quantity_d29', title: youbiWa[28]  ,width: '2%'    ,className: 'dt-body-center' ,render: function (data, type, row) { return (data==0 ? '' : data);} },
            { data: 'quantity_d30', title: youbiWa[29]  ,width: '2%'    ,className: 'dt-body-center' ,render: function (data, type, row) { return (data==0 ? '' : data);} },
            { data: 'quantity_d31', title: youbiWa[30]  ,width: '2%'    ,className: 'dt-body-center' ,render: function (data, type, row) { return (data==0 ? '' : data);} }
        ],
        language: {
           url: "../static/main/js/japanese.json"
        },
        "scrollY":        "150px",
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
          { data: 'name1'  ,width: '40%'},
          { data: 'tanka'  ,width: '10%' ,className: 'dt-body-right' ,render: function (data, type, row) { return (data*1).toLocaleString();} },
          { data: null     ,width: '30%' ,render: 
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
      "scrollY":$(window).height() * 30 / 100,
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
        "scrollY":        "150px",
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
      bInfo: false,
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
          { data: 'list'   ,width: '30%' ,  className: 'dt-body-center'},
          { data: 'name1'  ,width: '45%'}
      ],
      language: {
         url: "../static/main/js/japanese.json"
      },
      "scrollY":        $(window).height() * 35 / 100,
      "pageLength": 1000,
      paging:false,
      "order": [ 1, "asc" ],
      "lengthMenu": [100, 300, 500, 1000],
      dom:"<'row'<'col-sm-12'tr>>" +
          "<'row'<'col-sm-6'l><'col-sm-6'f>>"+
          "<'row'<'col-sm-5'i><'col-sm-7'p>>"
  });
}


$('#tableAddDaicho tbody').on( 'click', 'tr', function () {
   
   $("#inpDaichoAddMon").val("");
   $("#inpDaichoAddTue").val("");
   $("#inpDaichoAddWed").val("");
   $("#inpDaichoAddThu").val("");
   $("#inpDaichoAddFri").val("");
   $("#inpDaichoAddSat").val("");
   $("#inpDaichoAddSun").val("");
   
   var row =   $('#tableAddDaicho').DataTable().row( this ).data(); // 選択データ
   var rows = $('#tableDaicho').DataTable().rows().data(); // 台帳データ
   for(var i=0; i<rows.length; i++){
       if(rows[i].item_id == row.id){
           if(rows[i].getu != 0){ $("#inpDaichoAddMon").val(rows[i].getu);}
           if(rows[i].ka   != 0){ $("#inpDaichoAddTue").val(rows[i].ka  );}
           if(rows[i].sui  != 0){ $("#inpDaichoAddWed").val(rows[i].sui );}
           if(rows[i].moku != 0){ $("#inpDaichoAddThu").val(rows[i].moku);}
           if(rows[i].kin  != 0){ $("#inpDaichoAddFri").val(rows[i].kin );}
           if(rows[i].dou  != 0){ $("#inpDaichoAddSat").val(rows[i].dou );}
           if(rows[i].niti != 0){ $("#inpDaichoAddSun").val(rows[i].niti);}
       }
   }
  
} );



$('#tableCustomer tbody').on( 'click', 'tr', function () {
  //顧客テーブルから指定したレコード
  var rowData =   $('#tableCustomer').DataTable().row( this ).data();
  $('#subAtitle')[0].innerText = rowData.id + "," + rowData.name1 + " " + "へ追加する商品を選択してください。";
  createDaichoTables_Main(rowData.id);
  createSeikyuTables_Main(362,202011);
} );






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

