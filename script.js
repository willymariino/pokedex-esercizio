// =============================================
//  PokéDex Explorer — script.js
//  Studente: ____________________________
//  Data:     ____________________________
// =============================================

// ── Riferimento elementi del DOM ──────────────
const grid = document.getElementById('pokemon-grid');
const detailPanel = document.getElementById('detail-panel');
const detailInner = document.getElementById('detail-inner');
const inputSearch = document.getElementById('input-search');
const selectType = document.getElementById('select-type');
const selectSort = document.getElementById('select-sort');
const btnLoad = document.getElementById('btn-load');
const btnReset = document.getElementById('btn-reset');
const countLoaded = document.getElementById("count-loaded")
const countFiltered = document.getElementById("count-filtered")


// ── Stato dell'applicazione ───────────────────
let allPokemon = []; // Array completo caricato dall'API

// =============================================
// TASK 1 — Fetch e caricamento dati
// =============================================

async function loadPokemon() {
  // TODO: mostra skeleton loader nella grid
  //       crea 20 div con classe "skeleton skeleton-card" e aggiungili alla grid
  //       (svuota prima la grid con grid.innerHTML = '')

  // TODO: usa fetch() per chiamare l'endpoint lista:
  //       https://pokeapi.co/api/v2/pokemon?limit=20
  //       converti la risposta con .json() e ottieni l'array .results

  // prendo la lista che contiene solo nomi e url
  axios.get(`https://pokeapi.co/api/v2/pokemon?limit=20`)
    .then((res) => {
      const pokemonListWithUrls = res.data.results // array con solo nomi e url
      // console.log(allPokemon)

      // preparo la lista di chiamate scorrendo gli url e mettendoli dentro uno ad uno nell'array axiosGets
      const axiosGets = [] // array che contiene gli oggetti delle chiamate da fare agli url
      for (let i = 0; i < pokemonListWithUrls.length; i++) {
        axiosGets.push(axios.get(pokemonListWithUrls[i].url))
      }

      //  console.log(axiosGets)

      // TODO: per ogni elemento di .results (ha un campo .url),
      //       prepara una chiamata fetch() al dettaglio individuale

      // TODO: usa Promise.all() per eseguire tutte le chiamate in parallelo
      //       e attendere tutti i risultati insieme

      // chiamo la lista preparata dentro axiosGets chiamata gli url tutti insieme tramite promise.all
      Promise.all(axiosGets)
        .then((values) => {
          //  console.log(values)

          // aggiungo la proprieta details all'array originale con i data presi da values
          // values è l'array delle risposte della promise
          for (let i = 0; i < values.length; i++) {
            pokemonListWithUrls[i].details = values[i].data
          }
          // console.log(pokemonListWithUrls)


          // TODO: con .map() trasforma ogni risposta grezza in un oggetto con questa struttura:
          //   {
          //     id:        p.id,
          //     name:      p.name,
          //     sprite:    p.sprites.front_default,
          //     types:     p.types.map(t => t.type.name),        // array di stringhe es. ['fire','flying']
          //     weight:    p.weight,                              // in decagrammi (÷10 per kg)
          //     exp:       p.base_experience,                     // può essere null
          //     abilities: p.abilities.map(a => a.ability.name),
          //     stats:     p.stats.map(s => ({ name: s.stat.name, value: s.base_stat }))
          //   }

          // TODO: salva i risultati in allPokemon

          allPokemon = pokemonListWithUrls.map((p) => {
            const obj = {
              id: p.details.id,
              name: p.name,
              sprite: p.details.sprites.front_default,
              types: p.details.types.map(t => t.type.name),
              weight: p.details.weight,
              exp: p.details.base_experience,
              abilities: p.details.abilities.map(a => a.ability.name),
              stats: p.details.stats.map(s => ({ name: s.stat.name, value: s.base_stat }))
            };

            return obj
          })

          console.log(allPokemon)

          // IMPORTANT: queste funzioni devono essere chiamate SOLO dopo il caricamento dei dati,
          // perché axios è asincrono. Se chiamate fuori da Promise.all, verrebbero eseguite
          // prima che allPokemon sia popolato (causando rendering vuoto o incompleto)
          // in pratica le funzioni di rendering devono essere chiamate solo dopo che i dati async sono disponibili, 
          // altrimenti si rischia di lavorare su stato vuoto o incompleto
          // TODO: chiama populateTypeFilter() per popolare la select dei tipi
          populateTypeFilter()
          // TODO: chiama renderPokemon() per disegnare le card
          renderPokemon()

        })
      // console.log(res)
    })
    .catch(err => {
      console.error("errore nel caricamento dati", err)
    })


  // GESTIONE ERRORI: avvolgi tutto in try/catch
  //   in caso di errore, mostra un messaggio nella grid con state-placeholder
}


