function Context() {
  this.interval = 500;
  this.next = null;
  this.setp = 0;
}

Context.prototype.getDelay = function () {
  if (!this.next) {
    this.next = getCurrentTime() + this.interval;
  }
  else {
    this.next = this.next + this.interval;
  }

  return Math.max(this.next - getCurrentTime(), 0);
}
