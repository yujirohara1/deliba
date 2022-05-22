var DELIMIT = "@|@|@";
var grantLev = 0;
var systemMode = 0;

    
$(function () {
    $('#inpOrderMonthJoken').datetimepicker({
        locale: 'ja',
        format : 'YYYY-MM'
    });

    $('.date').datetimepicker({
        locale: 'ja',
        format : 'YYYY-MM-DD'
    });
    $.getJSON("/getMstSetting_Main/BACK_COLOR", function(json) {
        list = JSON.parse(json.data);
        $.each(list, function(i, item) {
            document.body.style.backgroundColor=item.param_val1;
        });
    });
});



function getMonth12(m, add=0){
    return ("0" + (toNumber(m+add)+1)).slice(-2);
}

function getLastDateOfMonth(yyyy,mm){
    var tmp1 = new Date(yyyy, mm, 1);
    tmp1.setMonth(toNumber(tmp1.getMonth())+1);
    tmp1.setDate(0);
    return tmp1;
}
function getFirstDateOfMonth(yyyy,mm){
    var tmp1 = new Date(yyyy, mm, 1);
    return tmp1;
}

function initHeaderDate(){
    var dtOrderDate = new Date();
    var dtHopeDate = new Date();
    dtHopeDate.setDate(new Date().getDate() + 7);
    
    var strOrderDate = dtOrderDate.getFullYear() + "-" + getMonth12(dtOrderDate.getMonth()) + "-" + dtOrderDate.getDate();
    var strHopeDate = dtHopeDate.getFullYear() + "-" + getMonth12(dtHopeDate.getMonth()) + "-" + dtHopeDate.getDate();
    
    document.getElementById("inpOrderDate").value = strOrderDate;
    document.getElementById("inpHopeDate").value = strHopeDate;
    
}

window.onload = function() {

    initHeaderDate();

    var d0 = new Date();
    var d1 = new Date();
    d0 = getFirstDateOfMonth(d1.getFullYear(), toNumber(d1.getMonth())+1);
    d1 = getLastDateOfMonth(d1.getFullYear(), toNumber(d1.getMonth())+1);
    document.getElementById("inpOrderMonthJoken").value = d0.getFullYear() + "-" + d0.getMonth();

    $('#btnConfirmOrder').attr("disabled","disabled");
    $('#divTableOrderItemMasterLeft').hide();
    $('#divTableOrderItemMasterCenter').hide();
    $('#divTableOrderItemMasterRight').hide();

    createOrderdGroupTable();
};

function initMode(){
    $('#btnShowItemList').text("入力開始")
    $('#inpHopeDate').removeAttr("disabled","disabled");
    $('#inpOrderDate').removeAttr("disabled","disabled");
    $('#divLabelStartGuide').text("注文者は、注文日と納品希望日を設定し、「入力開始」ボタンをクリックしてください。")
    initHeaderDate();
    editSelectTarget = [];
}

document.getElementById("btnShowItemList").addEventListener('click', function(){
    if($('#btnShowItemList').text()=="入力開始"){
        ; //何もしない
    } else { //修正モードから新規モードへの切り替え
        initMode();
    }
    var editOrderDate = document.getElementById("inpOrderDate").value;
    var editHopeDate = document.getElementById("inpHopeDate").value;
    //console.log(editOrderDate);
    //console.log(editHopeDate);

    createItemMasterTable("tableOrderItemMasterLeft", editSelectTarget, "0001","0200");
    createItemMasterTable("tableOrderItemMasterCenter", editSelectTarget, "0201","0400");
    createItemMasterTable("tableOrderItemMasterRight", editSelectTarget, "0401","9999");

    $('#btnConfirmOrder').removeAttr("disabled","disabled");
    $('#divTableOrderItemMasterLeft').show();
    $('#divTableOrderItemMasterCenter').show();
    $('#divTableOrderItemMasterRight').show();
    calcOrderTotal();
    //editSelectTarget = [];
});

