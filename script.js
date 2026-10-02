// ===== Header scroll =====
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== Detect In-App Browsers (TikTok, Instagram, etc.) =====
(function detectInAppBrowser() {
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  const inAppPatterns = [
    /TikTok/i,
    /BytedanceWebview/i,
    /Instagram/i,
    /FBAN|FBAV/i,
    /Snapchat/i,
    /Twitter/i,
    /Line/i,
    /MicroMessenger/i
  ];

  const isInApp = inAppPatterns.some(p => p.test(ua));

  if (isInApp) {
    const notice = document.getElementById('browserNotice');
    if (notice) {
      setTimeout(() => notice.classList.add('show'), 800);
    }
  }
})();

// ===== Force autoplay chalet videos (iOS fix) =====
function forcePlayVideos() {
  document.querySelectorAll('.chalet-video').forEach(video => {
    video.muted = true;
    video.setAttribute('muted', '');
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');

    const tryPlay = () => {
      const p = video.play();
      if (p && p.catch) p.catch(() => {});
    };

    tryPlay();
    video.addEventListener('loadeddata', tryPlay);
    video.addEventListener('canplay', tryPlay);
  });
}

document.addEventListener('DOMContentLoaded', forcePlayVideos);
window.addEventListener('load', forcePlayVideos);

['touchstart', 'click', 'scroll'].forEach(evt => {
  document.addEventListener(evt, forcePlayVideos, { once: true, passive: true });
});

// ===== Chalet videos: play when visible =====
document.querySelectorAll('.chalet-item').forEach(item => {
  const video = item.querySelector('.chalet-video');
  if (!video) return;

  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    },
    { threshold: 0.45 }
  );

  observer.observe(item);
});

// ===== Min date = today =====
const dateInput = document.getElementById('bDate');
if (dateInput) {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  dateInput.min = `${yyyy}-${mm}-${dd}`;
}

// ===== Hide scroll hint after 5s =====
setTimeout(() => {
  const hint = document.querySelector('.scroll-hint');
  if (hint) hint.classList.add('hidden');
}, 5000);

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

document.querySelectorAll('.section-head, .about-text, .feature-item, .review-card, .stat, .g-item').forEach(el => {
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
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
  bookingForm.addEventListener('submit', e => {
    e.preventDefault();

    const data = {
      chalet:   document.getElementById('bChalet').value,
      date:     document.getElementById('bDate').value,
      checkin:  document.getElementById('bCheckin').value,
      checkout: document.getElementById('bCheckout').value,
      name:     document.getElementById('bName').value,
      phone:    document.getElementById('bPhone').value
    };

    // تحقق من رقم الجوال
    const cleanPhone = data.phone.replace(/\D/g, '');
    if (cleanPhone.length < 9) {
      alert('الرجاء إدخال رقم جوال صحيح');
      return;
    }

    const msg =
`🌴 *طلب حجز جديد - ديامُونتا*

👤 الاسم: ${data.name}
📱 الجوال: ${data.phone}
🏝️ الشاليه: ${data.chalet}
📅 التاريخ: ${data.date}
🕓 وقت الوصول: ${data.checkin}
🕓 وقت المغادرة: ${data.checkout}

شكراً 🌸`;

    window.open(`https://wa.me/966549008997?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
  });
}

// ===== Lightbox =====
const lightbox = document.getElementById('lightbox');
const items = [...document.querySelectorAll('.g-item')];

if (lightbox && items.length) {
  const lbImg = lightbox.querySelector('.lb-img');
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
    lbImg.src = items[currentIndex].dataset.src;
  }

  items.forEach((it, i) => {
    it.addEventListener('click', () => openLb(i));
    it.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLb(i);
      }
    });
  });

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
}
