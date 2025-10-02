// Ano no footer
document.addEventListener('DOMContentLoaded', ()=> {
  const y = document.getElementById('year'); if(y) y.textContent = new Date().getFullYear();
});

// Scroll suave (fallback)
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const id = a.getAttribute('href');
    if(id.length>1){ e.preventDefault(); document.querySelector(id).scrollIntoView({behavior:'smooth'}); }
  });
});

// ===== Mobile Menu =====
const menuBtn = document.querySelector('.menu-btn');
const navList = document.querySelector('header nav ul');
if (menuBtn && navList) {
  menuBtn.addEventListener('click', () => {
    navList.classList.toggle('open');
  });
  navList.querySelectorAll('a').forEach(link=>{
    link.addEventListener('click', ()=> navList.classList.remove('open'));
  });
}

// ===== Cards de imóveis =====
async function loadCards() {
  const grid = document.getElementById('cards');
  if (!grid) return;
  try {
    const res = await fetch('imoveis.json', {cache:'no-store'});
    const data = await res.json();
    grid.innerHTML = '';
    data.forEach(p=> {
      const el = document.createElement('article');
      el.className = 'card';
      el.setAttribute('data-zona', (p.zona||'').toLowerCase());
      el.setAttribute('data-tipo', (p.tipo||'').toLowerCase());
      el.setAttribute('data-preco', p.preco_num||0);
      el.innerHTML = `
        <div class="card-media">
          ${p.badge ? `<span class="badge">${p.badge}</span>` : ``}
          <img loading="lazy" src="${p.img}" alt="${p.titulo||'Imóvel'}"/>
        </div>
        <div class="card-body">
          <div class="price">€ ${p.preco} • ${p.titulo}</div>
          <div class="meta">${p.meta}</div>
          <div style="margin-top:12px; display:flex; gap:.6rem; flex-wrap:wrap">
            <a class="btn" href="#contactos" data-track="view_property">Quero Saber Mais</a>
            <a class="btn primary" href="#contactos" data-track="agendar_visita">Agendar Visita</a>
          </div>
        </div>`;
      grid.appendChild(el);
    });
  } catch(err) {
    console.error('Falha ao carregar imóveis:', err);
  }
}
loadCards();

// ===== Filtros (uma única vez) =====
const buttons = document.querySelectorAll('[data-filter]');
buttons.forEach(btn=>btn.addEventListener('click',()=>{
  const f = btn.getAttribute('data-filter');
  document.querySelectorAll('#cards .card').forEach(c=>{
    if(f==='all'){ c.style.display = 'block'; return; }
    const zona = c.getAttribute('data-zona') || '';
    const tipo = c.getAttribute('data-tipo') || '';
    c.style.display = (zona.includes(f) || tipo.includes(f)) ? 'block' : 'none';
  });
}));

// ===== Botão topo + reveal =====
const toTop = document.getElementById('toTop');
if (toTop) {
  window.addEventListener('scroll',()=>{
    if(window.scrollY>600) toTop.classList.add('show'); else toTop.classList.remove('show');
  });
  toTop.addEventListener('click',()=> window.scrollTo({top:0, behavior:'smooth'}));
}

// Reveal
const revealables = document.querySelectorAll('section, .card, .hero-card');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('show'); });
},{threshold:.12});
revealables.forEach(el=>{ el.classList.add('reveal'); io.observe(el); });

// Tracking simples
document.querySelectorAll('[data-track]').forEach(el=>{
  el.addEventListener('click',()=>{
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({event:'custom_event', action: el.getAttribute('data-track')});
  });
});
