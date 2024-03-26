import slider from "./modules/slider";

window.addEventListener('DOMContentLoaded', function() {  
    slider({
        container: '.slider_container',
        slide: '.slider_slide',
        nextSlide: '.slider_next',
        prevSlide: '.slider_prev',
        wrapper: '.slider_wrapper',
        field: '.slider_field'
    });
});
