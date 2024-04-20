export const pokeByPage = 150;
export const maxPokemons = 1025;

export function getLocalPage()
{
    var localPage = localStorage.getItem('pokePage');
    return localPage != null 
        ? localPage 
        : 1;
}

export function setLocalPage(page)
{
    localStorage.setItem('pokePage', page);
}

export function getMaxPages() {
    return Math.ceil(maxPokemons / pokeByPage);
}