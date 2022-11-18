/*Primero se crea una variable const el canvas con llamando el Id de html, igual con el 
context que va a contener el objeto 2d.*/

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let lastTime = 0;
let dropInterval = 1000;
let dropCounter = 0;

/*Se crea la constante grid, para declarar la funcion createMatriz con 10 columnas y 10 filas.
otra constante llamada formas donde es igual a un objeto, que tendran claves de pos de posicion
en x y en y en 0 y matriz donde va contener los tetrimonios*/ 
const grid = createMatriz(10,20);
const player = {
    pos: {x: 0, y: 0},
    matriz: null,
    next: null,
    score: 0,
    lines: 0,
    level: 0,
};
const colors = [
    null,
    "red",
    "deepskyblue",
    "powderblue",
    "green",
    "orange",
    "purple",
    "darkorange",
]

/*Se llama la variable context para que escale cada figura en X y en Y por 20*/
context.scale(25,30);

/*Hacemos otra funcion llamado createPiece, como parametro tipo, entonces si su tipo es igual a
T entonces retorna la matriz y antes el valor tenia esta matriz y se pasa a null, porque su
valor está vacío.*/
function createPiece(tipo){
    if(tipo === "T"){
        return [
            [0,0,0],
            [1,1,1],
            [0,1,0]
        ];
    }else if(tipo === "O"){
        return [
            [2,2],
            [2,2]
        ];
    }else if(tipo === "L"){
        return [
            [0,3,0],
            [0,3,0],
            [0,3,3]
        ];
    }else if(tipo === "J"){
        return [
            [0,4,0],
            [0,4,0],
            [4,4,0]
        ];
    }else if(tipo === "I"){
        return [
            [0,5,0,0],
            [0,5,0,0],
            [0,5,0,0],
            [0,5,0,0]
        ];
    }else if(tipo === "S"){
        return [
            [0,6,6],
            [6,6,0],
            [0,0,0]
        ];
    }else if(tipo === "Z"){
        return [
            [7,7,0],
            [0,7,7],
            [0,0,0]
        ];
    }
}

/*Se crea la funcion con parametros como variables width, height. Se crea una variable constante
matriz igual a un array vacio y un ciclo que donde el alto es menor a 1, la matriz que es el
array vacio, mande un nuevo array con ancho que se rellene(.fill) en 0, para crear la tabla
como tal y por ultimo se retorna la matriz*/
function createMatriz(width,height){
    const matriz = [];
    while(height--){
        matriz.push(new Array(width).fill(0));
    }
    return matriz;
}

/*Se crea la funcion collision, llamando como parametros a las variables grid y formas, se crea la
variable matriz y posicion que es donde accede al objeto de formas con su clave, con un ciclo for
que donde Y y X es igual a 0 y sean menor a la longitud de la matriz, entonces se le suma a 1 en y 
y X, entonces si la matriz en Y X y las posiciones que tiene grid ni la forma no es igual a 0
entonces returna true, si no es falso o que deja pasar*/
function collide(grid, player){
    const matriz = player.matriz;
    const offset = player.pos;
    for(let y = 0; y < matriz.length; y++){
        for(let x = 0; x < matriz[y].length; x++){
            if(matriz[y][x] !== 0 && (grid[y + offset.y] && grid[y + offset.y][x + offset.x])!== 0){
                return true;
            }
        }
    }
    return false;
}


/*Creamos la funcion merge recorriendo la matriz en Y y en X, si el valor no es igual a 0 se crea
una nueva. No es necesario asignarle un redibujado, porque ya se está ejecutando en la funcion
drawMatriz*/
function merge(grid, player){
    player.matriz.forEach((row, y)=>{
        row.forEach((value, x)=>{
            if(value !== 0){
                grid[y + player.pos.y][x + player.pos.x] = value;
            }
        })
    })
}
