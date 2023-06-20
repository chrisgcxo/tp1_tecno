//fijarse como levantar entre varias imagenes random para generar la paleta una vez
class paleta {
  constructor(imagenPaleta_fondo, imagenPaleta_figura) {
    this.imagenPaleta_fondo = imagenPaleta_fondo;
    this.imagenPaleta_figura = imagenPaleta_figura;
  }
  
  // Paleta fondo
  darUnColor_fondo() {
    let x = int(random(this.imagenPaleta_fondo.width));
    let y = int(random(this.imagenPaleta_fondo.height));
  
    let pixelColor = this.imagenPaleta_fondo.get(x, y);
  
    let { hue, saturation, brightness, alpha } = rgbToHsb(pixelColor);
  
    return { hue, saturation, brightness, alpha };
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

