/*Primero se crea una variable const el canvas Countercon llamando el Id de html, igual con el 
context que va a contener el objeto 2d.*/

const CANVAS = document.getElementById("canvas");
const CONTEXT = CANVAS.getContext("2d");
let lastTime = 0;
let dropInterval = 1000;
let dropCounter = 0;

/*Se crea la constante grid, para declarar la funcion createMatriz con 10 columnas y 10 filas.
otra constante llamada formas donde es igual a un objeto, que tendran claves de pos de posicion
en x y en y en 0 y matriz donde va contener los tetrimonios*/ 
const GRID = createMatriz(10,20);
const PLAYER = {
    pos: {x: 0, y: 0},
    matriz: null,
    score: 0,
    lines: 0,
    level: 0,
};
const COLORS = [
    null,
    "red",
    "deepskyblue",
    "powderblue",
    "green",
    "orange",
    "purple",
    "darkorange",
];

const btn1 = document.getElementById("abajo");
const btn2 = document.getElementById("izquierda");
const btn3 = document.getElementById("derecha");
const btn4 = document.getElementById("rotar");

/*Se llama la variable context para que escale cada figura en X y en Y por 20*/
CONTEXT.scale(25,30);

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
function colicion(GRID, PLAYER){
    const matriz = PLAYER.matriz;
    const offset = PLAYER.pos;
    for(let y = 0; y < matriz.length; y++){
        for(let x = 0; x < matriz[y].length; x++){
            if(matriz[y][x] !== 0 && (GRID[y + offset.y] && GRID[y + offset.y][x + offset.x])!== 0){
                return true;
            }
        }
    }
    return false;
}


/*Creamos la funcion merge recorriendo la matriz en Y y en X, si el valor no es igual a 0 se crea
una nueva. No es necesario asignarle un redibujado, porque ya se está ejecutando en la funcion
drawMatriz*/
function merge(GRID, PLAYER){
    PLAYER.matriz.forEach((row, y)=>{
        row.forEach((value, x)=>{
            if(value !== 0){
                GRID[y + PLAYER.pos.y][x + PLAYER.pos.x] = value;
            }
        })
    })
}

function drawMatriz(matriz, offset){ //2 parametros la matriz de la tetraminio que quiero dibujar, la posicion de la piza que quiero dibujar
    matriz.forEach((row, y) => {
        row.forEach((value, x) => {
            if(value !==0){
                CONTEXT.fillStyle= COLORS[value];
                CONTEXT.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
        
    });
}




function draw(){
    CONTEXT.fillStyle= "black";//color del fondo del canvas
    CONTEXT.fillRect(0, 0, CANVAS.width, CANVAS.height);// los ceros son la posiciones y las otras dos variables son el tamaño y ancho
    drawMatriz(GRID,{x:0, y:0});//la posicion de la pieza de matriz
    drawMatriz(PLAYER.matriz, PLAYER.pos);// la pieza actual de la constante playes
    
}


function gridSweep(){
    let rowCount=1;
    outer: for(let y= GRID.length-1; y>0;--y){
        for(let x=0; x<GRID[y].length;++x ){
            if(GRID[y][x]===0){
            continue outer;
            }
        }
        const row= GRID.splice(y,1)[0].fill(0);
        GRID.unshift(row);
        ++y;

        PLAYER.score +=rowCount*10;
        PLAYER.lines ++;
        rowCount +=2;
        if(PLAYER.lines%3===0) PLAYER.level++;
    }
}


// se crea un funcion update para que se refreque el canvas en cada momento 
function update(time = 0){
    const DELTATIME = time - lastTime;
    lastTime=time;
    dropCounter += DELTATIME;
    if(dropCounter>dropInterval){
        playerDrop();
    }
    
    draw();//se llama esta funcion dentro de la funcion update para que se ejecute al mismo tiempo que uptade y pueda correr el juego 
    requestAnimationFrame(update);
}

function playerDrop(){
    PLAYER.pos.y++; //hace caer hacia abajo
    if(colicion(GRID, PLAYER)){
        PLAYER.pos.y--;
        merge(GRID, PLAYER);
        playerReset();
        gridSweep();
        updatescore();
    }
    dropCounter = 0;
}

function playerMove(direction){
    PLAYER.pos.x += direction;
    if(colicion(GRID,PLAYER)){
        PLAYER.pos.x -=direction;
    }
}


function playerRotate(){
    const pos =PLAYER.pos.x;
    let offset= 1;//con eso devuelve a la ficha a la posicion inicial si hay una colicion 
    rotate(PLAYER.matriz);
    while(colicion(GRID,PLAYER)){
        PLAYER.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if(offset>PLAYER.matriz[0].length){
            rotate(PLAYER.matriz);
            PLAYER.pos.x=pos;
            return;
        }
    }
}

function rotate(matriz){
    for(let y=0; y< matriz.length; ++y){
        for(let x=0; x<y; ++x){
            
            [matriz[x][y], matriz[y][x]]= [matriz[y][x], matriz[x][y]];
        }
    }
    matriz.forEach(row=> row.reverse());
}

function playerReset(){
    const pieces= "TOLIZSJ"
    dropInterval=1000-(PLAYER.level*100);
    PLAYER.matriz= createPiece(pieces[pieces.length*Math.random()| 0]);    
    PLAYER.pos.x=(GRID[0].length/2 |0)-(PLAYER.matriz[0].length/2|0);//esta linea de codigo se utiliza para centrar las piezas 
    PLAYER.pos.y=0;
    if(colicion(GRID,PLAYER)){
        GRID.forEach(row=> row.fill(0));
        PLAYER.score=0;
        PLAYER.level=0;
        PLAYER.lines=0;
        updatescore();
        alert("Game Over");
    }
}


function updatescore(){//funcion para mostar el score
    document.getElementById("score").innerHTML=PLAYER.score;//innerhmtl es para que aparezca en la web
    document.getElementById("lines").innerHTML=PLAYER.lines;
    document.getElementById("level").innerHTML=PLAYER.level;
}

document.addEventListener("keydown", event =>{//se llama un keydow para ejecutar un vento con la teclas
    if(event.key==="ArrowDown" || event.key==="s"){// en esta linea de codigo llama a las teclas con el evento y key
        playerDrop();
    }
    else if(event.key==="ArrowRight" || event.key==="d"){
        playerMove(1);
    }
    else if(event.key==="ArrowLeft" || event.key==="a"){
        playerMove(-1); 
    }else if(event.key==="w" || event.key==="ArrowUp"){
        playerRotate();
    }
});


btn1.addEventListener("click" , event =>{
    playerDrop();
});
btn2.addEventListener("click" , event =>{
    playerMove(-1);
});
btn3.addEventListener("click" , event =>{
    playerMove(1); 
});
btn4.addEventListener("click" , event =>{
    playerRotate();
});




//se llama para que se ejecute la funcion 
playerReset();
updatescore();
update();