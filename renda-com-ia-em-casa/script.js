(() => {
  'use strict';
  // Set only to the verified checkout for this product, never the original course.
  const CHECKOUT_URL = '';
  const CONSENT_KEY = 'aita_marketing_consent_v1';
  const PIXEL_ID = '1619572939144296';
  const sticky = document.getElementById('sticky-offer');
  const privacy = document.getElementById('privacy-dialog');
  const enrollment = document.getElementById('enrollment-dialog');
  let accepted = false, heroVisible = true, offerVisible = false, footerVisible = false, pixelStarted = false;

  function syncSticky() {
    const show = !heroVisible && !offerVisible && !footerVisible;
    sticky.classList.toggle('show', show);
    sticky.inert = !show;
    document.body.classList.toggle('has-sticky', show);
  }
  function openDialog(dialog) {
    if (dialog.open) return;
    dialog.showModal();
    document.body.classList.add('modal-open');
  }
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
    dialog.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => dialog.close()));
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
  });
  document.getElementById('privacy-open').addEventListener('click', () => openDialog(privacy));

  function track(event) {
    if (accepted && window.fbq) window.fbq('track', event, {content_name:'Renda com IA em Casa',content_ids:['renda-ia-casa-97'],content_type:'product',value:97,currency:'BRL'});
  }
  function startPixel() {
    if (!accepted) return;
    if (!window.fbq) {
      const queue = function () {if (queue.callMethod) queue.callMethod.apply(queue, arguments); else queue.queue.push(arguments);};
      queue.push = queue; queue.loaded = true; queue.version = '2.0'; queue.queue = [];
      window.fbq = queue;
      if (!window._fbq) window._fbq = queue;
      const script = document.createElement('script'); script.async = true; script.src = 'https://connect.facebook.net/en_US/fbevents.js'; document.head.appendChild(script);
      window.fbq('init', PIXEL_ID);
    }
    window.fbq('consent', 'grant');
    if (!pixelStarted) {window.fbq('track', 'PageView'); track('ViewContent'); pixelStarted = true;}
  }
  function updatePrivacyStatus() {
    document.getElementById('privacy-status').textContent = accepted ? 'Publicidade autorizada neste navegador. Você pode desativar a qualquer momento.' : 'Publicidade desativada. Nenhuma autorização é necessária para navegar ou comprar.';
    document.getElementById('accept-cookies').hidden = accepted;
    document.getElementById('decline-cookies').textContent = accepted ? 'Desativar publicidade' : 'Manter publicidade desativada';
  }
  function removeMarketingCookies() {
    const host = location.hostname, labels = host.split('.'), domains = [null, host];
    for (let index = 0; index < labels.length - 1; index++) domains.push('.' + labels.slice(index).join('.'));
    for (const name of ['_fbp', '_fbc']) for (const domain of domains) document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax${domain ? '; domain=' + domain : ''}`;
  }
  function setConsent(value) {
    accepted = value === 'accepted';
    try {localStorage.setItem(CONSENT_KEY, value);} catch (_) { /* Applies to this visit when storage is unavailable. */ }
    if (accepted) startPixel();
    else {if (window.fbq) window.fbq('consent', 'revoke'); removeMarketingCookies();}
    updatePrivacyStatus();
  }
  // No banner, advertising script or marketing request without consent. Existing domain consent is respected.
  try {accepted = localStorage.getItem(CONSENT_KEY) === 'accepted';} catch (_) { /* Defaults to off. */ }
  if (accepted) startPixel();
  updatePrivacyStatus();
  document.getElementById('accept-cookies').addEventListener('click', () => setConsent('accepted'));
  document.getElementById('decline-cookies').addEventListener('click', () => setConsent('declined'));
  addEventListener('storage', event => {
    if (event.key !== CONSENT_KEY && event.key !== null) return;
    accepted = event.newValue === 'accepted';
    if (accepted) startPixel();
    else {if (window.fbq) window.fbq('consent', 'revoke'); removeMarketingCookies();}
    updatePrivacyStatus();
  });

  let checkout = null;
  if (CHECKOUT_URL) try {const url = new URL(CHECKOUT_URL); if (url.protocol === 'https:' && url.hostname === 'pay.cakto.com.br') checkout = url;} catch (_) { /* Keep preparation state. */ }
  if (checkout) {
    for (const [key, value] of new URLSearchParams(location.search)) if ((/^utm_(source|medium|campaign|content|term|id)$/i.test(key) || ['fbclid','ttclid'].includes(key)) && value.length < 256) checkout.searchParams.set(key, value);
    document.getElementById('availability').textContent = 'Compra segura pela Cakto';
    document.getElementById('purchase-state').hidden = true;
  }
  document.querySelectorAll('[data-checkout]').forEach(link => {
    if (checkout) link.href = checkout.toString();
    link.addEventListener('click', event => {
      if (!checkout) {event.preventDefault(); openDialog(enrollment); return;}
      track('InitiateCheckout');
    });
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.target.id === 'inicio') heroVisible = entry.isIntersecting;
        else if (entry.target.id === 'oferta') offerVisible = entry.isIntersecting;
        else footerVisible = entry.isIntersecting;
      });
      syncSticky();
    });
    observer.observe(document.getElementById('inicio')); observer.observe(document.getElementById('oferta')); observer.observe(document.querySelector('.footer'));
  }
  let queued = false;
  function progress() {
    const total = document.documentElement.scrollHeight - innerHeight;
    document.querySelector('.read-progress').style.transform = `scaleX(${total > 0 ? Math.min(1, Math.max(0, scrollY / total)) : 0})`;
    queued = false;
  }
  addEventListener('scroll', () => {if (!queued) {queued = true; requestAnimationFrame(progress);}}, {passive:true});
  addEventListener('resize', progress); progress();
})();
