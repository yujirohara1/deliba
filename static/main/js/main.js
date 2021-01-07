$(document).ready(function() {
    $('#footable').DataTable({
        bInfo: true,
        bSort: true,
        ajax: {
            url: "/api",
            dataType: "json",
            dataSrc: function ( json ) {
                //console.log(tmpdata);
                //console.log(JSON.parse(json.data));
                return JSON.parse(json.data);
            },
            contentType:"application/json; charset=utf-8",
        },
        columns: [
            { data: 'id' },
            { data: 'code' },
            { data: 'name1' }
        ],
        language: {
           url: "../static/main/js/japanese.json"
        },
        "scrollY":        "200px",
    });
});

