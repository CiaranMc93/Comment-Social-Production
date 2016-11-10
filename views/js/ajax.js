$(document).ready(function(){

    $("#userDataForm").submit(function(e) { 
        e.preventDefault();
        var formData = JSON.stringify($("#userDataForm").serializeArray());

        $.ajax({
            type: "POST",
            url: "/api/",
            data: formData,
            dataType: "json",
            contentType: "application/json",
            sucess: function(retData){
                 alert('got here');
            },
            error: function(textstatus, errorThrown) {
                alert('text status ' + textstatus + ', err ' + errorThrown);
            }
        });
    }); 
});