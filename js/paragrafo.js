/*
 * paragrafo.js — transforma cada div[fd-element="paragraph"] em um
 * acordeão: clique no label para abrir/fechar o parágrafo (classes
 * .toggle-label / .toggle-conteudo / .toggle-simbolo do CSS do tema).
 *
 * Cole este script no evento de carregamento do formulário no Solar BPM.
 */
(() => {
  function ativarToggleParagrafos() {
    document.querySelectorAll('div[fd-element="paragraph"]').forEach(div => {
      const label = div.querySelector('label.control-label.ng-binding');
      const p = div.querySelector('p.ng-binding');

      if (!label || !p || div.classList.contains('toggle-aplicado')) return;

      div.classList.add('toggle-aplicado');

      p.classList.add('toggle-conteudo');
      label.classList.add('toggle-label');

      // Cria os elementos do título e símbolo
      const textoLabel = document.createElement('span');
      textoLabel.textContent = label.textContent.trim();
      textoLabel.classList.add('texto');

      const simbolo = document.createElement('span');
      simbolo.textContent = '+';
      simbolo.classList.add('toggle-simbolo');

      // Limpa e insere os elementos
      label.innerHTML = '';
      label.appendChild(textoLabel);
      label.appendChild(simbolo);

      // Toggle de abrir/fechar
      label.addEventListener('click', () => {
        const aberto = p.style.maxHeight && p.style.maxHeight !== '0px';
        if (aberto) {
          p.style.maxHeight = '0';
          p.style.opacity = '0';
          simbolo.textContent = '+';
        } else {
          p.style.maxHeight = p.scrollHeight + 'px';
          p.style.opacity = '1';
          simbolo.textContent = '–';
        }
      });
    });
  }

  const observer = new MutationObserver(ativarToggleParagrafos);
  observer.observe(document.body, { childList: true, subtree: true });

  ativarToggleParagrafos();
})();
