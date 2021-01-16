var DELIMIT = "@|@|@";

$(document).ready(function() {

  $.getJSON("/getMstSetting_Main/GROUP_KB", function(json) {
    list = JSON.parse(json.data);
    $.each(list, function(i, item) {
        var option = $('<option>').text(item.param_val1).val(item.param_no);
        $('#selGroupKb').append(option);
    });
  });
  
  $.getJSON("/getMstSetting_Main/GROUP_KB", function(json) {
    list = JSON.parse(json.data);
    $.each(list, function(i, item) {
        var option = $('<option>').text(item.param_val1).val(item.param_no);
        $('#selCustomerGroupKb').append(option);
    });
  });
  
  
  $.getJSON("/getMstSetting_Main/START_YM", function(json) {
    list = JSON.parse(json.data);
    if(list.length == 1){
      var y = list[0].param_val1.substring(0,4)*1;
      var m = list[0].param_val1.substring(4,6)*1-1;
      var dt = new Date(y, m, 15);
      var today = new Date(); 
      today.setMonth(today.getMonth() + 2);
      
      var ymFrom = dt.getFullYear() + "" + ("0"+dt.getMonth()).slice(-2);
      var ymTo =  today.getFullYear() + "" + ("0"+today.getMonth()).slice(-2);
      ymFrom = ymFrom * 1;
      ymTo = ymTo * 1;
      
      while (ymFrom <= ymTo) {
          var option = $('<option>').text(dt.getFullYear() + "年" + " " + (dt.getMonth()*1+1) + "月").val(dt.getFullYear() + "" + (("00"+(dt.getMonth()*1+1)).slice(-2)));
          $('#selNentuki').append(option);
          
          dt.setMonth(dt.getMonth() + 1);
          ymFrom = dt.getFullYear() + "" + ("0"+dt.getMonth()).slice(-2);
          ymFrom = ymFrom * 1;
      }
      
    }else{
      alert("エラー：START_YMがありません");
    }
  });
  
  
  $.getJSON("/getMstSetting_Main/SIHARAI_KB", function(json) {
    list = JSON.parse(json.data);
    $.each(list, function(i, item) {
        var option = $('<option>').text(item.param_val1).val(item.param_no);
        $('#selHaraiKb').append(option);
    });
  });
  
  $.getJSON("/getMstSetting_Main/CUSTOMER_ZEI_KB", function(json) {
    list = JSON.parse(json.data);
    $.each(list, function(i, item) {
        var option = $('<option>').text(item.param_val1).val(item.param_no);
        $('#selCustomerZeiKb').append(option);
    });
  });
  
  
  
   
  
  createCustomerTables_Main();
  createDaichoTables_Main(0);
  createSeikyuTables_Main(0,$('#selNentuki').val());
  
  
  //var domTableCustomer = $('#tableCustomer').DataTable();


});














/*
|| 請求書印刷
*/
$('#btnSeikyuPrint').on('click', function() {
  var randnum = Math.floor(Math.random()*10101010101)
  var customerid = $(".row_selected.customer").find("td:eq(0)").text();
  var nentuki = $('#selNentuki').val();
  $.ajax({
      type: "GET",
      url: "/printSeikyu/" + customerid + "/" + nentuki + "/" + randnum + "",
      success: function(data) {
          var blob=new Blob([data], {type: "application/pdf"});//
          var link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = "" + Math.random().toString(32).substring(2) + ".pdf";
          link.click();
      },
      error: function(data){
          alert("エラー：" + data.statusText);
      }
  });
});




/*
|| 請求データ作成
*/
$('#btnSeikyuCreate').on('click', function() {
  var customerid = $(".row_selected.customer").find("td:eq(0)").text();
  var nentuki = $('#selNentuki').val();
  $.ajax({
      type: "GET",
      url: "/createSeikyu/" + customerid + "/" + nentuki + "",
      success: function(data) {
          //alert(data);
          createSeikyuTables_Main(customerid,nentuki);
      },
      error: function(data){
          alert("エラー：" + data.statusText);
      }
  });
});





/*
|| 顧客情報更新
*/
$('#btnUpdateCustomer').on('click', function() {
  var customerid = $(".row_selected.customer").find("td:eq(0)").text();
  var param = $('#txtCustomerName').val() + DELIMIT + 
              $('#txtCustomerKana').val() + DELIMIT + 
              $('#txtAddress1').val() + DELIMIT + 
              $('#txtTel1').val() + DELIMIT + 
              $('#selHaraiKb').val() + DELIMIT + 
              $('#selCustomerGroupKb').val() + DELIMIT + 
              $('#selCustomerZeiKb').val() + DELIMIT + 
              $('#txtTantoName').val() + DELIMIT + 
              $('#txtList').val();
  //alert(param);
  
  $.ajax({
      type: "GET",
      url: "/updateCustomer/" + customerid + "/" + param + "",
      success: function(data) {
        $("#mainUpdCustomerMessageArea").append("<p style='color:red'>更新しました。</p>");
        setTimeout('$("#mainUpdCustomerMessageArea")[0].innerText="";', 3000);
          createCustomerTables_Main();
      },
      error: function(data){
          alert("エラー：" + data.statusText);
      }
  });
});

