/*
 * mascara.js — aplica máscaras de documento (CPF/CNPJ), telefone e CEP
 * nos campos do formulário, reagindo a inputs que aparecem/ficam visíveis
 * dinamicamente (Angular).
 *
 * Cole este script no evento de carregamento do formulário no Solar BPM.
 * Para adicionar um campo novo, inclua o id dele em MAPEAMENTO abaixo —
 * o resto do script não precisa ser tocado.
 */
(() => {
  //////////////////////////////////////////
  // Utilitário Geral
  //////////////////////////////////////////
  function removerMascara(valor) {
    return (valor || "").replace(/[^\d]/g, '');
  }

  function isVisible(elem) {
    if (!elem) return false;
    // verifica visibilidade própria e de ancestrais
    let current = elem;
    while (current && current.nodeType === 1) {
      const style = window.getComputedStyle(current);
      if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") return false;
      current = current.parentElement;
    }
    // também checa offsetParent para elementos realmente fora do fluxo
    return !!elem.offsetParent || elem.getClientRects().length > 0;
  }

  //////////////////////////////////////////
  // Máscaras
  //////////////////////////////////////////
  function aplicarMascaraDocumento(valor) {
    const documento = removerMascara(valor).slice(0, 14);
    return documento.length <= 11
      ? documento
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
      : documento
        .replace(/(\d{2})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1/$2")
        .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
  }

  function aplicarMascaraTelefone(valor) {
    const tel = removerMascara(valor).slice(0, 11);
    return tel.length === 11
      ? tel.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
      : tel.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }

  function aplicarMascaraCEP(valor) {
    const cep = removerMascara(valor).slice(0, 8);
    return cep.length === 8 ? cep.replace(/(\d{5})(\d{3})/, "$1-$2") : cep;
  }

  function aplicarMascaraDecimal(valor) {
    const num = removerMascara(valor).slice(0, 15);
    return num ? (parseInt(num, 10) / 100).toFixed(2) : "0.00";
  }

  //////////////////////////////////////////
  // Configuradores (aplicam listeners e inicializam)
  //////////////////////////////////////////
  function setupDocumentoInput(input) {
    if (!input || input.dataset.maskAttached === "1") return;
    input.dataset.maskAttached = "1";
    const modelKey = input.id;

    const aplicar = () => {
      const mascarado = aplicarMascaraDocumento(input.value);
      if (input.value !== mascarado) input.value = mascarado;
      if (typeof model !== "undefined" && model && model.hasOwnProperty(modelKey)) model[modelKey] = mascarado;
    };

    input.addEventListener("focus", () => { input.value = removerMascara(input.value); });
    input.addEventListener("input", () => { input.value = removerMascara(input.value); });
    input.addEventListener("blur", aplicar);

    // aplica imediatamente se visível e tiver valor
    if (input.value && input.value.trim() && isVisible(input)) aplicar();
  }

  function setupTelefoneInput(input) {
    if (!input || input.dataset.maskAttached === "1") return;
    input.dataset.maskAttached = "1";
    const modelKey = input.id;

    const aplicar = () => {
      const mascarado = aplicarMascaraTelefone(input.value);
      if (input.value !== mascarado) input.value = mascarado;
      if (typeof model !== "undefined" && model && model.hasOwnProperty(modelKey)) model[modelKey] = mascarado;
    };

    input.addEventListener("input", aplicar);
    input.addEventListener("blur", aplicar);

    // aplica imediatamente se visível e tiver valor
    if (input.value && input.value.trim() && isVisible(input)) aplicar();
  }

  function setupCepInput(input) {
    if (!input || input.dataset.maskAttached === "1") return;
    input.dataset.maskAttached = "1";
    const modelKey = input.id;

    const aplicar = () => {
      const mascarado = aplicarMascaraCEP(input.value);
      if (input.value !== mascarado) input.value = mascarado;
      if (typeof model !== "undefined" && model && model.hasOwnProperty(modelKey)) model[modelKey] = mascarado;
    };

    input.addEventListener("input", aplicar);
    input.addEventListener("blur", aplicar);

    if (input.value && input.value.trim() && isVisible(input)) aplicar();
  }

  //////////////////////////////////////////
  // Mapeamento de ids -> configuradores
  //////////////////////////////////////////
  const MAPEAMENTO = {
    documento: ["documentoSolicitante", "documentoRequerente"],
    telefone: ["telefoneSolicitante", "telefoneRequerente"],
    cep: ["cepSolicitante", "cepRequerente"],
  };

  //////////////////////////////////////////
  // Aplica/configura máscara em um elemento específico (quando aparece)
  //////////////////////////////////////////
  function aplicarMascaraEmElemento(input) {
    if (!input || !input.id) return;

    const id = input.id;

    if (MAPEAMENTO.documento.includes(id)) return setupDocumentoInput(input);
    if (MAPEAMENTO.telefone.includes(id)) return setupTelefoneInput(input);
    if (MAPEAMENTO.cep.includes(id)) return setupCepInput(input);
  }

  //////////////////////////////////////////
  // Inicializa os campos já presentes no DOM
  //////////////////////////////////////////
  function inicializarCamposExistentes() {
    const allIds = [].concat(MAPEAMENTO.documento, MAPEAMENTO.telefone, MAPEAMENTO.cep);
    allIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) aplicarMascaraEmElemento(el);
    });
  }

  //////////////////////////////////////////
  // Observa novos inputs inseridos e mudanças de atributos (classe/style)
  //////////////////////////////////////////
  function observarDOMMascaras() {
    const observer = new MutationObserver(mutations => {
      for (const m of mutations) {
        // nodes adicionados -> testar se é input alvo ou contém inputs alvo
        if (m.addedNodes && m.addedNodes.length) {
          m.addedNodes.forEach(node => {
            if (node.nodeType !== 1) return;
            if (node.tagName === "INPUT" && node.id) aplicarMascaraEmElemento(node);
            node.querySelectorAll && node.querySelectorAll('input[id]').forEach(i => aplicarMascaraEmElemento(i));
          });
        }

        // atributos mudaram (classe/style) -> pode ter tornado visível
        if (m.type === "attributes" && m.target) {
          const t = m.target;
          if (t.tagName === "INPUT" && t.id) {
            if (isVisible(t) && t.dataset.maskAttached !== "1") aplicarMascaraEmElemento(t);
            else if (isVisible(t) && t.dataset.maskAttached === "1" && t.value && t.value.trim()) {
              aplicarMascaraEmElemento(t);
            }
          } else {
            t.querySelectorAll && t.querySelectorAll('input[id]').forEach(i => {
              if (isVisible(i) && i.dataset.maskAttached !== "1") aplicarMascaraEmElemento(i);
              else if (isVisible(i) && i.dataset.maskAttached === "1" && i.value && i.value.trim()) aplicarMascaraEmElemento(i);
            });
          }
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style', 'hidden']
    });
  }

  //////////////////////////////////////////
  // Inicialização geral
  //////////////////////////////////////////
  function inicializarMascarasAuto() {
    inicializarCamposExistentes();
    observarDOMMascaras();
    // caso o Angular preencha tudo depois de um timeout maior, tenta reaplicar novamente
    setTimeout(inicializarCamposExistentes, 800);
    setTimeout(inicializarCamposExistentes, 2000);
  }

  inicializarMascarasAuto();
})();
