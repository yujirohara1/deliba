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
            { data: 'id'     ,width: '20%'},
            { data: 'list'   ,width: '20%'},
            { data: 'name1'  ,width: '60%'}
        ],
        language: {
           url: "../static/main/js/japanese.json"
        },
        "scrollY":        "500px",
        "pageLength": 1000,
        "lengthMenu": [100, 300, 500, 1000],
    });
});

