var DELIMIT = "@|@|@";
var grantLev = 0;
var systemMode = 0;

    
$(function () {
    $('.date').datetimepicker({
        locale: 'ja',
        format : 'YYYY-MM-DD'
    });
});



window.onload = function() {
    var dtOrderDate = new Date();
    var dtHopeDate = new Date();
    dtHopeDate.setDate(new Date().getDate() + 7);
    
    var strOrderDate = dtOrderDate.getFullYear() + "-" + dtOrderDate.getMonth() + "-" + dtOrderDate.getDate();
    var strHopeDate = dtHopeDate.getFullYear() + "-" + dtHopeDate.getMonth() + "-" + dtHopeDate.getDate();
    
    document.getElementById("inpOrderDate").value = strOrderDate;
    document.getElementById("inpHopeDate").value = strHopeDate;

    $('#btnConfirmOrder').attr("disabled","disabled");
};


document.getElementById("btnShowItemList").addEventListener('click', function(){
    var editOrderDate = document.getElementById("inpOrderDate").value;
    var editHopeDate = document.getElementById("inpHopeDate").value;
    console.log(editOrderDate);
    console.log(editHopeDate);

    createItemMasterTable("塚田カルセンド","tableOrderItemMasterLeft");
    createItemMasterTable("塚田カルセンド","tableOrderItemMasterCenter");
    createItemMasterTable("塚田カルセンド","tableOrderItemMasterRight");

    $('#btnConfirmOrder').removeAttr("disabled","disabled");
});






function createItemMasterTable(itemname1, tableId, updateAfter=false){

    $('#' + tableId).DataTable({
        bInfo: false,
        bSort: false,
        destroy: true,
        "processing": true,
        ajax: {
            url: "/getVOrderItem",
            dataType: "json",
            dataSrc: function ( json ) {
                return JSON.parse(json.data);
            },
            contentType:"application/json; charset=utf-8"
        },  
        "initComplete": function(settings, json) {
          if(updateAfter){
              $('#btnNewItem').click();
          }
        },
        columns: [
            { data: 'id'     ,width: '5%'},
            { data: 'code'   ,width: '12%'},
            { data: 'name1'  ,width: '33%'},
            { data: 'tanka'  ,width: '10%' ,className: 'dt-body-right' ,render: function (data, type, row) { return (data*1).toLocaleString();} },
            { data: 'ordernum'  ,width: '15%',  className: 'dt-body-right',render: function (data, type, row) 
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
        order: [[ 4, "desc" ],[ 3, "asc" ]],
        "pageLength": 1000,
        searching: false,
        paging: false,
        "lengthMenu": [100, 300, 500, 1000],
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
    if(document.getElementById("lblOrderTotal").value==0){
        return false;
    }
    createConfirmTable()
  
});


$('#modalConfirmOrder').on("hidden.bs.modal", function (e) {
    //sectionOrderHistory
    window.location.href = "#sectionOrderHistory";
    //alert(1);
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


document.getElementById("btnSendOrder").addEventListener('click', function(){
    var editOrderDate = document.getElementById("inpOrderDate").value;
    var editHopeDate = document.getElementById("inpHopeDate").value;
    var id = "0";
    $.ajax({
        type: "POST",
        data: JSON.stringify({
                "insParam":JSON.stringify(sendOrderData),
                "id":id,
                "orderDate": editOrderDate,
                "hopeDate": editOrderDate
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
    });

});


