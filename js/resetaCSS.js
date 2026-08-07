/*
 * resetaCSS — injeta/atualiza o <link> do CSS do formulário, forçando
 * o navegador a buscar a versão mais recente em vez de usar cache antigo.
 *
 * Cole este script na função JS do formulário (Solar BPM não permite
 * apontar uma função por URL externa — só CSS tem esse campo).
 *
 * Histórico:
 * - Versão atualmente em uso nos formulários ainda NÃO tem o mecanismo
 *   de versionamento via version.txt (usa Date.now() a cada carregamento,
 *   ou nem faz cache-busting, dependendo do formulário).
 * - A urlCSS usada até aqui apontava para o CSS hospedado no próprio
 *   domínio do sistema (https://ribeiraopreto-hml.solarbpm.softplan.com.br/
 *   tema/form-dinamico/css/styles/style.css) — isso estava errado: deveria
 *   apontar para o CSS mantido neste repositório (SolarBPM-Publico),
 *   que é o que realmente editamos. Corrigido abaixo.
 */
(() => {
  const urlCSS = "https://jorge-mamani.github.io/SolarBPM-Publico/css/pmrp-form-dinamico.css";
  const urlVersao = "https://jorge-mamani.github.io/SolarBPM-Publico/css/version.txt";
  const idCSS = "style";

  fetch(`${urlVersao}?t=${Date.now()}`)
    .then(r => r.text())
    .then(versao => {
      versao = versao.trim();
      const hrefFinal = `${urlCSS}?v=${versao}`;

      const linkAtual = document.getElementById(idCSS);
      if (linkAtual && linkAtual.href === hrefFinal) return; // já está na versão certa, não faz nada

      document.querySelectorAll(`link[href^="${urlCSS}"]`).forEach(link => link.remove());

      const link = document.createElement("link");
      link.id = idCSS;
      link.rel = "stylesheet";
      link.href = hrefFinal;
      document.head.appendChild(link);
    })
    .catch(() => {
      // se a busca da versão falhar (offline, GitHub Pages fora do ar etc.),
      // garante que o CSS carregue mesmo assim, sem cache-busting
      if (!document.getElementById(idCSS)) {
        const link = document.createElement("link");
        link.id = idCSS;
        link.rel = "stylesheet";
        link.href = urlCSS;
        document.head.appendChild(link);
      }
    });
})();
