// ==========================================
// DASHBOARD SERVER LOADER
// ==========================================
// Arquivo: src/routes/dashboard/+page.server.ts

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  // Server hook já garantiu que só chega aqui se autenticado
  return {
    isAuthenticated: locals.isAuthenticated,
    token: locals.token
  };
};