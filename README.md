# 🎮 PokéDex Explorer — Esercizio JavaScript

## Obiettivo

Completare il file `script.js` per rendere funzionante un'applicazione
web che interroga la **PokéAPI pubblica**, filtra/ordina i risultati
e mostra i dettagli di ogni Pokémon cliccato.

---

## Struttura del progetto

```
exercise-js/
├── index.html   ← già fornito, NON modificare
├── style.css    ← già fornito, NON modificare
├── script.js    ← DA COMPLETARE ✏️
└── README.md    ← questo file
```

---

## Come iniziare

1. Apri la cartella con **VS Code**
2. Installa l'estensione **Live Server** (se non ce l'hai)
3. Clicca destro su `index.html` → *"Open with Live Server"*
4. Apri `script.js` e inizia a completare le funzioni contrassegnate
   con `// TODO:`

> ⚠️ L'applicazione chiama un'API esterna — assicurati di avere
> connessione Internet attiva.

---

## Requisiti da implementare

### ✅ Task 1 — Fetch API

- [X] Chiama `https://pokeapi.co/api/v2/pokemon?limit=20`
      per ottenere la lista dei primi 20 Pokémon
- [X] Per ogni Pokémon, esegui un secondo `fetch()` all'URL individuale
      (campo `.url` di ogni elemento della lista)
- [X] Usa `Promise.all()` per eseguire tutte le chiamate in parallelo
- [X] Trasforma i dati con `.map()` nella struttura definita nei commenti
- [X] Gestisci gli errori con `try/catch`
- [ ] **Bonus**: mostra 20 skeleton loader durante il caricamento
      (elementi con classe `skeleton skeleton-card`)

---

### ✅ Task 2 — Metodi degli Array

Dentro `getFilteredAndSorted()`:
- [X] `.filter()` — filtra per nome (usa `.includes()`)
- [ ] `.filter()` — filtra per tipo (se selezionato)
- [ ] `.sort()`   — ordina per id, nome, peso o exp base

Dentro `updateStats(filtered)`:
- [ ] `.reduce()` — calcola il peso medio in kg
- [ ] `.reduce()` — calcola l'exp media (gestisci i valori `null`)

Dentro `populateTypeFilter()`:
- [ ] `.flatMap()` + `new Set()` — estrai i tipi unici
- [ ] Crea e aggiungi un `<option>` per ogni tipo alla `<select>`

---

### ✅ Task 3 — Manipolazione del DOM

Dentro `renderPokemon()`:
- [X] Svuota la grid con `grid.innerHTML = ''`
- [X] Crea ogni card con `document.createElement()`
- [ ] Aggiungi sprite, id formattato (`#001`), nome e badge dei tipi
- [ ] Aggiungi un listener `click` per aprire il dettaglio
- [ ] Mostra un messaggio se non ci sono risultati

Dentro `showDetail(pokemon)`:
- [ ] Rendi visibile `#detail-panel`
- [ ] Popola con sprite grande (160px), nome, id, tipi
- [ ] Mostra le abilità come chip colorati
- [ ] Mostra le statistiche come barre animate
      (larghezza % = `valore / 255 * 100`)
- [ ] Scrolla al pannello con `scrollIntoView({ behavior: 'smooth' })`

---

## Struttura dati Pokémon (da usare in script.js)

Dopo il fetch, ogni oggetto in `allPokemon` deve avere questa forma:

```javascript
{
  id:        1,                         // numero Pokédex
  name:      "bulbasaur",               // nome
  sprite:    "https://...png",          // URL immagine
  types:     ["grass", "poison"],       // array di stringhe
  weight:    69,                        // decagrammi (÷10 = kg)
  exp:       64,                        // esperienza base (può essere null)
  abilities: ["overgrow", "chlorophyll"],
  stats: [
    { name: "hp",      value: 45 },
    { name: "attack",  value: 49 },
    // ...
  ]
}
```

---

## API Reference

### Lista Pokémon
```
GET https://pokeapi.co/api/v2/pokemon?limit=20
```
Risposta: `{ results: [ { name, url }, ... ] }`

### Dettaglio singolo
```
GET https://pokeapi.co/api/v2/pokemon/{id_o_nome}
```
Campi utili della risposta:

| Campo                       | Tipo    | Descrizione                    |
|-----------------------------|---------|--------------------------------|
| `id`                        | number  | Numero Pokédex                 |
| `name`                      | string  | Nome                           |
| `weight`                    | number  | Peso in decagrammi             |
| `base_experience`           | number  | Exp base (può essere null)     |
| `sprites.front_default`     | string  | URL sprite frontale            |
| `types[].type.name`         | string  | Nome del tipo                  |
| `abilities[].ability.name`  | string  | Nome dell'abilità              |
| `stats[].stat.name`         | string  | Nome della statistica          |
| `stats[].base_stat`         | number  | Valore base                    |

---

## Classi CSS disponibili (non devi scrivere CSS)

| Classe                    | Descrizione                            |
|---------------------------|----------------------------------------|
| `pokemon-card`            | Card della griglia                     |
| `poke-id`                 | Numero Pokédex formattato              |
| `poke-name`               | Nome nella card                        |
| `poke-types`              | Contenitore badge tipi                 |
| `type-badge type-{tipo}`  | Badge tipo (es. `type-fire`)           |
| `detail-inner`            | Grid a 2 colonne per il dettaglio      |
| `detail-image-col`        | Colonna sinistra dettaglio             |
| `detail-info`             | Colonna destra dettaglio               |
| `detail-name`             | Nome grande nel dettaglio              |
| `detail-id`               | Id/info sotto il nome                  |
| `stat-row`                | Riga di una statistica                 |
| `stat-label`              | Etichetta statistica                   |
| `stat-bar-wrap`           | Sfondo barra statistica                |
| `stat-bar`                | Barra colorata (imposta `width` inline)|
| `stat-value`              | Valore numerico                        |
| `ability-chip`            | Chip abilità                           |
| `abilities-list`          | Contenitore chip abilità               |
| `skeleton skeleton-card`  | Placeholder animato di caricamento     |
| `state-placeholder`       | Messaggio stato vuoto o errore         |

### Tipi con colore CSS già definito
`fire` `water` `grass` `electric` `psychic` `ice` `dragon` `dark`
`fairy` `normal` `fighting` `flying` `poison` `ground` `rock`
`bug` `ghost` `steel`

---

## Criteri di valutazione

| Criterio                                 | Punti |
|------------------------------------------|-------|
| Fetch funzionante + `Promise.all`        | 25    |
| Filtro per nome e per tipo               | 20    |
| Ordinamento corretto (4 modalità)        | 15    |
| Statistiche calcolate con `.reduce()`    | 15    |
| Render card con DOM API                  | 15    |
| Pannello dettaglio completo              | 10    |
| **Bonus** — skeleton loader              | +5    |
| **Bonus** — gestione errori visiva       | +5    |

**Totale: 100 + 10 bonus**

---

## Consegna

Carica **solo il file `script.js`** completato sulla piattaforma
o invialo via email all'indirizzo indicato dal docente.
Non modificare `index.html` e `style.css`.
