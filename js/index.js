import slider from "./modules/slider";

window.addEventListener('DOMContentLoaded', function() {  
    slider({
        containerSelector: '.slider_container',
        slideSelector: '.slider_slide',
        nextSlideSelector: '.slider_next',
        prevSlideSelector: '.slider_prev',
        wrapperSelector: '.slider_wrapper',
        fieldSelector: '.slider_field',
        indicatorsClass: 'slider_indicators',
        duration: 3000,
        swipe: true,
    });
});
