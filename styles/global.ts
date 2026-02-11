import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  :root {
    --bg: #0B0D10;
    --surface: #10141A;
    --surface2: #151B23;
    --text: #EAF0F7;
    --muted: #A7B2C3;
    --border: rgba(255,255,255,0.10);
    --accent: #FF6B35;
    --accent2: #FF8A5C;
  }
  * { box-sizing: border-box; }
  html, body { padding: 0; margin: 0; }
  body {
    font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
    background: var(--bg);
    color: var(--text);
  }
  a { color: inherit; text-decoration: none; }
  input, button, textarea, select { font: inherit; }
  ::selection { background: rgba(255,107,53,0.35); }
`;
