import gsap from 'gsap';

export const fadeIn = (element, delay = 0) => {
    gsap.fromTo(
        element,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay, ease: 'power3.out' }
    );
};

export const slideUp = (element, delay = 0) => {
    gsap.fromTo(
        element,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, delay, ease: 'expo.out' }
    );
};

export const staggerChildren = (parent, selector, delay = 0) => {
    gsap.fromTo(
        gsap.utils.selector(parent)(selector),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, delay, ease: 'power2.out' }
    );
};
