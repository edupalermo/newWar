function getCurrentTime() {
  return (new Date()).getTime();
}

function random(a, b) {
  switch (arguments.length) {
    case 1:
      return Math.trunc(Math.random() * a);
    case 2:
      return Math.trunc(Math.random() * (b - a) + a);
    default:
      throw "Miss use of the fucntion random, with " + arguments.length + "arguments";
    }
}

function distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function isPositionAvailable(teams, warrior, x, y) {
  var free = true;

  var i;
  outer: for (i = 0; i < teams.length; i++) {
    var j;
    for (j = 0; j < teams[i].warriors.length; j++) {
      if (teams[i].warriors[j] != warrior && distance(warrior.position.x, warrior.position.y, teams[i].warriors[j].position.x, teams[i].warriors[j].position.y) < warrior.radius + teams[i].warriors[j].radius) {
        free = false;
        break outer;
      }
    }
  }
  return free;
};
