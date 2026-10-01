# MiMétodo
App web móvil (PWA) de bienestar y seguimiento de métodos anticonceptivos, con asistente de IA real vía OpenRouter. Datos locales en `localStorage`. La IA es informativa, **no** reemplaza a un profesional.

## Instalación
```
npm install
cp .env.example .env     # en Windows: copy .env.example .env
```
## Configurar OpenRouter
1. Crea una cuenta y una API key en https://openrouter.ai/keys
2. Edita `.env` (nunca se sube a Git) y pon tu clave en `OPENROUTER_API_KEY=`.
3. Cambia el modelo en `OPENROUTER_MODEL` (ej. `openrouter/free` o cualquier modelo `...:free`). Solo se lee en `backend/server.js`.

## Ejecutar
- Todo junto: `npm run dev` (frontend en http://localhost:5173, backend en :3001, con proxy `/api`).
- Solo backend: `npm run server`.
- Para probar en tu teléfono (misma red Wi-Fi) abre `http://IP-DE-TU-PC:5173`.

## Usar
Botón "+" para registrar síntomas, cambios, tomas, recordatorios y fechas. Abre el asistente desde el acceso rápido "IA" y escribe una duda; el historial de la conversación se envía en cada mensaje.
