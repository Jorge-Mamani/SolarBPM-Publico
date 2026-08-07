/*
 * resetaCSS — injeta o <link> do CSS do formulário sempre com um
 * cache-buster novo (timestamp), garantindo que a versão carregada
 * seja sempre a que está no repositório (main), sem depender de
 * cache do navegador ou de CDN.
 *
 * Cole este script no campo "função JS do formulário" do Solar BPM
 * (o campo de CSS do formulário deve ficar vazio — este script
 * assume o carregamento do stylesheet).
 */
(() => {
  const urlCSS = "https://jorge-mamani.github.io/SolarBPM-Publico/css/pmrp-form-dinamico.css";
  const idCSS = "style";
  const hrefFinal = `${urlCSS}?t=${Date.now()}`;

  document.querySelectorAll(`link[href^="${urlCSS}"]`).forEach(link => link.remove());

  const link = document.createElement("link");
  link.id = idCSS;
  link.rel = "stylesheet";
  link.href = hrefFinal;
  document.head.appendChild(link);
})();
