function LoopController(interval) {
  this.interval = interval;
  this.next = undefined;
  this.setp = 0;
}

LoopController.prototype.getDelay = function () {
  var current = getCurrentTime();

  var wait;
  if (this.next) {
    wait = this.interval - (current - this.next);
  }
  else {
    wait = this.interval;
  }

  if (wait <= 0) {
    console.log("ERROR! The system is not being able to process frame in " + this.interval + "ms. It is taking " + (this.interval - wait) + "ms.");
  }


  this.next = current + this.interval;

  // console.log("Waiting: " + wait + "ms.")
  return Math.min(Math.max(wait, 0), this.interval);
};