function createItemMasterTable(tableId, torokuKey, cdFrom, cdTo){
    var stamp = "dummy";
    var tenant = "dummy";
    if(torokuKey.length ==2){
        stamp = torokuKey[0];
        tenant = torokuKey[1];
    }

    $('#' + tableId).DataTable({
        bInfo: false,
        bSort: false,
        destroy: true,
        "processing": true,
        ajax: {
            url: "/getVOrderItem/" + cdFrom + "/" + cdTo + "/filter/" + stamp + "/" + tenant,
            dataType: "json",
            dataSrc: function ( json ) {
                if(torokuKey.length ==2){
                    if(json.hopeDate!=null){
                        document.getElementById("inpHopeDate").value = json.hopeDate;
                    }
                    if(json.orderDate!=null){
                        document.getElementById("inpOrderDate").value = json.orderDate;
                    }
                    $('#inpHopeDate').attr("disabled","disabled");
                    $('#inpOrderDate').attr("disabled","disabled");
                    $('#btnShowItemList').text("新規注文モードに切り替える");
                    $('#divLabelStartGuide').html("<p style='color:red'>注文済みデータの修正モードです。</p>")
                }
                return JSON.parse(json.data);
            },
            contentType:"application/json; charset=utf-8"
        },  
        columns: [
            { data: 'id'     ,width: '5%'},
            { data: 'code'   ,width: '12%',className: 'dt-body-right' ,render: function (data, type, row) { return (data*1);} },
            { data: 'name1'  ,width: '33%'},
            { data: 'tanka'  ,width: '15%' ,className: 'dt-body-right' ,render: function (data, type, row) { return (data*1).toLocaleString();} },
            { data: 'quantity'  ,width: '15%',  className: 'dt-body-right',render: function (data, type, row) 
                { 
                    var val = toNumber(data);
                    var inputtag = "";
                    inputtag = inputtag + '<input id="inpOrderQuantity" ';
                    inputtag = inputtag + 'class="form-control input-mm" ';
                    inputtag = inputtag + 'type="tel" '; //autocomplete="off"
                    inputtag = inputtag + 'autocomplete="off" '; //
                    inputtag = inputtag + 'style="width:100%; font-size:18px; text-align:right" ';
                    inputtag = inputtag + 'maxlength="4" ';
                    inputtag = inputtag + 'onfocus="this.select();" ';
                    inputtag = inputtag + 'oninput="fncNumOnly();" ';
                    inputtag = inputtag + 'onchange="calcOrderTotal(  );" '; 
                    inputtag = inputtag + 'onblur="calcOrderTotal(  );" '; 
                    inputtag = inputtag + 'value=' + (val==0 ? "":val) + '>';
                    return inputtag;
                } 
            }
        ],
        language: {
           url: "../static/main/js/japanese.json"
        },
        "scrollY":$(window).height() * 55 / 100,
        // order: [[ 3, "asc" ]],
        // sort:false,
        "pageLength": 1000,
        searching: false,
        paging: false,
        // dom:"<'row'<'col-sm-6'l><'col-sm-6'f>>"+
        //     "<'row'<'col-sm-12'tr>>" +
        //     "<'row'<'col-sm-5'i><'col-sm-7'p>>",
        // "fnRowCallback": function( nRow, row, iDisplayIndex, iDisplayIndexFull ) {
        //     var rows = $('#tableDaicho').DataTable().rows().data();
        //     for(var i=0; i<rows.length; i++){
        //         if(rows[i].item_id == row.id){
        //             //$('td:eq(2)', nRow).html( '<b>1</b>' );
        //             nRow.style.backgroundColor = "#ffefe0";
        //         }
        //     }
        // }
    });
  }
  