$('#btnListHenko').on('click', function() {
    $('#tableCustomerListHenko').hide();
    $('#modalUpdList').modal();
});


function createListHenkoTables_Main(){
    $('#divUpdateListReserveArea').html("&nbsp;");
    var groupkb = $("#selGroupKb").val();
    if(groupkb == undefined) {
      groupkb = 100;
    }
    
    var table = $('#tableCustomerListHenko').DataTable( {
            bInfo: false,
            bSort: true,
            destroy: true,
            ajax: {
                url: "/getCustomer_Main/" + groupkb + "/" + 1 + "",
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
                { data: 'list'      ,width: '30%' ,  className: 'dt-body-center'},
                { data: 'id'        ,width: '5%'},
                { data: 'name1'     ,width: '30%'},
                { data: 'address1'  ,width: '35%'}
            ],
            rowReorder: {
                dataSrc: 'list',
            },
            "aoColumnDefs": [
                { 'bSortable': false, 'aTargets': [ 0 ] },
                { 'bSortable': false, 'aTargets': [ 1 ] },
                { 'bSortable': false, 'aTargets': [ 2 ] },
                { 'bSortable': false, 'aTargets': [ 3 ] }
             ],
            "processing": true,
            language: {
               url: "../static/main/js/japanese.json"
            },
            "scrollY":        "300",
            "pageLength": 1000,
            searching: false,
            paging: false,
            "order": [ 0, "asc" ],
            "fnRowCallback": function( nRow, row, iDisplayIndex, iDisplayIndexFull ) {
                    if(toNumber(row.list) != toNumber(row.address3)){
                        $('td:eq(0)', nRow).html( row.list + "（変更前：" + toNumber(row.address3) + "）" );
                        nRow.style.backgroundColor = "#ffefe0";
                    }else{
                        nRow.style.backgroundColor = "";
                    }
            }
    } );

    $('#tableCustomerListHenko').show();
}


function createListMukoTables_Main(){
    $('#divUpdateListReserveArea').html("&nbsp;");
    var groupkb = $("#selGroupKb").val();
    if(groupkb == undefined) {
      groupkb = 100;
    }
    
    var table = $('#tableCustomerListMuko').DataTable( {
            bInfo: false,
            bSort: true,
            destroy: true,
            ajax: {
                url: "/getCustomer_Main/" + groupkb + "/" + 0 + "",
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
                { data: 'id'        ,width: '20%'},
                { data: 'name1'     ,width: '50%'},
                { data: 'address3'  ,width: '30%'}
            ],
            "processing": true,
            language: {
               url: "../static/main/js/japanese.json"
            },
            "scrollY":        "300",
            "pageLength": 1000,
            searching: true,
            paging: false,
            "order": [[ 2, "desc" ],[ 0, "desc" ]],
        dom:"<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-6'l><'col-sm-6'f>>"+
            "<'row'<'col-sm-5'i><'col-sm-7'p>>"
    } );

    $('#tableCustomerListMuko').show();
}

$('#modalUpdList').on("shown.bs.modal", function (e) {
  $('#guideListHenko').html("①配達順を変更したいデータの「氏名」をダブルクリック<br>②移動させたい位置でシングルクリック");
  createListHenkoTables_Main();
  createListMukoTables_Main();
});

var listChangeTarget = null;

$('#tableCustomerListHenko tbody').on('dblclick', 'tr', function () {
    if (IsNull_ChangeListTarget()==false){
        return;
    }
    ReserveHenkoCustomer(this, "#tableCustomerListHenko");
    
} );

$('#tableCustomerListMuko tbody').on('dblclick', 'tr', function () {
    if (IsNull_ChangeListTarget()==false){
        return;
    }
    ReserveHenkoCustomer(this, "#tableCustomerListMuko");
    
} );


