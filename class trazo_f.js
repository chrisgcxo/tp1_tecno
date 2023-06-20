//to do list//
//probar con diferentes mascaras y tipos de trazos//
/*hacer algo con el fondo para que no se acumulen tantos trazos(bajar la opacidad prograsivamente
o limitar la cantidad de vueltas que dan los caminantes*/
//hacer otro grupo de trazos mas irregulares//
//hacer una funcion para actualizar saturacion y
class Trazo_f {
  constructor(quetrazo,paleta,vueltas,max_vueltas) {
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
    this.posX2;
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

    //HSBA
    this.colorandom=this.paleta.darUnColor_fondo();
    this.hue_f=this.colorandom.hue;
    this.saturation_f=this.colorandom.saturation;
    this.brightness_f=this.colorandom.brightness;
    this.alpha_f =this.colorandom.alpha;
    //cantidad de vueltas que dan los caminantes
    this.vueltas=vueltas;
    this.max_vueltas=max_vueltas;
  }  
 

    movertrazo_f() {
      //variable para saber si hay sonido
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

  let variacionSerpenteo =2;
  // variables de movimiento
  this.posY = this.posY + this.dy;
  this.posX = this.posX + this.dx+random(-variacionSerpenteo,+variacionSerpenteo);

  // cuando la posicion en y pasa los -80, resetea la posicion
  if (this.posY > height || this.posY>width) {
    this.saltaralprincipio_f();
  }

    }

             // espacio toroidal//
             saltaralprincipio_f() {
              if (this.vueltas<this.max_vueltas){
              // resetea el trazo a afuera de la pantalla abajo//
              this.posY=height;
              // le asigna un color random al siguiente trazo que sale desde abajo//
              this.randomcol = random(200, 360);
              // le asigna una posicion en x al siguiente trazo que sale desde abajo//
              this.posX= random(width);
              this.colorandom=this.paleta.darUnColor_fondo();
              // Cambiar tamaño del trazo con pitch o amp
               this.setTam(gestorAmp.filtrada);
               //cambiar opacidad con pitch
               this.setOpacidad (gestorPitch.filtrada);
               this.vueltas++;
              }
                }
     //con esto se puede actualizar en tiempo real pero no queda muy bien quizas regulando el 3er y cuarto parametro si    
    //aca mismo se puede actualizar la saturacion y el brillo de cualquiera de las dos maneras
     actualizar_conpitch (pitch){
      this.alpha_f=map(pitch,0,1,0,255);
      }

    setTam(tam){
      this.tamaño=map(tam,0,1,15,35);
    }
    //cambiar opacidad con pitch
    setOpacidad (valor){
      this.alpha_f = map(valor, 0, 1, 10, 255);
  }

    dibujar_regulares(){
      push();
      tint(this.hue_f, this.saturation_f, this.brightness_f, this.alpha_f);
      imageMode(CENTER);
      translate(this.posX,this.posY);
      //esto es el map para girar la imagen del trazo;
      rotate(radians(this.anguloimg));
      image(this.quetrazo,0,0, this.tamaño, this.tamaño); 
      pop();
      console.log(this.alpha_f);
    }

  }
