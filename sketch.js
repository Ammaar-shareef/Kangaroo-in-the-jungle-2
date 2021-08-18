/*--------------------------------------------------------*/
var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;

var kangaroo, kangaroo_running, kangaroo_collided;
var jungle, invisibleGround;

var shrub;

var obstaclesGroup;
var obstacle,obstacleImg;

var score = 0;

var gameOver,resetbutton;

function preload(){
  kangaroo_running = loadAnimation("assets/kangaroo1.png","assets/kangaroo2.png","assets/kangaroo3.png");
  kangaroo_collided = loadAnimation("assets/kangaroo1.png");
  jungleImage = loadImage("assets/bg.png");
  shrub1 = loadImage("assets/shrub1.png");
  shrub2 = loadImage("assets/shrub2.png");
  shrub3 = loadImage("assets/shrub3.png");
  obstacleImg = loadImage("assets/stone.png");
  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("assets/restart.png");
  jumpSound = loadSound("assets/jump.wav");
  collidedSound = loadSound("assets/collided.wav");
}

function setup() {
  createCanvas(800,400);
  
  jungle = createSprite(400,100,400,20);
  jungle.addImage("jungle",jungleImage);
  jungle.scale=0.3
  jungle.x = width/2;

  kangaroo = createSprite(50,200);
  kangaroo.addAnimation("run",kangaroo_running);
  kangaroo.scale = 0.15;
  kangaroo.velocityY = 13;
  
  kangaroo.addAnimation("hit",kangaroo_collided);

  kangaroo.setCollider("circle",100,140,300);

  invisibleGround = createSprite(400,350,800,10);
  invisibleGround.visible = false;

  shrubsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;

  gameOver = createSprite(400,200);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
  gameOver.visible = false;

  resetbutton = createSprite(400,250);
  resetbutton.addImage(restartImg)
  resetbutton.scale = 0.08;
  resetbutton.visible = false;
}

function draw() {
  background(255);
  
  //kangaroo.debug = true;
  kangaroo.x = camera.position.x-270;

  if(gameState === PLAY){
    
  //giving velocity to bg and kangaroo
    jungle.velocityX = -5;
    kangaroo.velocityY = kangaroo.velocityY + 0.8;
  
  //givng movement to kangaroo
    if(keyIsDown(UP_ARROW) && kangaroo.collide(invisibleGround)){
      kangaroo.velocityY = -17;
      jumpSound.play();
    }
    
  //calling spawn functions
    spawnShrubs();
    spawnRocks();

  if(kangaroo.collide(shrubsGroup)){
      score = score + 1;
      shrubsGroup.destroyEach();
    }
  if(kangaroo.collide(obstaclesGroup)){
      gameState = END;
      collidedSound.play();
    }
  }

  if(gameState === END){
    kangaroo.changeAnimation("hit");
    kangaroo.velocityY = 0;

    jungle.velocityX = 0;
    
    obstaclesGroup.setLifetimeEach(-1);
    shrubsGroup.setLifetimeEach(-1);
     
    obstaclesGroup.setVelocityXEach(0);
    shrubsGroup.setVelocityXEach(0);

    resetbutton.visible = true;
    gameOver.visible = true;
    
    fill("white");
    text("Press Down Arrow key to restart",400,150);
    
    if(keyIsDown(DOWN_ARROW)){
      reset();
    }
  }

  if(gameState === WIN){
    kangaroo.changeAnimation("hit");
    kangaroo.velocityY = 0;

    jungle.velocityX = 0;
    
    obstaclesGroup.setLifetimeEach(-1);
    shrubsGroup.setLifetimeEach(-1);
     
    obstaclesGroup.setVelocityXEach(0);
    shrubsGroup.setVelocityXEach(0);

    //resetbutton.visible = true;
    //gameOver.visible = true;  
    
    if(keyIsDown(DOWN_ARROW)){
      reset();
    }
  }
  
  if(jungle.position.x < 200){
    jungle.position.x = 400
  }

  kangaroo.collide(invisibleGround);

  drawSprites();
  fill("white");
  text("Score: "+ score,700,30);

  if(score >= 5){
    //kangaroo.visible = false; 
    fill("white")
    text("Press Down Arrow key to restart",400,200);
 
    fill("white"); 
    text("Congragulations!! You win the game!!",400,150);
    gameState = WIN;
  }
  if(kangaroo.collide(obstaclesGroup)){
    fill("white")
    text("Press Down Arrow key to restart",400,200);
  }
}

function spawnShrubs()
{
  if (frameCount % 150 === 0){
    shrub = createSprite(camera.position.x+500,340,40,10);
    shrub.velocityX = -5;
    shrub.scale = 0.05;

    //generating random eggs
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: shrub.addImage(shrub1);
              break;
      case 2: shrub.addImage(shrub2);
              break;
      case 3: shrub.addImage(shrub3);
              break;
      default: break;
    }
    shrub.lifetime = 185;
    //adding shrubs to the group
    shrubsGroup.add(shrub);
  }
}
function spawnRocks()
{
  if (frameCount % 110 === 0){
    obstacle = createSprite(camera.position.x+500,340,40,10);
    obstacle.velocityX = -5;
    obstacle.scale = 0.1;
    obstacle.addImage(obstacleImg);
    obstacle.lifetime = 185;
    obstaclesGroup.add(obstacle);
  }
}

function reset()
{
  gameState = PLAY;
  shrubsGroup.destroyEach();
  obstaclesGroup.destroyEach();
  resetbutton.visible = false;
  gameOver.visible = false;
  kangaroo.changeAnimation("run");
  score = 0;
}
