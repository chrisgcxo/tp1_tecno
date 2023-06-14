//to do list//
//probar con diferentes mascaras y tipos de trazos//
/*hacer algo con el fondo para que no se acumulen tantos trazos(bajar la opacidad prograsivamente
o limitar la cantidad de vueltas que dan los caminantes*/
//hacer otro grupo de trazos mas irregulares//
//hacer la paleta de colores//
class Trazo_f {
  constructor(quetrazo,paleta) {
    //variable para elegir el trazo//
    this.quetrazo = quetrazo;
    //tamaño trazos
       // Tamaño aleatorio del trazo
    this.tamaño = random(15, 35);
    //this.quetrazo.resize(25,25);
    //variable para levantar la clase paleta
    this.paleta=paleta;
    //vars movimiento//
    this.posX=random(width);
    this.posY=height;
    this.dx;
    this.dy;
    this.vel = random(4,10);
    //angulos caminantes
    this.anguloInicial=270;
    this.angulo;
    //angulos rotacion imgs
    this.anguloimg;
    //vars cambiar color//
    //velocidad mouse//
    this.difX;
    this.difY;
    //HSBA
    this.colorandom=this.paleta.darUnColor_fondo();
    //sonido
    this.AMP_MIN=0.02;
     this.haysonido=false;
  } 
//funcion para gestionar brillo y saturacion y opacidad con velocidad del mouse//
velocidad_mouse() {
  let velocidadX = abs(mouseX - pmouseX);
  let velocidadY = abs(mouseY - pmouseY);
  // Modificar la variable "valor" en función de la velocidad del mouse
  if (velocidadX > 200 || velocidadY > 200) {
    //capaz acá se pueden tirar otros trazos mas cortos//
  } else {
  }
}

  
    movertrazo_f() {
      //variable para saber si hay sonido
      this.haysonido=amp>AMP_MIN;
       // Mapear el ángulo en función de la posición de la posicion x del trazo en el mouse
  let anguloInicial_fig = 270;

  //map para el angulo de los caminantes
  this.angulo = map(this.posX, 0, width, anguloInicial_fig - 90, anguloInicial_fig + 90);
// map para el rotate de las imgs
this.anguloimg= map(this.posX, 0, width,-90, +90);

  // dirección en x
  this.dx = this.vel * cos(radians(this.angulo));
  // dirección en y
  this.dy = this.vel * sin(radians(this.angulo));

  let variacionSerpenteo =1;
  // variables de movimiento
  this.posY = this.posY + this.dy+random(-variacionSerpenteo,+variacionSerpenteo);
  this.posX = this.posX + this.dx+random(-variacionSerpenteo,+variacionSerpenteo);

  // cuando la posicion en y pasa los -80, resetea la posicion
  if (this.posY > height || this.posY>width) {
    this.saltaralprincipio_f();
  }
  //si el angulo es menor a tanto los angulos de la imagen son tantos
  if(this.posX>width/3){
  }
   
    }

             // espacio toroidal//
             saltaralprincipio_f() {
              // resetea el trazo a afuera de la pantalla abajo//
              this.posY=height;
              // le asigna un color random al siguiente trazo que sale desde abajo//
              this.randomcol = random(200, 360);
              // le asigna una posicion en x al siguiente trazo que sale desde abajo//
              this.posX= random(width);
              this.colorandom=this.paleta.darUnColor_fondo();
              // Cambiar tamaño del trazo
               this.tamaño = random(15, 35);
                            }

    dibujar_regulares(){
      push();
      tint(this.colorandom); 
      imageMode(CENTER);
      translate(this.posX,this.posY);
      //esto es el map para girar la imagen del trazo;
      rotate(radians(this.anguloimg));
      image(this.quetrazo,0,0, this.tamaño, this.tamaño); 
      pop();
    }

    
  }
