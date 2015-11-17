var hwfp = {};

hwfp.curry = function(fx) {
	// Arity == number of arguments to a function
	var arity = fx.length;

	return function f1() {
		var args = Array.prototype.slice.call(arguments, 0);
		if (args.length >= arity) {
			// We have received all the arguments, so run the function
			return fx.apply(null, args);
		}
		else {
			return function f2() {
				// We have not received all the arguments yet, so
				// partially apply the function and return it while
				// waiting for the rest of the arguments
				var args2 = Array.prototype.slice.call(arguments, 0);
				return f1.apply(null, args.concat(args2));
			};
		}
	};
};

hwfp.compose = function() {
	var fncs = arguments;

	return function (result) {
		for (var i = fncs.length - 1; i > -1; i--) {
			result = fncs[i].call(this, result);
		}

		return result;
	};
};

hwfp.map = hwfp.curry(function(callback, haystack) {
	return haystack.map(callback);
});

hwfp.log = hwfp.curry(function(tag, data) {
	console.log(tag, data);
	return data;
});

hwfp.prop = hwfp.curry(function(property, obj) {
	return obj[property];
});

hwfp.pipe = function() {
	return hwfp.compose.apply(this, [].slice.call(arguments).reverse());
};

hwfp.filter = hwfp.curry(function(property, needle, haystack) {
	return haystack.filter(function(obj) {
		return obj[property] === needle;
	});
});

hwfp.sort = hwfp.curry(function(callback, haystack) {
	return Array.prototype.slice.call(haystack).sort(callback);
});

hwfp.Container = function() {
	var Container = function(data) {
		this._value = data;
	};

	Container.of = function(data) {
		return new Container(data);
	};

	Container.prototype.map = function(callback) {
		return Container.of(callback(this._value));
	};

	return Container;
};

hwfp.Maybe = function() {
	var Maybe = function(x) {
		this._value = x;
	};

	Maybe.of = function(x) {
		return new Maybe(x);
	};

	Maybe.prototype.isNothing = function() {
		return (this._value === null || this._value === undefined);
	};

	Maybe.prototype.map = function(callback) {
		if (this.isNothing()) {
			return Maybe.of(null);
		} else {
			return Maybe.of(callback(this._value));
		}
	};

	return Maybe;
};
