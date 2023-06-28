//to do list//
//probar con diferentes mascaras y tipos de trazos//
/*hacer algo con el fondo para que no se acumulen tantos trazos(bajar la opacidad prograsivamente o dibujarlos en un pgraphics*/
//pensar si combiene esto :hacer otro grupo de trazos mas irregulares en los que se pueda variar mas el serpenteo//
//podria hacer lo que hice con la paleta para el trazo de la figura pero a raiz del x del trazo
//revisar tamaño, opacidad, saturacion, brillo etc
//podría poner mas variedad de trazos
//terminar trazos irregulares
class Trazo_f {
  constructor(quetrazo,paleta,maxVueltas) {
    //variable para elegir el trazo//
    this.quetrazo = quetrazo;
    //tamaño trazos
   // Tamaño aleatorio del trazo
    this.tamaño = random(15, 35);
    this.tamaño2 = random(8, 10);
    //variable para levantar la clase paleta
    this.paleta=paleta;
    //vars movimiento//
    this.posX=random(width);
    this.posY=height;
    this.dx;
    this.dy;
    //serpenteo
    this.variacionSerpenteo=1;
    this.variacionSerpenteo2=random(50,10);
    this.vel =2;
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
    this.saltar_principio_timer = 0;
    //Intervalo mínimo en milisegundos entre saltos al principio
    this.saltar_principio_intervalo = 500; 
  }  
  

    movertrazo_f() {
  //map para el angulo de los caminantes
  this.angulo = map(this.posX, 0, width, this.anguloInicial_fig - 90, this.anguloInicial_fig + 90);
// map para el rotate de las imgs hay que probar si es mejor con 0 como está
this.anguloimg= map(this.posX,0, width,-90,+90);

  // dirección en x
  this.dx = this.vel * cos(radians(this.angulo));
  // dirección en y
  this.dy = this.vel * sin(radians(this.angulo));

  // variables de movimiento
  this.posY = this.posY + this.dy;
  this.posX = this.posX + this.dx+random(-this.variacionSerpenteo,+this.variacionSerpenteo);
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
              //si las cantidad de vueltas que dieron los trazos es menor a la cantidad maxima y limit saltar devuelve true
              if (this.activaciones< this.maxVueltas && this.limit_saltar_tf()){
              // le asigna una posicion en x al siguiente trazo que sale desde abajo//
              this.posX= random(width);
              // resetea el trazo a afuera de la pantalla abajo//
              this.posY=height;
           
              //asignar color nuevo
              this.colorandom=this.paleta.darUnColor_fondo();
              this.hue_f=this.colorandom.hue;
              this.saturation_f=this.colorandom.saturation;
              this.brightness_f=this.colorandom.brightness;
               this.saltar_principio_timer = millis();
               this.activaciones++;
              }
                }

   

//si las pongo en empezó el sonido se ejecutan una vez, cuando corta e inicia el sonido
//si las pongo en hay sonido se ejecutan contantemente
//cambiar el tamaño en funcion a la amplitud
    setTam(ampt){
      this.tamaño=map(ampt,AMP_MIN,AMP_MAX,15,18);
      this.tamaño2=map(ampt,AMP_MIN,AMP_MAX,8,10);
    }
    //elegir una opacidad nueva cara vez que empieza el sonido
   setAlpha(ampa){
    this.alpha_f=map(ampa,AMP_MIN,AMP_MAX,0.7,1);
   }
       //elegir una saturación  nueva cara vez que empieza el sonido
       SetBrillo(ampb){
        this.brightness_f=map(ampb,AMP_MIN,AMP_MAX,180,255);
       }
       SetSat(amps){
        this.saturation_f=map(amps,AMP_MIN,AMP_MAX,180,255);
       }
       //esto es para modificar la velocidad del caminante
       SetVelocidad(ampv){
      this.vel=map(ampv,AMP_MIN,AMP_MAX,2,5);
       }
   //funcion para aumentar el serpenteo del trazo
   setSerpenteo(amps){
    this.variacionSerpenteo2=map(amps,AMP_MIN,AMP_MAX,10,50);
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

    //esto es una prueba quiero hacer trazos que se muevan mas irregularmente
    dibujar_irregulares(longitudMaxima){
      push()
    ellipseMode(CENTER);
    noStroke();
    fill(this.hue_f, this.saturation_f, this.brightness_f, this.alpha_f);
    ellipse(this.posX,this.posY,this.tamaño2,this.tamaño2);
     // Verificar la longitud del trazo se podría pasar por fuera de la funcion un argumento dinamico para limitar la longitud
  // Restablecer la posición inicial o realizar alguna acción adicional
 this.saltaralprincipio_f();
      pop()
    }
  }
