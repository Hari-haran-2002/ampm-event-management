// ── PAGE LOADER ───────────────────────────────────────────────
window.addEventListener('load', function() {
  setTimeout(() => {
    const loader = document.getElementById('pageLoader');
    if (loader) loader.classList.add('hidden');
  }, 1200);
});

// ── PARTICLES ─────────────────────────────────────────────────
(function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 25; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `left:${Math.random()*100}%;width:${Math.random()*3+1}px;height:${Math.random()*3+1}px;animation-duration:${Math.random()*15+10}s;animation-delay:${Math.random()*10}s;opacity:${Math.random()*0.4}`;
    container.appendChild(p);
  }
})();

// ── NAVBAR SCROLL + ACTIVE LINK ───────────────────────────────
window.addEventListener('scroll', function() {
  const navbar = document.getElementById('navbar');
  const scrollBtn = document.getElementById('scrollTop');

  if (window.scrollY > 50) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');

  if (scrollBtn) {
    if (window.scrollY > 400) scrollBtn.classList.add('show');
    else scrollBtn.classList.remove('show');
  }

  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
  navLinks.forEach(link => {
    link.classList.remove('nav-active');
    if (link.getAttribute('href') === '#' + current) link.classList.add('nav-active');
  });
});

// ── NAVBAR TOGGLE (mobile) ────────────────────────────────────
function toggleNav() { document.getElementById('navLinks').classList.toggle('open'); }
function closeNav() { document.getElementById('navLinks').classList.remove('open'); }

// ── SIDE MENU ─────────────────────────────────────────────────
function toggleSideMenu() {
  const menu = document.getElementById('sideMenu');
  const overlay = document.getElementById('sideOverlay');
  const btn = document.querySelector('.hamburger-btn');
  const isOpen = menu.classList.contains('open');
  if (isOpen) {
    menu.classList.remove('open');
    overlay.classList.remove('show');
    btn.classList.remove('open');
    document.body.style.overflow = '';
  } else {
    menu.classList.add('open');
    overlay.classList.add('show');
    btn.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}
function closeSideMenu() {
  document.getElementById('sideMenu').classList.remove('open');
  document.getElementById('sideOverlay').classList.remove('show');
  document.querySelector('.hamburger-btn').classList.remove('open');
  document.body.style.overflow = '';
}

// ── ENQUIRY FORM ──────────────────────────────────────────────
document.getElementById('enquiryForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const btn = this.querySelector('.submit-btn');
  btn.textContent = 'Sending...';
  btn.disabled = true;
  const formData = new FormData(this);
  try {
    const res = await fetch('https://formspree.io/f/8ba875b2-240e-4988-94e8-85d364ac650b', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });
    if (res.ok) {
      this.reset();
      document.getElementById('enquiryForm').style.display = 'none';
      document.getElementById('successMsg').style.display = 'block';
      document.getElementById('successMsg').scrollIntoView({ behavior: 'smooth' });
    } else {
      const data = await res.json();
      showToast(data.error || 'Something went wrong. Please try again.', false);
    }
  } catch { showToast('Something went wrong. Please try again.', false); }
  btn.textContent = 'Send Enquiry →';
  btn.disabled = false;
});

function resetForm() {
  document.getElementById('successMsg').style.display = 'none';
  document.getElementById('enquiryForm').style.display = 'block';
  document.getElementById('enquiry').scrollIntoView({ behavior: 'smooth' });
}

function showToast(msg, success) {
  const t = document.getElementById('toast');
  t.textContent = (success ? '✓ ' : '✗ ') + msg;
  t.style.borderColor = success ? '#d8b15a' : '#d96b6b';
  t.style.display = 'block';
  setTimeout(() => { t.style.display = 'none'; }, 4000);
}

