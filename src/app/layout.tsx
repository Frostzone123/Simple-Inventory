import "./globals.css";
import { ItemProvider } from "../../context/ItemContext";

export const metadata = {
  title: "Simple Inven",
  description: "Minimalistic iOS-style inventory app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ItemProvider>{children}</ItemProvider>
      </body>
    </html>
  );
}