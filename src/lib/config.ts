import { env } from '$env/dynamic/public';
import { dev } from '$app/environment';

export const config = {
  api: {
    baseUrl: env.PUBLIC_API_URL || 'http://localhost:3001',
  },
  app: {
    name: 'RPG Digital',
    version: '1.0.0',
    isDev: dev,
  }
};

// Logger para o frontend
export const logger = {
  info: (message: string, data?: any) => {
    if (config.app.isDev) {
      console.log(`[INFO] ${message}`, data || '');
    }
  },

  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error);
  },

  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data || '');
  }
};