// ── MENU DATA ─────────────────────────────────────────────────
const menus = {
  "Semantham": { icon:"💍", cards:[
    { title:"Semantham Saapadu – 1", items:["Malai Jam Jam","White Rice","Sambar","Vatha Kuzhambu","Rasam","Buttermilk","National Poriyal","Potato Peas Masala","Appalam","Pickle","Ilaneer Payasam","Curd Vadai","Banana Leaf","Water Bottle"], variety:["Lemon Rice","Mango Rice","Coconut Rice","Puthina Rice","Puliyodharai Rice"] },
    { title:"Semantham Saapadu – 2", items:["Makkan Beda","Veg Biryani","Onion Raita","Medhu Vadai","White Rice","Sambar","Vatha Kuzhambu","Rasam","Buttermilk","National Poriyal","Potato Peas Masala","Appalam","Pickle","Ilaneer Payasam","Banana Leaf","Water Bottle"], variety:["Lemon Rice","Mango Rice","Coconut Rice","Puthina Rice","Puliyodharai Rice","Puthina Thuvayal"] }
  ]},
  "Breakfast": { icon:"🌅", cards:[
    { title:"Breakfast – 1", items:["Kesari Pineapple Pudding","Idly","Pongal","Sambar","Kara Chutney","Coconut Chutney","Medhu Vadai","Banana Leaf","Water Bottle"] },
    { title:"Breakfast – 2", items:["Kesari Pineapple Pudding","Idly","Pongal","Poori","Potato Masala","Kara Chutney","Coconut Chutney","Sambar","Medhu Vadai","Leaf","Water Bottle"] },
    { title:"Breakfast – 3", items:["Makkan Peda","Kasi Halwa","Idly","Pongal","Masal Dosai","Poori","Medhuvadai","Sambar","Potato Masala","Vada Curry","Coconut Chutney","Pudhna Chutney","Kara Chutney","Leaf","Water Bottle"] }
  ]},
  "Lunch": { icon:"☀️", cards:[
    { title:"Lunch – 1", items:["Makkan Beda","White Rice","Sambar","Rasam","Vatha Kulambu","Butter Milk","National Poriyal","Potato Peas Masala","Appalam","Pickle","Leaf","Water Bottle"] },
    { title:"Lunch – 2", items:["Malai Jam Jam","White Rice","Sambar","Rasam","Vatha Kuzhambu","Butter Milk","National Poriyal","Potato Peas Masala","Vadai","Appalam","Ilaneer Payasam","Mango Pickle","Leaf","Water Bottle"] },
    { title:"Lunch – 3", items:["Badham Kathali","Kala Jamun","Masala Vadai","Potato Peas Masala","Chow Chow Kootu","Veg Biryani","Onion Pachadi","Rice","Sambar","Vatha Kuzhambu","Rasam","Butter Milk","Appalam","Mangai Thokku","Paruppu Payasam","Leaf","Water Bottle"] }
  ]},
  "Dinner": { icon:"🌙", cards:[
    { title:"Dinner – 1", items:["Malai Jam Jam","Veg Biryani / Mushroom Biryani","Onion Pachadi","Chapati / Naan","Paneer Butter Masala","White Rice","Sambar","Vathakuzhambu","Rasam","Butter Milk","National Poriyal","Potato Peas Masala","Appalam","Pickle","Ilaneer Payasam","Leaf","Water Bottle"] },
    { title:"Dinner – 2", items:["Malai Jam Jam","Veg Biryani","Onion Pachadi","Chapati / Naan","Paneer Butter Masala","Gobi-65","Sambar Rice","Curd Rice","White Rice","Rasam","White Veg Kuruma","Idiyappam","Onion Uthappam","Kara Chutney","Veg Roll","Ilaneer Payasam","Leaf","Water Bottle"] },
    { title:"Dinner – 3", items:["Paan","Cauliflower 65 / Cutlet","National Poriyal","Potato Pattani Varuval","Chapathi","Channa Masala","Veg Biryani","Onion Raitha","Appalam","Rice","Sambar","Vathakuzhambu","Rasam","Vathal","More","Mangai Thokku","Leaf","Water Bottle"] },
    { title:"Dinner – 4", items:["Rasa Malai","Kaju Kathili","Veg Spring Roll","Gobi Manchurian","National Poriyal","Brinjal Mochai Chops","Rumali Roti","Paneer Butter Masala","Uthappam","Kara Chutney","Veg Biryani","Onion Raitha","Appalam","Bisibellebath","Rice","Tomato Rasam","Potato Chips","More Milagai","Bagalabath (Curd Rice)","Pickle","Leaf"] }
  ]}
};

