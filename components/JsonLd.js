// Structured data (schema.org). `<` di-escape supaya isi JSON tidak bisa menutup tag <script>.
export default function JsonLd({ data }) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
