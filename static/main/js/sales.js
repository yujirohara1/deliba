var DELIMIT = "@|@|@";
var grantLev = 0;
var systemMode = 0;

    
function Comma(txt){
    if(txt == ""){
        return "";
    }
    //txt = txt.replace(",","");
    txt = (txt+"").split(',').join('');

    var num = toNumber(txt)*1;
    return num.toLocaleString();

}
$(function () {
    $('#inpSalesMonthJoken').datetimepicker({
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
    var dtSalesDateFrom = new Date();
    var dtSalesDateTo = new Date();
    dtSalesDateFrom.setDate(new Date().getDate() -10);
    dtSalesDateTo.setDate(new Date().getDate() + 10);
    
    var strSalesDateFrom = dtSalesDateFrom.getFullYear() + "-" + getMonth12(dtSalesDateFrom.getMonth()) + "-" + ("0" + dtSalesDateFrom.getDate()).slice(-2);
    var strSalesDateTo = dtSalesDateTo.getFullYear() + "-" + getMonth12(dtSalesDateTo.getMonth()) + "-" + ("0" + dtSalesDateTo.getDate()).slice(-2);

    document.getElementById("inpSalesDateFrom").value = strSalesDateFrom;
    document.getElementById("inpSalesDateTo").value = strSalesDateTo;
    
}

window.onload = function() {
    initHeaderDate();
};










let isProcessing = false;

document.getElementById("btnSalesTermSelect").addEventListener('click', function () {
    if (isProcessing) return;

    isProcessing = true;

    const btn = document.getElementById("btnSalesTermSelect");
    const originalContent = btn.innerHTML;

    // 属性ベースで確実にロックし、見た目を変更
    btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 抽出中...';
    btn.setAttribute("disabled", "disabled");

    const editSalesDateFrom = document.getElementById("inpSalesDateFrom").value;
    const editSalesDateTo = document.getElementById("inpSalesDateTo").value;

    $.ajax({
        type: "GET",
        url: "/getSalesData/" + editSalesDateFrom + "/" + editSalesDateTo
    }).done(function (data) {
        window._salesData = data;
        renderSummaryTable(); // 引数なしに変更
    }).fail(function (data) {
        alert("エラー：" + data.statusText);
    }).always(function () {
        btn.innerHTML = originalContent;
        btn.removeAttribute("disabled"); // 属性ベースで解除
        isProcessing = false;
    });
});







// HTML要素のセットアップ

document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("divMainContainer");
    const controlPanel = document.createElement("div");
    controlPanel.className = "radio-group";

    const radioPrice = document.createElement("input");
    radioPrice.type = "radio";
    radioPrice.name = "displayMode";
    radioPrice.value = "price";
    radioPrice.checked = true;
    radioPrice.id = "radioPrice";

    const labelPrice = document.createElement("label");
    labelPrice.htmlFor = "radioPrice";
    labelPrice.innerText = "売上額";

    const radioQuantity = document.createElement("input");
    radioQuantity.type = "radio";
    radioQuantity.name = "displayMode";
    radioQuantity.value = "quantity";
    radioQuantity.id = "radioQuantity";

    const labelQuantity = document.createElement("label");
    labelQuantity.htmlFor = "radioQuantity";
    labelQuantity.innerText = "本数";

    const radioItemPrice = document.createElement("div");
    radioItemPrice.className = "radio-item";
    radioItemPrice.appendChild(radioPrice);
    radioItemPrice.appendChild(labelPrice);

    const radioItemQuantity = document.createElement("div");
    radioItemQuantity.className = "radio-item";
    radioItemQuantity.appendChild(radioQuantity);
    radioItemQuantity.appendChild(labelQuantity);

    controlPanel.appendChild(radioItemPrice);
    controlPanel.appendChild(radioItemQuantity);

    document.getElementById("divDisplayOption1").appendChild(controlPanel);

    //container.parentElement.insertBefore(controlPanel, container);

    controlPanel.addEventListener("change", function (e) {
        if (e.target.name === "displayMode") {
            renderSummaryTable(e.target.value);
        }
    });
});









function renderSummaryTable(mode = "price") {
    const groupedData = window._salesData.groupedData;
    const fullData = window._salesData.fullData;

    const container = document.getElementById("divMainContainer");
    container.innerHTML = "";
    container.style.position = "relative";

    const scrollWrapper = document.createElement("div");
    scrollWrapper.style.overflow = "auto";
    scrollWrapper.style.maxHeight = "400px";
    scrollWrapper.style.position = "relative";
    scrollWrapper.style.width = "100%";
    scrollWrapper.style.boxSizing = "border-box";

    const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
    const dates = [...new Set(groupedData.map(d => d.sei_deliver_ymd))].sort();
    const dateLabels = dates.map(d => {
        const dt = new Date(d);
        return (dt.getMonth() + 1) + "/" + dt.getDate();
    });
    const weekdayLabels = dates.map(d => {
        const dt = new Date(d);
        return weekdays[dt.getDay()];
    });

    const itemsMap = {};
    groupedData.forEach(d => {
        const key = (d.item_code || "") + "|" + d.item_name1;
        itemsMap[key] = true;
    });
    const items = Object.keys(itemsMap).sort().map(k => {
        const parts = k.split("|");
        return { item_code: parts[0], item_name1: parts[1] };
    });

    const valueMap = {};
    groupedData.forEach(d => {
        const key = (d.item_code || "") + "|" + d.item_name1 + "|" + d.sei_deliver_ymd;
        valueMap[key] = mode === "price" ? d.sum_sei_price : d.cnt_sei_quantity;
    });

    const table = document.createElement("table");
    table.style.borderCollapse = "collapse";
    table.style.minWidth = "1200px";
    table.style.position = "relative";
    table.style.tableLayout = "fixed";

    const colgroup = document.createElement("colgroup");
    const col1 = document.createElement("col");
    col1.style.width = "230px";
    colgroup.appendChild(col1);
    dates.forEach(() => {
        const col = document.createElement("col");
        colgroup.appendChild(col);
    });
    table.appendChild(colgroup);

    const thead = document.createElement("thead");
    const headRow1 = document.createElement("tr");
    const thFixed1 = document.createElement("th");
    thFixed1.rowSpan = 2;
    thFixed1.innerText = "商品コード　商品名　　指定期間計";
    Object.assign(thFixed1.style, {
        position: "sticky",
        left: "0",
        top: "0",
        backgroundColor: "#337ab7",
        color: "white",
        zIndex: "11",
        border: "1px solid #ccc",
        whiteSpace: "nowrap",
        overflow: "hidden"
    });
    headRow1.appendChild(thFixed1);

    dateLabels.forEach(label => {
        const th = document.createElement("th");
        th.innerText = label;
        Object.assign(th.style, {
            position: "sticky",
            top: "0",
            backgroundColor: "#337ab7",
            color: "white",
            zIndex: "2",
            border: "1px solid #ccc",
            textAlign: "center"
        });
        headRow1.appendChild(th);
    });

    const headRow2 = document.createElement("tr");
    const thSpacer = document.createElement("th");
    thSpacer.style.display = "none";
    headRow2.appendChild(thSpacer);

    weekdayLabels.forEach(label => {
        const th = document.createElement("th");
        th.innerText = label;
        Object.assign(th.style, {
            position: "sticky",
            top: "18px",
            backgroundColor: "#337ab7",
            color: "white",
            zIndex: "1",
            border: "1px solid #ccc",
            textAlign: "center"
        });
        headRow2.appendChild(th);
    });

    thead.appendChild(headRow1);
    thead.appendChild(headRow2);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");

    items.forEach(item => {
        const tr = document.createElement("tr");

        const tdMerged = document.createElement("td");

        const spanCode = document.createElement("span");
        spanCode.innerText = item.item_code;
        spanCode.style.display = "inline-block";
        spanCode.style.width = "60px";

        const spanName = document.createElement("span");
        spanName.innerText = item.item_name1;
        spanName.style.marginRight = "10px";
        spanName.style.display = "inline-block";
        spanName.style.width = "140px";

        // 指定期間計（合計）
        let sum = 0;
        dates.forEach(date => {
            const key = (item.item_code || "") + "|" + item.item_name1 + "|" + date;
            const val = valueMap[key];
            if (val !== undefined) sum += val;
        });
        const spanTotal = document.createElement("span");
        spanTotal.innerText = mode === "price" ? Comma(sum) : sum;
        spanTotal.title = "指定期間計";
        spanTotal.style.display = "inline-block";
        //spanTotal.style.float = "right";
        spanTotal.style.textAlign = mode === "price" ? "right" : "right";
        spanTotal.style.width = "80px";
        spanTotal.style.color = "#337ab7";
        spanTotal.style.fontWeight = "bold";

        tdMerged.appendChild(spanCode);
        tdMerged.appendChild(spanName);
        tdMerged.appendChild(spanTotal);

        Object.assign(tdMerged.style, {
            position: "sticky",
            left: "0",
            backgroundColor: "#ffffff",
            zIndex: "10",
            border: "1px solid #ccc",
            whiteSpace: "nowrap",
            overflow: "hidden"
        });

        tr.appendChild(tdMerged);

        dates.forEach(date => {
            const td = document.createElement("td");
            const key = (item.item_code || "") + "|" + item.item_name1 + "|" + date;
            td.innerText = valueMap[key] !== undefined ? valueMap[key] : "";
            td.innerText = mode === "price" ? Comma(td.innerText) : td.innerText;
            Object.assign(td.style, {
                border: "1px solid #ccc",
                textAlign: mode === "price" ? "right" : "center",
                backgroundColor: "#ffffff",
                cursor: "pointer",
                paddingRight:"5px",
                paddingLeft:"5px"
            });

            td.addEventListener("mouseover", () => {
                td.style.backgroundColor = "#ffe5b4";
            });
            td.addEventListener("mouseout", () => {
                td.style.backgroundColor = "#ffffff";
            });


            td.addEventListener("click", () => {
                const fullData = window._salesData.fullData;
            
                const filteredDetails = fullData.filter(fd =>
                    fd.item_code === item.item_code && fd.sei_deliver_ymd === date
                );
            
                                
                // 並び替えを追加
                filteredDetails.sort((a, b) => {
                    if (a.customer_group_id !== b.customer_group_id) {
                        return a.customer_group_id - b.customer_group_id;
                    }
                    return a.customer_list - b.customer_list;
                });

                let detailContainer = document.getElementById("divDetailContainer");
                if (!detailContainer) {
                    detailContainer = document.createElement("div");
                    detailContainer.id = "divDetailContainer";
                    container.parentNode.appendChild(detailContainer);
                }
                detailContainer.innerHTML = "";
            
                const detailWrapper = document.createElement("div");
                detailWrapper.style.maxHeight = "300px";
                detailWrapper.style.overflowY = "auto";
                detailWrapper.style.border = "0px";
                detailWrapper.style.marginTop = "20px";
            
                const detailTable = document.createElement("table");
                detailTable.style.borderCollapse = "collapse";
                detailTable.style.width = "auto";
                detailTable.style.maxWidth = "100%";
                detailTable.style.tableLayout = "auto";
            
                // ヘッダー
                const headers = [
                    "グループ", "配達順", "担当", "顧客ID", "顧客名",
                    "支払方法", "住所", "単価", "数量", "削除フラグ"
                ];
                const thead = document.createElement("thead");
                const headerRow = document.createElement("tr");
            
                headers.forEach(text => {
                    const th = document.createElement("th");
                    th.innerText = text;
                    th.style.border = "1px solid #999";
                    th.style.backgroundColor = "#337ab7";
                    th.style.color="white";
                    th.style.padding = "4px";
                    th.style.position = "sticky";
                    th.style.top = "0";
                    th.style.zIndex = "1";
                    headerRow.appendChild(th);
                });
                thead.appendChild(headerRow);
                detailTable.appendChild(thead);
            
                // 明細行
                const tbody = document.createElement("tbody");
                

                filteredDetails.forEach(detail => {
                    const row = document.createElement("tr");
                    const address = (detail.customer_address1 || "") + (detail.customer_address2 || "");
                
                    // 削除フラグが立っていたら行全体をグレーに
                    if (detail.customer_del_flg === 1) {
                        row.style.backgroundColor = "#f0f0f0";
                    }
                
                    const values = [
                        detail.group_id_name,
                        detail.customer_list,
                        detail.tanto_name,
                        detail.customer_id,
                        detail.customer_name1,
                        detail.siharai_kb_name,
                        address,
                        detail.sei_price,
                        detail.sei_quantity,
                        detail.customer_del_flg
                    ];
                
                    values.forEach((val, index) => {
                        const td = document.createElement("td");
                
                        if (index === 7) { // 単価
                            td.innerText = Comma(val);
                            td.style.textAlign = "right";
                        } else if (index === 8) { // 数量
                            td.innerText = val;
                            td.style.textAlign = "center";
                        } else if (index === 9) { // 削除フラグ
                            td.innerText = val === 1 ? "1" : "";
                        } else {
                            td.innerText = val;
                        }
                
                        td.style.border = "1px solid #ccc";
                        td.style.padding = "1px 1px";
                        row.appendChild(td);
                    });
                
                    tbody.appendChild(row);
                });
                

                detailTable.appendChild(tbody);
                detailWrapper.appendChild(detailTable);
                detailContainer.appendChild(detailWrapper);
            });
            

            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    scrollWrapper.appendChild(table);
    container.appendChild(scrollWrapper);
}



















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
            url: "/getVSalesItem/" + cdFrom + "/" + cdTo + "/filter/" + stamp + "/" + tenant,
            dataType: "json",
            dataSrc: function ( json ) {
                if(torokuKey.length ==2){
                    if(json.hopeDate!=null){
                        document.getElementById("inpHopeDate").value = json.hopeDate;
                    }
                    if(json.SalesDate!=null){
                        document.getElementById("inpSalesDate").value = json.SalesDate;
                    }
                    $('#inpHopeDate').attr("disabled","disabled");
                    $('#inpSalesDate').attr("disabled","disabled");
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
                    inputtag = inputtag + '<input id="inpSalesQuantity" ';
                    inputtag = inputtag + 'class="form-control input-mm" ';
                    inputtag = inputtag + 'type="tel" '; //autocomplete="off"
                    inputtag = inputtag + 'autocomplete="off" '; //
                    inputtag = inputtag + 'style="width:100%; font-size:18px; text-align:right" ';
                    inputtag = inputtag + 'maxlength="4" ';
                    inputtag = inputtag + 'onfocus="this.select();" ';
                    inputtag = inputtag + 'oninput="fncNumOnly();" ';
                    inputtag = inputtag + 'onchange="calcSalesTotal(  );" '; 
                    inputtag = inputtag + 'onblur="calcSalesTotal(  );" '; 
                    inputtag = inputtag + 'value=' + (val==0 ? "":val) + '>';
                    return inputtag;
                } 
            }
        ],
        language: {
           url: "../static/main/js/japanese.json"
        },
        "scrollY":$(window).height() * 55 / 100,
        // Sales: [[ 3, "asc" ]],
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
  

function calcSalesTotal(){
    var tableId = ["Left","Center","Right"];
    var SalesTotal = 0;
    for(let i=0; i<=2; i++){
        var tbl = document.getElementById("tableSalesItemMaster" + tableId[i]);
        try{
            for(var r=1; r<=tbl.rows.length; r++){
                var tanka = toNumber(tbl.rows[r].cells[3].innerText);
                var suryo = toNumber(tbl.rows[r].cells[4].firstChild.value);
                SalesTotal = SalesTotal + (tanka * suryo);
            }
        }catch(e){
            console.log(e);
        }
        //document.getElementById("tableSalesItemMaster" + tableId[i]).rows[1].cells[3].innerText
        //document.getElementById("tableSalesItemMaster" + tableId[i]).rows[1].cells[4].firstChild.value
        //for(let r=1; r<=)
    }
    document.getElementById("lblSalesTotal").value = SalesTotal.toLocaleString(); //Comma(SalesTotal);
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


var sendSalesData = [];
$('#modalConfirmSales').on("show.bs.modal", function (e) {
    $('#btnSendSales').removeAttr("disabled");
    $('#lblMessage2').text("よろしければ、注文確定ボタンをクリックしてください。");
    sendSalesData = [];
    calcSalesTotal();
    if(document.getElementById("lblSalesTotal").value==0 && $('#btnShowItemList').text()=="入力開始"){
        return false;
    }
    createConfirmTable()
  
});


$('#modalDetailSales').on("hidden.bs.modal", function (e) {
    // window.location.href = "#sectionSalesHistory";
    createSalesdGroupTable();
    return;
});


function editSales(){
    document.getElementById("btnCloseSalesDetail").click();
    document.getElementById("btnShowItemList").click();
    window.location.href = "#top";
    // $('#btnShowItemList').text("新規注文モードに切り替える");
    // $('#divLabelStartGuide').html("<p style='color:red'>注文済みデータの修正モードです。</p>");
    //alert(editSelectTarget);
}


function printSales(SalesYmd, hopeYmd, sendStamp){
    $.ajax({
        type: "GET",
        url: "/OutputExcelSalesSlip/" + SalesYmd + "/" + hopeYmd + "/" + sendStamp.replace("T"," ") + "",
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
}




$('#modalConfirmSales').on("hidden.bs.modal", function (e) {
    //sectionSalesHistory
    window.location.href = "#sectionSalesHistory";
    //alert(1);
    createSalesdGroupTable();
    return;
});



function createConfirmTable(){
    var tableId = ["Left","Center","Right"];
    var SalesTotal = 0;
    for(let i=0; i<=2; i++){
        var tbl = document.getElementById("tableSalesItemMaster" + tableId[i]);
        try{
            for(var r=1; r<=tbl.rows.length; r++){
                suryo = toNumber(tbl.rows[r].cells[4].firstChild.value);
                if(suryo > 0){
                    //document.getElementById("tableSalesItemMasterConfirm").appendChild(tbl.rows[r]);
                    var vid = toNumber(tbl.rows[r].cells[0].innerText);
                    var vcode = toNumber(tbl.rows[r].cells[1].innerText);
                    var vname1 = tbl.rows[r].cells[2].innerText;
                    var vtanka = toNumber(tbl.rows[r].cells[3].innerText);
                    var vsuryo = toNumber(tbl.rows[r].cells[4].firstChild.value);
                    var vshokei = vtanka * vsuryo;
                    sendSalesData.push({id:vid, code:vcode, name1:vname1, tanka:vtanka, quantity:vsuryo, subTotal:vshokei})
                }
            }
        }catch(e){
            console.log(e);
        }
    }
    
    $('#tableSalesItemMasterConfirm').DataTable({
        bInfo: false,
        bSort: false,
        destroy: true,
        processing: true,
        "bAutoWidth": false,
        data: sendSalesData,
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
        //Sales: [[ 4, "desc" ],[ 3, "asc" ]],
        //"pageLength": 1000,
        searching: false,
        paging: false,
        "lengthMenu": [100, 300, 500, 1000],
        // "fnRowCallback": function( nRow, row, iDisplayIndex, iDisplayIndexFull ) {
        //     var table = $('#tableSalesItemMasterConfirm').DataTable();
        //     table.columns.adjust().draw();
        // }
    });
    // var table = $('#tableSalesItemMasterConfirm').DataTable();
    // table.columns.adjust().draw();
    try{
        setTimeout(
            "$('#tableSalesItemMasterConfirm').DataTable().columns.adjust().draw();"
            , 500);
        
    }catch(e){
        console.log(e);
    }
}



function createSalesdGroupTable(){
    $('#tableSalesedGroup').DataTable({
        bInfo: false,
        bSort: true,
        destroy: true,
        "processing": true,
        ajax: {
            url: "/getVSalesedGroup",
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
            { data: 'Sales_ymd'     ,width: '7%',  className: 'dt-body-left'},
            { data: 'hope_ymd'     ,width: '7%',  className: 'dt-body-left'},
            { data: 'biko'         ,width: '40%',  className: 'dt-body-left'},
            { data: 'total'        ,width: '6%',  className: 'dt-body-right' ,render: function (data, type, row) { return (data*1).toLocaleString();} },
            { data: 'receive_stamp',width: '15%',  className: 'dt-body-left',render: function (data, type, row) { return japaneseDateTime(data);} },
            { data: null           ,width: '3%',  className: 'dt-body-center',render: 
                function (data, type, row) { 
                    var stamp = '"' + row.send_stamp + '"';
                    var tenant = '"' + row.tenant_id + '"';
                    var hopeYmd = '"' + row.hope_ymd + '"';
                    var SalesYmd = '"' + row.Sales_ymd + '"';
                    var tag = "";
                    tag = tag + "<a class='btn btn-warning btn-sm' ";
                    tag = tag + "   onclick='funcCheckSalesedDate(" + stamp + "," + tenant + "," + hopeYmd + "," + SalesYmd + ");' >" ; //確認</a>";
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
        "Sales": [ 1, "desc" ],
        "lengthMenu": [100, 300, 500, 1000],
        dom:"<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-6'l><'col-sm-6'f>>"+
            "<'row'<'col-sm-5'i><'col-sm-7'p>>",
      "preDrawCallback": function (settings) {
        return;
      },
    });


}

function funcCheckSalesedDate(stamp, tenant, hopeYmd, SalesYmd){
    //alert(tenant + "," + stamp);
    $('#modalDetailSales').modal({},{
        tenant:tenant,
        stamp:stamp,
        SalesYmd:SalesYmd,
        hopeYmd:hopeYmd
    });
    //createSalesedDetail(tenant, stamp);
}

var editSelectTarget = [];
$('#modalDetailSales').on("shown.bs.modal", function (e) {
    editSelectTarget = [];

    var SalesYmd = '"' + e.relatedTarget.SalesYmd + '"';
    var hopeYmd = '"' + e.relatedTarget.hopeYmd + '"';
    var sendStamp = '"' + e.relatedTarget.stamp + '"';

    $('#lblMessage3').text("注文内容を確認し、問題なければ「了承」してください。");
    $('#subtitleSalesDetailModal').text("注文日時：" + japaneseDateTime(e.relatedTarget.stamp) + "　注文者" + e.relatedTarget.tenant + " ");
    $('#subtitleSalesDetailModal').append("<a onclick='editSales();' class='btn btn-success btn-sm' style='margin-left:20px'>注文内容を修正する</a>");
    $('#subtitleSalesDetailModal').append("<a onclick='printSales(" + SalesYmd + "," + hopeYmd + "," + sendStamp + ");' class='btn btn-info btn-sm' style='margin-left:20px'>納品書出力</a>");
    //
    $('#btnReceivedSales').removeAttr("title");
    $('#btnReceivedSales').attr("stamp",e.relatedTarget.stamp);
    $('#btnReceivedSales').attr("tenant",e.relatedTarget.tenant);
    createSalesedDetail(e.relatedTarget.tenant, e.relatedTarget.stamp);
    editSelectTarget.push(e.relatedTarget.stamp);
    editSelectTarget.push(e.relatedTarget.tenant);
    
});


function createSalesedDetail(tenant, stamp){
    $('#tableSalesItemMasterDetail').DataTable({
        bInfo: false,
        bSort: true,
        destroy: true,
        processing: true,
        ajax: {
            url: "/getSalesedItemDetailByKey/" + tenant + "/" + stamp,
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

document.getElementById("btnReceivedSales").addEventListener('click', function(){
    var SalesKey = $('#subtitleSalesDetailModal').text();
    var tenant = document.getElementById("btnReceivedSales").getAttribute("tenant");
    var stamp = document.getElementById("btnReceivedSales").getAttribute("stamp");
    $.ajax({
        type: "GET",
        url: "/updateSalesReceived/" + tenant + "/" + stamp
      }).done(function(data) {
        $('#lblMessage3').html("<div style='color:red; font-size:16px'>確認完了！</div>");
      }).fail(function(data) {
        console.log(2);
      }).always(function(data) {
        console.log(3);
      });
});

document.getElementById("btnSendSales").addEventListener('click', function(){
    var editSalesDate = document.getElementById("inpSalesDate").value;
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
                "insParam":JSON.stringify(sendSalesData),
                "id":id,
                "SalesDate": editSalesDate,
                "hopeDate": editHopeDate,
                "stamp": stamp,
                "tenant": tenant
            }),
        url: "/createSalesData",
        //url: "/createSalesData/" + id + "/" + editSalesDate + "/" + editHopeDate + "/" + JSON.stringify(sendSalesData) + "",
        contentType:'application/json'
        //xhrFields    : {responseType : 'blob'},
    }).done(function(data) {
        $('#lblMessage2').html("<div style='color:red; font-size:16px'>注文完了！</div>");
        //$('#modalConfirmSales').hide();
    }).fail(function(data) {
        $('#lblMessage2').html("注文できませんでした。やり直してください。");
    }).always(function(data) {
        $('#btnSendSales').attr("disabled","disabled");
        initMode();
    });

});


document.getElementById("btnPrintSalesSeikyu").addEventListener('click', function(){
    var monthJoken = document.getElementById("inpSalesMonthJoken").value;

    $.ajax({
        type: "GET",
        url: "/OutputExcelSeikyushoSales/" + monthJoken,
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



$('#modalSettingItemSalesable').on("shown.bs.modal", function (e) {
    
    $('#tableSettingSalesable').DataTable({
        bInfo: false,
        bSort: false,
        destroy: true,
        "processing": true,
        ajax: {
            url: "/getVSalesItem/0000/9999/full/dummy/dummy",
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
            { data: 'Salesable'  ,width: '15%',  className: 'dt-body-right',render: function (data, type, row) 
                { 
                    var inputtag = "";
                    inputtag = inputtag + '<input id="chkSalesable" ';
                    inputtag = inputtag + 'type="checkbox" ';
                    inputtag = inputtag + 'class="checkbox" ';
                    inputtag = inputtag + 'onchange="updateItemSalesable(' + row.id + ');" '; 
                    inputtag = inputtag + ' ' + (toNumber(data)==1 ? 'checked':' ')  + ' />';
                    return inputtag;
                } 
            }
        ],
        language: {
           url: "../static/main/js/japanese.json"
        },
        "scrollY":$(window).height() * 55 / 100,
        Sales: [[ 2, "asc" ]],
        sort:true,
        "pageLength": 1000,
        searching: true,
        paging: false,
    });
});


function updateItemSalesable(id){
    //alert(id);
    $.ajax({
        type: "GET",
        url: "/updateItemSalesable/" + id + "/" + event.target.checked
      }).done(function(data) {
        console.log(1);
      }).fail(function(data) {
        console.log(2);
      }).always(function(data) {
        console.log(3);
      });
}