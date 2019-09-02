function DijkstraHelper() {
  this.dict = {};
  this.sortedList = [];
  this.distances = [];

  this.generateKey = function(x, y) {
    return x + "," + y;
  };

  this.findDistanceIndex = function(distance) {
    var minor = -1;
    var major = this.distances.length;

    while (major - minor > 1) {
      var middle = Math.trunc(minor + (major - minor) / 2);
      if (this.distances[middle] > distance) {
        major = middle;
      } else if (this.distances[middle] < distance) {
        minor = middle;
      }
      else {
        minor = middle;
        break;
      }
    }

    return minor + 1;
  };

}

DijkstraHelper.prototype.pop = function() {
  if (this.sortedList.length == 0) {
    return undefined;
  }
  else {
    this.dict[this.generateKey(this.sortedList[0].x, this.sortedList[0].y)] = undefined;
    this.distances.shift();
    var result = this.sortedList.shift();

    var i;
    for (i = 0; i < this.sortedList.length; i++) {
      var key = this.generateKey(this.sortedList[i].x, this.sortedList[i].y);
      this.dict[key] = this.dict[key] - 1;
    }

    return result;
  }
};

DijkstraHelper.prototype.update = function(x, y, distance) {
  var currentKey = this.generateKey(x, y);
  var actualIndex = this.dict[currentKey];

  if (actualIndex) {
    this.sortedList.splice(actualIndex, 1);
    this.distances.splice(actualIndex, 1);

    var i;
    for (i = actualIndex; i < this.sortedList.length; i++) {
      var key = this.generateKey(this.sortedList[i].x, this.sortedList[i].y);
      this.dict[key] = this.dict[key] - 1;
    }

    // Redundant
    this.dict[this.generateKey(this.sortedList[0].x, this.sortedList[0].y)] = undefined;
  }

  var newIndex = this.findDistanceIndex(distance);

  this.sortedList.splice(newIndex, 0, new Point(x, y));
  this.distances.splice(newIndex, 0, distance);
  this.dict[currentKey] = newIndex;

  var i;
  for (i = newIndex + 1; i < this.sortedList.length; i++) {
    var key = this.generateKey(this.sortedList[i].x, this.sortedList[i].y);
    this.dict[key] = this.dict[key] + 1;
  }
};
