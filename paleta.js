
class paleta {
  constructor(imagenPaleta_fondo, imagenPaleta_figura) {
    this.imagenPaleta_fondo = this.elegirImagenAleatoria(imagenPaleta_fondo);
    this.imagenPaleta_figura = this.elegirImagenAleatoria(imagenPaleta_figura);
  }
  
  // Paleta fondo
  darUnColor_fondo() {
    let x = int(random(this.imagenPaleta_fondo.width));
    let y = int(random(this.imagenPaleta_fondo.height));
  
    let pixelColor = this.imagenPaleta_fondo.get(x, y);
  
    let { hue, saturation, brightness, alpha } = rgbToHsb(pixelColor);
  
    return { hue, saturation, brightness, alpha };
  }

  // Elegir una imagen aleatoria de un array
  elegirImagenAleatoria(imagenes) {
    let index = int(random(imagenes.length));
    return imagenes[index];
  }

  //testeo
  debug(opcion){
    if(opcion==1){
      image(this.imagenPaleta_figura,0,0);
    }
    else if(opcion==2){
      image(this.imagenPaleta_fondo,0,0);
    }
  }

  //ver si no me conviene retornar todos los parametros del color por separado
  //paleta figura
  darUnColor_figura(posY) {
    let x, y, pixelColor;
    
    do {
      x = int(random(this.imagenPaleta_figura.width));
      y = int(posY);
      
      pixelColor = this.imagenPaleta_figura.get(x, y);
      
      let alphaValue = alpha(pixelColor);
      
      // Verificar si el píxel es transparente (alpha = 0)
      if (alphaValue === 0) {
        // Generar nuevas coordenadas y obtener un nuevo píxel
        continue;
      }
      
      // Convertir a HSB
      let { hue, saturation, brightness } = rgbToHsb(pixelColor);
      
      return { hue, saturation, brightness, alpha: alphaValue };
    } while (true);
  }
  

}

// Transformar RGB a HSB
function rgbToHsb(rgbColor) {
  colorMode(RGB); // Establecer el modo de color en RGB para evitar interferencias
  let c = color(rgbColor);
  colorMode(HSB); // Establecer el modo de color en HSB
  let hueValue = hue(c);
  let saturationValue = saturation(c);
  let brightnessValue = brightness(c);
  let alphaValue = alpha(c);
  
  return { hue: hueValue, saturation: saturationValue, brightness: brightnessValue, alpha: alphaValue };
}

