
const darkmodeSlider = document.querySelector('#darkmode-switch input')
darkmodeSlider.addEventListener('change', () => {
    document.body.className = darkmodeSlider.checked ? 'darkmode' : '';
    document.cookie = `darkmode=${darkmodeSlider.checked}; expires=Fri, 31 Dec 9000 23:59:59 GMT; path=/`;    
})

let darkmodeOnLoad = getCookie('darkmode') == 'true';
darkmodeSlider.checked = darkmodeOnLoad
document.body.className = darkmodeOnLoad ? 'darkmode' : '';
 


function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }