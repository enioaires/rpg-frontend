// ==========================================
// APP INITIALIZATION
// ==========================================

import { browser } from '$app/environment';
import { logger } from './utils/logger';
import { initialize as initAuth } from './stores/auth';

// ==========================================
// INITIALIZATION FUNCTION
// ==========================================

export async function initializeApp(): Promise<void> {
  if (!browser) return;

  try {
    logger.info('Inicializando aplicação');

    // Inicializa autenticação
    await initAuth();

    logger.info('Aplicação inicializada com sucesso');

  } catch (error) {
    logger.error('Erro na inicialização da aplicação', error);
  }
}

// ==========================================
// AUTO-INIT (call once)
// ==========================================

if (browser) {
  initializeApp();
}