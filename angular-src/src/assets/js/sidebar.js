
function toggleSidebar(element,event){
    event.preventDefault(); 
    $("#wrapper").toggleClass("toggled");

    var toggleButton = $("#menu-toggle span");

    if ( $("#wrapper").hasClass("toggled")){
        toggleButton.removeClass("glyphicon-option-vertical");
        toggleButton.addClass("glyphicon-remove");    
    }else{
        toggleButton.removeClass("glyphicon-remove");
        toggleButton.addClass("glyphicon-option-vertical");    
    }

}

$(document).on("click",".nav-option a",function(){
    $("span.arrow",this).toggleClass("glyphicon glyphicon-chevron-up glyphicon glyphicon-chevron-down");;
});


