var demo = function(people) {
	'use strict';
	var f = hwfp,
	Maybe = f.Maybe(),
	Container = f.Container(),

	shout = (s => s.toUpperCase()),
	concat = f.curry( (append, original) => original + append ),
	prepend = f.curry( (append, original) => append + original ),

	exclaim = concat('!'),
	frown = concat(' >:('),
	growl = prepend('Grr, '),

	angry = f.pipe(
		growl,
		shout,
		exclaim,
		frown
	),

	getWords = f.prop('words'),
	angrifyWords = f.pipe(getWords, angry);

	console.log(f.map(angrifyWords, people));
};

$(demo([
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

]));