// =============================================
// TASK 2 — Metodi degli Array
// =============================================

function getFilteredAndSorted() {
  const query = inputSearch.value.toLowerCase().trim();
  const typeVal = selectType.value;
  const sortVal = selectSort.value;

  // TODO: parti da allPokemon e applica .filter() per il nome
  //       usa .includes() per controllare se pokemon.name contiene query
  let filteredPokemons = allPokemon.filter(pokemon => pokemon.name.toLowerCase().includes(query))

  // TODO: se typeVal non è vuoto stringa, applica un secondo .filter()
  //       ogni pokemon.types è un array di stringhe
  //       usa .includes(typeVal) per verificare la presenza del tipo
  if (typeVal) {
    filteredPokemons = filteredPokemons.filter(pokemon => pokemon.types.includes(typeVal))

  }

  // TODO: applica .sort() in base a sortVal:
  //       'id'     → numerico crescente (a.id - b.id)
  //       'name'   → alfabetico (a.name.localeCompare(b.name))
  //       'weight' → numerico crescente (a.weight - b.weight)
  //       'exp'    → numerico decrescente (b.exp - a.exp), gestisci i null

  switch (sortVal) {
    case "id":
      filteredPokemons.sort((a, b) => a.id - b.id)
      break
    case "name":
      filteredPokemons.sort((a, b) => a.name.localeCompare(b.name))
      break
    case "weigth":
      filteredPokemons.sort((a, b) => a.weight - b.weight)
      break
    case "exp":
      filteredPokemons.sort((a, b) => b.exp - a.exp)
      break
    default:

  }

  // TODO: restituisci l'array risultante con return
  return filteredPokemons
}

function updateStats(filtered) {
  // TODO: seleziona l'elemento #count-loaded e aggiorna il suo textContent
  //       con allPokemon.length
  countLoaded.innerHTML = allPokemon.length

  // TODO: seleziona l'elemento #count-filtered e aggiorna con filtered.length
  countFiltered.innerHTML = filtered.length

  // TODO: calcola il peso medio in kg usando .reduce() su filtered
  //       (weight è in decagrammi → dividi per 10)
  //       aggiorna l'elemento #avg-weight
  //       se filtered è vuoto, mostra "—"
  const avgWeigth = document.getElementById("avg-weight")
  if (filtered.length) {
    const avg = (filtered.reduce((acc, curr) => acc + curr.weight, 0) / filtered.length) / 10
    avgWeigth.innerText = avg.toFixed(2)
  } else {
    avgWeigth.innerText = "-"
  }



  // TODO: calcola l'exp media con .reduce() su filtered
  //       alcuni pokemon.exp potrebbero essere null, esclludili dal calcolo
  //       aggiorna l'elemento #avg-exp
  //       se non ci sono dati validi, mostra "—"
}

function populateTypeFilter() {
  // TODO: estrai tutti i tipi da allPokemon
  //       usa .flatMap(p => p.types) per ottenere un array piatto di stringhe

  //   const listTypes = allPokemon.map(p => p.types)
  //  console.log("no flat", listTypes)

  const listFlatTypes = allPokemon.flatMap(p => p.types)
  // console.log("flat", listFlatTypes) uso il flatMap per spianare e farli diventare un array unico

  // TODO: ottieni i valori unici con: [...new Set(tipiArray)]
  const uniqueTypes = [...new Set(listFlatTypes)]

  // TODO: ordina i tipi alfabeticamente con .sort()

  uniqueTypes.sort()

  // TODO: per ogni tipo, crea un elemento <option>:
  //       option.value = tipo
  //       option.textContent = tipo (con prima lettera maiuscola)
  //       aggiungilo a selectType con appendChild()
  //       (non rimuovere la prima opzione "Tutti i tipi" già presente nell'HTML)

  uniqueTypes.forEach(element => {
    const listOption = document.createElement("option")
    listOption.value = element
    listOption.text = element

    selectType.append(listOption)
  })
}

// =============================================
// TASK 3 — Manipolazione del DOM
// =============================================

