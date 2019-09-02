const LAYER_BACKGROUND = 0;
const LAYER_PATH = 1;
const LAYER_WARRIOR = 2;
const LAYER_DEBUG = 5;

function Context(width, height) {
  this.loopController = new LoopController(500);
  this.width = width;
  this.height = height;
  this.teams = [];

  this.layers = [];

  // Layer 0 - Dead bodies
  // Layer 1 - Paths
  // Layer 2 - Warrirors
  // Layer 3 - Health bar
  // Layer 4 - Moving Arrows
  // Layer 5 - Debug
  var i;
  for (i = 0; i < 6; i++) {
    this.layers[i] = new OffscreenCanvas(this.width, this.height);
    //this.layers[i].width = this.width;
    //this.layers[i].height = this.height;
  }

  var bottomContext = this.layers[0].getContext("2d");
  bottomContext.fillStyle = "white";
  bottomContext.fillRect(0, 0, this.width, this.height);

  // TemporaryCanvas is used to merge layers
  this.temporaryCanvas = new OffscreenCanvas(this.width, this.height);
  //this.temporaryCanvas.width = this.canvas.width;
  //this.temporaryCanvas.height = this.canvas.height;

  this.removeDeadWarriors = function() {
    var i;
    for (i = 0; i < this.teams.length; i++) {
      var j;
      for (j = this.teams[i].warriors.length - 1; j >= 0; j--) {
        if (!this.teams[i].warriors[j].isAlive()) {
          this.teams[i].warriors.splice(j, 1);
        }
      }
    }
  };
}

Context.prototype.step = function() {
  this.move();
  this.draw();
  this.removeDeadWarriors();
};

Context.prototype.findAvailablePosition = function(radius) {
  var position;
  var free;
  do {
    position = new Point(random(radius, this.width - radius + 1), random(radius, this.height - radius + 1));
    free = true;

    var i;
    for (i = 0; i < this.teams.length; i++) {
      var j;
      for (j = 0; j < this.teams[i].warriors.length; j++) {
        if (distance(position.x, position.y, this.teams[i].warriors[j].position.x, this.teams[i].warriors[j].position.y) < radius + this.teams[i].warriors[j].radius) {
          free = false;
        }
      }
    }
  } while(!free);
  return position;
};

Context.prototype.move = function() {
  var i;
  for (i = 0; i < this.teams.length; i++) {
    var j;
    for (j = 0; j < this.teams[i].warriors.length; j++) {
      this.teams[i].warriors[j].move(this, this.teams[i]);
    }
  }
}

Context.prototype.draw = function(canvas) {
  // Cleaning the layers
  var i;
  for (i = 1; i < this.layers.length - 1; i++) { // Don't clear the first and the last layer!
      this.layers[i].getContext("2d").clearRect(0, 0, this.width, this.height);
  }
  this.temporaryCanvas.getContext("2d").clearRect(0, 0, this.width, this.height);

  // Calling the teams to draw themselves
  for (i = 0; i < this.teams.length; i++) {
    this.teams[i].draw(this);
  }

  // Merging canvas
  var destination = this.temporaryCanvas.getContext("2d");
  //var destination = this.canvas.getContext("2d");
  for (i = 0; i < this.layers.length; i++) {
    destination.drawImage(this.layers[i], 0, 0);
  }
  canvas.getContext("2d").drawImage(this.temporaryCanvas, 0, 0);

  setTimeout(function() {}, 100);
};

Context.prototype.getDelay = function () {
  return this.loopController.getDelay();
};

Context.prototype.createTeam = function (color) {
  var team = new Team(color);
  this.teams.push(team);
  return team;
};
