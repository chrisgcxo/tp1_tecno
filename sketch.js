//to do list
//gestor de estados

//----CONFIGURACION-----
//amplitud minima y maxima
let AMP_MIN = 0.01; // umbral mínimo de sonido qiu supera al ruido de fondo
let AMP_MAX = 0.2 // amplitud máxima del sonido
//pitch minimo y maximo
let FREC_MIN = 100;
let FREC_MAX = 400;
//amortiguacion de ruido
let AMORTIGUACION = 0.9; // factor de amortiguación de la señal
//mostrar grafico para debug
let IMPRIMIR = true;

//variables estados
let marca;
let tiempoLimiteAgregar = 3000;
let tiempoLimiteGrosor = 3000;
let tiempoLimiteColor = 3000;
let tiempoLimiteFin = 3000;

//----MICROFONO----
let mic;
let audioContext;

//-----AMPLITUD-----
let amp; // variable para cargar la amplitud (volumen) ee la señal de entrada del mic


//----GESTOR AMPITUD----
let gestorAmp;

//pitch del sonido (tono)
let pitch;
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
//variable para indicar cantidad de objetos
let cantidad=0;

// Mascara figura
let mascarafigura;
// Array de imágenes de trazos figura
let imgs_trazos = [];
//pgraphics
let pgf;
//objeto paleta
let paletas_color;
//imagen paleta
let imagen_paleta_fondo;

// Carga de recursos antes de iniciar el sketch
function preload() {
  //imagen paleta
  imagen_paleta_fondo=loadImage('paleta/paleta_fondo.jpg');
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
  pgf = createGraphics(windowWidth, windowHeight);
  // Fondo
  //trazofondo.mask(mascaratfondo);
 

  // Objetos Trazo_f
  for (let i = 0; i < 10; i++) {
    let trazo_f = new Trazo_f(trazofondo,paletas_color);
    tfon.push(trazo_f);
  }
  // Objetos trazo_fig
  for (let j = 0; j < 10; j++) {
    // Generar un índice aleatorio dentro del rango de índices de imgs_trazos
    let trazo_fi = new trazo_fig(mascarafigura,imgs_trazos,paletas_color);
    tfig.push(trazo_fi);
  }
  background(255);
  //colorMode(HSB);
}

function draw() {
  gestorAmp.actualizar(mic.getLevel());  
  amp = gestorAmp.filtrada;
  //cargo en vol la amplitud de la señal del mic cruda
  let vol= mic.getLevel();
  gestorAmp.actualizar(vol);//volumen filtrado

  haySonido = amp > AMP_MIN; //var para saber si hay sonido

  let inicioElSonido = haySonido && !antesHabiaSonido; // EVENTO inicio de sonido
  let finDelSonido = !haySonido && antesHabiaSonido; //EVENTO de fin de sonido;

  //si empezo el sonido solo sucede una vez en un fotograma porque es un evento; 
  if(inicioElSonido){
   tfig[0].saltaralprincipio();
  }
  
  if(haySonido){  // mientras hay sonido constante sucede constantemente porque es un   ESTADO
 //trazos fondo 
 for (let i = 0; i < tfon.length; i++) {
  tfon[i].dibujar_regulares();
  tfon[i].movertrazo_f();
}


//trazos figura
for (let j = 0; j < tfig.length; j++) {
 tfig[j].dibujar();
 tfig[j].mover();
}
  }
 
     //Mostrar el pgraphic//
     image(pgf, 0, 0, width, height);

     if(!IMPRIMIR){
      printData();
    }
    diagrama_de_estados(cantidad,estado,inicioElSonido,finDelSonido);
    console.log(estado);
     //variable para saber si en el fotograma anterior habia sonido
     antesHabiaSonido = haySonido; // guardo el estado del fotograma anteior
}
 
function diagrama_de_estados(cantidad,estado,inicioElSonido,finDelSonido){
  if(estado == "agregar"){
    if(inicioElSonido){ //Evento
      cantidad++;
      //console.log("nuevo rectangulo");
    }

    if(cantidad > 10){
      estado = "grosor";
    }
    
    if(haySonido){ //Estado
    }

    if(finDelSonido){//Evento
      marca = millis();
    }
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

}



//cuando dibujo no se muestra la variable filtrada no se pq pero creo que si está siendo filtrada
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
