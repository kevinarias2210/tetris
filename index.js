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