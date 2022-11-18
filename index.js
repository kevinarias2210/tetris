/*Primero se crea una variable const el canvas con llamando el Id de html, igual con el 
ctx que va a contener el objeto 2d.*/

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let lastTime = 0;
let interval = 1000;
let contador = 0;

/*Se crea la constante grid, para declarar la funcion createMatriz con 10 columnas y 10 filas.
otra constante llamada formas donde es igual a un objeto, que tendran claves de pos de posicion
en x y en y en 0 y matriz donde va contener los tetrimonios*/ 
const grid = createMatriz(10,20);
const formas = {
    pos: {x: 0, y: 0},
    matriz: null,
    next: null,
    score: 0,
    lines: 0,
    level: 0,
};
const colores = [
    null,
    "red",
    "deepskyblue",
    "powderblue",
    "green",
    "orange",
    "purple",
    "darkorange",
]

/*Se llama la variable ctx para que escale cada figura en X y en Y por 20*/
ctx.scale(25,30);

/*Hacemos otra funcion llamado crearFormas, como parametro tipo, entonces si su tipo es igual a
T entonces retorna la matriz y antes el valor tenia esta matriz y se pasa a null, porque su
valor está vacío.*/
function crearFormas(tipo){
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
    console.table(matriz);
    return matriz;
}