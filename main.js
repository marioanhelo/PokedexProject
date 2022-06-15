const container = document.getElementById('pokedex');
const inputSearch = document.getElementById('search');
const cards = document.getElementsByClassName('card');

function filterPokemon() {
    // Declare variables
    var input, filter, card, a, i, txtValue;
    input = document.getElementById('search');
    filter = input.value.toUpperCase();
    
    card = document.getElementsByClassName('col-2');
  
    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < card.length; i++) {
      a = card[i].getElementsByTagName("h4")[0];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        card[i].style.display = "";
      } else {
        card[i].style.display = "none";
      }
    }
  }
function getPokemonData(ID){
    axios.get(`https://pokeapi.co/api/v2/pokemon/${ID}`, {
        responseType: 'json'
      })
        .then(function(response) {
          if(response.status==200) {
            
            createCardPokemon(response);
          }
        })
        .catch(function(error) {
          console.log(error);
        })
}
    function createCardPokemon(pokemon){
      
        let pokemonName = capitalize(pokemon.data.name)
        let dataCard = `<div class="col-2 mb-4">
                            <div class="card shadow">
                                <a href="#" class="card-href" data-bs-toggle="modal" data-bs-target="#pokemonModal" onclick="getPokemonInfo(${pokemon.data.id})">
                                    <div class="card-body">
                                        <img class="d-block mx-auto" src="${pokemon.data.sprites.front_default}" style="width:100px">
                                        <h4 class="text-primary text-center">${pokemonName}</h4>
                                        <h5 class="text-primary text-center">#${pokemon.data.id.toString().padStart(3,0)}</h5>
                                        <h6 class="text-primary text-center">Tipo: ${pokemon.data.types[0].type.name}</h6>
                                    </div>
                                </a>
                            </div>
                        </div>`
        container.innerHTML += dataCard
    }
    function getPokemons(start,finish){
        for (let i = start; i < start + finish; i++) {
            getPokemonData(i);
          }
    }
    getPokemons(1,150)

    function capitalize(string){
        let myString = string;
        let result = myString.replace(/^\w/, (c) => c.toUpperCase());
        return result
    }

function getPokemonInfo(ID){
    let cardHeader = document.getElementById("pokemonName")
    let pokemonIMG = document.getElementById("pokemonImg")
    let pokemonStats = document.getElementById("Estadisticas")
    let pokemonProfile = document.getElementById("Perfil")
    pokemonStats.innerHTML = ""
    axios.get(`https://pokeapi.co/api/v2/pokemon/${ID}`, {
        responseType: 'json'
      })
        .then(function(response) {
          if(response.status==200) {
            console.log(response)
            let pokemonName = capitalize(response.data.name)
            console.log(response)
            let nombre = `<p>${pokemonName}</p>`
            cardHeader.innerHTML = nombre;
            let fotoPokemon = `<img src="${response.data.sprites.front_default}" class="d-block mx-auto">
                                <p class="text-center">#${response.data.id.toString().padStart(3,0)}</p>
                                <p class="text-center">${response.data.types[0].type.name}</p>`
            pokemonIMG.innerHTML = fotoPokemon
            pokemonStats.appendChild(progressBars(response.data.stats));
            let perfil = `<p>Peso: ${response.data.weight}</p>
                          <p>Altura: ${response.data.height}</p>`
            pokemonProfile.innerHTML = perfil;

            }
        })
        .catch(function(error) {
          console.log(error);
        })
}
function progressBars(stats) {
    const statsContainer = document.createElement("div");
    statsContainer.classList.add("stats-container");
    for (let i = 0; i < 3; i++) {
      const stat = stats[i];
      const statPercent = stat.base_stat + "%";
      const statContainer = document.createElement("stat-container");
      const statName = document.createElement("p");
      statName.textContent = stat.stat.name;
      const progress = document.createElement("div");
      progress.classList.add("progress");
      const progressBar = document.createElement("div");
      progressBar.classList.add("progress-bar");
      progressBar.setAttribute("aria-valuenow", stat.base_stat);
      progressBar.setAttribute("aria-valuemin", 0);
      progressBar.setAttribute("aria-valuemax", 100);
      progressBar.style.width = statPercent;
      progressBar.textContent = stat.base_stat;
      progress.appendChild(progressBar);
      statContainer.appendChild(statName);
      statContainer.appendChild(progress);
      statsContainer.appendChild(statContainer);
    }
    return statsContainer;
  }