function calcOrderTotal(){
    var tableId = ["Left","Center","Right"];
    var orderTotal = 0;
    for(let i=0; i<=2; i++){
        var tbl = document.getElementById("tableOrderItemMaster" + tableId[i]);
        try{
            for(var r=1; r<=tbl.rows.length; r++){
                var tanka = toNumber(tbl.rows[r].cells[3].innerText);
                var suryo = toNumber(tbl.rows[r].cells[4].firstChild.value);
                orderTotal = orderTotal + (tanka * suryo);
            }
        }catch(e){
            console.log(e);
        }
        //document.getElementById("tableOrderItemMaster" + tableId[i]).rows[1].cells[3].innerText
        //document.getElementById("tableOrderItemMaster" + tableId[i]).rows[1].cells[4].firstChild.value
        //for(let r=1; r<=)
    }
    document.getElementById("lblOrderTotal").value = orderTotal.toLocaleString(); //Comma(orderTotal);
}


function Comma(txt){
    if(txt == ""){
        return;
    }
    //txt = txt.replace(",","");
    txt = (txt+"").split(',').join('');

    var num = toNumber(txt)*1;
    return num.toLocaleString();

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
    var ret = inp.replace(/[‐－―ー]/g, '-').replace(/[^\-\d\.]/g, '').replace(/(?!^\-)[^\d\.]/g, '');
    //$(event.srcElement).val(ret);
    $(event.srcElement).val(ret.toLocaleString());
    //var tanka = toNumber(event.srcElement.parentElement.previousElementSibling.innerText);
    //event.srcElement.parentElement.nextElementSibling.innerText = (tanka * ret).toLocaleString();
    //$("#inpKaniGokei").val(calcGokei().toLocaleString());
}




function toNumber(val){ 
    var vala = (val+"").split(',').join('');
    if(isNaN(parseInt(vala))){
        return 0;
    }
  
    var ret = 0;
    try{
        ret = vala * 1;
    }catch(e){
        ret = 0;
    }
    return ret;
}


var sendOrderData = [];
$('#modalConfirmOrder').on("show.bs.modal", function (e) {
    $('#btnSendOrder').removeAttr("disabled");
    $('#lblMessage2').text("よろしければ、注文確定ボタンをクリックしてください。");
    sendOrderData = [];
    calcOrderTotal();
    if(document.getElementById("lblOrderTotal").value==0 && $('#btnShowItemList').text()=="入力開始"){
        return false;
    }
    createConfirmTable()
  
});


$('#modalDetailOrder').on("hidden.bs.modal", function (e) {
    // window.location.href = "#sectionOrderHistory";
    createOrderdGroupTable();
    return;
});


function editOrder(){
    document.getElementById("btnCloseOrderDetail").click();
    document.getElementById("btnShowItemList").click();
    window.location.href = "#top";
    // $('#btnShowItemList').text("新規注文モードに切り替える");
    // $('#divLabelStartGuide').html("<p style='color:red'>注文済みデータの修正モードです。</p>");
    //alert(editSelectTarget);
}

$('#modalConfirmOrder').on("hidden.bs.modal", function (e) {
    //sectionOrderHistory
    window.location.href = "#sectionOrderHistory";
    //alert(1);
    createOrderdGroupTable();
    return;
});



