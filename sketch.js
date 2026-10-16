/*
Template for IMA's Creative Coding Lab 

Project A: Generative Creatures
CCLaboratories Biodiversity Atlas 
*/

let off1, off2, off3, off4;
let cx = 0;
let cy = 0;

let x = 400
let y = 250;

let tentacleLenList = [];
let tentacleCount = 4; 

let jelly = []
const jellyCount = 33;

let circles = []
let gameover = false;
let clickLock = false;

let totalClicked = 0;

let gameoverTime = 0;
const RESET_DELAY = 1000;

let dots = [];
const gridStep = 30; 

function setup() {
  createCanvas(800, 500);
  colorMode(HSB,360,100,100,255);
  noStroke();
  off1 = 0;
  off2 = 5;
  off3 = 10;
  off4 = 15;
  totalClicked = 0;

  
  for(let i = 0; i < tentacleCount; i++){
    tentacleLenList[i] = random(25,40);
  }

  for(let i = 0; i < jellyCount; i++){
    jelly.push({
      x: random(width),
      y: random(height),
      offsetX: random(-150,150),
      offsetY: random(-150,150),
      lerpSpeed: random(0.01,0.08),
      sizeScale: random(0.2,1.2),
      phase: random(20),
      saveX: 0,
      saveY: 0,
    });
  }

  circles.push({x:150, y:90, r:13, clicked:false});
  circles.push({x:250, y:400, r:10, clicked:false});
  circles.push({x:500, y:220, r:12, clicked:false});
  circles.push({x:700, y:180, r:11, clicked:false});


  for(let x = gridStep; x < width; x += gridStep){
    for(let y = gridStep; y < height; y += gridStep){
      dots.push({
        originX: x,
        originY: y,
        currX: x,
        currY: y,
        targetX: x + random(-30,30),
        targetY: y + random(-30,30)
      });
    }
  }

}


function draw() {
  if (gameover && millis() - gameoverTime > RESET_DELAY) {
    setup();
    gameover = false;
    return;
  }
  
  background(235, 75, 65);
  
  //background
  if(gameover){
    background(0);
  }else{
    noStroke()
    x = lerp(x, mouseX, 0.015);
    y = lerp(y, mouseY, 0.015);
    let t = millis()* 0.0008;
  
    for (let d = 1000; d > 0; d -= 30) {
      let h = map(d, 0, 1000, 207, 235);
      let a = map(d, 0, 1000, 55, 0);
      fill(h, 75, 65, a);

      let m = sin(d * 0.025) * 10;
      let n = cos(d * 0.025) * 10;
      ellipse(x, y, d + m, d + n)
    }
    fill(0, 0, 0, totalClicked * 40);
    noStroke();
    rect(0,0,width,height);



    fill(200,45,58,230);
    noStroke();

    for(let d of dots){
      d.currX = lerp(d.currX, d.targetX, 0.03);
      d.currY = lerp(d.currY, d.targetY, 0.03);

    let distToTarget = dist(d.currX, d.currY, d.targetX, d.targetY);
      if(distToTarget < 1.5){
        d.targetX = d.originX + random(-30,30);
        d.targetY = d.originY + random(-30,30);
    }

      circle(d.currX, d.currY, 1.6);
  }
  }



  
  //4 circles
    if(!gameover){
      noFill();
    
      for(let i = 0; i < circles.length; i++){
        let c = circles[i];
        if(c.clicked){
          stroke(200,45,75,70);
        }else{
          stroke(0,0,100,60);
        }

        strokeWeight(2);
        circle(c.x, c.y, c.r);

      // 内侧简单装饰线
        if(c.clicked){
          stroke(205,40,76,80);
        }else{
          stroke(0,0,100,65);
       }

        strokeWeight(1);
        circle(c.x, c.y, c.r*0.7);


  }
    

    

}


  //creature
  push();
  noFill()
  stroke(255)
  strokeWeight(3)
  for(let j of jelly){
    if(gameover == false){
      let cx = mouseX + j.offsetX;
      let cy = mouseY + j.offsetY;
      j.x = lerp(j.x, cx, j.lerpSpeed);
      j.y = lerp(j.y, cy, j.lerpSpeed);
      j.saveX = j.x;
      j.saveY = j.y;
    }else{
      j.x = j.saveX + random(-5,5) ;
      j.y = j.saveY + random(-5.5) ;
    }
    drawJellyfish(j.x, j.y, j.sizeScale, j.phase);
  }



}

function drawJellyfish(cx,cy, sizeScale, phaseOffset){
  push();
  noStroke();
  if(gameover){
    fill(0,90,80);
  }else{
    let c = color(206,26,100);
    c.setAlpha(130);
    fill(c);
  }
  ellipse(cx, cy, 30*sizeScale, 20*sizeScale);

  let tentacleCount = 4;
  let time = frameCount * 0.06 + phaseOffset;
  for(let i = 0; i < tentacleCount; i++){
    let startX = cx -10*sizeScale + i * 6*sizeScale;
    let startY = cy + 3*sizeScale;

    beginShape();
    
    vertex(startX, startY);
    let thisLen = tentacleLenList[i] * sizeScale;
    let segNum = 4;
    for(let s = 1; s <= segNum; s++){
      let segY = startY + (thisLen / segNum) * s;
      let waveOffset = sin(time + i * 1.2 + s * 0.4) * ( s*1.8)*sizeScale;
      let segX = startX + waveOffset;
      vertex(segX, segY);
    }
    endShape();
  }
  pop();
}

function mousePressed(){
  if(gameover) return;
  for(let i=0; i < circles.length; i++){
    let c = circles[i];
    let d = dist(mouseX, mouseY, c.x, c.y);
    if(d < c.r && !c.clicked){
      c.clicked = true;
      totalClicked++;
      if(totalClicked >= 4){
        gameover = true;
        gameoverTime = millis();
      }
      break;
    }
  }
   
    for(let j of jelly){
      j.shakyBaseX = j.x;
      j.shakyBaseY = j.y;
    }
}
  
