import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  :root {
    --bg: #FFFFFF;
    --bg-end: #F1F5F9;
    --surface: #FFFFFF;
    --surface2: #F8FAFC;
    --text: #0F172A;
    --muted: #64748B;
    --border: #E2E8F0;
    --accent: #FF6B35;
    --accent-hover: #F2551F;
    --hover-bg: #F8FAFC;
  }
  * { box-sizing: border-box; }
  html, body { padding: 0; margin: 0; }
  body {
    font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
    background: linear-gradient(180deg, var(--bg) 0%, var(--bg-end) 100%);
    background-attachment: fixed;
    color: var(--text);
  }
  a { color: inherit; text-decoration: none; }
  input, button, textarea, select { font: inherit; }
  ::selection { background: rgba(255,107,53,0.25); }
`;
