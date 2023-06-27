//to do list
//tengo dos opciones o dibujo una de las dos cosas en un pgraphic o intento limitarlos como estoy haciendo
//RECALIBAR AMPLITUD y PITCH  ver video para calibrarlo
//hacer algo para que no sea tan molesto completar la obra generar mas cantidad de trazos o modificar la velocidad
//pensar en los estados
//agregar mas interaccion con el pitch

//----CONFIGURACION-----
//amplitud minima y maxima
let AMP_MIN = 0.01; // umbral mínimo de sonido qiu supera al ruido de fondo
let AMP_MAX = 0.2 // amplitud máxima del sonido
//pitch minimo y maximo
let FREC_MIN = 90;
let FREC_MAX = 350;
//amortiguacion de ruido
let AMORTIGUACION = 0.9; // factor de amortiguación de la señal
//mostrar grafico para debug
let IMPRIMIR = false;

//variables estados
//tiempo
let marca;
let tiempoLimiteAgregar = 3000;
let tiempoLimiteGrosor = 3000;
let tiempoLimiteColor = 3000;
let tiempoLimiteFin = 3000;

//variable para indicar cantidad de objetos
let cantidad=0;
let cantidad_max=5;


//----MICROFONO----
let mic;
let audioContext;

//-----AMPLITUD-----
let amp; // variable para cargar la amplitud (volumen) ee la señal de entrada del mic


//----GESTOR AMPITUD----
let gestorAmp;


//pitch del sonido (tono)
let pitch;
let tono;
const model_url = 'https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/';
//----GESTOR PITCH----
let gestorPitch;


//-----ESTADOS-------
let haySonido = false;
let antesHabiaSonido = false; // memoria del estado de "haySonido" un fotograma atrás

//estado inicial de los objetos//
let estado="agregar";

//obtejos 
// Array de objetos Trazo_f
let tfon = [];
// Array de objetos trazo_fig
let tfig = [];

//imagenes y mascaras
//array de imgs mascara figura
let mascarafigura=[];
let index_mfig;
// Array de imágenes de trazos figura
let imgs_trazos = [];
//objeto paleta
let paletas_color;

//array de imagenes para las paletas del fondo
let imagen_paleta_fondo=[];
//array de imagenes para las paletas de la figura
let imagen_paleta_figura=[];

// Carga de recursos antes de iniciar el sketch
function preload() {


  // Trazo del fondo
  trazofondo = loadImage('trazos/trazofondo_prueba3.png');
  // Mascara fondo
  mascaratfondo = loadImage('trazos/mascara_trazo0.png');

  // Recursos figura
  // URLs de las imágenes de trazo figura
  let urls = [
    "trazos/trazofigura_0.png",
    "trazos/trazofigura_01.png",
    "trazos/trazofigura_02.png",
    "trazos/trazofigura_03.png",
    "trazos/trazofigura_04.png",
    "trazos/trazofigura_05.png",
    "trazos/trazofigura_06.png",
    "trazos/trazofigura_07.png"
  ];

  // Carga de las imágenes de trazos figura en el array imgs_trazos
  for (let i = 0; i < urls.length; i++) {
    loadImage(urls[i], (img) => {
    // Redimensionar la imagen de la figura
      imgs_trazos.push(img); // Agregar la imagen cargada al array
    });
  }
//imaganes paleta de colores 

//figura
  // URLs de las imágenes de la paleta de colores de los trazos figura
  let urls_pfig = [
    "paleta/paleta_figura2.png",
    "paleta/paleta_figura3.jpg",
    "paleta/paleta_figura4f.jpg",
    "paleta/paleta_figura5f.png",
    "paleta/paleta_figura6f.png",
    "paleta/paleta_figura7f.png"
  ];

  // Carga de las imágenes de trazos figura en el array imagen_paleta_figura
  for (let j = 0; j < urls_pfig.length; j++) {
    loadImage(urls_pfig[j], (img) => {
   
      imagen_paleta_figura.push(img); // Agregar la imagen cargada al array
    });
  }

//fondo
  // URLs de las imágenes de la paleta de colores de los trazos fondo
  let urls_pfon = [
    "paleta/paleta_fondo.jpg",
    "paleta/paleta_fondo_2.jpg",
    "paleta/paleta_fondo_3.jpg",
    "paleta/paleta_fondo_4.jpg",
    "paleta/paleta_fondo_5.jpg",
    "paleta/paleta_fondo_6.jpg"
  ];

  // Carga de las imágenes de trazos figura en el array imagen_paleta_fondo
  for (let k = 0; k < urls_pfon.length; k++) {
    loadImage(urls_pfon[k], (img) => {
   
      imagen_paleta_fondo.push(img); // Agregar la imagen cargada al array
    });
  }

    // Carga de la máscara figura prueba
    //fondo
  // URLs de las imágenes de la mascara para la figura
  let urls_mascfig = [
    "trazos/mascara_figura3.jpg",
    "trazos/mascara_figura4.png",
    "trazos/mascara_figura5.jpg",
    "trazos/mascara_figura6.jpg",
    "trazos/mascara_figura7.jpg",
    "trazos/mascara_figura8.jpg"
  ];

  // Carga de las imágenes de trazos figura en el array imagen_paleta_fondo
  for (let l = 0; l < urls_mascfig.length; l++) {
    loadImage(urls_mascfig[l], (img) => {
   
      mascarafigura.push(img); // Agregar la imagen cargada al array
    });
  }

}


