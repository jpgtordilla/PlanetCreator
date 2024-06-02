const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// planet parameters
let x1 = 150; // m
let y1 = 150;
let rad1 = 20; // visual only
let x2 = 280;
let y2 = 150;
let rad2 = 10; 
let m1 = 1000000000000; // kg
let m2 = 1000000000;

// planet references (can be removed when OOP integrated)
let minX1 = 0;
let minY1 = 0;
let minX2 = 0;
let minY2 = 0;

// time in seconds
let timer = 0;

// GAME LOOP METHODS

const clear = () => {
  ctx.fillStyle = "black";
  ctx.fillRect(0,0,300,300);
}

const update = () => {
  timer += 0.001;
  // calc force 
  // - m1 feels positive
  // - m2 feels negative
  let dist = calculateDistance(x1, y1, x2, y2);
  let avgRad = (rad1 + rad2) / 2; 

  if (dist > avgRad / 2) {

    let ang = calculateAngle(x1, y1, x2, y2);
    let rad = ang*(Math.PI/180); 

    // fnet
    let f1 = calculateForce(m1, m2, dist);
    let f2 = f1;
    // f1x, f1y, f2x, f2y
    // a1x, a1y, a2x, a2y
    let f1x = 0;
    let f1y = 0;
    let f2x = 0; 
    let f2y = 0; 

    let a1x = 0;
    let a1y = 0;
    let a2x = 0;
    let a2y = 0; 

    // intial velocity
    let vi = 1.3; 

    // update vectors based on quad
    if (ang >= 0 && ang <= 90) {
    // get x and y comp in quad 1
      
      f1x = Math.cos(rad)*f1;
      f2x = f1x;
      f1y = -Math.sin(rad)*f1;
      f2y = f1y;

      a1x = f1x/m1;
      a2x = -f2x/m2;
      a1y = f1y/m1;
      a2y = -f2y/m2;
    } 
    // get x and y comp in quad 2
    else if (ang > 90 && ang <= 180) {
      // convert to acute angle
      let newAng = 90 - ang;
      rad = newAng*(Math.PI/180);

      f1x = Math.cos(rad)*f1;
      f2x = f1x;
      f1y = -Math.sin(rad)*f1;
      f2y = f1y;

      a1x = f1x/m1;
      a2x = -f2x/m2;
      a1y = f1y/m1;
      a2y = -f2y/m2;
    }
    // get x and y comp in quad 4
    else if (ang < 0 && ang >= -90) {
      f1x = -Math.cos(rad)*f1;
      f2x = f1x;
      f1y = Math.sin(rad)*f1;
      f2y = f1y;

      a1x = f1x/m1;
      a2x = -f2x/m2;
      a1y = f1y/m1;
      a2y = -f2y/m2;
    }
    // quad 3
    else {

      let newAng = 90 + ang;
      rad = newAng*(Math.PI/180);

      f1x = -Math.cos(rad)*f1;
      f2x = f1x;
      f1y = -Math.sin(rad)*f1;
      f2y = f1y;

      a1x = f1x/m1;
      a2x = -f2x/m2;
      a1y = f1y/m1;
      a2y = -f2y/m2;
    }

    // update x based on timer
    // kinematics: delta_x = 0.5 * a * t^2
    let updateX1 = (0.5)*(a1x)*((timer*timer));
    let updateX2 = (0.5)*(a2x)*((timer*timer));
    let updateY1 = (0.5)*(a1y)*((timer*timer));
    let updateY2 = vi*timer + (0.5)*(a2y)*((timer*timer));

    x1 = x1 + updateX1;
    x2 = x2 + updateX2;
    y1 = y1 + updateY1;
    y2 = y2 + updateY2;
  }
}

const main = () => {
  update();
  clear();
  draw();
}
setInterval(main, 1);

// GRAPHICS

const draw = () => {
  drawPlanet("red", x1, y1, rad1); 
  drawPlanet("blue", x2, y2, rad2); 
}

// arcs too comp. intensive
const drawPlanet = (color,x,y,radius) => {
  ctx.beginPath(); 
  ctx.fillStyle = color;
  ctx.arc(x,y,radius,0,Math.PI*2,false);
  ctx.fill();
}

// physics

// force of m2 on m1
const calculateForce = (m1, m2, d) => {
  const G = 6.67 * 10E-11; 
  return (G*m1*m2)/(d^2); 
}

const calculateDistance = (x1, y1, x2, y2) => {
  let d = Math.sqrt(((x2-x1)*(x2-x1))+((y2-y1)*(y2-y1)));
  return d;

}

const calculateAngle = (x1, y1, x2, y2) => {
  // return pos angle or neg angle

  let xDiff = x2 - x1;
  let yDiff = y2 - y1;

  // scale to unit circle

  let hyp = Math.sqrt(Math.abs(xDiff*xDiff)+Math.abs(yDiff*yDiff));

  xDiff = xDiff / hyp;
  yDiff = yDiff / hyp;

  if (yDiff == 0) {
    return 0;
  }

  // quad 1
  if (xDiff >= 0 && yDiff <= 0) {

    let cosine = xDiff;

    let ang = (180/Math.PI)*Math.acos(cosine);

    return ang;
  }
  // quad 2
  else if (xDiff >= 0 && yDiff > 0) {
    let cosine = xDiff; 
    let ang = 90 + (180/Math.PI)*Math.acos(cosine);
    return ang;
  }
  // quad 3
  else if (xDiff < 0 && yDiff > 0) {
    let xAbsDiff = Math.abs(xDiff);
    let cosine = xAbsDiff;
    let ang = -90 - (180/Math.PI)*Math.acos(cosine);
    return ang; 
  }
  // quad 4 
  else {
    let xAbsDiff = Math.abs(xDiff);
    let cosine = xAbsDiff;
    let ang = -(180/Math.PI)*Math.acos(cosine);
    return ang; 
  }
}



