// ==========================================
// LAYOUT SERVER LOADER
// ==========================================
// Arquivo: src/routes/+layout.server.ts

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
  return {
    isAuthenticated: locals.isAuthenticated || false,
    token: locals.token || null,
    pathname: url.pathname
  };
};