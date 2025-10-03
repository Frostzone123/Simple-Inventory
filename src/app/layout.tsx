import "./globals.css";
import { ItemProvider } from "../../context/ItemContext";
import { LoadingProvider } from "../../context/LoadingContext";

export const metadata = {
  title: "Simple Inven",
  description: "Minimalistic iOS-style inventory app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LoadingProvider>
            <ItemProvider>{children}</ItemProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}