// ===== Header scroll =====
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== Chalet videos play when visible =====
document.querySelectorAll('.chalet-item').forEach(item => {
  const video = item.querySelector('.chalet-video');
  if (!video) return;

  const obs = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) video.play().catch(()=>{});
    else video.pause();
  }, { threshold: 0.45 });
  obs.observe(item);
});

// ===== Reveal on scroll =====
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = 1;
      entry.target.style.transform = 'translateY(0)';
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.section-head, .about-text, .about-img, .feature-item, .review-card, .stat, .g-item').forEach(el => {
  el.style.opacity = 0;
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity .8s ease, transform .8s ease';
  revealObs.observe(el);
});

// ===== Stats counter =====
const statsObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = +el.dataset.target;
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const start = performance.now();

    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(tick);
    statsObs.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num').forEach(el => statsObs.observe(el));

// ===== Booking form → WhatsApp =====
document.getElementById('bookingForm').addEventListener('submit', e => {
  e.preventDefault();

  const data = {
    chalet:   document.getElementById('bChalet').value,
    date:     document.getElementById('bDate').value,
    checkin:  document.getElementById('bCheckin').value,
    checkout: document.getElementById('bCheckout').value,
    name:     document.getElementById('bName').value,
    phone:    document.getElementById('bPhone').value
  };

  const msg =
`🌴 *طلب حجز جديد - ديامونتا*

👤 الاسم: ${data.name}
📱 الجوال: ${data.phone}
🏝️ الشاليه: ${data.chalet}
📅 التاريخ: ${data.date}
🕓 وقت الوصول: ${data.checkin}
🕓 وقت المغادرة: ${data.checkout}

شكراً 🌸`;

  window.open(`https://wa.me/966549008997?text=${encodeURIComponent(msg)}`, '_blank');
});

// ===== Lightbox =====
const lightbox = document.getElementById('lightbox');
const lbImg = lightbox.querySelector('.lb-img');
const items = [...document.querySelectorAll('.g-item')];
let currentIndex = 0;

function openLb(index) {
  currentIndex = index;
  lbImg.src = items[index].dataset.src;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLb() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}
function navLb(dir) {
  currentIndex = (currentIndex + dir + items.length) % items.length;
  lbImg.style.animation = 'none';
  setTimeout(() => lbImg.style.animation = '', 10);
  lbImg.src = items[currentIndex].dataset.src;
}

items.forEach((it, i) => it.addEventListener('click', () => openLb(i)));
lightbox.querySelector('.lb-close').addEventListener('click', closeLb);
lightbox.querySelector('.lb-prev').addEventListener('click', e => { e.stopPropagation(); navLb(-1); });
lightbox.querySelector('.lb-next').addEventListener('click', e => { e.stopPropagation(); navLb(1); });
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLb(); });

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLb();
  if (e.key === 'ArrowRight') navLb(-1);
  if (e.key === 'ArrowLeft') navLb(1);
});
