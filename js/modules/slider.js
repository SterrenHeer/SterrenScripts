function slider({containerSelector, slideSelector, nextSlideSelector, prevSlideSelector, wrapperSelector, fieldSelector, indicatorsClass}) {
    let slideIndex = 1,
    	offset = 0;
    const slides = document.querySelectorAll(slideSelector),
		container = document.querySelector(containerSelector),
        prev = document.querySelector(prevSlideSelector),
        next = document.querySelector(nextSlideSelector),
        wrapper = document.querySelector(wrapperSelector),
        field = document.querySelector(fieldSelector);
	
	let width = window.getComputedStyle(wrapper).width;
	width = Math.floor(deleteNotDigits(width)) + 'px';

    field.style.width = 100 * slides.length + "%";

    slides.forEach((slide) => {
		slide.style.width = width;
	});

    next.addEventListener("click", () => {
		moveNext();
	});

    prev.addEventListener("click", () => {
		movePrev();
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
		changeActivity()
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
		changeActivity()
    }

	function changeActivity() {
        field.style.transform = `translateX(-${offset}px)`;
    }

    function deleteNotDigits(str) {
        return +str.replace(/[^\d\.]/g, '');
    }
}

export default slider;
