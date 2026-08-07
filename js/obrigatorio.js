/*
 * obrigatorio.js — pinta o indicador (bolinha vermelha/verde via CSS) de
 * cada label dentro de um div.required, marcando "preenchido" ou "vazio"
 * conforme o campo (input, select, arquivo, generic-input-select) tem valor.
 *
 * Cole este script no evento de carregamento do formulário no Solar BPM.
 */
(() => {
  function atualizarIndicadores() {
    document.querySelectorAll('div.required').forEach(container => {
      const label = container.querySelector('label.control-label');
      if (!label) return;

      // Limpa indicadores antigos
      label.classList.remove('vazio', 'preenchido');

      let algumPreenchido = false;

      // -------------------------------------------
      // 1. Verificação para arquivos
      // -------------------------------------------
      const arquivoCarregado = container.querySelector('.file-uploaded a.ng-binding.ng-scope');
      if (arquivoCarregado && arquivoCarregado.textContent.trim() !== '') {
        algumPreenchido = true;
      }

      // -------------------------------------------
      // 2. Verificação para inputs, textareas e selects
      // -------------------------------------------
      const inputs = container.querySelectorAll('input, textarea, select');

      inputs.forEach(input => {
        let valor = (input.value || '').trim();

        // Corrigir selects com valores inválidos
        const invalido = (
          valor === '' ||
          valor === '?' ||
          valor.includes('string') ||
          valor.includes('?') ||
          valor.toLowerCase().includes('undefined') ||
          valor === '0' ||
          valor.toLowerCase() === 'selecione'
        );

        if (input.tagName.toLowerCase() === 'select') {
          if (!invalido) algumPreenchido = true;
        }

        else if (input.type === 'radio' || input.type === 'checkbox') {
          if (input.checked) algumPreenchido = true;
        }

        else if (input.type === 'file') {
          if (input.files && input.files.length > 0) algumPreenchido = true;
        }

        else {
          if (valor !== '' && valor !== '0,00') {
            algumPreenchido = true;
          }
        }

        if (!input.dataset.observando) {
          input.addEventListener('input', atualizarIndicadores);
          input.addEventListener('change', atualizarIndicadores);
          input.dataset.observando = 'true';
        }
      });

      // -------------------------------------------
      // 3. Verificação para input-select (componentes especiais)
      // -------------------------------------------
      const inputSelects = container.querySelectorAll('generic-input-select');

      inputSelects.forEach(inputSelect => {
        const selectedItems = inputSelect.querySelectorAll('.sp-input-select__match-items li');

        selectedItems.forEach(item => {
          const text = item.textContent.trim();
          if (text && text !== '-' && text !== '') {
            algumPreenchido = true;
          }
        });

        // Verifica valor no Angular
        try {
          const ngModel = inputSelect.getAttribute('ng-model');
          if (ngModel && window.angular) {
            const element = angular.element(inputSelect);
            const scope = element.scope();
            if (scope) {
              const modelValue = scope.$eval(ngModel);
              if (modelValue) {
                if (typeof modelValue === 'object') {
                  for (let key in modelValue) {
                    if (modelValue[key] && modelValue[key].toString().trim() !== '') {
                      algumPreenchido = true;
                      break;
                    }
                  }
                } else if (modelValue.toString().trim() !== '') {
                  algumPreenchido = true;
                }
              }
            }
          }
        } catch (e) {
          console.log('Erro Angular:', e);
        }

        // Observadores
        if (!inputSelect.dataset.observando) {
          const matchContainer = inputSelect.querySelector('.sp-input-select__match');
          if (matchContainer) {
            new MutationObserver(atualizarIndicadores).observe(matchContainer, {
              childList: true,
              subtree: true
            });
          }

          inputSelect.addEventListener('blur', atualizarIndicadores);

          const aplicarBtn = inputSelect.querySelector('.modal-footer .btn-primary');
          if (aplicarBtn) {
            aplicarBtn.addEventListener('click', () => {
              setTimeout(atualizarIndicadores, 100);
            });
          }

          inputSelect.dataset.observando = 'true';
        }
      });

      // -------------------------------------------
      // Aplica classes final
      // -------------------------------------------
      if (algumPreenchido) {
        label.classList.add('preenchido');
        label.classList.remove('vazio');
      } else {
        label.classList.add('vazio');
        label.classList.remove('preenchido');
      }
    });
  }

  // -------------------------------------------
  // Inicialização
  // -------------------------------------------
  function init() {
    const observer = new MutationObserver(() => atualizarIndicadores());

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    if (window.angular) {
      angular.element(document).ready(() => {
        setTimeout(atualizarIndicadores, 500);
      });
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(atualizarIndicadores, 500);
      });
    }

    const interval = setInterval(atualizarIndicadores, 1000);
    setTimeout(() => clearInterval(interval), 5000);
  }

  init();
})();
