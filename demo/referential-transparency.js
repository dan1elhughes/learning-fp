$(function() {
	$.getJSON("stub/uk.json", fp);
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

var fp = function(tasks) {
	'use strict';

	var ourUsername = 'alice';

	var onlyOurTasks = R.filter(R.whereEq({user: ourUsername}));
	var groupByUser = R.groupBy(R.prop('user'));
	var getIncompleteTasks = R.filter(R.whereEq({done: false}));
	var sortByPriority = R.sortBy(R.prop('priority'));

	var showOurTasks = R.compose(
		groupByUser,
		sortByPriority,
		getIncompleteTasks
	);

	console.log(showOurTasks(tasks));
};
