function Warrior() {

  this.position;

  this.radius = 12;

  // Radius needed for a physical attack
  this.additionalAttackRadius = 9;

  this.health = 100;

  this.attack = 25;
  this.defense = 25;

  // Energy needed to attack or move, increased every turn.
  this.energy = 0;


  this.velocity = 3;
  this.requiredEnergyForAttack = 10;

  this.route = undefined;


  this.getNextNotVisited = function(visited, dist) {
    var point;
    var lower = Infinity;

    var i;
    var j;
    for (i = 0; i < dist.length; i++) {
      for (j = 0; j < dist[i].length; j++) {
        if (dist[i][j] != Infinity && !visited[i][j] && dist[i][j] < lower) {
          lower = dist[i][j];
          point = new Point(i, j);
        }
      }
    }
    return point;
  };

  this.canAttack = function(warrior) {
    return distance(warrior.position.x, warrior.position.y, this.position.x, this.position.y)
      <= this.radius + warrior.radius + this.additionalAttackRadius;
  };

  this.getNearestEnemy = function(teams, team) {
    var lowestDistance = Infinity;
    var nearestEnemy = undefined;
    var i;
    for (i = 0; i < teams.length; i++) {
      if (teams[i] != team) {
        var j;
        for (j = 0; j < teams[i].warriors.length; j++) {
          if (teams[i].warriors[j].isAlive()) {
            var dist = distance(this.position.x, this.position.y, teams[i].warriors[j].position.x, teams[i].warriors[j].position.y);
            if (dist < lowestDistance) {
              lowestDistance = dist;
              nearestEnemy = teams[i].warriors[j];
            }
          }
        }
      }
    }
    return nearestEnemy;
  };

}

Warrior.prototype.isAlive = function() {
    return this.health > 0;
}

Warrior.prototype.draw = function(context, team) {
  if (this.isAlive()) {
    var ctxWarrior = context.layers[LAYER_WARRIOR].getContext("2d");

    ctxWarrior.resetTransform();

    // Draw the body

    ctxWarrior.beginPath()
    ctxWarrior.fillStyle = "black";
    ctxWarrior.arc(this.position.x, this.position.y, this.radius,0 , Math.PI*2);
    ctxWarrior.fill();

    ctxWarrior.beginPath()
    ctxWarrior.fillStyle = team.color;
    ctxWarrior.arc(this.position.x, this.position.y, this.radius - 2, 0, Math.PI*2);
    ctxWarrior.fill();

    // Draw the health bar

    ctxWarrior.beginPath()
    ctxWarrior.fillStyle = "black";
    ctxWarrior.fillRect(this.position.x - this.radius, this.position.y - this.radius - 6,
                 2 * this.radius, 4);

    ctxWarrior.beginPath()
    ctxWarrior.fillStyle = "yellow";
    ctxWarrior.fillRect(this.position.x - this.radius + 1, this.position.y - this.radius - 5,
                 Math.trunc((this.health / 100) * 2 * this.radius - 2), 2);

    // Draw path
    var ctxPath = context.layers[LAYER_PATH].getContext("2d");
    ctxPath.resetTransform();
    if (this.route && this.route.length > 0) {
      ctxPath.fillStyle = "LightGray";
      var i;
      for (i = 0; i < this.route.length; i++) {
        ctxPath.rect(this.route[i].x, this.route[i].y, 1, 1);
      }
      ctxPath.fill();
    }

  }
};

Warrior.prototype.defend = function (attack) {
  this.health -= Math.max(0, random(attack) - random(this.defense));
}


Warrior.prototype.move = function (context, team) {

  if (!this.health) {
    return; // Can not move a dead body
  }


  this.energy++;

  var nearestEnemy = this.getNearestEnemy(context.teams, team);

  if (this.canAttack(nearestEnemy)) {

    if (this.energy < this.requiredEnergyForAttack) {
      return; // Not enough energy to attack!
    }

    nearestEnemy.defend(this.attack);
    this.enegy -= this.requiredEnergyForAttack;
    // Attack this motherfucker here!

    return;
  }

  if (!this.route || this.route.length == 0 || !isPositionAvailable(context.teams, this, this.route[0].x, this.route[0].y)) {
    var pathCalculator = new DijkstraPathCalculator(context, team, this);
    this.route = pathCalculator.calculate();
  }

  if (this.route && this.route.length) {
    var moved;
    do {
      moved = false;
      var dist = distance(this.position.x, this.position.y, this.route[0].x, this.route[0].y);

      if (dist * this.velocity <= this.energy) {
          this.position = this.route.shift();
          this.energy-= dist * this.velocity;
          moved = true;
      }

    } while (moved && this.route.length);
  }


  //if (!window.confirm("Should process another?")) {
  //  throw new Error("Something went badly wrong!");
  //}

};
