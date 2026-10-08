document.documentElement.classList.add('js');

// رقم الواتساب (غيّره برقمك بصيغة دولية بدون +)
const WHATSAPP = '200000000000';

// قائمة الموبايل
const burger = document.getElementById('burger');
const menu = document.getElementById('menu');
burger.addEventListener('click', () => {
  const open = menu.parentElement.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});
menu.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => {
    menu.parentElement.classList.remove('open');
    burger.setAttribute('aria-expanded', false);
  })
);

// تمييز الرابط النشط أثناء السكرول
const links = [...menu.querySelectorAll('a')];
const spy = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      links.forEach(l => l.classList.toggle('on', l.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
['top', 'services', 'about', 'contact'].forEach(id => {
  const el = document.getElementById(id);
  if (el) spy.observe(el);
});

// ظهور الكروت عند السكرول
const reveal = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('in'), i * 90);
      reveal.unobserve(e.target);
    }
  });
}, { threshold: .15 });
document.querySelectorAll('.card').forEach(c => reveal.observe(c));

// عدّاد الأرقام
const counter = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    counter.unobserve(e.target);
    const el = e.target, end = +el.dataset.n, t0 = performance.now();
    (function tick(t) {
      const p = Math.min((t - t0) / 1300, 1);
      el.textContent = Math.round(end * p).toLocaleString('ar-EG') + (p === 1 ? '+' : '');
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  });
}, { threshold: .6 });
document.querySelectorAll('[data-n]').forEach(n => counter.observe(n));

// نموذج التواصل: تحقق ثم فتح واتساب برسالة جاهزة
const form = document.getElementById('form');
const err = document.getElementById('err');
form.addEventListener('submit', e => {
  e.preventDefault();
  const f = id => document.getElementById(id);
  const phoneOk = /^01[0-9]{9}$/.test(f('phone').value.trim().replace(/\s/g, ''));
  let bad = [];
  ['name', 'phone', 'dest'].forEach(id => {
    const ok = f(id).value.trim() && (id !== 'phone' || phoneOk);
    f(id).classList.toggle('bad', !ok);
    if (!ok) bad.push(id);
  });
  if (bad.length) {
    err.hidden = false;
    err.textContent = bad.includes('phone') && f('phone').value.trim()
      ? 'اكتب رقم موبايل مصري صحيح من 11 رقم.'
      : 'من فضلك املأ الحقول المطلوبة.';
    return;
  }
  err.hidden = true;
  const text = [
    'طلب جديد من الموقع',
    'الاسم: ' + f('name').value.trim(),
    'الموبايل: ' + f('phone').value.trim(),
    'الخدمة: ' + f('service').value,
    'الوجهة: ' + f('dest').value.trim(),
    'تفاصيل: ' + (f('msg').value.trim() || '-')
  ].join('\n');
  window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
  form.reset();
});
