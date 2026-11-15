import "./globals.css";

export const metadata = {
  title: "LegaCITi",
  description: "A memória coletiva do CITi: o legado de cada geração, de volta para quem trabalha agora.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
