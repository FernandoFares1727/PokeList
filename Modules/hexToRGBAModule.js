
const alpha = 0.5;

export default // Função para converter código hexadecimal para RGBA
function hexToRGBA(hex) {
    // Remova o caractere '#' do início (se presente)
    hex = hex.replace('#', '');

    // Divida o código hexadecimal em componentes R, G, B
    var r = parseInt(hex.substring(0, 2), 16);
    var g = parseInt(hex.substring(2, 4), 16);
    var b = parseInt(hex.substring(4, 6), 16);

    // Retorne o formato RGBA com a opacidade especificada
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
}