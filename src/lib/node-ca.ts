import tls from 'node:tls';

let systemCertificatesLoaded = false;

type TlsWithSystemCa = typeof tls & {
  getCACertificates?: (type: 'default' | 'system') => string[];
  setDefaultCACertificates?: (certificates: string[]) => void;
};

export function loadSystemCertificates() {
  if (systemCertificatesLoaded || typeof window !== 'undefined') return;
  systemCertificatesLoaded = true;
  const tlsWithSystemCa = tls as TlsWithSystemCa;

  if (
    typeof tlsWithSystemCa.getCACertificates !== 'function' ||
    typeof tlsWithSystemCa.setDefaultCACertificates !== 'function'
  ) {
    return;
  }

  const certificates = [
    ...tlsWithSystemCa.getCACertificates('default'),
    ...tlsWithSystemCa.getCACertificates('system'),
  ];

  tlsWithSystemCa.setDefaultCACertificates([...new Set(certificates)]);
}
