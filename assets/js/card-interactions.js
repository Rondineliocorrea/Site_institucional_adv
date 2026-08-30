(() => {
  function activateCard(card, target, role) {
    if (!card || !target || card.dataset.wholeCardReady === '1') return;
    card.dataset.wholeCardReady = '1';
    card.classList.add('is-whole-clickable');
    if (!card.hasAttribute('tabindex')) card.tabIndex = 0;
    card.setAttribute('role', role);

    const trigger = () => {
      if (target.tagName === 'A' && target.href) {
        window.location.href = target.href;
      } else {
        target.click();
      }
    };

    card.addEventListener('click', event => {
      if (event.target.closest('a,button,input,textarea,select,label')) return;
      trigger();
    });

    card.addEventListener('keydown', event => {
      if (event.target !== card) return;
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        trigger();
      }
    });
  }

  function reuseHomeWhatsappButton() {
    document.querySelectorAll('.floating-lawyer-cta').forEach(button => {
      button.classList.remove('floating-lawyer-cta');
      button.classList.add('whatsapp');
      button.setAttribute('aria-label', 'Falar pelo WhatsApp');
      button.innerHTML = `
        <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
          <path d="M16.03 3.2c-7.05 0-12.77 5.72-12.77 12.77 0 2.25.59 4.45 1.7 6.38L3.15 28.8l6.6-1.73a12.73 12.73 0 0 0 6.28 1.6h.01c7.05 0 12.77-5.72 12.77-12.77S23.08 3.2 16.03 3.2zm0 23.3h-.01a10.55 10.55 0 0 1-5.38-1.47l-.39-.23-3.92 1.03 1.05-3.82-.25-.39a10.52 10.52 0 1 1 8.9 4.88zm5.78-7.89c-.32-.16-1.88-.93-2.17-1.04-.29-.11-.5-.16-.71.16-.21.32-.82 1.04-1 1.25-.18.21-.37.24-.69.08-.32-.16-1.34-.49-2.55-1.57-.94-.84-1.58-1.88-1.76-2.2-.18-.32-.02-.49.14-.65.14-.14.32-.37.48-.55.16-.18.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.71-1.72-.98-2.36-.26-.62-.52-.54-.71-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.11 1.09-1.11 2.65s1.14 3.07 1.3 3.28c.16.21 2.24 3.43 5.44 4.81.76.33 1.35.52 1.81.67.76.24 1.45.2 2 .13.61-.09 1.88-.77 2.15-1.51.27-.74.27-1.38.18-1.51-.08-.13-.29-.21-.61-.37z"/>
        </svg>`;
    });
  }

  function init() {
    reuseHomeWhatsappButton();

    document.querySelectorAll('.area-card').forEach(card => {
      const target = card.querySelector('.area-cta');
      activateCard(card, target, 'button');
      const label = card.querySelector('h3')?.textContent?.trim();
      if (label) card.setAttribute('aria-label', `${label}: solicitar atendimento`);
    });

    document.querySelectorAll('.content-card').forEach(card => {
      const target = card.querySelector('.read-link');
      activateCard(card, target, 'link');
      const label = card.querySelector('h3')?.textContent?.trim();
      if (label) card.setAttribute('aria-label', `Ler conteúdo: ${label}`);
    });

    document.querySelectorAll('.article-card').forEach(card => {
      const target = card.querySelector('h2 a');
      activateCard(card, target, 'link');
      const label = card.querySelector('h2')?.textContent?.trim();
      if (label) card.setAttribute('aria-label', `Ler conteúdo: ${label}`);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
