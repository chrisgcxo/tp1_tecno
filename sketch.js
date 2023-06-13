//to do list
//implementar sonido
//transformar las interacciones a sonido
//gestor de estados


// Array de objetos Trazo_f
let tfon = [];
// Array de objetos trazo_fig
let tfig = [];
// Mascara figura
let mascarafigura;
// Array de imágenes de trazos figura
let imgs_trazos = [];
//pgraphics
let pgf;
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
  //noCursor();
  colorMode(HSB);
  createCanvas(windowWidth, windowHeight);
  pgf = createGraphics(windowWidth, windowHeight);
  // Fondo
  //trazofondo.mask(mascaratfondo);
 

  // Objetos Trazo_f
  for (let i = 0; i < 10; i++) {
    let trazo_f = new Trazo_f(trazofondo);
    tfon.push(trazo_f);
  }
  // Objetos trazo_fig
  for (let j = 0; j < 10; j++) {
    // Generar un índice aleatorio dentro del rango de índices de imgs_trazos
    let trazo_fi = new trazo_fig(mascarafigura,imgs_trazos);
    tfig.push(trazo_fi);
  }

}

function draw() {

for (let i = 0; i < tfon.length; i++) {
    push();
    tfon[i].dibujar_regulares();
    tfon[i].movertrazo_f();
    tfon[i].darcolor();
    pop();
  }



  for (let j = 0; j < tfig.length; j++) {
    push();
    tfig[j].dibujar();
    tfig[j].mover();
    pop();
  }
     // Mostrar el pgraphic//
     image(pgf, 0, 0, width, height);
     fill(0);
     rect(width/2,height/2,50,50);
}

