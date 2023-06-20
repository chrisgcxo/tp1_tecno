//borrar la paleta del trazo fig?
//implementar un random que levante una imagen al azar la primera vez que se crea la paleta
class paleta {
    constructor(imagenPaleta_fondo,imagenPaleta_figura) {
      this.imagenPaleta_fondo = imagenPaleta_fondo;
      this.imagenPaleta_figura=imagenPaleta_figura;
    }
    //paleta fondo
    darUnColor_fondo() {
      let x = int(random(this.imagenPaleta_fondo.width));
      let y = int(random(this.imagenPaleta_fondo.height));
  
      let pixelColor =this.imagenPaleta_fondo.get(x, y);
  
      let hsbColor = rgbToHsb(pixelColor);
  
      return hsbColor;
    }
 
  }
  //transformar rgb a hsb
  function rgbToHsb(rgbColor) {
    colorMode(RGB); // Establecer el modo de color en RGB para evitar interferencias
    let c = color(rgbColor);
    colorMode(HSB); // Establecer el modo de color en HSB
    let h = hue(c);
    let s = saturation(c);
    let b = brightness(c);
    //how can i transform this return " return color(h, s, b);" a color in hsb but hue, bright and saturation on diferent vars?
    return color(h, s, b);
  }

