// Header shadow on scroll
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
});

// Play card video on hover (desktop) + on visible (mobile)
document.querySelectorAll('.card').forEach(card => {
  const video = card.querySelector('.card-video');
  if (!video) return;

  card.addEventListener('mouseenter', () => video.play().catch(()=>{}));
  card.addEventListener('mouseleave', () => {
    video.pause();
    video.currentTime = 0;
  });

  const obs = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) video.play().catch(()=>{});
    else video.pause();
  }, { threshold: 0.5 });
  obs.observe(card);
});

// Reveal on scroll
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = 1;
      entry.target.style.transform = 'translateY(0)';
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.card, .section-head, .about-text, .about-img, .g-item').forEach(el => {
  el.style.opacity = 0;
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity .8s ease, transform .8s ease';
  revealObs.observe(el);
});
