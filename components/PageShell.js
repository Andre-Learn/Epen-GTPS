// Pengganti class di <body> pada versi lama (home-page, partners-page, ...).
export default function PageShell({ className = '', pageKey, children }) {
  return (
    <div className={className} data-page-key={pageKey} style={{ minHeight: '100vh' }}>
      {children}
    </div>
  );
}