/*
|| 左右の表のダブルクリック時にリザーブエリアに一時移動。
*/
function ReserveHenkoCustomer(eventObj, tableId){
    listChangeTarget = null;
    var scrpos = $(tableId)[0].parentElement.scrollTop;
    var table = $(tableId).DataTable();
    var row = table.row(eventObj)
    var data = table.row(eventObj).data();
    var idx = table.row( eventObj ).index();
    table.row(idx).remove().draw();
    var customerName;
    if(data.list != null){
        customerName = data.list + " - " + data.id + " - " + data.name1 + " "
    }else{
        customerName = data.id + " - " + data.name1 + " "
    }
    listChangeTarget = JSON.stringify(data);
    
    var cancelTag;
    if(data.list ==null){
        cancelTag = customerName + "<a href='#' onclick='fncCancel_ListPickUp(" + listChangeTarget + ");'><span class='badge larger-badge'>戻す</span></a>";
    } else {
        cancelTag = customerName + "<a href='#' onclick='fncCancel_ListPickUp(" + listChangeTarget + ");'><span class='badge larger-badge'>戻す</span></a>&nbsp;&nbsp;<a href='#' onclick='fncToMuko_ListPickUp(" + listChangeTarget + ");'><span class='badge larger-badge'>宅配停止</span></a>";
    }
    
    $('#divUpdateListReserveArea').html(cancelTag);
    $(tableId)[0].parentElement.scrollTop = scrpos;
}


/*
|| リザーブエリアに持ってきた顧客情報を「宅配停止」バッジで右の表に移動
*/
function fncToMuko_ListPickUp(rowData){
    var tableMuko = $("#tableCustomerListMuko").DataTable();
    rowData.list = null;
    tableMuko.row.add(rowData).draw();
    $('#divUpdateListReserveArea').html("&nbsp;");
    
    
    var table = $('#tableCustomerListHenko').DataTable();
    var newData = [];
    var targetNum = JSON.parse(listChangeTarget).list;
    
    $.each(table.rows().data(), function(i, row){
    
        if(row.list > targetNum ){
            row.list--;
        }
        newData.push(row);
    });
    
    table.clear().draw();
    
    $.each(newData, function(i, row){
        table.row.add(row);
    });
    table.draw();
    
}


/*
|| リザーブエリアに持ってきた顧客情報を「戻す」バッジで元の位置に戻す
*/
function fncCancel_ListPickUp(rowData){
    var tableId = "#tableCustomerListHenko";
    if(rowData.list == null || toNumber(rowData.list) == 0){
        tableId = "#tableCustomerListMuko";
    }
    
    var scrpos = $(tableId)[0].parentElement.scrollTop;
    var table = $(tableId).DataTable();
    table.row.add(rowData).draw();
    $('#divUpdateListReserveArea').html("&nbsp;");
    $(tableId)[0].parentElement.scrollTop = scrpos;
}

/*
|| リザーブエリアが空白かどうかを検査
*/
function IsNull_ChangeListTarget(){
  var str = $('#divUpdateListReserveArea')[0].innerText.trim();
  if(str == " "){
      return true;
  }else if(str == ""){
      return true;
  }else if(str == "&nbsp;"){
      return true;
  }else{
      return false;
  }
}

$('#tableCustomerListHenko tbody').on('click', 'tr', function () {
    if (IsNull_ChangeListTarget()){
        return;
    }
    var scrpos = $('#tableCustomerListHenko')[0].parentElement.scrollTop;
    var table = $('#tableCustomerListHenko').DataTable();
    var selectNum = table.row(this).data().list;
    var ikubekiBasho = 0;
    
    var newData = [];
    var targetNum = JSON.parse(listChangeTarget).list;
    
    $.each(table.rows().data(), function(i, row){
    
        if(targetNum != null){ //アクティブユーザの移動
           if(selectNum > targetNum){ //上にいるデータを下に持っていく場合
              ikubekiBasho = selectNum;
              if(selectNum >= row.list && row.list > targetNum ){
                  row.list--;
              }
           } else if(selectNum+1 == targetNum){ //元の位置に戻す場合
              ikubekiBasho = selectNum+1;
           } else if(selectNum < targetNum){ //下にいるデータを上に持っていく場合
              ikubekiBasho = selectNum+1;
              if(selectNum < row.list && row.list < targetNum ){
                  row.list++;
              }
           }
        } else { //パッシブユーザの移動（無効データの有効化）
            if(selectNum < row.list){
                row.list++;
            }
        }
        newData.push(row);
    });
    
    //パッシブユーザの移動では、現在順がnullのためselectNum+1を入れる
    if(targetNum == null){
        ikubekiBasho = selectNum+1;
    }
    
    table.clear().draw();
    
    $.each(newData, function(i, row){
        table.row.add(row);
    });
    
    d = JSON.parse(listChangeTarget);
    d.list = ikubekiBasho;
    table.row.add(d).draw();
    
    $('#tableCustomerListHenko')[0].parentElement.scrollTop = scrpos;
    $('#divUpdateListReserveArea').html("&nbsp;");
} );