function renderPokemon() {
  const list = getFilteredAndSorted();
  updateStats(list);

  // TODO: svuota la grid: grid.innerHTML = ''
  grid.innerHTML = ""

  // TODO: se list è vuoto, crea e inserisci un div.state-placeholder
  //       con un messaggio "Nessun risultato trovato" e termina la funzione (return)
  if (list.length === 0) {
    console.log("lista vuota")
  }
  else {
    list.forEach(element => {
      // const card = document.createElement("div")
      // card.classList.add("pokemon-card")
      // card.innerHTML = `
      // <div class = "poke-id" > # ${element.id}  </div>
      // <img src="${element.sprite}" alt="${element.name}"
      // width  = "80"
      // height = "80"
      // loading = "lazy"
      // >
      // <div class="poke-name">${element.name}</div>
      // <div class="poke-types"></div>
      // `
      // grid.append(card)

      let tipi = ""
      element.types.forEach(tipo => {
        tipi += `<span class="type-badge type-${tipo}" > ${tipo} </span>`
      })

      grid.innerHTML += `
      <div class="pokemon-card" > 
      <div class = "poke-id" > # ${element.id}  </div>
      <img src="${element.sprite}" alt="${element.name}"
      width  = "80"
      height = "80"
      loading = "lazy"
      >
      <div class="poke-name">${element.name}</div>
      <div class="poke-types">${tipi}</div>
      </div>
      `



    });
  }

  // TODO: per ogni pokemon in list, crea una card con document.createElement('div')
  //       aggiungi la classe CSS "pokemon-card"
  //
  //       La card deve contenere (puoi usare innerHTML oppure createElement per ogni parte):
  //
  //       1) div.poke-id con testo "#" + String(pokemon.id).padStart(3, '0')
  //
  //       2) <img> con:
  //            src    = pokemon.sprite  (se null usa un placeholder es. '')
  //            alt    = pokemon.name
  //            width  = "80"
  //            height = "80"
  //            loading = "lazy"
  //
  //       3) div.poke-name con pokemon.name
  //
  //       4) div.poke-types con un <span> per ogni tipo in pokemon.types
  //          ogni span deve avere: className = "type-badge type-" + tipo
  //          e textContent = tipo

  // TODO: aggiungi un click listener su ogni card:
  //       card.addEventListener('click', () => showDetail(pokemon))

  // TODO: aggiungi la card alla grid con grid.appendChild(card)
}

function showDetail(pokemon) {
  // TODO: rendi visibile il pannello:
  //       detailPanel.style.display = 'block'

  // TODO: popola detailInner con innerHTML o createElement
  //       La struttura HTML attesa è:
  //
  //   <!-- Colonna sinistra -->
  //   <div class="detail-image-col">
  //     <img src="{sprite}" alt="{name}" width="160" height="160" />
  //     <div class="poke-types"> ... badge tipi ... </div>
  //     <div class="detail-name">{name}</div>
  //     <div class="detail-id">#{id con 3 cifre} · {weight/10} kg · Exp: {exp}</div>
  //   </div>
  //
  //   <!-- Colonna destra -->
  //   <div class="detail-info">
  //     <h3>Abilità</h3>
  //     <div class="abilities-list">
  //       <!-- un div.ability-chip per ogni abilità in pokemon.abilities -->
  //     </div>
  //
  //     <h3>Statistiche base</h3>
  //     <!-- per ogni stat in pokemon.stats, crea una .stat-row:
  //          <div class="stat-row">
  //            <span class="stat-label">{stat.name}</span>
  //            <div class="stat-bar-wrap">
  //              <div class="stat-bar" style="width:{stat.value/255*100}%"></div>
  //            </div>
  //            <span class="stat-value">{stat.value}</span>
  //          </div>
  //     -->
  //   </div>

  // TODO: scrolla fino al pannello con animazione fluida:
  //       detailPanel.scrollIntoView({ behavior: 'smooth' })
}

// =============================================
// Event Listeners — NON MODIFICARE
// =============================================

btnLoad.addEventListener('click', loadPokemon);

btnReset.addEventListener('click', () => {
  inputSearch.value = '';
  selectType.value = '';
  selectSort.value = 'id';
  renderPokemon();
});

inputSearch.addEventListener('input', renderPokemon);
selectType.addEventListener('change', renderPokemon);
selectSort.addEventListener('change', renderPokemon);



