import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "@/styles/globals.css";
import { Toaster } from 'sonner';
import { QueryProvider } from '@/providers/QueryProvider';
import { WhatsAppFlotante } from '@/components/cliente/WhatsAppFlotante';
import { getPublicEnv } from '@/lib/env';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-poppins',
  display: 'optional',
});

const SITE_URL = getPublicEnv().NEXT_PUBLIC_SITE_URL;
const SITE_NAME = 'Adventur Hoteles';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Hoteles en Cajamarca y todo el Perú`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'Encuentra los mejores hoteles en Cajamarca, Lima, Cusco, Arequipa y todo el Perú. Reserva directa por WhatsApp, sin comisiones y con confirmación inmediata.',
  keywords: [
    'hoteles Perú', 'hoteles Cajamarca', 'hoteles Lima', 'hoteles Cusco',
    'hoteles Arequipa', 'reserva hotel WhatsApp', 'alojamiento Perú',
    'hospedaje Cajamarca', 'Adventur hoteles',
  ],
  authors: [{ name: 'Adventur', url: SITE_URL }],
  creator: 'Adventur',
  publisher: 'Adventur',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    locale: 'es_PE',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Hoteles en Cajamarca y todo el Perú`,
    description:
      'Hoteles verificados en todo el Perú. Reserva directa por WhatsApp, sin comisiones.',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — Hoteles en Cajamarca y todo el Perú`,
    description: 'Hoteles verificados en todo el Perú. Reserva directa por WhatsApp, sin comisiones.',
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={poppins.variable} data-scroll-behavior="smooth">
      <head>
        <link rel="preload" as="image" href="/hero-inicio.webp" media="(min-width: 640px)" fetchPriority="high" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LodgingBusiness',
              name: SITE_NAME,
              url: SITE_URL,
              logo: `${SITE_URL}/logoadventur2.png`,
              description:
                'Plataforma de hoteles verificados en todo el Perú. Reserva directa por WhatsApp sin comisiones.',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Jr. Amazonas 1079',
                addressLocality: 'Cajamarca',
                addressCountry: 'PE',
              },
              telephone: '+51958101721',
              email: 'hoteles@adventur.pe',
              areaServed: {
                '@type': 'Country',
                name: 'Perú',
              },
            }),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <QueryProvider>
          {children}
          <WhatsAppFlotante />
        </QueryProvider>
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            style: { fontFamily: 'Poppins, sans-serif', fontSize: '14px' },
          }}
        />
      </body>
    </html>
  );
}
