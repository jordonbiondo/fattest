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
	     target: 4
	   },
	   
	   {
	     func: "length",
	     args: [],
	     target: Math.sqrt(3.0 * 3.0 +  4.0 * 4.0)
	   },
	   
	   {
	     func: "add",
	     args: [1, 1],
	     target: function(out) { return out.x == 4 && out.y == 5;}
	   });
env.run();



var fatty = require('./fattest');

var tests = new fatty.Env();


/**
 * Testing functions
 */

//Function to multiply two numbers
function multiply(a, b) {
  return a * b;
}


// tests that multiply(2, 4) === 8
tests.def(multiply, [2, 4], 8);

// we can determine if a test passes by using a predicate function
tests.def(multiply, [2, 4], function(result) {
  return result > 7.999 && result < 8.001;
});

// we expect multiply('foo', 'bar') to be NaN.
// well, we don't, but Javascript does.
tests.def(multiply, ['foo', 'bar'], isNaN);


// function that will throw an error when given a 0 arg
function throwAnErrorWhenZero(n) {
  if (n === 0) throw new TypeError();
  else return "hello";
}

// we can test that we get errors when expected
tests.def(throwAnErrorWhenZero, [0], TypeError);


/**
 * Testing in a context
 */

var myArray = [1, 2, 3];

// helper function to test array equality by value, [1, 2] === [1, 2]
function arrayEql(a, b) {
  return a.length === b.length &&
    (function(){
      for (var i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
      }
      return true;
    })();
}

tests.defFor(myArray, {
  func: 'slice',
  args: [1],
  target: function(result) {
    return arrayEql(result, [2, 3]);
  }
},{
  
  func: 'map',
  args: [function(x) { return x + 1; }],
  target: function(result) {
    return arrayEql(result, [2, 3, 4]);
  }
},{
  func: 'push',
  args: [5],
  target: function(result) {
    return myArray.length === result;
  }
});



// run the tests, we'll see that all will pass
tests.run();















