
const darkmodeSlider = document.querySelector('#darkmode-switch input')
darkmodeSlider.addEventListener('change', () => {
    document.body.className = darkmodeSlider.checked ? 'darkmode' : '';
    localStorage.setItem('darkmode', darkmodeSlider.checked);
})

let darkmodeOnLoad = localStorage.getItem('darkmode') == 'true';
darkmodeSlider.checked = darkmodeOnLoad
document.body.className = darkmodeOnLoad ? 'darkmode' : '';
 