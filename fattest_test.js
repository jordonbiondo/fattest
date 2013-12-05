var fat = require('./fattest.js');

var env = new fat.Env();

function point(x, y) {
  this.x = x + 0.0;
  this.y = y + 0.0;

  this.xPlusOne = function xPlusOne() {
    return this.x + 1;
  };
  
  this.length = function length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  };
  
  this.add = function add(x, y) {
    this.x += x;
    this.y += y;
    return this;
  };
  
  this.inverse = function inverse() {
    return new point(this.y, this.x);
  };
}

var bacon = new point(3, 4);

bacon.inverse();

env.defFor(bacon,
	   {
	     func: "xPlusOne",
	     args: [],
	     expected: 4
	   },
	   
	   {
	     func: "length",
	     args: [],
	     expected: Math.sqrt(3.0 * 3.0 +  4.0 * 4.0)
	   },
	   
	   {
	     func: "add",
	     args: [1, 1],
	     expected: function(out) { return out.x == 4 && out.y == 5;}
	   });
env.run();