function createConfirmTable(){
    var tableId = ["Left","Center","Right"];
    var orderTotal = 0;
    for(let i=0; i<=2; i++){
        var tbl = document.getElementById("tableOrderItemMaster" + tableId[i]);
        try{
            for(var r=1; r<=tbl.rows.length; r++){
                suryo = toNumber(tbl.rows[r].cells[4].firstChild.value);
                if(suryo > 0){
                    //document.getElementById("tableOrderItemMasterConfirm").appendChild(tbl.rows[r]);
                    var vid = toNumber(tbl.rows[r].cells[0].innerText);
                    var vcode = toNumber(tbl.rows[r].cells[1].innerText);
                    var vname1 = tbl.rows[r].cells[2].innerText;
                    var vtanka = toNumber(tbl.rows[r].cells[3].innerText);
                    var vsuryo = toNumber(tbl.rows[r].cells[4].firstChild.value);
                    var vshokei = vtanka * vsuryo;
                    sendOrderData.push({id:vid, code:vcode, name1:vname1, tanka:vtanka, quantity:vsuryo, subTotal:vshokei})
                }
            }
        }catch(e){
            console.log(e);
        }
    }
    
    $('#tableOrderItemMasterConfirm').DataTable({
        bInfo: false,
        bSort: false,
        destroy: true,
        processing: true,
        "bAutoWidth": false,
        data: sendOrderData,
        columns: [
            { data: 'id'     ,width: '5%'},
            { data: 'code'   ,width: '12%'},
            { data: 'name1'  ,width: '33%'},
            { data: 'tanka'  ,width: '10%' ,className: 'dt-body-right' },
            { data: 'quantity'  ,width: '10%' ,className: 'dt-body-right' },
            { data: 'subTotal'  ,width: '10%' ,className: 'dt-body-right' ,render: function (data, type, row) { return (data*1).toLocaleString();} },
        ],
        language: {
           url: "../static/main/js/japanese.json"
        },
        "scrollY":$(window).height() * 60 / 100,
        //order: [[ 4, "desc" ],[ 3, "asc" ]],
        //"pageLength": 1000,
        searching: false,
        paging: false,
        "lengthMenu": [100, 300, 500, 1000],
        // "fnRowCallback": function( nRow, row, iDisplayIndex, iDisplayIndexFull ) {
        //     var table = $('#tableOrderItemMasterConfirm').DataTable();
        //     table.columns.adjust().draw();
        // }
    });
    // var table = $('#tableOrderItemMasterConfirm').DataTable();
    // table.columns.adjust().draw();
    try{
        setTimeout(
            "$('#tableOrderItemMasterConfirm').DataTable().columns.adjust().draw();"
            , 500);
        
    }catch(e){
        console.log(e);
    }
}



function createOrderdGroupTable(){
    $('#tableOrderedGroup').DataTable({
        bInfo: false,
        bSort: true,
        destroy: true,
        "processing": true,
        ajax: {
            url: "/getVOrderedGroup",
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
            { data: 'tenant_id'    ,width: '5%',  className: 'dt-body-left'},
            { data: 'send_stamp'   ,width: '15%',  className: 'dt-body-left',render: function (data, type, row) { return japaneseDateTime(data);} },
            { data: 'order_ymd'     ,width: '7%',  className: 'dt-body-left'},
            { data: 'hope_ymd'     ,width: '7%',  className: 'dt-body-left'},
            { data: 'biko'         ,width: '40%',  className: 'dt-body-left'},
            { data: 'total'        ,width: '6%',  className: 'dt-body-right' ,render: function (data, type, row) { return (data*1).toLocaleString();} },
            { data: 'receive_stamp',width: '15%',  className: 'dt-body-left',render: function (data, type, row) { return japaneseDateTime(data);} },
            { data: null           ,width: '3%',  className: 'dt-body-center',render: 
                function (data, type, row) { 
                    var stamp = '"' + row.send_stamp + '"';
                    var tenant = '"' + row.tenant_id + '"';
                    var tag = "";
                    tag = tag + "<a class='btn btn-warning btn-sm' ";
                    tag = tag + "   onclick='funcCheckOrderedDate(" + stamp + "," + tenant + ");' >" ; //確認</a>";
                    tag = tag + "   確認";
                    tag = tag + "</a>";
                    return tag;
                } 
            },
        ],
        language: {
           url: "../static/main/js/japanese.json"
        },
        "scrollY":        "300",
        searching: false,
        "pageLength": 1000,
        sort:true,
        paging:false,
        "order": [ 1, "desc" ],
        "lengthMenu": [100, 300, 500, 1000],
        dom:"<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-6'l><'col-sm-6'f>>"+
            "<'row'<'col-sm-5'i><'col-sm-7'p>>",
      "preDrawCallback": function (settings) {
        return;
      },
    });


}

