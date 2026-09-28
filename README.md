# Nut po nucie — źródła produkcyjne

Aplikacja do ćwiczenia gry na pianinie. `public/piano.html` zawiera interfejs, `src/` obsługuje wyniki i ustawienia trzech graczy, a `schema.sql` definiuje bazę D1. Adres `/piano` przekierowuje do aplikacji.

## Uruchomienie produkcyjne

1. Wrzuć **zawartość tego folderu** do repozytorium GitHub (nie sam plik ZIP).
2. W Cloudflare utwórz osobną bazę D1 `piano-trainer-prod`. Skopiuj jej identyfikator UUID do `wrangler.jsonc` zamiast `REPLACE_WITH_YOUR_PRODUCTION_D1_ID`.
3. Zastosuj schemat w bazie produkcyjnej (CLI: `npx wrangler d1 execute piano-trainer-prod --remote --file=schema.sql`).
4. W Cloudflare Workers & Pages utwórz Worker przez **Import a repository**, wybierz repozytorium i wdrażanie przez Wrangler (`npm run deploy`; instalacja `npm install`). Alternatywnie na swoim komputerze: `npm install`, `npm run check`, `npm run deploy`.
5. Zweryfikuj adres Workera `/piano` i działanie `/api/progress`; potem ustaw docelową domenę.

W ZIP nie ma bazy ani danych użytkowników. Przed przełączeniem dzieci na wersję produkcyjną trzeba przenieść wyniki i ustawienia z testowej bazy do nowej. Migracje `0003` i `0004` z testu są celowo pominięte: nadpisałyby liczniki po przeniesieniu. Prototyp pozostaje osobnym wdrożeniem.
