function DijkstraPathCalculator(context, team, warrior) {
  this.context = context;
  this.team = team;
  this.warrior = warrior;
  this.debug = true;

  this.canAttackAnyEnemyOnThatPosition = function(x, y) {
    var result = false;

    var teams = this.context.teams;
    var i;
    outer: for (i = 0; i < teams.length; i++) {
      if (teams[i] != this.team) {
        var j;
        for (j = 0; j < teams[i].warriors.length; j++) {
          if (teams[i].warriors[j].isAlive()) {
            if (distance(x, y, teams[i].warriors[j].position.x, teams[i].warriors[j].position.y) <= this.warrior.radius + teams[i].warriors[j].radius + this.warrior.additionalAttackRadius) {
              result = true;
              break outer;
            }
          }
        }
      }
    }
    return result;
  };

}

DijkstraPathCalculator.prototype.calculate = function() {

  //var timer = new Timer();

  var dist = [];
  var prev = [];
  var visited = [];
  var helper = new DijkstraHelper();

  var i;
  var j;
  for (i = 0; i < this.context.canvas.width; i++) {
    for (j = 0; j < this.context.canvas.height; j++) {
      if (!dist[i]) {
        dist[i] = [];
        prev[i] = [];
        visited[i] = [];
      }
      dist[i][j] = Infinity;
      prev[i][j] = undefined;
      visited[i][j] = false;
    }
  }

  var current = this.warrior.position;
  dist[current.x][current.y] = 0;

  if (this.debug) {
    this.context.layers[LAYER_DEBUG].getContext("2d").clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
  }


  var counter = 0;
  while (true) {

    // if can attack! We found a solution!
    if (this.canAttackAnyEnemyOnThatPosition(current.x, current.y)) {
      console.log("Can Attack!");
      break;
    }


    visited[current.x][current.y] = true;

    //var ctx = canvas.getContext("2d");
    //ctx.fillStyle = "yellow";
    //ctx.fillRect(current.x,current.y,1,1);

    for (i = current.x - 1; i <= current.x + 1; i++) {
      for (j = current.y - 1; j <= current.y + 1; j++) {
        if (i >= this.warrior.radius - 1 && j >= this.warrior.radius - 1 && i < this.context.canvas.width - this.warrior.radius && j < this.context.canvas.height - this.warrior.radius && (i != 0 || j != 0)) {
          if (!visited[i][j] && isPositionAvailable(this.context.teams, this.warrior, i, j)) {
            var newDist = dist[current.x][current.y] + distance(current.x, current.y, i, j);
            if ((!dist[i][j]) || (dist[i][j] > newDist)) {
              dist[i][j] = newDist;
              prev[i][j] = new Point(current.x, current.y);
              helper.update(i, j, newDist);
            }
          }
        }
      }
    }

    // current = this.getNextNotVisited(visited, dist);
    current = helper.pop();
    if (!current) {
      console.log("Not able to find a reacheable enemy!");
      return undefined;
    }
    else {
      if (this.debug) {
        var ctx = this.context.layers[LAYER_DEBUG].getContext("2d");
        ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
        ctx.fillRect(current.x, current.y, 1, 1);
        context.draw();
      }
    }

    counter++;

    if (counter % 5000 == 0) {
        console.log("Processed 500");
    }
  }

  var route = undefined;

  if (current) {
    route = [new Point(current.x, current.y)];
    while (prev[route[0].x][route[0].y]) {
      route.splice(0, 0, prev[route[0].x][route[0].y]);
    }
  }

  if (this.debug) {
    this.context.layers[LAYER_DEBUG].getContext("2d").clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
  }


  return route;

  //if (!window.confirm("Should process another?")) {
  //  throw new Error("Something went badly wrong!");
  //}

};