function renderMenu(cat) {
  const root = document.getElementById('menu-root');
  if (!root) return;
  const tabs = Object.keys(menus).map(k =>
    `<button class="mtab ${k===cat?'active':''}" onclick="renderMenu('${k}')">${menus[k].icon} ${k}</button>`
  ).join('');
  const cards = menus[cat].cards.map(c => `
    <div class="menu-card reveal">
      <div class="menu-card-title"><span class="menu-card-dot"></span>${c.title}</div>
      <ul class="menu-item-list">${c.items.map(i=>`<li>${i}</li>`).join('')}</ul>
      ${c.variety?`<div class="menu-variety"><div class="menu-variety-title">Variety Rice</div><ul class="menu-item-list">${c.variety.map(i=>`<li>${i}</li>`).join('')}</ul></div>`:''}
    </div>`).join('');
  root.innerHTML = `<div class="menu-tabs">${tabs}</div><div class="menu-grid">${cards}</div>`;
  root.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

// ── FAQ ───────────────────────────────────────────────────────
const faqs = [
  { q:"What is the minimum number of guests you cater for?", a:"We cater for events of all sizes — from intimate family gatherings of 50 guests to large weddings and corporate events of 1000+ guests. No event is too small or too big!" },
  { q:"How far in advance should I book?", a:"We recommend booking at least 2–4 weeks in advance. For peak season (Oct–Feb) and weddings, booking 1–2 months early is advisable to ensure availability." },
  { q:"Do you provide staff and serving equipment?", a:"Yes! We provide trained serving staff, chafing dishes, serving utensils, and complete setup. You just need to enjoy your event." },
  { q:"What areas in Chennai do you serve?", a:"We serve all areas across Chennai including Ayanavaram, Anna Nagar, T. Nagar, Porur, OMR, ECR and more. Contact us to confirm for your location." },
  { q:"Do you offer both Veg and Non-Veg menus?", a:"Yes! We specialize in both Veg and Non-Veg catering with customized menus based on your preferences, dietary requirements and budget." },
  { q:"How is the pricing structured?", a:"Our pricing is per plate and varies based on menu selection, number of guests and event type. Contact us for a free customized quote." }
];

function initFAQ() {
  const list = document.getElementById('faqList');
  if (!list) return;
  list.innerHTML = faqs.map((f,i) => `
    <div class="faq-item">
      <button class="faq-question" onclick="toggleFAQ(${i})" id="fq${i}"><span>${f.q}</span><span class="faq-icon">+</span></button>
      <div class="faq-answer" id="fa${i}">${f.a}</div>
    </div>`).join('');
}

function toggleFAQ(i) {
  const q = document.getElementById('fq'+i), a = document.getElementById('fa'+i);
  const open = q.classList.contains('open');
  document.querySelectorAll('.faq-question').forEach(el=>el.classList.remove('open'));
  document.querySelectorAll('.faq-answer').forEach(el=>el.classList.remove('open'));
  if (!open) { q.classList.add('open'); a.classList.add('open'); }
}

// ── GALLERY ───────────────────────────────────────────────────
const galleryItems = [
  {icon:'💍',caption:'Marriage Catering'},{icon:'🍽',caption:'Saapadu Feast'},
  {icon:'🎂',caption:'Birthday Setup'},{icon:'🥘',caption:'Veg Spread'},
  {icon:'🎪',caption:'Outdoor Event'},{icon:'🌸',caption:'Reception Decor'},
  {icon:'🍛',caption:'Non-Veg Special'},{icon:'🎉',caption:'Get-Together'},
  {icon:'✨',caption:'Semantham'},
];
let currentLight = 0;

function filterGallery(cat, e) {
  document.querySelectorAll('.gtab').forEach(t=>t.classList.remove('active'));
  if (e&&e.target) e.target.classList.add('active');
  document.querySelectorAll('.gallery-item').forEach(item => {
    if (cat==='all'||item.dataset.cat===cat) item.classList.remove('hidden');
    else item.classList.add('hidden');
  });
}

function openLight(i) {
  currentLight = i;
  document.getElementById('lightIcon').textContent = galleryItems[i].icon;
  document.getElementById('lightCaption').textContent = galleryItems[i].caption;
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLight() { document.getElementById('lightbox').classList.remove('open'); document.body.style.overflow=''; }
function changeLight(dir) {
  currentLight = (currentLight+dir+galleryItems.length)%galleryItems.length;
  document.getElementById('lightIcon').textContent = galleryItems[currentLight].icon;
  document.getElementById('lightCaption').textContent = galleryItems[currentLight].caption;
}
document.addEventListener('keydown', e => {
  if (e.key==='Escape') closeLight();
  if (e.key==='ArrowRight') changeLight(1);
  if (e.key==='ArrowLeft') changeLight(-1);
});

// ── STATS COUNTER ─────────────────────────────────────────────
let counterDone = false;
function startCounters() {
  if (counterDone) return; counterDone = true;
  document.querySelectorAll('.counter').forEach(el => {
    const target = parseInt(el.dataset.target);
    const step = target / (2000/16);
    let cur = 0;
    const t = setInterval(() => {
      cur += step;
      if (cur >= target) { el.textContent = target; clearInterval(t); }
      else el.textContent = Math.floor(cur);
    }, 16);
  });
}
const statsObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) startCounters(); });
}, { threshold: 0.3 });

// ── REVEAL ANIMATIONS ─────────────────────────────────────────
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) setTimeout(() => e.target.classList.add('visible'), i * 80);
  });
}, { threshold: 0.1 });

// ── INIT ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  renderMenu('Semantham');
  initFAQ();

  const stats = document.getElementById('stats');
  if (stats) statsObs.observe(stats);

  document.querySelectorAll('.about-card,.service-card,.review-card,.stat-card,.gallery-item,.faq-item,.pricing-card,.about-quote').forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });
});

