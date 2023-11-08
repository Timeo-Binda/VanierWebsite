$(document).ready(function(){
    $("img.project-thumbnail").click(function(){
        var t = $(this).attr("data-large-image-src");
        $(".modal-body").html("<img src='" + t + "' class='modal-img'>");
        $("#myModal").modal();
    });
    
    // Le code pour gérer les vidéos peut rester inchangé
    $("video").click(function(){
        var v = $("video > source");
        var t = v.attr("src");
        $(".modal-body").html("<video class='model-vid' controls><source src='"+t+"' type='video/mp4'></source></video>");
        $("#myModal").modal();  
    });
});

