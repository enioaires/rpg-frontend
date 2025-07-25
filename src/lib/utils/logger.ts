// ==========================================
// LOGGER FRONTEND - Simples e Eficiente
// ==========================================

import { IS_DEV, IS_BROWSER } from './constants';

// ==========================================
// TYPES
// ==========================================

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  userId?: number;
  characterId?: number;
  action?: string;
  component?: string;
  url?: string;
  userAgent?: string;
  timestamp?: string;
  [key: string]: any;
}

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: LogContext;
  timestamp: string;
  sessionId?: string;
}

// ==========================================
// LOGGER CLASS
// ==========================================

class Logger {
  private sessionId: string;
  private logs: LogEntry[] = [];
  private maxLogs = 1000; // Máximo de logs em memória

  constructor() {
    this.sessionId = this.generateSessionId();

    // Debug inicial
    if (IS_DEV) {
      this.info('Logger iniciado', { sessionId: this.sessionId });
    }
  }

  // ==========================================
  // MÉTODOS PÚBLICOS
  // ==========================================

  debug(message: string, context?: LogContext): void {
    if (IS_DEV) {
      this.log('debug', message, context);
    }
  }

  info(message: string, context?: LogContext): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context);
  }

  error(message: string, error?: Error | any, context?: LogContext): void {
    const errorContext: LogContext = {
      ...context,
      error: error?.message || error,
      stack: error?.stack,
    };

    this.log('error', message, errorContext);
  }

  // ==========================================
  // MÉTODOS ESPECÍFICOS
  // ==========================================

  // Auth
  authSuccess(action: string, context?: LogContext): void {
    this.info(`Auth: ${action} bem-sucedido`, {
      ...context,
      category: 'auth',
      action,
    });
  }

  authError(action: string, error: any, context?: LogContext): void {
    this.error(`Auth: ${action} falhou`, error, {
      ...context,
      category: 'auth',
      action,
    });
  }

  // API
  apiRequest(method: string, url: string, context?: LogContext): void {
    this.debug(`API: ${method} ${url}`, {
      ...context,
      category: 'api',
      method,
      url,
    });
  }

  apiResponse(method: string, url: string, status: number, duration: number, context?: LogContext): void {
    const level = status >= 400 ? 'error' : status >= 300 ? 'warn' : 'debug';

    this[level](`API: ${method} ${url} -> ${status} (${duration}ms)`, {
      ...context,
      category: 'api',
      method,
      url,
      status,
      duration,
    });
  }

  // Character
  characterAction(action: string, characterId?: number, context?: LogContext): void {
    this.info(`Character: ${action}`, {
      ...context,
      category: 'character',
      action,
      characterId,
    });
  }

  // Form
  formSubmit(formName: string, success: boolean, context?: LogContext): void {
    const level = success ? 'info' : 'warn';
    const result = success ? 'enviado' : 'falhou';

    this[level](`Form: ${formName} ${result}`, {
      ...context,
      category: 'form',
      form: formName,
      success,
    });
  }

  // Navigation
  pageView(path: string, context?: LogContext): void {
    this.info(`Page: ${path}`, {
      ...context,
      category: 'navigation',
      path,
      referrer: IS_BROWSER ? document.referrer : undefined,
    });
  }

  // Performance
  performance(metric: string, value: number, unit: string = 'ms', context?: LogContext): void {
    this.debug(`Performance: ${metric} = ${value}${unit}`, {
      ...context,
      category: 'performance',
      metric,
      value,
      unit,
    });
  }

  // ==========================================
  // MÉTODOS PRIVADOS
  // ==========================================

  private log(level: LogLevel, message: string, context?: LogContext): void {
    const timestamp = new Date().toISOString();

    const entry: LogEntry = {
      level,
      message,
      context: this.enrichContext(context),
      timestamp,
      sessionId: this.sessionId,
    };

    // Adiciona à memória
    this.addToMemory(entry);

    // Log no console (sempre em dev, só error/warn em prod)
    if (IS_DEV || level === 'error' || level === 'warn') {
      this.consoleLog(entry);
    }

    // Em produção, enviar errors para serviço de monitoramento
    if (!IS_DEV && level === 'error') {
      this.sendToMonitoring(entry);
    }
  }

  private enrichContext(context?: LogContext): LogContext {
    const baseContext: LogContext = {
      ...context,
      timestamp: new Date().toISOString(),
    };

    // Adiciona dados do browser se disponível
    if (IS_BROWSER) {
      baseContext.url = window.location.href;
      baseContext.userAgent = navigator.userAgent;
    }

    return baseContext;
  }

  private consoleLog(entry: LogEntry): void {
    const { level, message, context, timestamp } = entry;

    // Formatação colorida para o console
    const colors = {
      debug: '#6B7280', // gray-500
      info: '#3B82F6',  // blue-500
      warn: '#F59E0B',  // amber-500
      error: '#EF4444', // red-500
    };

    const style = `color: ${colors[level]}; font-weight: bold;`;

    if (context && Object.keys(context).length > 0) {
      console.groupCollapsed(`%c[${level.toUpperCase()}] ${timestamp} - ${message}`, style);
      console.table(context);
      console.groupEnd();
    } else {
      console.log(`%c[${level.toUpperCase()}] ${timestamp} - ${message}`, style);
    }
  }

  private addToMemory(entry: LogEntry): void {
    this.logs.push(entry);

    // Remove logs antigos se exceder o limite
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }

  private sendToMonitoring(entry: LogEntry): void {
    // TODO: Implementar envio para serviço de monitoramento
    // Exemplos: Sentry, LogRocket, Datadog, etc.

    try {
      // Placeholder para integração futura
      if (window.Sentry) {
        window.Sentry.captureException(new Error(entry.message), {
          extra: entry.context,
          level: entry.level,
        });
      }
    } catch (error) {
      // Silently fail - não queremos quebrar a app por causa de logging
      console.warn('Failed to send log to monitoring service:', error);
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // ==========================================
  // MÉTODOS UTILITÁRIOS
  // ==========================================

  // Obtém logs da sessão atual
  getLogs(level?: LogLevel): LogEntry[] {
    if (level) {
      return this.logs.filter(log => log.level === level);
    }
    return [...this.logs];
  }

  // Limpa logs da memória
  clearLogs(): void {
    this.logs = [];
    this.info('Logs limpos');
  }

  // Exporta logs como JSON
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  // Obtém estatísticas dos logs
  getStats(): Record<LogLevel, number> & { total: number } {
    const stats = {
      debug: 0,
      info: 0,
      warn: 0,
      error: 0,
      total: this.logs.length,
    };

    this.logs.forEach(log => {
      stats[log.level]++;
    });

    return stats;
  }

  // Cronômetro para performance
  startTimer(label: string): () => void {
    const startTime = performance.now();

    return () => {
      const duration = performance.now() - startTime;
      this.performance(label, Math.round(duration));
      return duration;
    };
  }
}

// ==========================================
// SINGLETON INSTANCE
// ==========================================

export const logger = new Logger();

// ==========================================
// CONVENIENCE EXPORTS
// ==========================================

export const {
  debug,
  info,
  warn,
  error,
  authSuccess,
  authError,
  apiRequest,
  apiResponse,
  characterAction,
  formSubmit,
  pageView,
  performance: logPerformance,
  startTimer,
  getLogs,
  clearLogs,
  exportLogs,
  getStats,
} = logger;

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

if (IS_BROWSER) {
  // Captura erros JavaScript não tratados
  window.addEventListener('error', (event) => {
    logger.error('Erro JavaScript não tratado', event.error, {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });

  // Captura promises rejeitadas não tratadas
  window.addEventListener('unhandledrejection', (event) => {
    logger.error('Promise rejeitada não tratada', event.reason, {
      type: 'unhandledrejection',
    });
  });
}

// ==========================================
// TYPE DECLARATIONS
// ==========================================

declare global {
  interface Window {
    Sentry?: any;
    logger: Logger;
  }
}

// Expõe logger globalmente em desenvolvimento
if (IS_DEV && IS_BROWSER) {
  window.logger = logger;
}