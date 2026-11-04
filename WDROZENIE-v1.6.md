# PIANO teacher v1.6 — lekcje 7 i 8

## Aktualizacja istniejącej produkcji

Rozpakuj paczkę i wgraj pliki z zachowaniem ścieżek do istniejącego repozytorium:

- public/piano.html
- public/song-engine.js
- public/scores/ragtime.png
- public/scores/piwnica.png
- src/progress.ts
- src/index.ts
- public/_headers
- tsconfig.json

Zatwierdź zmiany na głównej gałęzi. Cloudflare wdroży je automatycznie.
Nie trzeba uruchamiać schema.sql ani zmieniać wrangler.jsonc. Wyniki i ustawienia pozostają w istniejącej bazie.

## Działanie nowych lekcji

7. Ragtime małego klauna: wstęp raz (takty 1–4), następnie takty 5–7, zakończenie 1, powrót do taktów 5–7 i zakończenie 2. Razem 34 zdarzenia nutowe; ostatnie C4 dowolną ręką.
8. W murowanej piwnicy: oba systemy kolejno, 28 zdarzeń nutowych, bez repetycji.

Naciśnij „Słuchaj”, aby włączyć mikrofon. To włącza słuchanie; nie wyznacza początku utworu. Partytura jest widoczna w całości i nie jest podświetlana. Tempo i długość dźwięków nie są oceniane. Każdy dźwięk jest sprawdzany jako koniec potencjalnego pełnego wykonania; przerwij i zacznij od początku bez resetowania. Ponowne uderzenie tego samego klawisza jest oddzielnym zdarzeniem. Po pauzie trzeba zagrać całość od nowa.

Całe wykonanie daje 10 pkt za każdą nutę i 300 pkt premii. Częściowe próby nie naliczają punktów.
- Ragtime: 340 + 300 = 640 pkt.
- W murowanej piwnicy: 280 + 300 = 580 pkt.

Pozostaje dotychczasowy przelicznik: 30 pkt = żółta, 10 żółtych = czerwona, 10 czerwonych = fioletowa, 10 fioletowych = nowa biała. Dotychczasowe wyniki automatycznie pokazują się w czterech kolorach; nic nie jest zerowane. Jedno zakończone wykonanie otrzymuje jedną premię także po ponowieniu żądania zapisu.

## Sprawdzenie po wdrożeniu

- W nagłówku widać v1.6; w wyborze są lekcje 7 i 8.
- Partytura wyświetla się od razu po wyborze lekcji.
- Lekcje 1–6 nadal pokazują przewijaną pięciolinię.
- Mikrofon włącza się po „Słuchaj”; w diagnostyce widać sygnał i słyszaną nutę.
- Trzymanie klawisza nie dodaje wielu zdarzeń; ponowne uderzenie powinno być liczone osobno.

Logika sprawdzona na generowanych sygnałach 44,1 i 48 kHz. Rzeczywisty fortepian i mikrofon telefonu wymagają sprawdzenia w miejscu ćwiczeń; przy problemie użyj raportu diagnostycznego. Dźwięk nie jest nagrywany ani wysyłany — serwer otrzymuje rozpoznaną sekwencję MIDI przy zaliczeniu.

W v1.6 strona otrzymuje Cache-Control: no-store. Po aktualizacji odśwież kartę i sprawdź numer v1.6. Nowe utwory wybiera się w polu Lekcja (7 i 8).