function funcCheckOrderedDate(stamp, tenant){
    //alert(tenant + "," + stamp);
    $('#modalDetailOrder').modal({},{
        tenant:tenant,
        stamp:stamp
    });
    //createOrderedDetail(tenant, stamp);
}

var editSelectTarget = [];
$('#modalDetailOrder').on("shown.bs.modal", function (e) {
    editSelectTarget = [];
    $('#lblMessage3').text("注文内容を確認し、問題なければ「了承」してください。");
    $('#subtitleOrderDetailModal').text("注文日時：" + japaneseDateTime(e.relatedTarget.stamp) + "　注文者" + e.relatedTarget.tenant + " ");
    $('#subtitleOrderDetailModal').append("<a onclick='editOrder();' class='btn btn-success btn-sm' style='margin-left:20px'>注文内容を修正する</a>");
    //
    $('#btnReceivedOrder').removeAttr("title");
    $('#btnReceivedOrder').attr("stamp",e.relatedTarget.stamp);
    $('#btnReceivedOrder').attr("tenant",e.relatedTarget.tenant);
    createOrderedDetail(e.relatedTarget.tenant, e.relatedTarget.stamp);
    editSelectTarget.push(e.relatedTarget.stamp);
    editSelectTarget.push(e.relatedTarget.tenant);
    
});


function createOrderedDetail(tenant, stamp){
    $('#tableOrderItemMasterDetail').DataTable({
        bInfo: false,
        bSort: true,
        destroy: true,
        processing: true,
        ajax: {
            url: "/getOrderedItemDetailByKey/" + tenant + "/" + stamp,
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
            { data: 'item_id'   ,width: '5%',  className: 'dt-body-center'},
            { data: 'item_code'   ,width: '5%',  className: 'dt-body-center'},
            { data: 'item_name1'   ,width: '35%',  className: 'dt-body-left'},
            { data: 'item_siire'   ,width: '5%',  className: 'dt-body-right'},
            { data: 'quantity'   ,width: '5%',  className: 'dt-body-right'},
        ],
        language: {
           url: "../static/main/js/japanese.json"
        },
        "scrollY":        "300",
        searching: false,
        "pageLength": 1000,
        sort:true,
        paging:false,
        "lengthMenu": [100, 300, 500, 1000],
        dom:"<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-6'l><'col-sm-6'f>>"+
            "<'row'<'col-sm-5'i><'col-sm-7'p>>",
        "preDrawCallback": function (settings) {
            return;
        },
    });

}

function japaneseDateTime(datetime){
    if(datetime==undefined){
        return "";
    }
    if(datetime==""){
        return "";
    }
    var str = datetime.replace("T","-").replace(":","-").replace(":","-").replace(".","-");
    var arr = str.split("-");
    str = arr[0] + "年" +  arr[1] + "月" +  arr[2] + "日" +  arr[3] + "時" +  arr[4] + "分" +  arr[5] + "秒";
    return str;
}

document.getElementById("btnReceivedOrder").addEventListener('click', function(){
    var orderKey = $('#subtitleOrderDetailModal').text();
    var tenant = document.getElementById("btnReceivedOrder").getAttribute("tenant");
    var stamp = document.getElementById("btnReceivedOrder").getAttribute("stamp");
    $.ajax({
        type: "GET",
        url: "/updateOrderReceived/" + tenant + "/" + stamp
      }).done(function(data) {
        $('#lblMessage3').html("<div style='color:red; font-size:16px'>確認完了！</div>");
      }).fail(function(data) {
        console.log(2);
      }).always(function(data) {
        console.log(3);
      });
});

