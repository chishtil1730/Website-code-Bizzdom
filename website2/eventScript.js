document.addEventListener("DOMContentLoaded", () => {
    const carousels = document.querySelectorAll(".wrapper");

    carousels.forEach(wrapper => {
        const carousel = wrapper.querySelector(".carousel");
        const leftArrow = wrapper.querySelector(".carousel-btn-left");
        const rightArrow = wrapper.querySelector(".carousel-btn-right");

        if (!carousel || !leftArrow || !rightArrow) {
            console.error("Carousel elements not found in one of the wrappers");
            return;
        }

        const visibleCards = 3;
        const cards = Array.from(carousel.querySelectorAll(".card"));
        const totalCards = cards.length;
        let currentIndex = visibleCards;
        let isAnimating = false;

        if (totalCards <= visibleCards) {
            leftArrow.style.display = "none";
            rightArrow.style.display = "none";
            return;
        }

        const clonesBefore = cards.slice(-visibleCards).map(card => card.cloneNode(true));
        clonesBefore.forEach(clone => carousel.insertBefore(clone, cards[0]));

        const clonesAfter = cards.slice(0, visibleCards).map(card => card.cloneNode(true));
        clonesAfter.forEach(clone => carousel.appendChild(clone));

        const updatedCards = Array.from(carousel.querySelectorAll(".card"));

        carousel.style.display = "flex";
        carousel.style.overflow = "visible";
        carousel.parentElement.style.overflow = "hidden";

        let cardWidth;

        const setupCarouselDimensions = () => {
            const card = updatedCards[0];
            const cardStyle = getComputedStyle(card);
            const cardMarginRight = parseFloat(cardStyle.marginRight) || 0;
            cardWidth = card.offsetWidth + cardMarginRight;

            carousel.parentElement.style.width = `${cardWidth * visibleCards}px`;
            
            carousel.style.transition = "none";
            updateCarouselPosition();
        };

        const updateCarouselPosition = (useTransition = true) => {
            isAnimating = useTransition;
            const translateX = -currentIndex * cardWidth;
            carousel.style.transition = useTransition ? "transform 0.5s ease-in-out" : "none";
            carousel.style.transform = `translateX(${translateX}px)`;
        };

        const handleTransitionEnd = () => {
            isAnimating = false;

            if (currentIndex < visibleCards) {
                currentIndex = totalCards + currentIndex;
                updateCarouselPosition(false);
            } else if (currentIndex >= totalCards + visibleCards) {
                currentIndex = currentIndex - totalCards;
                updateCarouselPosition(false);
            }
        };

        const moveTo = (newIndex) => {
            if (isAnimating) return;
            currentIndex = newIndex;
            updateCarouselPosition(true);
        };

        rightArrow.addEventListener("click", () => moveTo(currentIndex + 1));
        leftArrow.addEventListener("click", () => moveTo(currentIndex - 1));
        carousel.addEventListener("transitionend", handleTransitionEnd);

        let touchStartX = 0;
        let touchMoveX = 0;
        let dragThreshold = 50;

        const handleTouchStart = (e) => {
            if (isAnimating) return;
            touchStartX = e.touches[0].clientX;
            carousel.style.transition = "none";
        };

        const handleTouchMove = (e) => {
            if (isAnimating) return;
            touchMoveX = e.touches[0].clientX;
            const dragDistance = touchMoveX - touchStartX;
            const translateX = -currentIndex * cardWidth + dragDistance;
            carousel.style.transform = `translateX(${translateX}px)`;
        };

        const handleTouchEnd = () => {
            if (isAnimating) return;
            const dragDistance = touchMoveX - touchStartX;

            if (Math.abs(dragDistance) > dragThreshold) {
                moveTo(dragDistance < 0 ? currentIndex + 1 : currentIndex - 1);
            } else {
                updateCarouselPosition(true);
            }
            touchStartX = 0;
            touchMoveX = 0;
        };

        carousel.addEventListener("touchstart", handleTouchStart);
        carousel.addEventListener("touchmove", handleTouchMove);
        carousel.addEventListener("touchend", handleTouchEnd);

        let resizeTimeout;
        window.addEventListener("resize", () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                setupCarouselDimensions();
            }, 200);
        });

        setupCarouselDimensions();
    });
});