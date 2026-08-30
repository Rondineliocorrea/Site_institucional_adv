(() => {
  const PIXEL_ID = '2144170376171137';
  const CONSENT_KEY = 'rc_cookie_consent_v1';
  let pageViewSent = false;

  function injectStyles() {
    if (document.getElementById('rc-cookie-styles')) return;
    const style = document.createElement('style');
    style.id = 'rc-cookie-styles';
    style.textContent = `
      .rc-cookie-banner{position:fixed;left:20px;right:20px;bottom:20px;z-index:9999;max-width:980px;margin:0 auto;background:#fffdf9;color:#0d2038;border:1px solid rgba(198,155,81,.65);box-shadow:0 20px 60px rgba(0,0,0,.28);padding:20px 22px;border-radius:10px;font-family:Manrope,Arial,sans-serif}
      .rc-cookie-grid{display:grid;grid-template-columns:1fr auto;gap:22px;align-items:center}
      .rc-cookie-title{font-family:'Cormorant Garamond',Georgia,serif;font-size:25px;font-weight:600;margin:0 0 5px}
      .rc-cookie-text{font-size:12.5px;line-height:1.6;color:#566272;margin:0;max-width:700px}
      .rc-cookie-text a{color:#8d6429;text-decoration:underline}
      .rc-cookie-actions{display:flex;gap:9px;flex-wrap:wrap;justify-content:flex-end}
      .rc-cookie-btn{border:1px solid #06182c;border-radius:4px;min-height:42px;padding:0 17px;font:600 12px Manrope,Arial,sans-serif;cursor:pointer}
      .rc-cookie-accept{background:#06182c;color:#fff}
      .rc-cookie-reject{background:transparent;color:#06182c}
      @media(max-width:720px){.rc-cookie-banner{left:12px;right:12px;bottom:12px;padding:18px}.rc-cookie-grid{grid-template-columns:1fr}.rc-cookie-actions{justify-content:stretch}.rc-cookie-btn{flex:1}.rc-cookie-title{font-size:23px}}
    `;
    document.head.appendChild(style);
  }

  function clearMetaCookies() {
    ['_fbp', '_fbc'].forEach(name => {
      document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
      document.cookie = `${name}=; Max-Age=0; path=/; domain=.rondineliocorrea.com.br; SameSite=Lax`;
      document.cookie = `${name}=; Max-Age=0; path=/; domain=www.rondineliocorrea.com.br; SameSite=Lax`;
    });
  }

  function revokeMetaConsent() {
    if (typeof window.fbq === 'function') {
      window.fbq('consent', 'revoke');
    }
    clearMetaCookies();
  }

  function loadMetaPixel() {
    if (window.fbq) {
      window.fbq('consent', 'grant');
      if (!pageViewSent) {
        window.fbq('track', 'PageView');
        pageViewSent = true;
      }
      return;
    }

    !function(f,b,e,v,n,t,s){
      if(f.fbq)return;
      n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];
      t=b.createElement(e);t.async=!0;t.src=v;
      s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s);
    }(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');

    window.fbq('init', PIXEL_ID);
    window.fbq('consent', 'grant');
    window.fbq('track', 'PageView');
    pageViewSent = true;
  }

  function getConsent() {
    try { return localStorage.getItem(CONSENT_KEY); } catch (_) { return null; }
  }

  function setConsent(value) {
    try { localStorage.setItem(CONSENT_KEY, value); } catch (_) {}
  }

  function closeBanner() {
    const el = document.getElementById('rc-cookie-banner');
    if (el) el.remove();
  }

  function showBanner() {
    if (document.getElementById('rc-cookie-banner')) return;
    injectStyles();
    const banner = document.createElement('div');
    banner.className = 'rc-cookie-banner';
    banner.id = 'rc-cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Preferências de cookies');
    banner.innerHTML = `
      <div class="rc-cookie-grid">
        <div>
          <p class="rc-cookie-title">Privacidade e cookies</p>
          <p class="rc-cookie-text">Utilizamos armazenamento estritamente necessário para lembrar sua escolha e, somente com sua autorização, o Meta Pixel para medir visitas e conversões. Você pode rejeitar o rastreamento sem prejudicar o uso do site. <a href="/politica-de-privacidade/">Saiba mais</a>.</p>
        </div>
        <div class="rc-cookie-actions">
          <button type="button" class="rc-cookie-btn rc-cookie-reject" data-cookie-choice="rejected">Rejeitar</button>
          <button type="button" class="rc-cookie-btn rc-cookie-accept" data-cookie-choice="accepted">Aceitar</button>
        </div>
      </div>`;
    document.body.appendChild(banner);

    banner.querySelectorAll('[data-cookie-choice]').forEach(btn => {
      btn.addEventListener('click', () => {
        const choice = btn.getAttribute('data-cookie-choice');
        setConsent(choice);
        closeBanner();
        if (choice === 'accepted') loadMetaPixel();
        else revokeMetaConsent();
      });
    });
  }

  window.rcTrackLead = () => {
    if (getConsent() === 'accepted') {
      loadMetaPixel();
      if (typeof window.fbq === 'function') window.fbq('track', 'Lead');
    }
  };

  window.rcOpenCookiePreferences = () => {
    showBanner();
  };

  function init() {
    const consent = getConsent();
    if (consent === 'accepted') loadMetaPixel();
    else {
      revokeMetaConsent();
      if (consent !== 'rejected') showBanner();
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();