document.getElementById("btnSendOrder").addEventListener('click', function(){
    var editOrderDate = document.getElementById("inpOrderDate").value;
    var editHopeDate = document.getElementById("inpHopeDate").value;

    var stamp = "dummy";
    var tenant = "dummy";
    if(editSelectTarget.length ==2){
        stamp = editSelectTarget[0];
        tenant = editSelectTarget[1];
    }

    var id = "0";
    $.ajax({
        type: "POST",
        data: JSON.stringify({
                "insParam":JSON.stringify(sendOrderData),
                "id":id,
                "orderDate": editOrderDate,
                "hopeDate": editHopeDate,
                "stamp": stamp,
                "tenant": tenant
            }),
        url: "/createOrderData",
        //url: "/createOrderData/" + id + "/" + editOrderDate + "/" + editHopeDate + "/" + JSON.stringify(sendOrderData) + "",
        contentType:'application/json'
        //xhrFields    : {responseType : 'blob'},
    }).done(function(data) {
        $('#lblMessage2').html("<div style='color:red; font-size:16px'>注文完了！</div>");
        //$('#modalConfirmOrder').hide();
    }).fail(function(data) {
        $('#lblMessage2').html("注文できませんでした。やり直してください。");
    }).always(function(data) {
        $('#btnSendOrder').attr("disabled","disabled");
        initMode();
    });

});


document.getElementById("btnPrintOrderSeikyu").addEventListener('click', function(){
    var monthJoken = document.getElementById("inpOrderMonthJoken").value;

    $.ajax({
        type: "GET",
        url: "/OutputExcelSeikyushoOrder/" + monthJoken,
        xhrFields    : {responseType : 'blob'},
      }).done(function(data, textStatus, jqXHR ) {
        var blob=new Blob([data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64"});//
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = "" + Math.random().toString(32).substring(2) + ".xlsx";
        link.click();
      }).fail(function(data) {
            alert("エラー：" + data.statusText);
      }).always(function(data) {
    });
});



$('#modalSettingItemOrderable').on("shown.bs.modal", function (e) {
    
    $('#tableSettingOrderable').DataTable({
        bInfo: false,
        bSort: false,
        destroy: true,
        "processing": true,
        ajax: {
            url: "/getVOrderItem/0000/9999/full/dummy/dummy",
            dataType: "json",
            dataSrc: function ( json ) {
                return JSON.parse(json.data);
            },
            contentType:"application/json; charset=utf-8"
        },  
        columns: [
            { data: 'id'     ,width: '5%'},
            { data: 'code'   ,width: '12%',className: 'dt-body-right' ,render: function (data, type, row) { return (data*1);} },
            { data: 'name1'  ,width: '33%'},
            { data: 'tanka'  ,width: '15%' ,className: 'dt-body-right' ,render: function (data, type, row) { return (data*1).toLocaleString();} },
            { data: 'orderable'  ,width: '15%',  className: 'dt-body-right',render: function (data, type, row) 
                { 
                    var inputtag = "";
                    inputtag = inputtag + '<input id="chkOrderable" ';
                    inputtag = inputtag + 'type="checkbox" ';
                    inputtag = inputtag + 'class="checkbox" ';
                    inputtag = inputtag + 'onchange="updateItemOrderable(' + row.id + ');" '; 
                    inputtag = inputtag + ' ' + (toNumber(data)==1 ? 'checked':' ')  + ' />';
                    return inputtag;
                } 
            }
        ],
        language: {
           url: "../static/main/js/japanese.json"
        },
        "scrollY":$(window).height() * 55 / 100,
        // order: [[ 3, "asc" ]],
        // sort:false,
        "pageLength": 1000,
        searching: false,
        paging: false,
    });
});


function updateItemOrderable(id){
    //alert(id);
    $.ajax({
        type: "GET",
        url: "/updateItemOrderable/" + id + "/" + event.target.checked
      }).done(function(data) {
        console.log(1);
      }).fail(function(data) {
        console.log(2);
      }).always(function(data) {
        console.log(3);
      });
}