$('#btnUpdList').on('click', function() {
    alert(1);
});

/*
|| 台帳情報更新
*/
$('#btnDaichoAdd').on('click', function() {
  var customerid = toNumber($(".row_selected.customer").find("td:eq(0)").text());
  var sendParam = customerid + "," +
                  $(".row_selected.addDaicho").find("td:eq(0)").text() + "," +
                  toNumber($("#inpDaichoAddMon").val()) + "," +
                  toNumber($("#inpDaichoAddTue").val()) + "," +
                  toNumber($("#inpDaichoAddWed").val()) + "," +
                  toNumber($("#inpDaichoAddThu").val()) + "," +
                  toNumber($("#inpDaichoAddFri").val()) + "," +
                  toNumber($("#inpDaichoAddSat").val()) + "," +
                  toNumber($("#inpDaichoAddSun").val()) ;
                  
  var tmpTotal = 
    toNumber($("#inpDaichoAddMon").val())+
    toNumber($("#inpDaichoAddTue").val())+
    toNumber($("#inpDaichoAddWed").val())+
    toNumber($("#inpDaichoAddThu").val())+
    toNumber($("#inpDaichoAddFri").val())+
    toNumber($("#inpDaichoAddSat").val())+
    toNumber($("#inpDaichoAddSun").val());
  
  var itemid = toNumber($(".row_selected.addDaicho").find("td:eq(0)").text());
  $("#modalAddDaichoMessageArea")[0].innerText="";
  
  if(tmpTotal==0 && $(".row_selected.addDaicho").find("td:eq(4)").text()==""){
    $("#modalAddDaichoMessageArea").append("<p style='color:red'>本数を入力してください。</p>");
    setTimeout('$("#modalAddDaichoMessageArea")[0].innerText="";', 3000);
    return;
  }
  
  if(itemid==0){
    $("#modalAddDaichoMessageArea").append("<p style='color:red'>商品が選択されていません。</p>");
    setTimeout('$("#modalAddDaichoMessageArea")[0].innerText="";', 3000);
    return;
  }
  
  if(customerid==0){
    $("#modalAddDaichoMessageArea").append("<p style='color:red'>顧客情報が選択されていません。</p>");
    setTimeout('$("#modalAddDaichoMessageArea")[0].innerText="";', 3000);
    return;
  }
  
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



function toNumber(val){
  if(isNaN(parseInt(val))){
      return 0;
  }
  
  var ret = 0;
  try{
    ret = val * 1;
  }catch(e){
    ret = 0;
  }
  return ret;
}



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



























$("#selNentuki").change(function(){
  var customerid = $(".row_selected.customer").find("td:eq(0)").text();
  if(customerid!=0){
    createDaichoTables_Main(customerid);
    createSeikyuTables_Main(customerid,$('#selNentuki').val());
  }
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
   var customerid = toNumber($(".row_selected.customer").find("td:eq(0)").text());
   if(customerid==0){
     $("#mainAddDaichoMessageArea")[0].innerText="";
     $("#mainAddDaichoMessageArea").append("<p style='color:red'>左のリストから顧客を選択してください。</p>");
     setTimeout('$("#mainAddDaichoMessageArea")[0].innerText="";', 3000);
     return false;
   }
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
var pageScrollPos = 0;
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
  
  pageScrollPos = $('#tableCustomer')[0].parentElement.scrollTop;
  
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
          "<'row'<'col-sm-5'i><'col-sm-7'p>>",
    "preDrawCallback": function (settings) {
      return;
    },
    "drawCallback": function (settings) {
        //$('div.dataTables_scrollBody').scrollTop(pageScrollPos);
        $('#tableCustomer')[0].parentElement.scrollTop = pageScrollPos;
    }
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
  createSeikyuTables_Main(rowData.id,$('#selNentuki').val());
  $('#txtCustomerName').val(rowData.name1);
  $('#txtCustomerKana').val(rowData.name2);
  $('#txtAddress1').val(rowData.address1);
  $('#txtTel1').val(rowData.tel1);
  $('#selHaraiKb').val(rowData.harai_kb);
  $('#selCustomerGroupKb').val(rowData.group_id);
  $('#selCustomerZeiKb').val(rowData.biko2);
  $('#txtTantoName').val(rowData.biko3);
  $('#txtList').val(rowData.list);
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




$("#tableCustomerListMuko tbody").on('click',function(event) {
    $("#tableCustomerListMuko").removeClass('row_selected listMuko');        
    $("#tableCustomerListMuko tbody tr").removeClass('row_selected listMuko');        
    $("#tableCustomerListMuko tbody td").removeClass('row_selected listMuko');        
    $(event.target.parentNode).addClass('row_selected listMuko');
    
});
