import type { NextConfig } from "next";

const SUPABASE_HOST = 'zbfrqolopbktzxfchqjy.supabase.co';

// Domains that may still host hotel images referenced in Supabase data
const HOTEL_IMAGE_HOSTS = [
  'costadelsolperu.com',
  'dynamic-media-cdn.tripadvisor.com',
  'hotelcontinental.com.pe',
  'hotelmonthanas.com',
  'hotelpilanconescajamarca.com',
  'i0.wp.com',
  'lagunaseca.com.pe',
  'portaldelmarques.com',
  'posadapuruay.com.pe',
  'static.wixstatic.com',
  'upload.wikimedia.org',
];

const cspHotelImgSrc = HOTEL_IMAGE_HOSTS.map(h => `https://${h}`).join(' ');

const isDev = process.env.NODE_ENV !== 'production';

// React + Turbopack require eval() in development for call-stack reconstruction.
// It is never used in production, so we only add 'unsafe-eval' in dev mode.
const scriptSrc = isDev
  ? `'self' 'unsafe-inline' 'unsafe-eval'`
  : `'self' 'unsafe-inline'`;

const ContentSecurityPolicy = `
  default-src 'self';
  script-src ${scriptSrc};
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: blob: https://${SUPABASE_HOST} ${cspHotelImgSrc};
  connect-src 'self' https://${SUPABASE_HOST} wss://${SUPABASE_HOST};
  media-src 'self' blob:;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
`.replace(/\n\s+/g, ' ').trim();

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: ContentSecurityPolicy },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
        ],
      },
    ];
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [50, 75],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: SUPABASE_HOST,
        pathname: '/storage/v1/object/public/**',
      },
      // Peruvian hotel websites that may still host images referenced in DB
      ...HOTEL_IMAGE_HOSTS.map(hostname => ({
        protocol: 'https' as const,
        hostname,
      })),
    ],
  },
};

export default nextConfig;
