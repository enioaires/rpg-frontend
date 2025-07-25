// ==========================================
// SERVER-SIDE AUTH HOOK
// ==========================================
// Arquivo: src/hooks.server.ts

import { redirect, type Handle } from '@sveltejs/kit';
import { STORAGE_KEYS } from '$lib/utils/constants';

// ==========================================
// ROTAS PROTEGIDAS
// ==========================================

const PROTECTED_ROUTES = [
  '/dashboard',
  '/characters',
  '/profile',
  '/settings'
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
// MAIN HANDLE FUNCTION
// ==========================================

export const handle: Handle = async ({ event, resolve }) => {
  const pathname = event.url.pathname;

  // Pega token dos cookies (mais seguro no server)
  const token = event.cookies.get(STORAGE_KEYS.AUTH_TOKEN) ||
    event.request.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) return await resolve(event);

  const isAuthenticated = isTokenValid(token);

  // Adiciona dados de auth no locals para usar nas páginas
  event.locals.isAuthenticated = isAuthenticated;
  event.locals.token = token || null;

  // ==========================================
  // ROTA PROTEGIDA - Precisa estar logado
  // ==========================================
  if (isProtectedRoute(pathname)) {
    if (!isAuthenticated) {
      // Redireciona para login
      const redirectUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
      throw redirect(302, redirectUrl);
    }
  }

  // ==========================================
  // ROTA DE AUTH - Logado não deve acessar
  // ==========================================
  if (isAuthRoute(pathname) && isAuthenticated) {
    throw redirect(302, '/dashboard');
  }

  // Continua com a response normal
  const response = await resolve(event);

  return response;
};

// ==========================================
// TYPES PARA O SVELTEKIT
// ==========================================

declare global {
  namespace App {
    interface Locals {
      isAuthenticated: boolean;
      token: string | null;
    }
  }
}