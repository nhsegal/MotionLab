
let car;
let resetButton;
let markerButton;
let startButton;
let metronome;
let meterstick;
let ruler;
let markOn;
let marks;
let moving;

let checkBoxBuggy1;
let checkBoxBuggy2;
let checkBoxRacer;

let klack;
let nextKlack = 0;
let muted = true;

function preload() {
  klack = loadSound('metronome_clack.wav');
  klack.playMode('restart');
}


function setup() {
  createCanvas(1000, 400);
  angleMode(DEGREES);
  rectMode(CENTER);
  car = new Car(width / 4, height / 2, 1, 0);
  car3 = new Car(width / 6, height / 2, 0, 1);
  ruler = new Ruler(width / 4, 250, 20, 400);
  marks = []
  moving = false;
  
  resetButton = createButton("Reset");
  resetButton.position(10, height - 50);
  resetButton.size(100, 40);
  resetButton.style("font-size", "20px");
  resetButton.style("background-color", color(240, 240, 130));
  resetButton.mousePressed(reset);
  
  markerButton = createButton("Marker On");
  markerButton.position(120, height - 50);
  markerButton.size(130, 40);
  markerButton.style("font-size", "20px");
  markerButton.style("background-color", color(140, 210, 240));
  markerButton.mousePressed(mark);
  markOn = false;
  
  checkBoxBuggy1 = createCheckbox(' Buggy 1', true);
  checkBoxBuggy1.position(10,20)
  checkBoxBuggy1.style("font-family", "Helvetica");
  checkBoxBuggy1.style("font-size", "20px");
  checkBoxBuggy1.changed(buggy1);
  
  checkBoxBuggy2 = createCheckbox(' Buggy 2', false);
  checkBoxBuggy2.position(10,40)
  checkBoxBuggy2.style("font-family", "Helvetica");
  checkBoxBuggy2.style("font-size", "20px");
  checkBoxBuggy2.changed(buggy2);
  
  checkBoxRacer = createCheckbox(' Racer', false);
  checkBoxRacer.position(10,60)
  checkBoxRacer.style("font-family", "Helvetica");
  checkBoxRacer.style("font-size", "20px");
  checkBoxRacer.changed(racer);
  
  startButton = createButton("Toys On");
  startButton.position(260, height - 50);
  startButton.size(100, 40);
  startButton.style("font-size", "20px");
  startButton.style("background-color", color(240, 180, 100));
  startButton.mousePressed(
    function(){
      moving = !moving
      if (checkBoxBuggy1.checked()){car.on = !car.on}
    
    if (checkBoxBuggy2.checked()){
    car2.on = !car2.on}
       if (checkBoxRacer.checked()){
    car3.on = !car3.on}
    
    if (moving){
      startButton.html("Toys Off")
    } else {
      startButton.html("Toys On")
    }
    
  }
    )
  
  metronome = createButton("Metronome On");
  metronome.position(370, height - 50);
  metronome.size(160, 40);
  metronome.style("font-size", "20px");
  metronome.style("background-color", color(170, 240, 170));
  metronome.mousePressed(function(){muted = !muted;
                                    if(muted){
                                      metronome.html("Metronome On")
                                    } else {
                                      metronome.html("Metronome Off")
                                    }
                                    
                                   });
  
  
  
}

function draw() {
  background(220);
   let timeNow = millis();
  
  if (timeNow > nextKlack && muted == false) {
    klack.play();
  	nextKlack = timeNow + 1000;
  }
 
  if (checkBoxBuggy1.checked()){
    car.move();
    car.display();
  }
  
  if (checkBoxBuggy2.checked()){
    car2.move();
    car2.display();
  }

  if (checkBoxRacer.checked()){
    car3.move();
    car3.display();
  }


  ruler.move();
  ruler.display();
  for (let i = 0; i< marks.length; i++){
    fill(0,0,200);
    noStroke;
    ellipse(marks[i].x, marks[i].y, 8);
  }
  if (markOn){
    ellipse(mouseX, mouseY, 8);
  }
}

