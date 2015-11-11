/*
	TODO:	Add sentences to lorem

	Utilities
	========================================

	{{ something() }}
		The return value of something() is printed
		in the JSON.

	{% something() %}
		The JS is evaluated but not printed

	register({name: function})
		Pass a map of functions or values to add
		custom functions or values. Example:
		"{%
			register({
				double: function(num) {
					return num * 2;
				},
				triple: function(num) {
					return num * 3;
				}
			})
		%}"

	repetition
		"{% ~10 %}"
		"key": "val"
		"{% ~end %}"
		The defined section of JSON is repeated
		by the number of times specified after the
		'~' character.
		Commas are added automatically, except the
		last item.

	========================================
 */

var _ = require('lodash');
module.exports = function(grunt) {
	'use strict';

	grunt.registerTask('json', 'Create example JSON data from templates in json_profiles.', function(lang) {
		grunt.log.subhead('Requests and issues to dan.hughes@heathwallace.com');

		lang = lang || 'uk';
		var
			infile = 'json_profiles/template.json',
			outfile = 'stub/' + lang + '.json';

		// {{ someVar }} -> outputs the contents of someVar
		_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

		// {% evaluated expression %}
		_.templateSettings.evaluate = /{%([\s\S]+?)%}/g;

		var props = {

			/**
			 * Register a list of custom properties for this template only
			 * @param  {map}	customProps		Key/value pairs of functions
			 */
			register: function(customProps) {
				for (var name in customProps) {
					grunt.log.writeln('Registered ' + name);
					this[name] = customProps[name];
				}
			},

			/**
			 * Repeat a function multiple times
			 * @param  {integer}	count		The number of times to execute the callback
			 * @param  {Function}	callback	The executable callback
			 */
			repeat: function(count, callback) {
				_.forEach(_.range(count), function(i) {
					callback(i, count-1 === i);
				});
			},

			/**
			 * Create a firstname from a list of popular first names
			 * @param  {string}		gender		Male or Female names to generate
			 * @return {string}					A random name of the specified gender
			 */
			firstname: function(gender) {
				gender = gender || _.sample(['male', 'female']);
				return _.sample(grunt.file.readJSON('tasks/json-samples/' + gender + '-firstnames.uk.json'));
			},

			/**
			 * Generate a random surname of the current language
			 * @return {string}					A random surname
			 */
			surname: function() {
				return _.sample(grunt.file.readJSON('tasks/json-samples/surnames.' + lang + '.json'));
			},

			/**
			 * Generate a random city
			 * @return {string}					A random city, UK or HK
			 */
			city: function() {
				return _.sample(grunt.file.readJSON('tasks/json-samples/cities.' + lang + '.json'));
			},

			/**
 			 * Generate a date
			 * @param  {integer}	amount		Optional number of days to subtract from today
			 * @return {Date}					Generated date
			 */
			date: function(amount) {
				var d = new Date();
				d.setDate(d.getDate() - amount);
				return d;
			},

			/**
			 * Select a random element from the parameters
			 * @param  {Array?}		params		Either an array of things to choose from, or multiple parameters to the function call
			 * @return {?}						A random element from the input parameters
			 */
			random: function() {
				if (arguments.length === 1 && arguments[0] instanceof Array) {
					return _.sample(arguments[0]);
				}
				return _.sample(arguments);
			},

			/**
			 * Generate a random integer (inclusive)
			 * @param  {integer}	max			The maximum possible number
			 * @param  {integer?}	min			The smallest possible number
			 * @return {integer}				The random integer
			 */
			integer: function(max, min) {
				min = min || 1;
				return _.random(min, max);
			},

			/**
			 * Generate a random float (inclusive)
			 * @param  {integer/float}		max	The maximum possible number
			 * @param  {integer?/float?}	min	The smallest possible number
			 * @return {float}	 				The random float
			 */
			float: function(max, min) {
				min = min || 1;
				return _.random(min, max, true).toFixed(2);
			},

			/**
			 * A random boolean value (true or false)
			 * @return {bool}					The random bool
			 */
			bool: function() {
				return _.sample([true, false]);
			},

			/**
			 * Generate a random number of lorem ipsum words
			 * @param  {integer}	amount		How many words to generate
			 * @param  {string}		unit   		'words' or 'sentences'
			 * @return {string}					A string of random lipsum words
			 */
			lorem: function(amount, unit) {
				unit = unit || 'words';
				if (!_.contains(['words', 'sentences'], unit)) {
					grunt.log.error(unit + ' is not a valid lorem unit. (words, sentences)');
				}

				var flatLorem = grunt.file.readJSON('tasks/json-samples/lorem-ipsum.json')[0];
				var words = _.shuffle(flatLorem.split(" "));
				var countedWords = words.slice(0, amount);
				var joinedWords = countedWords.join(" ");

				if (unit === 'sentences') {
					grunt.log.error('Sentences not available yet, sorry!');
				}
				return joinedWords;
			},

			/**
			 * Generate a random unique alphanumeric identifier
			 * @param  {integer}	length		Length of the ID generated
			 * @return {string}					A unique ID, guaranteed unique across function calls
			 */
			id: function(length) {
				length = length || 16;
				var nums = _.range(0, 10);
				var letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
				var sources = nums.concat(letters);

				// Use uniqueID to ensure that the uid is always at least one number different
				// (uniqueID returns integers in ascending order every call)
				var uid = _.uniqueId();

				while (uid.length <= length) {
					uid = _.shuffle(sources)[0] + uid;
				}

				uid = _.shuffle(uid.split('')).join('');

				return uid;
			},

			/**
			 * Log out a string to the Grunt STDOUT
			 * @param  {string}		content		The string to log
			 */
			log: function(content) {
				grunt.log.writeln('LOG: ' + content);
			}
		};

		grunt.log.writeln('Compiling JSON profile');
		var tmpl = grunt.file.read(infile);

		// Expand repetition shortcuts into function calls before compilation
		tmpl = tmpl.replace(/^\s*\"?{% ~(\d+) %}\"?$/gm, "{% repeat($1, function(i, last) { %}");
		tmpl = tmpl.replace(/\n\s*\"?{% ~end %}\"?$/gm, "{% if (!last) { %},{% } }) %}");

		var compiled = _.template(tmpl);
		var output = grunt.util.normalizelf(compiled(props));

		// Strip blank lines from output
		//		^		Beginning of line
		//		\s		Whitespace character (tab, space)
		//		*		Any number of the previous
		//		\n		Newline character (backslash n)
		//		/gm		Search globally and multi-line
		output = output.replace(/^\s*\n/gm,"");

		// Remove any lines that solely consist of open and close
		// quotes, as these are used for adding custom functions
		// and should not be output
		output = _.filter(output.split("\r"), function(line) {
			//		^		Beginning of line
			//		\s		Whitespace character
			//		*		Any number of the previous
			//		\"		Escaped quote mark
			//		(?!.)	Cancel if any character follows
			var patt = /^\s*\"\"(?!.)/;

			// Return false (i.e. filter out) anything matching the above
			return (!patt.test(line));
		}).join("\r");

		if (grunt.file.write(outfile, output)) {
			grunt.log.ok('Wrote ' + outfile);
		} else {
			grunt.log.error('Error writing ' + outfile);
		}

		grunt.loadNpmTasks('grunt-jsonlint');
		grunt.initConfig({
			jsonlint: {
				stubs: {
					src: ['stub/' + lang + '.json']
				}
			}
		});
		grunt.task.run('jsonlint');
	});
};
