import type { Metadata } from "next";
import "@/styles/globals.css";
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: "Adventur Hoteles",
  description: "Encuentra los mejores hoteles para tu próxima aventura",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col">
        {children}
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            style: { fontFamily: 'Montserrat, sans-serif' },
          }}
        />
      </body>
    </html>
  );
}