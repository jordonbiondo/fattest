# fattest
	tiny js unit test tool
## Example:
```javascript
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
	
	```



