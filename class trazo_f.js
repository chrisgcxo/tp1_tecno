//to do list//
//probar con diferentes mascaras y tipos de trazos//
/*hacer algo con el fondo para que no se acumulen tantos trazos(bajar la opacidad prograsivamente
o limitar la cantidad de vueltas que dan los caminantes*/
//hacer otro grupo de trazos mas irregulares//
//hacer la paleta de colores//
class Trazo_f {
  constructor(quetrazo) {
    //variable para elegir el trazo//
    this.quetrazo = quetrazo;
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
    this.randomcol = random(200, 360);
    this.brillo=200;
    this.saturacion=200;
  } 
//funcion para gestionar brillo y saturacion y opacidad con velocidad del mouse//
darcolor() {
  // Brillo y opacidad
  this.brillo =50;
  this.saturacion=40;
  let velocidadX = abs(mouseX - pmouseX);
  let velocidadY = abs(mouseY - pmouseY);
  
  // Modificar la variable "valor" en función de la velocidad del mouse
  if (velocidadX > 200 || velocidadY > 200) {
    //capaz acá se pueden tirar otros trazos mas cortos//
    this.saturacion += 50; // Aumentar el valor si la velocidad es alta
    this.dibujar_irregulares();
  } else {
   this.saturacion-= 1; // Disminuir el valor si la velocidad es baja
  }
// Restringir el valor dentro de un rango específico (opcional)
  this.brillo=constrain(this.brillo, 0, 255);
}

  
    movertrazo_f() {
       // Mapear el ángulo en función de la posición de la posicion x del trazo en el mouse
  let anguloInicial_fig = 270;

  //map para el angulo de los caminantes
  this.angulo = map(this.posX, 0, width, anguloInicial_fig - 90, anguloInicial_fig + 90);
// map para el rotate de las imgs
this.anguloimg= map(this.posX, 0, width,-90, 90);
  // dirección en x
  this.dx = this.vel * cos(radians(this.angulo));
  // dirección en y
  this.dy = this.vel * sin(radians(this.angulo));

  // variables de movimiento
  this.posY = this.posY + this.dy;
  this.posX = this.posX + this.dx;

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
                            }

    dibujar_regulares(){
      push();
      tint(this.randomcol,this.saturacion, this.brillo,0.20); 
      imageMode(CENTER);
      translate(this.posX,this.posY);
      //esto es el map para girar la imagen del trazo;
      rotate(radians(this.anguloimg));
      image(this.quetrazo,0,0); 
      pop();
    }

dibujar_irregulares(){
push();
//tint(this.randomcol,this.saturacion, this.brillo,0.5); 
//imageMode(CENTER);
//translate(this.posX,this.posY);
//rotate(radians(this.anguloimg));
//las otras imagenes//
noStroke();
fill(0);
ellipse(this.posX+random(50),this.posY+random(10),20,20);
pop();
  }
    
  }
