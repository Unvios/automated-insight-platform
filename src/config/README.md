# Конфигурация API

Этот файл содержит настройки для подключения к API серверу и LiveKit.

## Автоматическое определение URL

По умолчанию URL определяются автоматически:

- **Локальная разработка** (localhost): 
  - API: `http://localhost:3000`
  - LiveKit: `ws://localhost:7002`

- **Продакшн** (любой другой домен):
  - API: `{protocol}//{hostname}` (текущий домен)
  - LiveKit: `{ws_protocol}//{hostname}/demo/livekit/`

## Ручная настройка через переменные окружения

Вы можете переопределить URL через переменные окружения Vite:

### Для разработки (.env.local):
```bash
VITE_API_BASE_URL=http://localhost:3000
VITE_LIVEKIT_URL=ws://localhost:7002
```

### Для продакшна:
```bash
VITE_API_BASE_URL=https://your-domain.com
VITE_LIVEKIT_URL=wss://your-domain.com/livekit
```

## Отладка

При подключении к агенту в консоль выводится текущая конфигурация:

```javascript
🔧 API Configuration: {
  apiBaseUrl: "http://localhost:3000",
  livekitUrl: "ws://localhost:7002", 
  environment: "development",
  hostname: "localhost",
  envVariables: {
    VITE_API_BASE_URL: "не задана",
    VITE_LIVEKIT_URL: "не задана" 
  }
}
```

## API

- `getApiUrl(endpoint)` - полный URL для API запроса
- `getApiUrlWithDemo(endpoint)` - URL с поддержкой demo режима
- `getLivekitUrl()` - URL для подключения к LiveKit
- `logApiConfig()` - вывод текущей конфигурации в консоль 