class Car {
  constructor(x, y, v, a) {
    this.x = x;
    this.y = y;
    this.v = v;
    this.a = a;
    this.on = false;
    this.dragging = false;
    this.turning = false;
    this.direction = createVector(1, 0);
  }
  move() {
    if (this.on) {
      this.v += 0.007*this.a
      this.y += this.v*this.direction.y;
      this.x += this.v*this.direction.x;
    } else if (this.dragging) {
      this.x = mouseX;
      this.y = mouseY;
    } else if (this.turning) {
      this.direction.setHeading(radians(this.direction.heading() + 180));
      this.turning = false;
    }
  }
  display() {
    push();
    translate(this.x, this.y);
    rotate(this.direction.heading() - 90);
    rectMode(CENTER);
    noStroke();
    fill(0);
    rect(-12, -15, 10, 12);
    rect(12, -15, 10, 12);
    rect(-12, 15, 10, 12);
    rect(12, 15, 10, 12);
    if (this.a != 0){
      stroke(0)
      fill(250)
      rect(0, 14, 28, 19);
      triangle(-15, -25, 15, -25, 0, 30);
       
    } else{ 
     if (this.v < 1.1){  
        fill(250, 0, 0);
    } else {
       fill(0, 0, 250);
    }
     rect(0, 0, 28, 54);
       stroke(0);
    strokeWeight(0.5);
    rect(0, 0, 20, 15);
    }
    noStroke();
    fill(250, 250, 0);
    ellipse(-8, 25, 9, 4);
    ellipse(8, 25, 9, 4);
    noFill();
    stroke(0);
    strokeWeight(0.5);
    arc(0, 0, 36, 36, 60, 120, OPEN);
    line(-9, 17, -4, 13);
    line(-9, 17, -4, 21);
    strokeWeight(2);
    line(-7, -17, 7, -17);
    line(0, -17, -4 + 8 * this.on, -21);
    pop();
  }

  pickedUp() {
    if (abs(this.x - mouseX) < 8 && abs(this.y - mouseY) < 8) {
      this.dragging = true;
      this.on = false;
      this.x = mouseX;
      this.y = mouseY;
    }
    if (
      abs(this.x - mouseX + this.direction.x * 20) < 8 &&
      abs(this.y + this.direction.y * 20 - mouseY) < 7
    ) {
      this.turning = true;
      this.dragging = false;
      this.on = false;
    }
    if (
      abs(this.x - mouseX - this.direction.x * 20) < 7 &&
      abs(this.y - this.direction.y * 20 - mouseY) < 7
    ) {
      this.turning = false;
      this.dragging = false;
      this.on = !this.on;
      if (this.on){
        
      }
    }
  }
}

class Ruler {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 20;
    this.h = 400;
    this.dragging = false;
    this.offsetX = 0;
    this.offsetY = 0;
  }

  display() {
    push();
    fill(240, 240, 140);
    noStroke();
    translate(this.x, this.y);
    rotate(90)
    rect(0, 0, this.w, this.h);
    tickMarks(-this.w / 2, -this.h / 2, 4);
    pop();
  }
  
  pickedUp() {
     if (abs(this.x - mouseX) < this.h/2 && abs(this.y - mouseY) < this.w/2) {
     
      this.offsetX = this.x - mouseX;
      this.offsetY = this.y - mouseY;
      this.dragging = true;
      this.x = mouseX// + this.offsetX;
      this.y = mouseY// + this.offsetY;
    }
    if (
      abs(this.x - mouseX ) < this.w/2 &&
      abs(this.y + this.h/2 - mouseY) < this.h/2
    ) {
     
      this.dragging = false;
    }
  }

  move(){
    if (this.dragging){
      this.x = mouseX + this.offsetX;
      this.y = mouseY + this.offsetY;
    }
    
  }

}

function mousePressed() {
  if (!markOn){
    if (checkBoxBuggy1.checked()){
       car.pickedUp();
    }
   if (checkBoxBuggy2.checked()){
       car2.pickedUp();
    }
    if (checkBoxRacer.checked()){
       car3.pickedUp();
    }
  ruler.pickedUp();
  } else 
  {
    marks.push(createVector(mouseX, mouseY));
  }
}
function mouseReleased() {
   if (checkBoxBuggy1.checked()){
  car.dragging = false;
  car.turning = false;
   }
  if (checkBoxBuggy2.checked()){
  car2.dragging = false;
  car2.turning = false;
   }
  if (checkBoxRacer.checked()){
  car3.dragging = false;
  car3.turning = false;
   }
  ruler.dragging = false;
}

function tickMarks(x, y, s) {
  stroke(0);
  for (let i = 0; i < 101; i++) {
    line(x, y + s * i, x + 2 + 4 * ((i + 1) % 2), y + s * i);
    if (i % 10 == 0) {
      line(x, y + s * i, x + 10, y + s * i);
      noStroke();
      fill(0);
      textSize(10);
      text(100 - i, x + 10, y + s * i);
      stroke(0);
    }
  }
}

function reset() {
  marks = [];
    if (checkBoxBuggy1.checked()){car.on = false;
                                 car.x = width/3; 
                                   car.y = height /2 }
    if (checkBoxBuggy2.checked()){
    car2.on = false
    car2.x = width/3
    car2.y = height/3}
       if (checkBoxRacer.checked()){
    car3.on = false;
         car3.v = 0
       car3.x = width/6
       car3.y = height/3
       }
  startButton.html("Toys On")
}

function mark(){
  if (!markOn){
    markerButton.html("Marker Off")  }
  else {
    markerButton.html("Marker On")  }
  markOn = !markOn;
  
}

function buggy1(){
     car = new Car(width / 3, height / 2, 1, 0)
}

function buggy2(){
     car2 = new Car(width / 3, height / 3, 1.7, 0)
}

function racer(){
 
     car3 = new Car(width / 6, height / 3, 0, 1)
}
