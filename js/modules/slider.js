function slider({containerSelector, slideSelector, nextSlideSelector, prevSlideSelector, wrapperSelector, fieldSelector, indicatorsClass, elementsPerPage = 1, elementsPerPageMobile = 1, columnGap = 0, duration = 0, swipe = false}) {
    let slideIndex = 1,
    	offset = 0,
		timer = 0,
        perPage = 1,
        gap = 0,
        startX,
        endX,
		mobile = window.matchMedia('(max-width: 992px)').matches,
        templates = [],
        mainClass,
		dots = [];
    const slides = document.querySelectorAll(slideSelector),
		container = document.querySelector(containerSelector),
        prev = document.querySelector(prevSlideSelector),
        next = document.querySelector(nextSlideSelector),
        wrapper = document.querySelector(wrapperSelector),
        field = document.querySelector(fieldSelector);

    if (indicatorsClass) {
        mainClass = indicatorsClass.slice(0, -11);
    }

    let baseSlides = slides;
    mobile ? perPage = elementsPerPageMobile : perPage = elementsPerPage;
    mobile ? gap = columnGap / 2 : gap = columnGap;
    perPage == 1 ? gap = 0 : gap = gap;
	let width = Math.floor(deleteNotDigits(window.getComputedStyle(wrapper).width) / perPage - (gap * (slides.length - 1) / slides.length)) + 'px';

    field.style.width = 100 * (slides.length + perPage - 1) / perPage + "%";
    field.style.columnGap = gap + "px";

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
            dot.classList.add(`${mainClass}_dot`);
            if (i == 0) {
                dot.classList.add(`${mainClass}_active`);
            } 
            indicators.append(dot);
            dots.push(dot);
        }

        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const slideTo = e.target.getAttribute('data-slide-to');
                slideIndex = slideTo;
                offset = (deleteNotDigits(width) + gap) * (slideTo - 1);
                changeActivity();
                makeTimer(duration);
            });
        });
    }

	makeTimer(duration);

	window.addEventListener('resize', (e) => {
        mobile = window.matchMedia('(max-width: 992px)').matches;
        mobile ? perPage = elementsPerPageMobile : perPage = elementsPerPage;
        mobile ? gap = columnGap / 2 : gap = columnGap;
        perPage == 1 ? gap = 0 : gap = gap;
        width = Math.floor(deleteNotDigits(window.getComputedStyle(wrapper).width) / perPage - (gap * (slides.length - 1) / slides.length)) + 'px';
        field.style.width = 100 * (slides.length + perPage - 1) / perPage + "%";
        field.style.columnGap = gap + "px";

        while (field.childElementCount > baseSlides.length) {
            field.removeChild(field.lastElementChild)
        }
        for (let i = 0; i < (perPage - 1); i++) {
            field.append(templates[i + 1].cloneNode(true));
        }

        let slidesNew = document.querySelectorAll(slideSelector);
        slidesNew.forEach((slide, index) => {
            slide.style.width = width;
        });
        
        if (indicatorsClass) {
            let dots = document.querySelectorAll(`.${mainClass}_dot`);
            dots.forEach((dot) => {
                mobile ? dot.style.width = 100 / slides.length + '%' : dot.style.width = '';
            });
        }
		
        slideIndex = 1,
        offset = 0,
        changeActivity();
        onSwipe();
    }); 

    if (nextSlideSelector) {
        next.addEventListener("click", () => {
            moveNext();
            makeTimer(duration);
        });
    }

    if (prevSlideSelector) {
        prev.addEventListener("click", () => {
            movePrev();
            makeTimer(duration);
        });
    }

	function moveNext() {
        if (offset >= (deleteNotDigits(width) + gap) * (slides.length - 1)) {
			offset = 0;
		} else {
			offset += deleteNotDigits(width) + gap;
		}

		if (slideIndex == slides.length) {
			slideIndex = 1;
		} else {
			slideIndex++;
		}
		changeActivity();
    }

    function movePrev() {
        if (offset < deleteNotDigits(width)) {
			offset = (deleteNotDigits(width) + gap) * (slides.length - 1);
		} else {
			offset -= deleteNotDigits(width) + gap;
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
            dots.forEach(dot => dot.classList.remove(`${mainClass}_active`));
            dots[slideIndex-1].classList.add(`${mainClass}_active`);
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

    const start = (e) => {
        startX = e.pageX || e.touches[0].pageX;	
    }

    const end = () => {
        let distance = 20;
        if (endX < startX && Math.abs(startX - endX) > distance) {
            moveNext();
            makeTimer(duration);
        }  
        if (endX > startX && Math.abs(endX - startX) > distance) {
            movePrev();
            makeTimer(duration);
        }
    }

    const move = (e) => {
        endX = e.pageX || e.touches[0].pageX;
    }

    onSwipe()

    function onSwipe() {
        field.addEventListener('mousedown', start);
        field.addEventListener('touchstart', start, {passive: true});

        field.addEventListener('mousemove', move);
        field.addEventListener('touchmove', move, {passive: true});

        field.addEventListener('mouseup', end);
        field.addEventListener('touchend', end);

        if (!swipe || !mobile) {
            field.removeEventListener('mousedown', start);
            field.removeEventListener('touchstart', start, {passive: true});
    
            field.removeEventListener('mousemove', move);
            field.removeEventListener('touchmove', move, {passive: true});
    
            field.removeEventListener('mouseup', end);
            field.removeEventListener('touchend', end);
        }
    }
}

export default slider;
