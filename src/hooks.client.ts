// ==========================================
// FRONTEND AUTH MIDDLEWARE - SvelteKit Hooks
// ==========================================
// Arquivo: src/hooks.client.ts

import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { authStore } from '$lib/stores/auth';
import { logger } from '$lib/utils/logger';
import { ROUTES, STORAGE_KEYS } from '$lib/utils/constants';

// ==========================================
// ROTAS PROTEGIDAS E PÚBLICAS
// ==========================================

const PROTECTED_ROUTES = [
  '/dashboard',
  '/characters',
  '/profile',
  '/settings'
];

const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/about'
];

const AUTH_ROUTES = ['/login', '/register'];

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(route => pathname.startsWith(route));
}

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some(route => pathname.startsWith(route));
}

function isTokenValid(token: string | null): boolean {
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp * 1000;
    const now = Date.now();

    return expiry > (now + 5 * 60 * 1000); // Buffer de 5 minutos
  } catch {
    return false;
  }
}

// ==========================================
// AUTH MIDDLEWARE PRINCIPAL
// ==========================================

export async function handleNavigation({ url }: { url: URL }) {
  if (!browser) return;

  const pathname = url.pathname;
  logger.debug('🔍 Client navigation', { pathname });

  // Apenas inicializa auth store se necessário
  // O server hook já cuidou dos redirects
  authStore.initialize();
}

// ==========================================
// AUTO-LOGOUT EM TOKEN EXPIRADO
// ==========================================

export function setupTokenWatcher() {
  if (!browser) return;

  // Verifica token a cada 5 minutos
  const interval = setInterval(() => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

    if (token && !isTokenValid(token)) {
      logger.warn('🕐 Token expired - Auto logout');
      authStore.logout();

      // Se estiver em rota protegida, redireciona
      const currentPath = window.location.pathname;
      if (isProtectedRoute(currentPath)) {
        goto(`${ROUTES.LOGIN}?redirect=${encodeURIComponent(currentPath)}`);
      }
    }
  }, 5 * 60 * 1000); // 5 minutos

  // Cleanup na saída
  return () => clearInterval(interval);
}

// ==========================================
// INICIALIZAÇÃO DO MIDDLEWARE
// ==========================================

if (browser) {
  // Configura watcher de token
  setupTokenWatcher();

  // Inicializa auth store na primeira carga
  authStore.initialize();

  logger.info('🔐 Auth middleware initialized');
}

// ==========================================
// GUARDS UTILITÁRIOS PARA COMPONENTES
// ==========================================

export function requireAuth() {
  if (!browser) return true;

  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  const isAuthenticated = isTokenValid(token);

  if (!isAuthenticated) {
    const currentPath = window.location.pathname;
    goto(`${ROUTES.LOGIN}?redirect=${encodeURIComponent(currentPath)}`);
    return false;
  }

  return true;
}

export function requireGuest() {
  if (!browser) return true;

  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  const isAuthenticated = isTokenValid(token);

  if (isAuthenticated) {
    goto(ROUTES.DASHBOARD);
    return false;
  }

  return true;
}

// ==========================================
// COMPONENT GUARD HOOK
// ==========================================

export function useAuthGuard(type: 'auth' | 'guest' = 'auth') {
  if (!browser) return { canAccess: true };

  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  const isAuthenticated = isTokenValid(token);

  const canAccess = type === 'auth' ? isAuthenticated : !isAuthenticated;

  if (!canAccess) {
    const targetRoute = type === 'auth' ? ROUTES.LOGIN : ROUTES.DASHBOARD;
    const currentPath = window.location.pathname;

    if (type === 'auth') {
      goto(`${targetRoute}?redirect=${encodeURIComponent(currentPath)}`);
    } else {
      goto(targetRoute);
    }
  }

  return { canAccess, isAuthenticated };
}