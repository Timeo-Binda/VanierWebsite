let constrain = 20;
let maxPerspective = 100; // La valeur maximale de la perspective
let ex1Layer = document.getElementById("ex1-layer");

if (ex1Layer) {
  function transforms(x, y, el) {
    let box = el.getBoundingClientRect();
    let calcX = -(y - box.y - (box.height / 2)) / constrain;
    let calcY = (x - box.x - (box.width / 2)) / constrain;

    // Limiter la perspective pour éviter une inclinaison excessive sur l'axe Y
    let perspective = Math.min(maxPerspective, Math.abs(calcY) * 10);

    return "perspective(" + perspective + "px) "
      + "   rotateX("+ calcX +"deg) "
      + "   rotateY("+ calcY +"deg) ";
  }

  function transformElement(el, xyEl) {
    el.style.transform = transforms.apply(null, xyEl);
  }

  document.onmousemove = function(e) {
    let xy = [e.clientX, e.clientY];
    let position = xy.concat([ex1Layer]);

    window.requestAnimationFrame(function(){
      transformElement(ex1Layer, position);
    });
  };
} else {
  console.log("L'élément ex1-layer n'a pas été trouvé.");
}
