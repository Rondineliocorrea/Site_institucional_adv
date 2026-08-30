(() => {
  const WA = '5567996119098';
  const LEADS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbw9DBXpE3hJXm-cyCFufhniPgHE0AWUx00L1e6p44od9kCVXf6yd6q3jHb9gOHD4TA/exec';

  function injectStyles() {
    if (document.getElementById('rc-attendance-styles')) return;
    const style = document.createElement('style');
    style.id = 'rc-attendance-styles';
    style.textContent = `
      body.rc-modal-open{overflow:hidden}.rc-modal{position:fixed;inset:0;background:rgba(3,14,27,.78);backdrop-filter:blur(5px);z-index:9998;display:none;align-items:center;justify-content:center;padding:20px}.rc-modal.open{display:flex}.rc-modal-panel{width:min(100%,520px);max-height:92vh;overflow:auto;background:#fbfaf7;color:#0d2038;border-radius:11px;padding:32px;box-shadow:0 28px 90px rgba(0,0,0,.42);position:relative;font-family:Manrope,Arial,sans-serif}.rc-modal-close{position:absolute;right:17px;top:13px;border:0;background:none;color:#26333f;font-size:30px;cursor:pointer}.rc-modal h2{font-family:'Cormorant Garamond',Georgia,serif;font-size:38px;line-height:1;margin:0 36px 9px 0}.rc-modal-rule{width:43px;height:2px;background:#c69b51;margin:0 0 17px}.rc-modal-intro{font-size:13px;color:#53606e;line-height:1.55;margin-bottom:20px}.rc-field{margin-bottom:14px}.rc-field label{display:block;font-size:11.5px;font-weight:800;margin-bottom:6px}.rc-field input,.rc-field textarea{width:100%;border:1px solid #cbd1d8;border-radius:5px;background:#fff;outline:none;color:#12283f}.rc-field input{height:47px;padding:0 12px}.rc-field textarea{min-height:96px;padding:11px 12px;resize:vertical;line-height:1.5}.rc-field input:focus,.rc-field textarea:focus{border-color:#c69b51;box-shadow:0 0 0 3px rgba(198,155,81,.12)}.rc-help{font-size:10px;color:#7b858f;margin-top:5px}.rc-consent{display:flex;gap:9px;align-items:flex-start;font-size:10.5px;line-height:1.5;color:#59636e;margin:7px 0 18px}.rc-consent input{margin-top:3px}.rc-consent a{color:#8d6429;text-decoration:underline}.rc-submit{width:100%;height:52px;border:0;border-radius:4px;background:#06182c;color:#fff;font-weight:700;cursor:pointer}.rc-submit:hover{background:#102c4b}.rc-modal-note{font-size:10.5px;color:#727b84;margin-top:10px}@media(max-width:560px){.rc-modal-panel{padding:27px 20px 23px}.rc-modal h2{font-size:34px}}
    `;
    document.head.appendChild(style);
  }

  function ensureModal() {
    if (document.getElementById('rcAtendimentoModal')) return;
    injectStyles();
    const modal = document.createElement('div');
    modal.className = 'rc-modal';
    modal.id = 'rcAtendimentoModal';
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
      <div class="rc-modal-panel" role="dialog" aria-modal="true" aria-labelledby="rcModalTitle">
        <button class="rc-modal-close" type="button" aria-label="Fechar">×</button>
        <h2 id="rcModalTitle">Fale com o advogado</h2>
        <div class="rc-modal-rule"></div>
        <p class="rc-modal-intro">Preencha os dados abaixo para gerar uma mensagem de atendimento pelo WhatsApp.</p>
        <form id="rcAtendimentoForm">
          <input type="hidden" id="rcArea" value="Atendimento geral">
          <div class="rc-field"><label for="rcNome">Nome *</label><input id="rcNome" name="nome" autocomplete="name" required></div>
          <div class="rc-field"><label for="rcTelefone">WhatsApp / Telefone *</label><input id="rcTelefone" name="telefone" autocomplete="tel" required></div>
          <div class="rc-field"><label for="rcEmail">E-mail <span style="font-weight:500;color:#8a939c">(opcional)</span></label><input id="rcEmail" name="email" type="email" autocomplete="email"></div>
          <div class="rc-field"><label for="rcResumo">Conte brevemente sua situação <span style="font-weight:500;color:#8a939c">(opcional)</span></label><textarea id="rcResumo" name="resumo" maxlength="500"></textarea><div class="rc-help">Até 500 caracteres. Evite inserir documentos ou informações desnecessariamente sensíveis nesta etapa.</div></div>
          <label class="rc-consent"><input type="checkbox" id="rcConsentimento" required><span>Li e concordo com o tratamento dos dados para esta solicitação de atendimento, conforme a <a href="/politica-de-privacidade/" target="_blank" rel="noopener">Política de Privacidade</a>.</span></label>
          <button class="rc-submit" type="submit">Continuar pelo WhatsApp</button>
          <div class="rc-modal-note">O envio do formulário não estabelece, por si só, relação advogado-cliente.</div>
        </form>
      </div>`;
    document.body.appendChild(modal);

    const close = () => {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('rc-modal-open');
    };
    modal.querySelector('.rc-modal-close').addEventListener('click', close);
    modal.addEventListener('click', e => { if (e.target === modal) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) close(); });

    document.getElementById('rcAtendimentoForm').addEventListener('submit', e => {
      e.preventDefault();
      const nome = document.getElementById('rcNome').value.trim();
      const telefone = document.getElementById('rcTelefone').value.trim();
      const email = document.getElementById('rcEmail').value.trim();
      const resumo = document.getElementById('rcResumo').value.trim();
      const area = document.getElementById('rcArea').value || 'Atendimento geral';
      const consentimento = document.getElementById('rcConsentimento').checked;
      if (!nome || !telefone || !consentimento) return;

      const params = new URLSearchParams(window.location.search);
      const dados = new URLSearchParams({
        nome, telefone, email, area, resumo,
        consentimento: 'Sim', origem: 'Site', pagina: window.location.href,
        utm_source: params.get('utm_source') || '',
        utm_medium: params.get('utm_medium') || '',
        utm_campaign: params.get('utm_campaign') || ''
      });
      fetch(LEADS_ENDPOINT,{method:'POST',mode:'no-cors',body:dados,keepalive:true}).catch(()=>{});
      if (typeof window.rcTrackLead === 'function') window.rcTrackLead();

      let texto = `Olá, Dr. Rondinelio. Quero atendimento jurídico.\n\nÁrea: ${area}\nNome: ${nome}\nTelefone: ${telefone}`;
      if (email) texto += `\nE-mail: ${email}`;
      if (resumo) texto += `\nResumo: ${resumo}`;
      window.open(`https://wa.me/${WA}?text=${encodeURIComponent(texto)}`,'_blank','noopener');
      close();
    });
  }

  function openModal(area) {
    ensureModal();
    document.getElementById('rcArea').value = area || 'Atendimento geral';
    const modal = document.getElementById('rcAtendimentoModal');
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('rc-modal-open');
    setTimeout(() => document.getElementById('rcNome').focus(), 20);
  }

  function init() {
    ensureModal();
    document.addEventListener('click', e => {
      const trigger = e.target.closest('.open-modal-link');
      if (!trigger) return;
      e.preventDefault();
      openModal(trigger.getAttribute('data-area') || 'Atendimento geral');
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();