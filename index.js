const pokeRange = 900;

const mainUrl = "https://pokeapi.co/api/v2/";
const limitParam = "pokemon?limit=";

const componentsFolder = "./Components/";
const pokeCardFolder = "PokeCard/"
const pokeCardPage = "index.html";
const pokeDetailsFolder = "PokeDetails/";
const pokeDetailsCardPage = "index.html";

const language = "en";

const statGraficBarOpacity = 0.5;

const searchs = {
    tagId : "tagId",
    tagName : "tagName"
};

const searchDisplay = {
    show : "flex",
    hide : "none"
};

const pokeAtributesLabels = {
    hp : "HP",
    attack : "ATK",
    defense : "DEF",
    specialAttack : "SATK",
    speacialDefense : "SDEF",
    speed : "SPD"
};

const pokeTypeColors = {
    normal: "#AAA67F",
    fighting: "#C12239",
    flying: "A891EC",
    ground: "#DEC16B",
    poison: "#A43E9E",
    rock: "#B69E31",
    bug: "#A7B723",
    ghost: "#70559B",
    steel: "#B7B9D0",
    fire: "#F57D31",
    water: "#6493EB",
    grass: "#74CB48",
    eletric: "#F9CF30",
    psychic: "#FB5584",
    ice: "#9AD6DF",
    dragon: "#7037FF",
    dark: "#75574C",
    fairy: "#E69EAC"
}

loadPage();

function loadPage()
{
    enableInput(false);
    getPokemonList(pokeRange);
    searchPokemon();
    enableInput(true);
}

function enableInput(enable)
{
    var searchInput = document.querySelector('#search').querySelector('input');
    searchInput.disabled = !enable;
}

function getPokemonList(pokeRange)
{
    fetch(mainUrl + limitParam + pokeRange)
    .then(response => response.json())
    .then(function(allpokemon) {
        allpokemon.results.forEach(function(pokemon){
            fetchPokemonData(pokemon);
          })
    });
}

function searchPokemon()
{
    var searchInput = document.querySelector('#search').querySelector('input');

    searchInput.addEventListener("input", function() {
        var valueInput = searchInput.value.trim().toLowerCase();
        var actualSearch = document.querySelector('#search').querySelector('button').querySelector('img').getAttribute('id');

        if (valueInput == '')
        {
            showAllPokemons();
            return;
        }

        var pokeCards = document.querySelectorAll('.pokeCard');

        if (actualSearch == searchs.tagId)
        {
            pokeCards.forEach(pokeCard => {
                const pokeCardId = pokeCard.querySelector('.pokeId').textContent.replace('#','');
                const isVisible = pokeCardId == valueInput;
                pokeCard.style.display = isVisible ? searchDisplay.show : searchDisplay.hide;
            })
        }

        else if (actualSearch == searchs.tagName)
        {
            valueInput = valueInput
            pokeCards.forEach(pokeCard => {
                const pokeName = pokeCard.querySelector('.pokeName').textContent.toLowerCase();
                const isVisible = pokeName.includes(valueInput);
                pokeCard.style.display = isVisible ? searchDisplay.show : searchDisplay.hide;
            })
        }
    })
}

function fetchPokemonData(pokemon){
    var url = pokemon.url // <--- this is saving the pokemon url to a      variable to us in a fetch.(Ex: https://pokeapi.co/api/v2/pokemon/1/)
    fetch(url)
    .then(response => response.json())
    .then(function(pokeData){
        createPokemonCard(pokeData);
    });
}

function createPokemonCard(pokeData)
{
    var pokeList = document.querySelector('#pokeList');

    fetch(componentsFolder + pokeCardFolder + pokeCardPage)
    .then(response => response.text())
    .then(html => {

        var pokeCard = document.createElement('li');
        pokeCard.classList.add('pokeCard');

        pokeCard.innerHTML = html;
        var pokeName = pokeCard.querySelector('.pokeName');
        var pokeId = pokeCard.querySelector('.pokeId');
        var pokeImg = pokeCard.querySelector('img');

        pokeName.textContent = pokeData.name;
        pokeId.textContent = "#" + pokeData.id;
        pokeImg.src = pokeData.sprites.front_default;


        pokeCard.style.order = pokeData.id;
        pokeCard.setAttribute('id', pokeData.id);

        pokeCard.addEventListener('click', function() {
            var isDisabled = pokeCard.disabled;
            if (isDisabled == true)
                return;

            var pokemonId = pokeCard.getAttribute('id');
            showPokeDetails(pokemonId);
            pokeCardsDisabled(true);
        })

        pokeList.appendChild(pokeCard);
    })
}

