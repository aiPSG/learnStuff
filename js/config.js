/*
 * Einstellungen für den KI-Tutor.
 *
 * NIEMALS einen API-Key in dieses Repository schreiben – alles hier ist öffentlich!
 *
 * Variante A (eine Familie): leer lassen. Ein Elternteil trägt den Key in der App
 *   unter ⚙️ ein; er wird nur im Browser dieses Geräts gespeichert.
 * Variante B (Klasse/mehrere Kinder): einen eigenen Proxy betreiben (siehe proxy/README.md)
 *   und hier seine Adresse eintragen, z. B. 'https://termquest-tutor.example.workers.dev'.
 *   Der Key liegt dann nur als Secret auf dem Proxy.
 */
window.TQ_CONFIG = {
  proxyUrl: '',
  model: 'claude-opus-5-5',
  sdkUrl: 'https://cdn.jsdelivr.net/npm/@anthropic-ai/sdk@0.131.0/+esm',
  dailyMessageLimit: 40,
};
