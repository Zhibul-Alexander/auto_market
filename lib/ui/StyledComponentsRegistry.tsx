'use client';

import React, { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';
import { GlobalStyle } from '../../styles/global';

export default function StyledComponentsRegistry({ children }: { children: React.ReactNode }) {
  // Only create stylesheet once with lazy initial state
  const [sheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = sheet.getStyleElement();
    sheet.instance.clearTag();
    return <>{styles}</>;
  });

  // On the client, styled-components injects styles via its own mechanism
  // (appending <style> tags to <head>). Wrapping with StyleSheetManager
  // on the client hijacks that and redirects to ServerStyleSheet, which
  // is never flushed during client-side navigation — causing missing styles.
  if (typeof window !== 'undefined') {
    return (
      <>
        <GlobalStyle />
        {children}
      </>
    );
  }

  // On the server, collect styles via ServerStyleSheet so that
  // useServerInsertedHTML can flush them into the SSR stream.
  return (
    <StyleSheetManager sheet={sheet.instance}>
      <GlobalStyle />
      {children}
    </StyleSheetManager>
  );
}
