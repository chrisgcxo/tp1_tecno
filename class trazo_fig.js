//to do list//
//solucionar rotación de las imagenes?//
//la opacidad progresivamente a medida que se hacen largos o a medida que se acercan a los bordes de la pantalla//
//hacer algo para determinar la posicion en funcion al pitch
//levantar de varias mascaras al azar para cambiar la mascara en cada ejecucion
class trazo_fig {
  constructor(imagen,trazo,paleta) {
    //margenes
    this.margen_tfig=10;
    //movimiento
    this.posX_fig=random(this.margen_tfig,width-this.margen_tfig);
    this.posY_fig=random(this.margen_tfig,height-this.margen_tfig);
    this.dx_fig;
    this.dy_fig;
    this.vel_fig = random(2, 7);
    this.angulo_fig;
    //color
    this.paleta=paleta;
    //paleta fondo
    this.colorandom2=this.paleta.darUnColor_fondo();
    //HSBA
    this.hue_fig=random(360);
    this.brillo_fig=random(360);
    this.saturacion_fig=random(360);
    this.opacidad = 1;
    //color figura
    this.color_fig = color(this.hue_fig,this.brillo_fig,this.saturacion_fig,this.alfa_fig);
    this.saltar_principio_timer = 0;
    //Intervalo mínimo en milisegundos entre saltos al principio
    this.saltar_principio_intervalo = 500; 
    //enmascarado//
    this.imagen= imagen;
    this.x_mascara;
    this.y_mascara;
    // trazo
     // Cambiar tamaño del trazo
     this.tam= random(15, 35);
    //largo inicial trazo
     this.largo_trazo = 0.05;
      
  // Asignar un índice aleatorio al array de imagenes para los trazos
  this.trazo = trazo;
  this.cual = floor(random(this.trazo.length));
  this.trazo = this.trazo[this.cual];
  }

  //funciones y metodos//

  //metodos 
  // metodo  para verificar si los trazos están en los píxeles oscuros de la imagen de mascara
    pertenece_a_la_forma() {
      let x_en_img = floor(map(this.posX_fig, 0, width, 0, this.imagen.width));
      let y_en_img = floor(map(this.posY_fig, 0, height, 0, this.imagen.height));
      let estepixel = this.imagen.get(x_en_img, y_en_img);

      //manda true cada vez que el brillo de un pixel de la img de mascara es menor a 50//
      return brightness(estepixel) <50; 
    }

    //metodo para verificar si se sale de los margenes  de la pantalla
    esta_en_margenes(){
      return (
        this.posX_fig > this.margen_tfig &&
        this.posX_fig < width - this.margen_tfig &&
        this.posY_fig > this.margen_tfig &&
        this.posY_fig < height - this.margen_tfig
      );
    }

   //levanta una imagen al azar del array de imgs//
 elegirIndiceAleatorio() {
  this.cual = floor(random(this.trazo.length));
}

    //funciones 

//funcion mover trazo//
  mover() { 
     //variable para el maximo del largo de un trazo//
    let max_largo_trazo = 0.05;
    // Restringir largo_trazo dentro del rango permitido//
    this.largo_trazo = constrain(this.largo_trazo, 0,max_largo_trazo);
    // Incrementar o decrementar largo_trazo en función de mouseX//
    this.largo_trazo+= map(mouseX, 0, width, -1, 1);// no si sirve tanto este map cuando aplicamos el sonido
    this.largo_trazo = constrain(this.largo_trazo, 0,max_largo_trazo);
    //se verifica si pasó el intervalo mínimo desde el último salto al principio antes de llamar a la función
    if (millis() > this.saltar_principio_timer + this.saltar_principio_intervalo) {
      if (this.largo_trazo >= max_largo_trazo || !this.pertenece_a_la_forma()) {
        this.saltaralprincipio();
        this.saltar_principio_timer = millis();
      }
    } 

    //angulos
    let anguloInicial=270;
    //map para la distribucion de trazo
    this.angulo_fig = map(this.posX_fig, 0, width, anguloInicial - 90,anguloInicial + 90);
    //map para el rotate de las imgs
this.anguloimg2= map(this.posX_fig, this.anguloInicial, width, -90, +90);

    //direccion en x
    this.dx_fig = this.vel_fig * cos(radians(this.angulo_fig));
    //direccion en y
    this.dy_fig = this.vel_fig * sin(radians(this.angulo_fig));
    
    let variacionSerpenteo=1;
    //variables de movimiento//
    this.posY_fig = this.posY_fig + this.dy_fig+random(-variacionSerpenteo,+variacionSerpenteo);
    this.posX_fig = this.posX_fig + this.dx_fig+random(-variacionSerpenteo,+variacionSerpenteo);   
  }


  //funcion volver al estado inicial del trazo(espacio toroidal)//
  saltaralprincipio() {
 //------------------ACA DEBERIA LLAMAR A LA FUNCION PARA SETEAR LA POSX 
    //sector arriba eje y
    if (mouseY >= height/2+50) {
      // Generar trazos al azar desde el punto cero de la pantalla a la mitad (izquierda)
      this.posX_fig = random(0, width/3+100);
    } 
    //sector abajo eje y
    else if (mouseY < height/2-50) {
      // Generar trazos al azar desde la mitad hasta el ancho de la pantalla (derecha)
      this.posX_fig = random(width/3*2-100, width);
    }
    //sector medio eje ydiam
     else{
      //generar trazos al azar en el sector del medio de la pantalla
      this.posX_fig = random(width/3*2-100, width/3+100);
    }

    //dar posicion al azar en y
    this.posY_fig=random(this.margen_tfig,height-this.margen_tfig);
        // variable para cambiar a una imagen aleatoria dentro del array de imgs// 
        this.elegirIndiceAleatorio();
        this.tamaño = random(15, 35);
  }
   
//esto es para cambiar el tamaño en funcion al sonido
actualizar_conamp (amplitud){
this.tam=map(amplitud,AMP_MIN,AMP_MAX,15,25);
}



//esto no se para que sirve creo que no hace nada
/*cambiartam(tam){
  this.tamaño=tam;
}*/


  dibujar() {
// Dibujar el trazo en el lienzo gráfico si pertenece a la forma y no está fuera de los margenes y si hay sonido(ESTADO)//
if (this.esta_en_margenes() && this.pertenece_a_la_forma()) {
  push();
  //trazos con imgs//
  tint(this.hue_fig,this.brillo_fig,this.saturacion_fig,this.opacidad);
  rotate(radians(this.anguloimg2));
  image(this.trazo,this.posX_fig,this.posY_fig,this.tam,this.tam);
  pop();
}
//esto es para generar trazos negros
/*else if(!this.pertenece_a_la_forma()){
  push();
  pgf.tint(this.colorandom2);
  pop();
}*/
  }


}

