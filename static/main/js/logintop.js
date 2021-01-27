//btnSendMail

$('#btnSendMail').on('click', function() {
    $('#btnSendMail').attr("disabled","disabled");
    $('#btnSendMail').text("送信中...")
    var acc = new Array();
    acc.push($('#txtMailAddr').val());
    acc.push($('#txtOmise').val());
    $.ajax({
        type: "POST",
        data: JSON.stringify({"data":acc}),
        url: "/AccountToroku",
        contentType:'application/json'
    }).done(function(data) {
        $('#btnSendMail').text("申請完了");
    }).fail(function(data) {
        alert("エラー：" + data.statusText);
    }).always(function(data) {
        setTimeout('$("#btnSendMail").text("利用登録");$("#btnSendMail").removeAttr("disabled");', 2000);
        
   });
});

$('#btnJmbTrn').click(function() {
    var speed = 400; 
    var href= $(this).attr("href");
    var target = $('#spanTest');
    var position = target.offset().top;
    $('body,html').animate({scrollTop:position}, speed, 'swing');
    return false;
});
