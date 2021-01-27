//btnSendMail

$('#btnSendMail').on('click', function() {
    var acc = new Array();
    acc.push($('#txtMailAddr').val());
    acc.push($('#txtOmise').val());
    $.ajax({
        type: "POST",
        data: JSON.stringify({"data":acc}),
        url: "/AccountToroku",
        contentType:'application/json'
    }).done(function(data) {
        alert("受け付けました");
    }).fail(function(data) {
        alert("エラー：" + data.statusText);
    }).always(function(data) {
        alert(data);
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
