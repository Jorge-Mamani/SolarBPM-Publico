# SolarBPM-Publico

Repositório público de arquivos estáticos (CSS e outros recursos) para uso
em conjunto com o Solar BPM — templates de e-mail, formulários e demais
integrações que precisam referenciar um arquivo hospedado publicamente.

Servido via GitHub Pages em:
https://jorge-mamani.github.io/SolarBPM-Publico/

## Estrutura

- `css/` — folhas de estilo reutilizáveis.
- `css/version.txt` — número de versão do `style.css` do tema (usado pelo script "resetaCSS" para cache-busting). Suba esse número toda vez que publicar uma mudança no CSS — não precisa editar nada nos formulários.
- `js/` — scripts de referência colados manualmente na função JS de cada formulário no Solar BPM (o sistema não tem campo de URL externa para JS, só para CSS).
