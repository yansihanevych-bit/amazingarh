export default function NotFound() {
  return (
    <main className="wrap" style={{ minHeight: '80svh', display: 'grid', placeContent: 'center', textAlign: 'center', gap: 16 }}>
      <h1 style={{ font: '400 clamp(56px,10vw,140px)/.9 var(--serif)', margin: 0 }}>404</h1>
      <p className="it" style={{ fontSize: 24, margin: 0 }}>This room hasn&apos;t been built yet.</p>
      <a href="/">amazing-irchitect</a>
    </main>
  );
}
