
function toggleSidebar(element,event){
    event.preventDefault();
    if ( $(element).attr('id') == "menu-toggle" )
    {   
        $("#wrapper").toggleClass("toggled");
    }
}
