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
    //paleta figura
    darUnColor_figura() {
        let x = int(random(this.imagenPaleta_figura.width));
        let y = int(random(this.imagenPaleta_figura.height));
    
        let pixelColor2 =this.imagenPaleta_figura.get(x, y);
    
        let hsbColor2 = rgbToHsb(pixelColor2);
    
        return hsbColor2;
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
    return color(h, s, b);
  }

