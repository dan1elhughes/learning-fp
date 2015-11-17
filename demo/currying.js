$(function() {
	$.getJSON("stub/uk.json", fpDemo);
});

var vjs = function(tasks) {
	'use strict';

	var incompleteTasks = tasks.filter(function(task) {
		return !task.done;
	});

	var users = [];

	var userIsInArray = function(arr, username) {
		return arr.filter(function(item) {
			return item.user === username;
		}) > 0;
	};

	for (var i = 0; i < tasks.length; i++) {
		if (userIsInArray(users, tasks[i].user)) {
			users.push({
				user: tasks[i].user
			});
		}
	}

	// for (var i = 0; i < tasks.length; i++) {
	// 	users[tasks[i].user].push(tasks[i]);
	// }

	console.log(users);
};

var fpDemo = function(tasks) {
	'use strict';
	var f = hwfp,
	Maybe = f.Maybe(),
	Container = f.Container(),

	people = [
		{
			name: 'frank',
			words: 'soup for the gent'
		},
		{
			name: 'louis',
			words: 'i want meat sweets for lunch'
		},
		{
			name: 'morena',
			words: 'double booked again'
		}
	],

	shout = function(s) { return s.toUpperCase(); },
	concat = f.curry(function(append, original) {
		return original + append;
	}),
	prepend = f.curry(function(append, original) {
		return append + original;
	}),

	exclaim = concat('!'),
	frown = concat(' >:('),

	angry = f.pipe(
		shout,
		exclaim,
		frown
	),

	getWords = f.prop('words'),
	angrifyWords = f.pipe(getWords, angry);

	console.log(f.map(angrifyWords, people));
};
