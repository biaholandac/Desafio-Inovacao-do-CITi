import "@fontsource/poppins/300-italic.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource-variable/inter";
import "@fontsource/bricolage-grotesque/700.css";
import "@fontsource/unbounded/600.css";
import "@fontsource/syne/700.css";
import "@fontsource/syne/800.css";
import "@fontsource/kanit/900-italic.css";
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