function changeSearch(element)
{
    var img = element.querySelector('img');
    var actualSearch = img.getAttribute('id');

    if (actualSearch == searchs.tagId)
    {
        img.src = "./images/tagName.svg";
        img.setAttribute('id',searchs.tagName);
    }
    else
    {
        img.src = "./images/tag.svg";
        img.setAttribute('id', searchs.tagId);
    }

    var searchInput = document.querySelector('#search').querySelector('input');
    searchInput.value = "";

    showAllPokemons();
}

function showAllPokemons()
{
    var pokeCards = document.querySelectorAll('.pokeCard');

    pokeCards.forEach(pokeCard => {
        pokeCard.style.display = searchDisplay.show;
    })
}

function showPokeDetails(pokeId)
{
    fetch(mainUrl + "pokemon" + "/" + pokeId + "/")
    .then(response => response.json())
    .then(function(pokeData) {
        createPokemonDetails(pokeData);
    })
}

function createPokemonDetails(pokeData)
{
    fetch(componentsFolder + pokeCardFolder + pokeDetailsFolder + pokeDetailsCardPage)
    .then(response => response.text())
    .then(async html => {

        var pokeDetails = document.createElement('div');
        pokeDetails.classList.add('pokeDetails');

        pokeDetails.innerHTML = html;
        var turnBackButton = pokeDetails.querySelector('button');

        turnBackButton.addEventListener('click', function() {
            removePokeDetails();
        })

        document.body.addEventListener('click', handleOutsideClick);

        // Function to handle clicks outside of pokeDetails
        function handleOutsideClick(event) {
          if (!pokeDetails.contains(event.target)) {
            removePokeDetails();
            document.body.removeEventListener('click', handleOutsideClick);
          }
        }

        var pokeDetailsName = pokeDetails.querySelector('.pokeDetailsName');
        pokeDetailsName.textContent = pokeData.name;

        var pokeDetailsId = pokeDetails.querySelector('.pokeDetailsId');
        pokeDetailsId.textContent = "#" + pokeData.id;

        var pokeDetailsImage = pokeDetails.querySelector('.pokeDetailsImage').querySelector('img');
        pokeDetailsImage.src = pokeData.sprites.front_default;

        /* construct pokeDetailsCard */

        var pokeDetailsCard = pokeDetails.querySelector('.pokeDetailsCardInfo');
        
        /* construct pokeDetailsTypes */

        var pokeDetailsCardTypes = pokeDetailsCard.querySelector('.pokeDetailsCardTypes');
        var types = pokeData.types;

        var pokeDetailsCardMainType = types[0].type.name;
        pokeDetails.setAttribute('mainType', pokeDetailsCardMainType);

        var mainTypeColor = getPokeCardColor(pokeDetailsCardMainType);
        pokeDetails.style.backgroundColor = mainTypeColor;

        types.forEach(type => {
            var pokeDetailsCardTypeElement = document.createElement('p');
            var typeName = type.type.name;
            pokeDetailsCardTypeElement.textContent = typeName;
            var typeColor = getPokeCardColor(typeName);
            pokeDetailsCardTypeElement.style.backgroundColor = typeColor;
            pokeDetailsCardTypes.appendChild(pokeDetailsCardTypeElement);
        })

        var pokeDetailsCardAbout = pokeDetails.querySelector('.about');
        pokeDetailsCardAbout.style.color = mainTypeColor;

        /* construct pokeDetailsAtributes */

        var pokeDetailsCardWeight = pokeDetailsCard.querySelector('.pokeDetailsCardWeightValue');
        pokeDetailsCardWeight.textContent = pokeData.weight/10 + "kg";

        var pokeDetailsHeight = pokeDetailsCard.querySelector('.pokeDetailsCardHeightValue');
        pokeDetailsHeight.textContent = pokeData.height/10 + "m";

        /*var pokeDetailsMoves = pokeDetails.querySelector('.pokeDetailsCardMovesValue');
        var moves = pokeData.moves;

        let count = 0;
        moves.forEach(move => {
            if (count < 3) {
                var pokeDetailsCardMoveElement = document.createElement('p');
                pokeDetailsCardMoveElement.textContent = move.move.name;
                pokeDetailsMoves.appendChild(pokeDetailsCardMoveElement);
                count++;
            } else {
                return; // Exit the loop early
            }
        });*/

        /* construct description */

        var pokemonDescription = await getPokemonDescription(pokeData.id);
        var pokeDetailsCardDescription = pokeDetailsCard.querySelector('.pokeDetailsCardDescription');
        pokeDetailsCardDescription.textContent = pokemonDescription;

        /* construct base stats */

        var pokeDetailsCardStats = pokeDetails.querySelector('.stats');
        pokeDetailsCardStats.style.color = mainTypeColor;

        var pokeDetailsCardStatsLabels = pokeDetailsCard.querySelector('.pokeDetailsCardStatsLabels');
        var pokeDetailsCardStatsValues = pokeDetailsCard.querySelector('.pokeDetailsCardStatsValues');

        var stats = pokeData.stats;
        const maxStat = 233;

        stats.forEach(stat => {

            var statIndex = stats.indexOf(stat);

            var statLabel = document.createElement('p');
            var statName = getShortPokeAtribute(statIndex);

            statLabel.textContent = statName;
            statLabel.style.color = mainTypeColor;
            pokeDetailsCardStatsLabels.appendChild(statLabel);

            var statGrafic = document.createElement('div');
            statGrafic.classList.add('pokeDetailsCardStatsRows');

            var statValue = document.createElement('p');
            statValue.textContent = stat.base_stat;

            var statPercentValue = (stat.base_stat / 233) * 100;

            var statGraficBar = document.createElement('div');
            statGraficBar.classList.add('statGraficBar');
            var statGraficBarContent = document.createElement('div');
            
            statGraficBar.style.width = 100 + "%";
            statGraficBar.style.background = hexToRGBA(mainTypeColor, statGraficBarOpacity);
            
            statGraficBarContent.style.width = statPercentValue + "%";
            statGraficBarContent.style.background = mainTypeColor;
            
            statGraficBar.appendChild(statGraficBarContent);

            statGrafic.appendChild(statValue);
            statGrafic.appendChild(statGraficBar);

            pokeDetailsCardStatsValues.appendChild(statGrafic);
            

        })

        document.body.appendChild(pokeDetails);
    })
}

