(() => {
  'use strict';
  // Preserve the approved pixel, checkout, consent key and current launch state.
  const PIXEL_ID = '1619572939144296';
  const CHECKOUT = 'https://pay.cakto.com.br/xe9d3nw_1234619';
  const SALES_OPEN = false;
  const CONSENT_KEY = 'aita_marketing_consent_v1';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const banner = document.getElementById('cookie-banner');
  const stickyOffer = document.getElementById('sticky-offer');
  const footer = document.querySelector('.footer');
  const hero = document.querySelector('.hero');
  const offer = document.getElementById('oferta');
  const privacy = document.getElementById('privacy-dialog');
  const prelaunch = document.getElementById('dialog');
  const proof = document.getElementById('proof-dialog');
  let heroVisible = true;
  let offerVisible = false;
  function updateSticky() {
    const show = !heroVisible && !offerVisible && banner.hidden;
    stickyOffer.classList.toggle('show', show);
    stickyOffer.inert = !show;
    footer.classList.toggle('foot-with-bar', show);
  }
  function openDialog(dialog) {
    if (!dialog || typeof dialog.showModal !== 'function') return;
    dialog.showModal();
    document.body.classList.add('modal-open');
  }
  for (const dialog of [privacy, prelaunch, proof]) {
    dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
  }
  document.getElementById('close').addEventListener('click', () => prelaunch.close());
  document.getElementById('privacy-open').addEventListener('click', () => openDialog(privacy));
  document.getElementById('privacy-close').addEventListener('click', () => privacy.close());
  document.getElementById('proof-open').addEventListener('click', () => openDialog(proof));
  document.getElementById('proof-close').addEventListener('click', () => proof.close());
  // No marketing request before consent.
  function loadMetaPixel() {
    if (window.fbq) return;
    !function(f,b,e,v,n,t,s) {
      if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];
      t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s);
    }(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', PIXEL_ID);
    window.fbq('track', 'PageView');
    window.fbq('track', 'ViewContent', {content_name:'AI Trainer Academy — Curso Completo',content_type:'product',content_ids:['aita-197'],value:197,currency:'BRL'});
  }
  function setConsent(value) {
    try { localStorage.setItem(CONSENT_KEY, value); } catch (_) { /* Choice works for this visit. */ }
    banner.hidden = true;
    if (value === 'accepted') loadMetaPixel();
    updateSticky();
  }
  let consent = null;
  try { consent = localStorage.getItem(CONSENT_KEY); } catch (_) { /* Offer both choices. */ }
  if (consent === 'accepted') loadMetaPixel();
  else if (consent !== 'declined') banner.hidden = false;
  document.getElementById('accept-cookies').addEventListener('click', () => setConsent('accepted'));
  document.getElementById('decline-cookies').addEventListener('click', () => setConsent('declined'));
  document.getElementById('privacy-reset').addEventListener('click', () => {
    try { localStorage.removeItem(CONSENT_KEY); } catch (_) { /* Storage unavailable. */ }
    privacy.close();
    banner.hidden = false;
    updateSticky();
  });
  const checkoutUrl = new URL(CHECKOUT);
  for (const [key, value] of new URLSearchParams(location.search)) {
    if (/^utm_(source|medium|campaign|content|term|id)$/i.test(key) && value.length < 256) checkoutUrl.searchParams.set(key, value);
  }
  document.querySelectorAll('[data-checkout]').forEach(link => {
    link.href = checkoutUrl.toString();
    link.addEventListener('click', event => {
      if (!SALES_OPEN) { event.preventDefault(); openDialog(prelaunch); return; }
      if (window.fbq && consentAccepted()) window.fbq('track', 'InitiateCheckout', {content_ids:['aita-197'],value:197,currency:'BRL'});
    });
  });
  function consentAccepted() {
    try { return localStorage.getItem(CONSENT_KEY) === 'accepted'; } catch (_) { return false; }
  }
  if (SALES_OPEN) {
    document.getElementById('buy').firstChild.textContent = 'QUERO ENTRAR NA AI TRAINER ACADEMY ';
    document.getElementById('availability').textContent = 'Inscrição pelo checkout da Cakto';
    document.querySelector('.offer-note').hidden = true;
  }
  // Clearly labeled simulation. No AI requests or data collection.
  document.querySelectorAll('[data-answer]').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-answer]').forEach(other => {
        const selected = other === button;
        other.classList.toggle('selected', selected);
        other.setAttribute('aria-pressed', String(selected));
      });
      const feedback = document.querySelector('.demo-feedback');
      if (button.dataset.answer === 'b') feedback.innerHTML = '<strong>Isso: a resposta B segue o pedido.</strong> Ela explica a atividade em uma frase e com linguagem simples. Conferir se a resposta seguiu o pedido faz parte da avaliação de qualidade.';
      else feedback.innerHTML = '<strong>Repare nos termos usados.</strong> A resposta A inclui jargões como “benchmarking” e “scoring”, contrariando o pedido. A B explica a atividade com linguagem simples.';
    });
  });
  const stepContent = [
    ['Encontre seu ponto de partida.','Aprenda a olhar os requisitos de um projeto e decidir se faz sentido avançar.','Análise de uma oportunidade de referência'],
    ['Dê clareza ao seu perfil.','Organize suas experiências e apresente evidências do que você já sabe fazer.','Currículo e LinkedIn alinhados aos requisitos'],
    ['Saiba qual é a próxima ação.','Registre cada etapa e acompanhe o processo com prazos e estados reais.','Registro de candidaturas e acompanhamento'],
    ['Treine seu olhar de avaliador.','Leia critérios, compare respostas e aprenda a justificar suas decisões.','Exercícios de avaliação e revisão']
  ];
  function activateStep(index) {
    const [title, description, deliverable] = stepContent[index];
    document.getElementById('path-title').textContent = title;
    document.getElementById('path-description').textContent = description;
    document.getElementById('path-deliverable').textContent = deliverable;
    document.querySelectorAll('[data-step]').forEach((step, i) => step.classList.toggle('is-active', i === index));
    document.querySelectorAll('.path-mini-progress span').forEach((step, i) => step.classList.toggle('active', i <= index));
  }
  document.querySelectorAll('.module').forEach(module => {
    module.addEventListener('toggle', () => {
      if (module.open) document.querySelectorAll('.module').forEach(other => { if (other !== module) other.open = false; });
    });
  });
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    }, {threshold:0.08});
    document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));
    document.documentElement.classList.add('motion-ready');
    const sectionObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.target === hero) heroVisible = entry.isIntersecting;
        if (entry.target === offer) offerVisible = entry.isIntersecting;
      }
      updateSticky();
    }, {threshold:0});
    sectionObserver.observe(hero);
    sectionObserver.observe(offer);
    const pathObserver = new IntersectionObserver(entries => {
      const active = entries.filter(entry => entry.isIntersecting).sort((a,b) => b.intersectionRatio-a.intersectionRatio)[0];
      if (active) activateStep(Number(active.target.dataset.step));
    }, {rootMargin:'-20% 0px -40% 0px',threshold:[0,.5,1]});
    document.querySelectorAll('[data-step]').forEach(step => pathObserver.observe(step));
  }
  const progress = document.querySelector('.read-progress');
  let scrollQueued = false;
  function updateProgress() {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = 'scaleX(' + (total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0) + ')';
    scrollQueued = false;
  }
  window.addEventListener('scroll', () => { if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateProgress); } }, {passive:true});
  window.addEventListener('resize', updateProgress, {passive:true});
  updateProgress();
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const art = document.querySelector('.hero-art');
    art.addEventListener('pointermove', event => {
      if (reducedMotion.matches) return;
      const box = art.getBoundingClientRect();
      art.style.setProperty('--tilt-x', (((event.clientX-box.left)/box.width-.5)*9)+'deg');
      art.style.setProperty('--tilt-y', (((event.clientY-box.top)/box.height-.5)*-7)+'deg');
    }, {passive:true});
    art.addEventListener('pointerleave', () => { art.style.setProperty('--tilt-x','0deg'); art.style.setProperty('--tilt-y','0deg'); });
    document.querySelectorAll('.spotlight').forEach(card => card.addEventListener('pointermove', event => {
      if (reducedMotion.matches) return;
      const box = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x',(event.clientX-box.left)+'px');
      card.style.setProperty('--mouse-y',(event.clientY-box.top)+'px');
    }, {passive:true}));
  }
})();
