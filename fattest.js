/* fattest.js --- tiny little testing tool
 *
 * Filename: fattest.js
 * Description: tiny little testing tool
 * Author: Jordon Biondo jordonbiondo@gmail.com
 * Created: Wed Dec  4 22:33:03 2013 (-0500)
 * Last-Updated: Wed Dec  4 23:48:16 2013 (-0500)
 *           By: Jordon Biondo
 *     Update #: 3
 * URL: github.com/jordonbiondo/fattest
 */

/* Commentary:
 *
 *
 *
 */

/* This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation; either version 3, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; see the file COPYING.  If not, write to
 * the Free Software Foundation, Inc., 51 Franklin Street, Fifth
 * Floor, Boston, MA 02110-1301, USA.
 */

/* Code: */


/**
 * Fattest, a small unit testing tool
 */

/**
 * String Colors
 */

var fatGreen = function(str) {return "\x1b[32m" + str + "\x1b[0m";};
var fatRed = function(str) {return "\x1b[31m" + str + "\x1b[0m";};


/**
 * A single test
 */
var Test = function(func, args, target, context) {
  this.context = (context) ? context : null;
  this.func = (context && typeof func === 'string') ? context[func] : func;
  this.args = args;
  this.target = target;
  this.passed = null;


  /**
   * The derived name of the test
   */
  this.name = function() {

    var name = ((this.context) ? this.context.constructor.name + "." : "") + this.func.name;
    return (name != "") ? name : "λ";
  };


  /**
   * Run this test, display results, set this.passed
   */
  this.run = function() {
    var target_name = (typeof this.target === "function") ? 'predicate()' : this.target;
    var string = this.name()+"("+this.args.join()+") == " + target_name;
    try {
      // run the test
      var output = this.func.apply(this.context, this.args);
      // check output against value or predicate
      this.passed = (typeof this.target === 'function')
	? (this.target(output) === true)
	: this.target === output;

      if (! this.passed) {
	string += " | GOT: " + output;
      }
    } catch (err) {
      if (typeof target === "function" && err.name === target.name) {
	this.passed = true;
      } else {
	this.passed = false;
	string += " | CAUGHT: " + err;
      }
    }
    console.log(" " + (this.passed ? fatGreen("*") : fatRed("-")) + "  " + string);
  };

};


/**
 * Testing Environment
 */
var TestEnv = function() {

  /**
   * The tests
   */
  this.tests = [];

  /**
   * Define a new test, run FUNC with ARGS and assert the output == TARGET when run
   */
  this.def = function(func, args, target, context) {
    this.tests.push(new Test(func, args, target, context));
  };

  /**
   * Define tests for functions in given context or class
   */
  this.defFor = function (context /* , arguments */) {
    Array.prototype.slice.call(arguments, 1).forEach(function(testObj) {
      var func = testObj["func"];
      var args = testObj["args"];
      var target = testObj["target"];
      if (func !== null && args !== null && target !== null) {
	this.def(func, args, target, context);
      } else {
	console.log(fatRed("Invalid test definition"),
		    context + "." + (func) ? func.name : null +
		    "(" + ((args) ? (args.join) ? (args.join()) : null : null) + ")" +
		    " === " + target);


      }
    }, this);
  };

  /**
   * Run all tests, display results
   */
  this.run = function() {
    console.log("\nRunning tests...\n");
    this.tests.forEach(function(test) {
      test.run();
    });

    var passes = (this.tests.filter(function(test) { return test.passed == true; })).length;
    var fails = this.tests.length - passes;

    console.log("\n" + this.tests.length + " tests run ");
    console.log(fatGreen("\tPassed: ") + ((passes == this.tests.length) ? "All" : passes));
    if (fails > 0) console.log(fatRed("\tFailed: ") + fails);
    return {
      passes: passes,
      fails: fails
    };
  };

};


/**
 * Exports
 */
module.exports = {
  Test: Test,
  Env: TestEnv // short name
};

/* fattest.js ends here */
