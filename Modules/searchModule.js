
const searchs = {
    tagId : "tagId",
    tagName : "tagName"
};

const searchDisplay = {
    show : "flex",
    hide : "none"
};

export function clearSearchInput()
{
    var searchInput = document.querySelector('#search').querySelector('input');
    searchInput.value = "";
}

export function getLocalSearch()
{
    var localSearch = localStorage.getItem('pokeSearch');
    return localSearch != null
        ? localSearch
        : searchs.tagId;
}

export function setLocalSearch(search) 
{
    localStorage.setItem('pokeSearch', search);
    changeSearchImg(search);
}

export function changeSearchImg(search)
{
    var img = document.querySelector('#search').querySelector('img');

    img.src = search == searchs.tagId 
        ? "./images/tag.svg"
        : "./images/tagName.svg";
    img.setAttribute('id', search);
}

export function changeSearch()
{
    var img = document.querySelector('#search').querySelector('img');
    var actualSearch = img.getAttribute('id');

    if (actualSearch == searchs.tagId)
        setLocalSearch(searchs.tagName);
    else
        setLocalSearch(searchs.tagId);

    clearSearchInput();
    showAllPokemons();
}

export function searchPokemon()
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

function showAllPokemons()
{
    var pokeCards = document.querySelectorAll('.pokeCard');

    pokeCards.forEach(pokeCard => {
        pokeCard.style.display = searchDisplay.show;
    })
}