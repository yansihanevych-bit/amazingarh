import { Fragment } from 'react';

/** Renders authored strings that use <em>…</em> and <br> — without dangerouslySetInnerHTML. */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(<em>.*?<\/em>|<br>)/g).filter(Boolean);
  return (
    <>
      {parts.map((p, i) =>
        p === '<br>' ? <br key={i} /> : p.startsWith('<em>') ? <em key={i}>{p.slice(4, -5)}</em> : <Fragment key={i}>{p}</Fragment>,
      )}
    </>
  );
}
