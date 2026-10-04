# Tutor-Proxy (optional)

Für eine Klasse oder mehrere Familien: Der API-Key liegt dann **nur** auf diesem Proxy,
nicht in der App und nicht im Repository.

1. Kostenloses Konto bei [Cloudflare](https://dash.cloudflare.com) anlegen → *Workers & Pages* → *Create Worker*.
2. Den Inhalt von `worker.js` in den Editor kopieren und deployen.
3. *Settings → Variables and Secrets*:
   - `ANTHROPIC_API_KEY` als **Secret** (Typ „Secret“, nicht „Text“) mit deinem Key.
   - `ALLOWED_ORIGIN` = `https://aipsg.github.io`
4. Die Worker-Adresse (z. B. `https://termquest-tutor.<name>.workers.dev`) in `js/config.js` bei `proxyUrl` eintragen und pushen.
5. Empfohlen: in der Anthropic Console ein monatliches **Ausgabenlimit** für den Key setzen und in
   Cloudflare eine *Rate Limiting Rule* für den Worker anlegen (z. B. 30 Anfragen pro Minute und IP).

Hinweis: Die Herkunftsprüfung (`Origin`) hält nur Browser anderer Websites ab, keine Skripte.
Das Ausgabenlimit ist deshalb die eigentliche Sicherung.
