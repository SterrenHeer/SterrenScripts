function slider({containerSelector, slideSelector, nextSlideSelector, prevSlideSelector, wrapperSelector, fieldSelector, indicatorsClass, elementsPerPage = 1, elementsPerPageMobile = 1, duration = 0, swipe = false}) {
    let slideIndex = 1,
    	offset = 0,
		timer = 0,
        perPage = 1,
		mobile = window.matchMedia('(max-width: 992px)').matches,
        templates = [],
		dots = [];
    const slides = document.querySelectorAll(slideSelector),
		container = document.querySelector(containerSelector),
        prev = document.querySelector(prevSlideSelector),
        next = document.querySelector(nextSlideSelector),
        wrapper = document.querySelector(wrapperSelector),
        field = document.querySelector(fieldSelector);

    let baseSlides = slides;
    mobile ? perPage = elementsPerPageMobile : perPage = elementsPerPage;
	let width = Math.floor(deleteNotDigits(window.getComputedStyle(wrapper).width)) / perPage + 'px';

    field.style.width = 100 * (slides.length + perPage - 1) / perPage + "%";

    slides.forEach((slide, index) => {
		slide.style.width = width;
        templates[index] = slide;
	});

    for (let i = 0; i < (perPage - 1); i++) {
        field.append(templates[i + 1].cloneNode(true));
    }

    if (indicatorsClass) {
        let indicators = document.createElement('div');
        indicators.classList.add(indicatorsClass);
        container.append(indicators);

        for (let i = 0; i < slides.length; i++) {
            const dot = document.createElement('div');
            mobile ? dot.style.width = 100 / slides.length + '%' : dot.style.width = '';
            dot.setAttribute('data-slide-to', i + 1);
            dot.classList.add('slider_dot');
            if (i == 0) {
                dot.classList.add('slider_active');
            } 
            indicators.append(dot);
            dots.push(dot);
        }

        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const slideTo = e.target.getAttribute('data-slide-to');
                slideIndex = slideTo;
                offset = deleteNotDigits(width) * (slideTo - 1);
                changeActivity();
                makeTimer(duration);
            });
        });
    }

	makeTimer(duration);

	window.addEventListener('resize', (e) => {
        mobile = window.matchMedia('(max-width: 992px)').matches;
        mobile ? perPage = elementsPerPageMobile : perPage = elementsPerPage;
        width = Math.floor(deleteNotDigits(window.getComputedStyle(wrapper).width) / perPage) + 'px'
        field.style.width = 100 * (slides.length + perPage - 1) / perPage + "%";

        while (field.childElementCount > baseSlides.length) {
            field.removeChild(field.lastElementChild)
        }
        for (let i = 0; i < (perPage - 1); i++) {
            field.append(templates[i + 1].cloneNode(true));
        }

        let slidesNew = document.querySelectorAll(slideSelector);
        slidesNew.forEach((slide) => {
            slide.style.width = width;
        });
        
        if (indicatorsClass) {
            let dots = document.querySelectorAll('.slider_dot');
            dots.forEach((dot) => {
                mobile ? dot.style.width = 100 / slides.length + '%' : dot.style.width = '';
            });
        }
		
        slideIndex = 1,
        offset = 0,
        changeActivity();
    }); 

    next.addEventListener("click", () => {
		moveNext();
		makeTimer(duration);
	});

    prev.addEventListener("click", () => {
		movePrev();
		makeTimer(duration);
	});

	function moveNext() {
        if (offset == deleteNotDigits(width) * (slides.length - 1)) {
			offset = 0;
		} else {
			offset += deleteNotDigits(width);
		}

		if (slideIndex == slides.length) {
			slideIndex = 1;
		} else {
			slideIndex++;
		}
		changeActivity();
    }

    function movePrev() {
        if (offset == 0) {
			offset = deleteNotDigits(width) * (slides.length - 1);
		} else {
			offset -= deleteNotDigits(width);
		}

		if (slideIndex == 1) {
			slideIndex = slides.length;
		} else {
			slideIndex--;
		}
		changeActivity();
    }

	function changeActivity() {
        field.style.transform = `translateX(-${offset}px)`;
        if (indicatorsClass) {
            dots.forEach(dot => dot.classList.remove('slider_active'));
            dots[slideIndex-1].classList.add('slider_active');
        }
    }

	function makeTimer(duration){
        if (duration == 0) {
            return;
        }
        clearInterval(timer);
        timer = setInterval(moveNext, duration);
    }

    function deleteNotDigits(str) {
        return +str.replace(/[^\d\.]/g, '');
    }

    if (swipe) {
        let startX;
        let endX;

        const start = (e) => {
            startX = e.pageX || e.touches[0].pageX;	
        }

        const end = () => {
            if (endX < startX) {
                moveNext();
                makeTimer(duration);
            }  
            if (endX > startX) {
                movePrev();
                makeTimer(duration);
            }
        }

        const move = (e) => {
            endX = e.pageX || e.touches[0].pageX;
        }

        field.addEventListener('mousedown', start);
        field.addEventListener('touchstart', start, {passive: true});

        field.addEventListener('mousemove', move);
        field.addEventListener('touchmove', move, {passive: true});

        field.addEventListener('mouseleave', end);
        field.addEventListener('mouseup', end);
        field.addEventListener('touchend', end);
    }
}

export default slider;
