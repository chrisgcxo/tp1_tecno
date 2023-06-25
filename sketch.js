//to do list
//tengo dos opciones o dibujo una de las dos cosas en un pgraphic o intento limitarlos como estoy haciendo

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
let IMPRIMIR = true;

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
// Array de objetos Trazo_f
let tfon = [];
// Array de objetos trazo_fig
let tfig = [];

// Mascara figura
let mascarafigura;
// Array de imágenes de trazos figura
let imgs_trazos = [];
//pgraphics
//objeto paleta
let paletas_color;
//imagen paleta
let imagen_paleta_fondo;

// Carga de recursos antes de iniciar el sketch
function preload() {
  //imagen paleta
  imagen_paleta_fondo=loadImage('paleta/paleta_fondo_2.jpg');
  imagen_paleta_figura=loadImage('paleta/paleta_figura2.png');
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

  // Carga de la máscara figura
  mascarafigura = loadImage('trazos/mascara_figura4.png');

  // Carga de las imágenes de trazos figura en el array imgs_trazos
  for (let i = 0; i < urls.length; i++) {
    loadImage(urls[i], (img) => {
    // Redimensionar la imagen de la figura
      imgs_trazos.push(img); // Agregar la imagen cargada al array
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

  //objeto paleta
  paletas_color = new paleta(imagen_paleta_fondo,imagen_paleta_figura);
  // Fondo
  //trazofondo.mask(mascaratfondo);
 
  background(255);
  colorMode(HSB);
}

function draw() {
  //cargo en vol la amplitud de la señal del mic cruda
  let vol= mic.getLevel();
  gestorAmp.actualizar(vol);//volumen filtrado
  haySonido = gestorAmp.filtrada > AMP_MIN; //var para saber si hay sonido

  diagrama_de_estados();
  //console.log(estado);
     if(!IMPRIMIR){
      printData();
    }


     //variable para saber si en el fotograma anterior habia sonido
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
    tfon[cantidad] = new Trazo_f(trazofondo,paletas_color,0,5);
  }
    tfig[cantidad]= new trazo_fig(mascarafigura,imgs_trazos,paletas_color,amp);
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
      tfon[k].movertrazo_f();
      //cambiar tamaño con volumen
      tfon[k].setTam(gestorAmp.filtrada);
      //cambiar la saturacion con el amp;
      tfon[k].setBrillo(gestorAmp.filtrada);
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
