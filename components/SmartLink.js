import Link from 'next/link';

// Link internal pakai next/link (navigasi client-side), link eksternal / tab baru pakai <a> biasa.
export default function SmartLink({ href, target, children, ...props }) {
  const internal = typeof href === 'string' && href.startsWith('/') && !href.startsWith('//');
  const blank = target === '_blank';

  if (internal && !blank) {
    return <Link href={href} {...props}>{children}</Link>;
  }
  return (
    <a
      href={href}
      target={blank ? '_blank' : undefined}
      rel={blank ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children}
    </a>
  );
}