// ── WHATSAPP POPUP ────────────────────────────────────────────
let waOpen = false;

function toggleWAPopup() {
  waOpen ? closeWAPopup() : openWAPopup();
}

function openWAPopup() {
  waOpen = true;
  const box = document.getElementById('waPopupBox');
  const dot = document.getElementById('waNotifDot');
  box.style.display = 'flex';
  setTimeout(() => box.classList.add('show'), 10);
  dot.classList.add('hidden');
}

function closeWAPopup() {
  waOpen = false;
  const box = document.getElementById('waPopupBox');
  box.classList.remove('show');
  setTimeout(() => { box.style.display = 'none'; }, 300);
}

function waQuickReply(text, btn) {
  document.getElementById('waQuickBtns').style.display = 'none';
  waAddUserMsg(text);
  waShowTyping();

  const replies = {
    'Get a Quote': 'Sure! Please share your event type, date and number of guests — we will send you a customised quote right away! 😊',
    'Check the Menu': 'We serve Breakfast, Lunch, Dinner & Semantham menus with Veg & Non-Veg options. Tap below to chat with us for full details!',
    'Book an Event': 'Wonderful! Tell us your event date, type and guest count. We will confirm availability and plan everything for you!',
    'Call Now': 'Please call Rohith directly at +91 6374330154. We are available Mon–Sun, 8 AM to 9 PM. 📞'
  };

  setTimeout(() => {
    waRemoveTyping();
    waBotMsg(replies[text] || 'Thank you! We will get back to you shortly.');
    waShowOpenButton(text);
  }, 1800);
}

function waSendMsg() {
  const inp = document.getElementById('waTextInput');
  const msg = inp.value.trim();
  if (!msg) return;
  document.getElementById('waQuickBtns').style.display = 'none';
  waAddUserMsg(msg);
  inp.value = '';
  waShowTyping();
  setTimeout(() => {
    waRemoveTyping();
    waBotMsg('Thank you for your message! Tap below to continue chatting with Rohith on WhatsApp.');
    waShowOpenButton(msg);
  }, 1800);
}

function waAddUserMsg(text) {
  const chat = document.getElementById('waPopupChat');
  const d = document.createElement('div');
  d.style.cssText = 'display:flex;justify-content:flex-end;';
  d.innerHTML = `<div class="wa-popup-reply">${text}<div class="wa-popup-time">Now ✓✓</div></div>`;
  chat.appendChild(d);
  chat.scrollTop = chat.scrollHeight;
}

function waBotMsg(text) {
  const chat = document.getElementById('waPopupChat');
  const d = document.createElement('div');
  d.className = 'wa-popup-msg-wrap';
  d.innerHTML = `<div class="wa-popup-msg">${text}<div class="wa-popup-time">Now</div></div>`;
  chat.appendChild(d);
  chat.scrollTop = chat.scrollHeight;
}

function waShowTyping() {
  const chat = document.getElementById('waPopupChat');
  const d = document.createElement('div');
  d.id = 'waTyping';
  d.className = 'wa-popup-msg-wrap';
  d.innerHTML = `<div class="wa-typing"><span></span><span></span><span></span></div>`;
  chat.appendChild(d);
  document.getElementById('waStatus').innerHTML = '<span class="wa-online-dot"></span> Typing...';
  chat.scrollTop = chat.scrollHeight;
}

function waRemoveTyping() {
  const t = document.getElementById('waTyping');
  if (t) t.remove();
  document.getElementById('waStatus').innerHTML = '<span class="wa-online-dot"></span> Online · Replies instantly';
}

function waShowOpenButton(context) {
  const chat = document.getElementById('waPopupChat');
  const msg = encodeURIComponent(`Hi AMPM! I want to enquire about: ${context}`);
  const d = document.createElement('div');
  d.style.marginTop = '6px';
  d.innerHTML = `<a href="https://wa.me/916374330154?text=${msg}" target="_blank" class="wa-open-btn">
    <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/><path d="M11.5 2.5C6.261 2.5 2 6.761 2 12c0 1.826.487 3.535 1.338 5.004L2 22l5.132-1.348A9.455 9.455 0 0011.5 21.5c5.239 0 9.5-4.261 9.5-9.5S16.739 2.5 11.5 2.5z"/></svg>
    Continue on WhatsApp
  </a>`;
  chat.appendChild(d);
  chat.scrollTop = chat.scrollHeight;
}

// Auto open popup after 8 seconds on first visit
setTimeout(() => {
  if (!waOpen && !sessionStorage.getItem('waShown')) {
    openWAPopup();
    sessionStorage.setItem('waShown', '1');
  }
}, 8000);