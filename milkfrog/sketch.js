let angelmilkfrog = [];
let ghost = [];


let angelmilkfrogFrame = 0;
let ghostFrame = 0;

let devilMode = false;

let devilmilkfrog;
let pumkin;

async function setup() {
  createCanvas(400, 400);

  const angelPromises = [];

  for (let i = 1; i <= 2; i++) {
    angelPromises.push(
      loadImage("image/angelmilkfrog" + i + ".jpg")
    );
  }
  angelmilkfrog = await Promise.all(angelPromises);
  
  devilmilkfrog = await loadImage("image/devilmilkfrog.jpg");
  pumkin = await loadImage("image/pumkin.jpg");
  
  const ghostPromises = [];
  for (let i = 1; i <= 2; i++) {
    ghostPromises.push(
      loadImage("image/ghost" + i + ".jpg")
    );
  }
  ghost = await Promise.all(ghostPromises);


  eraseBackground(angelmilkfrog, 10);
  eraseBackground(devilmilkfrog, 10);
  eraseBackground(ghost, 10);
  eraseBackground(pumkin,10);
  imageMode(CENTER);

}

function draw() {
  background(255);

  if (!devilMode) {
    if (frameCount % 20 == 0) {
      angelmilkfrogFrame = (angelmilkfrogFrame + 1) % angelmilkfrog.length;
    }
    drawFit(
      angelmilkfrog[angelmilkfrogFrame],
      mouseX,
      mouseY,
      220,
      220
    );

  }
  else {
    drawFit(
      devilmilkfrog,
      mouseX,
      mouseY,
      220,
      220
    );
  }

  if(frameCount % 15 == 0){
    ghostFrame = (ghostFrame + 1) % ghost.length;
  }
  drawFit(
    ghost[ghostFrame],
    300,
    90,
    180,
    180
  );

  drawFit(
    pumkin,
    80,
    380,
    180,
    180
  );
}

function drawFit(img, x, y, maxW, maxH) {

  if (!img || !img.width || !img.height) {
    console.log("Image is missing:", img);
    return;
  }

  let fitRatio = min(
    maxW / img.width,
    maxH / img.height
  );

  image(
    img,
    x,
    y,
    img.width * fitRatio,
    img.height * fitRatio
  );
}

function mousePressed() {
  let d = dist(
    mouseX,
    mouseY,
    300,
    90
  );
  if (d < 100) {
    devilMode = !devilMode;
    angelmilkfrogFrame = 0;
  }
}


function eraseBackground(imageArray, threshold) {
  let images = Array.isArray(imageArray)
    ? imageArray
    : [imageArray];
  for (let img of images) {
    if (!img) continue;
    let maxDimension = 800;
    if (max(img.width, img.height) > maxDimension) {
      let ratio = maxDimension / max(img.width, img.height);
      img.resize(
        Math.round(img.width * ratio),
        Math.round(img.height * ratio)
      );
    }
    img.loadPixels();
    for (let i = 0; i < img.pixels.length; i += 4) {
      let r = img.pixels[i];
      let g = img.pixels[i + 1];
      let b = img.pixels[i + 2];
      if (
        r > 255 - threshold &&
        g > 255 - threshold &&
        b > 255 - threshold
      ) {
        img.pixels[i + 3] = 0;
      }
    }

    img.updatePixels();
  }
}