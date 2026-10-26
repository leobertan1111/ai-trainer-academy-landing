document.documentElement.classList.add('js');

const revealItems = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

const sticky = document.querySelector('[data-sticky]');
const mainOffer = document.querySelector('[data-main-offer]');
if (sticky && mainOffer && 'IntersectionObserver' in window) {
  const stickyObserver = new IntersectionObserver(([entry]) => {
    sticky.classList.toggle('show', !entry.isIntersecting && entry.boundingClientRect.top < 0);
  }, { threshold: 0.05 });
  stickyObserver.observe(mainOffer);
}

document.querySelectorAll('[data-scroll-offer]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const offer = document.querySelector('#oferta');
    if (offer) {
      event.preventDefault();
      offer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
});