function getShortPokeAtribute(index)
{
    switch(index)
    {
        case 0:
            return pokeAtributesLabels.hp;
        case 1:
            return pokeAtributesLabels.attack;
        case 2: 
            return pokeAtributesLabels.defense;
        case 3:
            return pokeAtributesLabels.specialAttack;
        case 4:
            return pokeAtributesLabels.speacialDefense;
        case 5: 
            return pokeAtributesLabels.speed;
        default:
            return pokeAtributesLabels.hp;
    }
}

function getPokeCardColor(type)
{
    switch(type){
        case "normal":
            return pokeTypeColors.normal;
        case "fighting":
            return pokeTypeColors.fighting;
        case "flying":
            return pokeTypeColors.flying;
        case "ground":
            return pokeTypeColors.ground;
        case "poison":
            return pokeTypeColors.poison;
        case "rock":
            return pokeTypeColors.rock;
        case "bug":
            return pokeTypeColors.bug;
        case "ghost":
            return pokeTypeColors.ghost;
        case "steel":
            return pokeTypeColors.steel;
        case "fire":
            return pokeTypeColors.fire;
        case "water":
            return pokeTypeColors.water;
        case "grass":
            return pokeTypeColors.grass;
        case "electric":
            return pokeTypeColors.eletric;
        case "psychic":
            return pokeTypeColors.psychic;
        case "ice":
            return pokeTypeColors.ice;
        case "dragon":
            return pokeTypeColors.dragon;
        case "dark":
            return pokeTypeColors.dark;
        case "fairy":
            return pokeTypeColors.fairy;
        default:
            return pokeTypeColors.normal;   
    }
}

// Função para converter código hexadecimal para RGBA
function hexToRGBA(hex, alpha) {
    // Remova o caractere '#' do início (se presente)
    hex = hex.replace('#', '');

    // Divida o código hexadecimal em componentes R, G, B
    var r = parseInt(hex.substring(0, 2), 16);
    var g = parseInt(hex.substring(2, 4), 16);
    var b = parseInt(hex.substring(4, 6), 16);

    // Retorne o formato RGBA com a opacidade especificada
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
}

function removePokeDetails()
{
    var pokeDetails = document.querySelector('.pokeDetails');
    document.body.removeChild(pokeDetails);

    pokeCardsDisabled(false);
}

function pokeCardsDisabled(disable)
{
    var pokeCards = document.querySelectorAll('.pokeCard');
    pokeCards.forEach(pokeCard => {
        pokeCard.disabled = disable;
    })
}

async function getPokemonDescription(pokeId) {
  return fetch(mainUrl + "pokemon-species/" + pokeId + "/")
    .then(response => response.json())
    .then(function(result) { 

        var translatedText = result.flavor_text_entries[0].flavor_text;
        result.flavor_text_entries.forEach(r => {
            if (r.language.name == language)
            {
                translatedText = r.flavor_text;
                return;
            }
        });

        return translatedText;
    });
}