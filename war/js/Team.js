function Team(color) {
  this.warriors = [];
  this.color = color;
}

Team.prototype.addWarrior = function (warrior) {
  this.warriors.push(warrior);
};

Team.prototype.draw = function (context) {
  var i;
  for (i = 0; i < this.warriors.length; i++) {
    this.warriors[i].draw(context, this);
  }
};
