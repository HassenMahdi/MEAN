function toggleSidebar(element,event){
    event.preventDefault();

    var unToggleButtonClass="glyphicon-remove";
    var toggeleButtonClass="glyphicon-dashboard";

    $("#wrapper").toggleClass("toggled");

    var toggleButton = $("#menu-toggle span");

    if ( $("#wrapper").hasClass("toggled")){
        toggleButton.removeClass(toggeleButtonClass);
        toggleButton.addClass(unToggleButtonClass);    
    }else{
        toggleButton.removeClass(unToggleButtonClass);
        toggleButton.addClass(toggeleButtonClass);    
    }

}

$(document).on("click",".nav-option a",function(){
    $("span.arrow",this).toggleClass("glyphicon glyphicon-chevron-up glyphicon glyphicon-chevron-down");;
});

