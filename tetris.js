let= lastTime=0;
let= dropInterval =1000;
let= dropCounter=0;


const CANVAS =document.getElementById("tetris"); /* se llama la id canvas que es llamada tetris */
const CONTEXT = CANVAS.getContext("2d");//se declara constante para contextualizar que formato de dibujo utilizaremos
const GRID= creareMatriz(10,20);//para saber si hay filas ocupadas




const colors=[
    null,
    "red",
    "blue",
    "violet",
    "green",
    "purple",
    "orange",
    "pink"
];

const PLAYER ={        //constante de tipo objeto para las figuras
    pos:{x:0, y:0},      //atrivuto llamado pos 
    matriz:null,
    score:0,
    level:0,
    line:0
    
};


CONTEXT.scale(20,20);
//10 columnas y 20 filas 
//200 /20 = 10 
//400 /20 = 20


function createPiece(tipo){
    if(tipo==="T"){
            return [          //va hacer la pieza T se hace con dos arry bidimensional
            [0,0,0],
            [1,1,1],
            [0,1,0]
        ]
    }else if(tipo==="O"){
        return [          //va hacer la pieza T se hace con dos arry bidimensional
        [2,2],
        [2,2]
        
    ]
    }else if(tipo==="L"){
        return[
            [0,3,0],
            [0,3,0],
            [0,3,3]
        ]
    }else if(tipo==="J"){
        return[
            [0,4,0],
            [0,4,0],
            [4,4,0]
        ]
    }else if(tipo==="I"){
        return[
            [0,5,0,0],
            [0,5,0,0],
            [0,5,0,0],
            [0,5,0,0]
        ]
    }else if(tipo==="S"){
        return[
            [0,6,6],
            [6,6,0],
            [0,0,0]
            
        ]
    }else if(tipo==="Z"){
        return[
            [7,7,0],
            [0,7,7],
            [0,0,0]
            
        ]
    }
}


function creareMatriz(width, height) {
    const matriz=[];
    while(height--){//se va ir restando hasta que devuelva falso
        matriz.push(new Array(width).fill(0));
    }
    return matriz;
}

function colicion(GRID, PLAYER){ // se llama grid por que tiene la matrix y player de la matrix de las piezas 
    const matriz = PLAYER.matriz;
    const offset = PLAYER.pos;

    for(let y= 0; y< matriz.length; ++y){
        for(let x=0; x<matriz[y].length; ++x){
            if(matriz[y] [x] !==0 &&(GRID[y+ offset.y] && GRID[y+ offset.y][x + offset.x])!==0){ //&& comparacion logica
            return true;
            }    
        }
    }
    return false;
}

function merge(GRID, PLAYER){
    PLAYER.matriz.forEach((row, y)=>{
        row.forEach((value,x)=>{
            if(value !==0){
                GRID[y+PLAYER.pos.y][x + PLAYER.pos.x]=value;
            }
        });
    });
}



function drawMatriz(matriz, offset){ //2 parametros la matriz de la tetraminio que quiero dibujar, la posicion de la piza que quiero dibujar
    matriz.forEach((row, y) => {
        row.forEach((value, x) => {
            if(value !==0){
                CONTEXT.fillStyle= colors[value];
                CONTEXT.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
        
    });
}




function draw(){
    CONTEXT.fillStyle= "#000";//color del fondo del canvas
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
        PLAYER.line ++;
        rowCount +=2;
        if(PLAYER.line%3===0) PLAYER.level++;
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
        PLAYER.line=0;
        updatescore();
    }
}


function updatescore(){//funcion para mostar el score
    document.getElementById("score").innerHTML=PLAYER.score;//innerhmtl es para que aparezca en la web
    document.getElementById("line").innerHTML=PLAYER.line;
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




//se llama para que se ejecute la funcion 
playerReset();
updatescore();
update();