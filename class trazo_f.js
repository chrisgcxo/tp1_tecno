class Trazo_f_regular{
  constructor(quetrazo,paleta,maxVueltas) {
    //variable para elegir el trazo//
    this.quetrazo = quetrazo;
    //tamaño trazos
   // Tamaño aleatorio del trazo
    this.tamaño =15;
    //variable para levantar la clase paleta
    this.paleta=paleta;
    //vars movimiento//
    this.escalaruido=5;
    this.posY=height;
    this.dx;
    this.dy;
    this.vel =random(4,6);

  // Generar posición X con distribución gaussiana
  const meanX = width / 2; // Media de la distribución
  const stdDevX = width / 8; // Desviación estándar de la distribución
  this.posX = randomGaussian(meanX, stdDevX);


    //angulos caminantes
    this.anguloInicial_fig=270;
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
        //saltar al principio
    //cantidad de vueltas que dan los caminantes
    this.vueltas=0;
    this.activaciones=0;
    this.maxVueltas=maxVueltas;
    this.pasoeltiempo; 
    this.saltar_principio_timer =100;
    //Intervalo mínimo en milisegundos entre saltos al principio
    this.saltar_principio_intervalo = 500; 
  }  
  

    movertrazo_f() {
  //map para el angulo de los caminantes
  const ruido = noise(this.posX * 0.01) * 2 - 1; // Valor de ruido entre -1 y 1
  const anguloRuido = ruido *this.escalaruido; // escala de ruido
  this.angulo = map(this.posX, 0, width, this.anguloInicial_fig - 90, this.anguloInicial_fig + 90) + anguloRuido;
  
// map para el rotate de las imgs hay que probar si es mejor con 0 como está
this.anguloimg= map(this.posX,0, width,-90,+90);

  // dirección en x
  this.dx = this.vel * cos(radians(this.angulo));
  // dirección en y
  this.dy = this.vel * sin(radians(this.angulo));

  // variables de movimiento
  this.posY = this.posY + this.dy;
  this.posX = this.posX + this.dx;
  //esto es para poder  generar mas variacion en los trazos irregulares
  


  //espacio toroidal
  if (this.posY > height || this.posX>width || this.posX<0) {
    this.saltaralprincipio_f();
  }

    } 
    //función para limitar el saltar al principio
    limit_saltar_tf(){
  //timer saltar al principio
  this.pasoeltiempo=millis() > this.saltar_principio_timer + this.saltar_principio_intervalo;
  if(this.pasoeltiempo){
    this.saltar_principio_timer = millis();
    return true;
  }else{
    return false;
  }
    }
             // espacio toroidal//
             saltaralprincipio_f() {
              this.escalaruido=5;
              //si las cantidad de vueltas que dieron los trazos es menor a la cantidad maxima y limit saltar devuelve true
              if (this.limit_saltar_tf()){
              // le asigna una posicion en x al siguiente trazo que sale desde abajo//
              //this.posX= random(width);
              this.posX=random(width);
              // resetea el trazo a afuera de la pantalla abajo//
              this.posY=height;
              //asignar color nuevo
              this.colorandom=this.paleta.darUnColor_fondo();
              this.hue_f=this.colorandom.hue;
              this.saturation_f=this.colorandom.saturation;
              this.brightness_f=this.colorandom.brightness;
               this.saltar_principio_timer = millis();
              this.vueltas++;
              }
                }

//si las pongo en empezó el sonido se ejecutan una vez, cuando corta e inicia el sonido
//si las pongo en hay sonido se ejecutan contantemente
//cambiar el tamaño en funcion a la amplitud
    setTam(ampt){
      //no se porque pero con la amplitud me funciona
      this.tamaño=map(ampt,AMP_MIN,AMP_MAX,15,17);
    }
    //elegir una opacidad nueva cara vez que empieza el sonido
   setAlpha(ampa){
    this.alpha_f=map(ampa,AMP_MIN,AMP_MAX,0.7,1);
   }
       //elegir una saturación  nueva cara vez que empieza el sonido
       SetBrillo(ampb){
        this.brightness_f=map(ampb,AMP_MIN,AMP_MAX,-10,+10);
       }
       SetSat(amps){
        this.saturation_f=map(amps,AMP_MIN,AMP_MAX,180,255);
       }
       //esto es para modificar la velocidad del caminante
       SetVelocidad(ampv){
      this.vel=this.vel*map(ampv,AMP_MIN,AMP_MAX,2,5);
       }
   //funcion para aumentar el serpenteo del trazo   
    setEscalaRuido(pitchE){
    this.escalaruido=map(pitchE,0,1,5,30);
    }



    dibujar_regulares(){
      // Calcular la distancia desde el centro de la pantalla
    let distanciaCentro = dist(this.posX,this.posY, width / 2, height / 2);
    //mapear la opacidad
    this.alpha_f=map(distanciaCentro, 0, height / 2, 1, 0.6);
      push();
      tint(this.hue_f, this.saturation_f, this.brightness_f, this.alpha_f);
      imageMode(CENTER);
      translate(this.posX,this.posY);
      //esto es el map para girar la imagen del trazo;
      rotate(radians(this.anguloimg));
      image(this.quetrazo,0,0, this.tamaño, this.tamaño); 
      pop();
    }
  }
