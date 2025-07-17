// Конфигурация API и LiveKit URL
interface ApiConfig {
  apiBaseUrl: string;
  livekitUrl: string;
}

// Определяем конфигурацию на основе окружения
const getApiConfig = (): ApiConfig => {
  // Проверяем переменные окружения Vite (если заданы)
  const envApiUrl = import.meta.env.VITE_API_BASE_URL;
  const envLivekitUrl = import.meta.env.VITE_LIVEKIT_URL;
  
  if (envApiUrl && envLivekitUrl) {
    return {
      apiBaseUrl: envApiUrl,
      livekitUrl: envLivekitUrl
    };
  }
  
  // Автоматическое определение на основе текущего окружения
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const isDevelopment = import.meta.env.DEV;
  
  if (isLocalhost || isDevelopment) {
    // Локальная разработка
    return {
      apiBaseUrl: envApiUrl || 'http://localhost:3000',
      livekitUrl: envLivekitUrl || 'ws://localhost:7002'
    };
  }
  
  // Продакшн - используем nginx proxy для API и прямой доступ для LiveKit
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const port = window.location.port;
  const wsProtocol = protocol === 'https:' ? 'wss:' : 'ws:';
  
  // В Docker окружении API запросы идут через nginx proxy
  const apiBaseUrl = envApiUrl || `${protocol}//${hostname}${port ? `:${port}` : ''}/api`;
  
  // LiveKit использует прямой доступ к сервису
  const livekitUrl = envLivekitUrl || `${wsProtocol}//${hostname}:7002`;
  
  return {
    apiBaseUrl,
    livekitUrl
  };
};

export const API_CONFIG = getApiConfig();

// Функция для отладки конфигурации
export const logApiConfig = (): void => {
  console.log('🔧 API Configuration:', {
    apiBaseUrl: API_CONFIG.apiBaseUrl,
    livekitUrl: API_CONFIG.livekitUrl,
    environment: import.meta.env.MODE,
    hostname: window.location.hostname,
    port: window.location.port,
    envVariables: {
      VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'не задана',
      VITE_LIVEKIT_URL: import.meta.env.VITE_LIVEKIT_URL || 'не задана'
    }
  });
};

// Вспомогательные функции для построения URL
export const getApiUrl = (endpoint: string): string => {
  // Убираем слеш в начале endpoint если он есть
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_CONFIG.apiBaseUrl}/${cleanEndpoint}`;
};

export const getLivekitUrl = (): string => {
  return API_CONFIG.livekitUrl;
};

// Для совместимости с демо режимом
export const getApiUrlWithDemo = (endpoint: string): string => {
  const basePath = window.location.pathname.startsWith('/demo') ? '/demo' : '';
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  if (basePath) {
    return `${basePath}/${cleanEndpoint}`;
  }
  
  return getApiUrl(endpoint);
}; 