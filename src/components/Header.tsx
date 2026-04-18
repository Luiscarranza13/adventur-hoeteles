import Link from 'next/link';
import { Button } from './Button';

interface HeaderProps {
  showAuthButton?: boolean;
}

export function Header({ showAuthButton = true }: HeaderProps) {
  return (
    <header className="bg-[#001f3f] text-white py-4 px-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-[#ffd600]">
          Adventur Hoteles
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/" className="hover:text-[#ffd600] transition-colors">
            Inicio
          </Link>
          <Link href="/hoteles" className="hover:text-[#ffd600] transition-colors">
            Hoteles
          </Link>
          {showAuthButton && (
            <Link href="/login">
              <Button variant="primary" size="sm">
                Admin
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#001f3f] text-white py-8 px-6 mt-auto">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-lg font-semibold">Adventur Hoteles</p>
        <p className="text-sm text-gray-300 mt-2">
          Encuentra tu próximo destino perfecto
        </p>
        <p className="text-xs text-gray-400 mt-4">
          © {new Date().getFullYear()} Adventur Hoteles. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
