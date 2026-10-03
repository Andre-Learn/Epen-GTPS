export const metadata = {
  title: { absolute: 'Epen GTPS — Admin' },
  robots: { index: false, follow: false, noarchive: true }
};

export default function AdminLayout({ children }) {
  return (
    <>
      <style>{'body{margin:0}'}</style>
      {children}
    </>
  );
}
