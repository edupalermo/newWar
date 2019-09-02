onmessage = function(e) {
  console.log('Inside of the Worker mnain body!');
  //e.data[0].step();
  console.log(self.context);

  console.log(window.context);

  postMessage("END_OF_TURN");
}
