$(document).ready(function(){

    $("#userDataForm").submit(function(e) { 
        e.preventDefault();
        var formData = JSON.stringify($("#userDataForm").serializeArray());

        console.log(formData);

        $.ajax({
            type: "POST",
            url: "/api/",
            data: formData,
            sucess: function(){
                console.log("Got here");
                $("#response").html(data);
            },
            error: function(textstatus, errorThrown) {
                alert('text status ' + textstatus + ', err ' + errorThrown);
            }
        });
    }); 
});