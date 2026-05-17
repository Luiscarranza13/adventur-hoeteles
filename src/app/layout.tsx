import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "@/styles/globals.css";
import { Toaster } from 'sonner';
import { QueryProvider } from '@/providers/QueryProvider';
import { GoogleTranslateScript } from '@/components/shared/GoogleTranslate';
import { WhatsAppFlotante } from '@/components/cliente/WhatsAppFlotante';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal'],
  variable: '--font-montserrat',
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://hoteles.adventur.pe';
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
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Adventur Hoteles — Alojamiento en el Perú',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — Hoteles en Cajamarca y todo el Perú`,
    description: 'Hoteles verificados en todo el Perú. Reserva directa por WhatsApp, sin comisiones.',
    images: [`${SITE_URL}/og-image.jpg`],
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
    <html lang="es" className={montserrat.variable} data-scroll-behavior="smooth">
      <head>
        <link rel="dns-prefetch" href="//translate.google.com" />
        <link rel="dns-prefetch" href="//translate.googleapis.com" />
        <link rel="dns-prefetch" href="//www.gstatic.com" />
        <link rel="preconnect" href="https://translate.google.com" />
        <link rel="preconnect" href="https://translate.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.gstatic.com" crossOrigin="anonymous" />
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
              email: 'reservas@adventur.pe',
              sameAs: [
                'https://www.facebook.com/',
                'https://www.instagram.com/',
              ],
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
        <GoogleTranslateScript />
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            style: { fontFamily: 'Montserrat, sans-serif', fontSize: '14px' },
          }}
        />
      </body>
    </html>
  );
}
