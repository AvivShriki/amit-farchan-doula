// עמית פרחן — דולה מוסמכת: אינטראקציות משותפות לכל הדפים

document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  initTestimonials();
  initScrollReveal();
});

function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (items.length === 0) return;

  const revealAll = () => items.forEach((el) => el.classList.add('is-visible'));

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    revealAll();
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach((el) => observer.observe(el));

  // ניווט ישיר לעוגן (למשל קישור בתפריט) יכול "לדלג" מעל סקשן בלי
  // שהוא אי-פעם ייכנס לתצוגה — במקרה כזה חושפים הכל מיד במקום להשאיר
  // אותו שקוף לצמיתות.
  document.querySelectorAll('a[href*="#"]').forEach((link) => {
    link.addEventListener('click', revealAll);
  });
  window.addEventListener('hashchange', revealAll);
}

function initNavToggle() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function initTestimonials() {
  const root = document.querySelector('.testimonials');
  if (!root) return;

  const slidesWrap = root.querySelector('.testimonial-slides');
  const slides = Array.from(root.querySelectorAll('.testimonial-card'));
  const dotsWrap = root.querySelector('.testimonial-dots');
  if (!slidesWrap || slides.length === 0) return;

  let current = 0;
  let timer = null;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'testimonial-dot';
    dot.type = 'button';
    dot.setAttribute('aria-label', `עברי להמלצה ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.querySelectorAll('.testimonial-dot'));

  function render() {
    slidesWrap.style.transform = `translateX(${current * 100}%)`;
    dots.forEach((d, i) => {
      d.classList.toggle('is-active', i === current);
      d.setAttribute('aria-current', i === current ? 'true' : 'false');
    });
  }

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    render();
    resetTimer();
  }

  function resetTimer() {
    if (timer) clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 6000);
  }

  render();
  resetTimer();

  root.addEventListener('mouseenter', () => timer && clearInterval(timer));
  root.addEventListener('mouseleave', resetTimer);
}
