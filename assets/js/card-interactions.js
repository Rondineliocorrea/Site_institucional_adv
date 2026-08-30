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

  function init() {
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
