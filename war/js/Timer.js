function Timer() {
  this.last = getCurrentTime();
}

Timer.prototype.delta = function (msg) {
  console.log(msg + ": " + (getCurrentTime() - this.last) + "ms");
  this.last = getCurrentTime();
};