function setup() {
 //----MICROFONO-----
 createCanvas(windowWidth, windowHeight);
 audioContext = getAudioContext();
 mic = new p5.AudioIn(); // objeto que se comunica con la enrada de micrófono
 mic.start(startPitch); // se inicia el flujo de audio hay que pasarle el pitch para que funcione
 //----GESTOR----
 gestorAmp = new GestorSenial(AMP_MIN, AMP_MAX); // inicilizo en goestor con los umbrales mínimo y máximo de la señal
 gestorPitch= new GestorSenial(FREC_MIN,FREC_MAX);
 gestorAmp.f = AMORTIGUACION;
 //------MOTOR DE AUDIO-----
 userStartAudio(); // esto lo utilizo porque en algunos navigadores se cuelga el audio. Esto hace un reset del motor de audio (audio context)

 //obj palaeta de color
  paletas_color = new paleta(imagen_paleta_fondo,imagen_paleta_figura);  
 
  //background(255);
  //colorMode(HSB);
  //variable para elegir una mascara de figuras del array
  index_mfig=floor(random(mascarafigura.length));
}

function draw() {

  //cargo en vol la amplitud de la señal del mic cruda
  let vol= mic.getLevel();
  gestorAmp.actualizar(vol);//volumen filtrado
  haySonido = gestorAmp.filtrada > AMP_MIN; //var para saber si hay sonido

  diagrama_de_estados();
  //console.log(estado);
     if(IMPRIMIR){
      printData();
    }
     //para probar si funciona la eleccion al azar de las paletas opc 1 es la paleta de la figura y 2 del fondo
    //paletas_color.debug(2);
    //para debuggear la mascara de la figura
  //console.log(index_mfig);
     //variable para saber si en el fotograma anterior habia sonido esto siempre al final del draw
     antesHabiaSonido = haySonido; // guardo el estado del fotograma anteior
}
 


