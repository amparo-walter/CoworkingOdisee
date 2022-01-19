hamburgerFocused = false;
//toggle focus onclick
function toggleHamburger(){
  hamburgerFocused = !hamburgerFocused;
  if(hamburgerFocused){
    $('.hamburger').addClass('focus');
    $('.nav-items').addClass('showHamburgerMenu');
    document.getElementsByTagName('body')[0].setAttribute("style","overflow-y: hidden");

  }else{
    $('.hamburger').removeClass('focus');
    $('.nav-items').removeClass('showHamburgerMenu');
    document.getElementsByTagName('body')[0].removeAttribute("style");

  }
}

//check if any focus is lost, toggle if not untoggled
$(document).on('click', function(){
  if(!$('.hamburger').is(":focus") && hamburgerFocused){
    toggleFocus();
  }
});

function toggleFocus(){
  toggleHamburger();
}