function diagrama_de_estados(){
  let inicioElSonido = haySonido && !antesHabiaSonido; // EVENTO inicio de sonido
  let finDelSonido = !haySonido && antesHabiaSonido; //EVENTO de fin de sonido;


if(estado == "agregar"){
  //cuando inicia el sonido
  if(inicioElSonido){ //Evento
     // if para limitar la cantidad de veces que se crean los trazos del fondo
    if(cantidad <cantidad_max){
      /*el 3er parametro son para contar la cantidad de veces que saltar al principio se activa 
      y el 4to es para limitar la cantidad de vueltas por trazo para que no entren en loop*/
    tfon[cantidad] = new Trazo_f(trazofondo,paletas_color,0,20);
     //establece una saturacion cada vez que se corta e inicia de nuevo un sonido
    tfon[cantidad].SetBrillo(gestorAmp.filtrada);
  }
    tfig[cantidad]= new trazo_fig(mascarafigura[index_mfig],imgs_trazos,paletas_color,gestorAmp.filtrada);
    //cada vez que se corta e inicia el sonido de nuevo se genera una posicion nueva
    tfig[cantidad].saltaralprincipio();
    cantidad++;
  }
  

  

 //si la cantidad supera el maximo de trazos pasa al siguiente estado

  if(cantidad >cantidad_max){
    //estado = "grosor";
  }
  
  if(haySonido){ //Estado
  // aca se podria cambiar la posicion en funcion al pitch
  //crear trazos figura cuando se inicio el sonido//
  if(cantidad <cantidad_max){
    for(let k = 0; k<cantidad;k++){
      tfon[k].dibujar_regulares();
      //tfon[k].dibujar_irregulares(5);
      tfon[k].movertrazo_f();
      //cambiar tamaño con volumen
      tfon[k].setTam(gestorAmp.filtrada);
      //cambiar velocidad del trazo
      tfon[k].SetVelocidad(gestorAmp.filtrada);
      tfon[k].setSerpenteo(gestorAmp.filtrada);
    }
     }

     for(let l=0; l<cantidad;l++){
      //esto cambia el tamaño de los trazos
      tfig[l].actualizar_conamp(gestorAmp.filtrada);
      tfig[l].dibujar();
      tfig[l].mover();
    }
  }

  if(finDelSonido){//Evento
    //empieza el contador de tiempo
    marca = millis();
  }
  //si estoy en silencio mas tiempo que el tiempo limite paso al siguiente estado
  if(!haySonido){ //Estado SILENCIO
    let ahora = millis();
    if(ahora > marca + tiempoLimiteAgregar){
      estado = "grosor";
      marca = millis();
    }
  }


}else if (estado == "grosor"){

  if(inicioElSonido){ //Evento
  }

  if(haySonido){ //Estado

  }

  if(finDelSonido){//Evento
    marca = millis();
  }

  if(!haySonido){ //Estado SILENCIO
    let ahora = millis();
    if(ahora > marca + tiempoLimiteGrosor){

      estado = "color";
      marca = millis();
    }
  }

}else if (estado == "color"){

  if(inicioElSonido){ //Evento
   //aca se podria actualizar el color
  }

  if(haySonido){ //Estado
 
  }

  if(finDelSonido){//Evento
    marca = millis();
  }
  
  if(!haySonido){ //Estado SILENCIO
    let ahora = millis();
    if(ahora > marca + tiempoLimiteColor){

      estado = "fin";
      marca = millis();
    }
  }
  //si hago un sonido de 3 seg se reinicia 
}else if (estado == "fin"){

  if(inicioElSonido){ //Evento
    marca = millis();
  }

  if(haySonido){ //Estado

    let ahora = millis();
    if(ahora > marca + tiempoLimiteFin){
      estado = "reinicio";
      marca = millis();
    }
  }

  if(finDelSonido){//Evento
  }
  
  if(!haySonido){ //Estado SILENCIO
  }
  
}else if (estado == "reinicio"){

  cantidad = 0;
  estado = "agregar";
  marca = millis();
}
//console.log(estado);
//console.log(cantidad);
}




function printData(){
background(255);
ellipse(width/2, height-amp * 300, 30, 30);
gestorAmp.dibujar(100, 500);
gestorPitch.dibujar(100, 250);
}

// ---- Pitch detection ---
function startPitch() {
  pitch = ml5.pitchDetection(model_url, audioContext , mic.stream, modelLoaded);
}

function modelLoaded() {
  getPitch();
}

function getPitch() {
  pitch.getPitch(function(err, frequency) {
    if (frequency) {

      gestorPitch.actualizar(frequency);    
      //console.log(frequency);
    } 
    getPitch();
  })
}
