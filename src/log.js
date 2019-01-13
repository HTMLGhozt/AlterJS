function Log(message, color) {
	// The function signature is a lie but it doesn't matter I want to leverage polymorphic code
	const colors = {
		clear:   '\x1b[0m',
		black:   '\x1b[30m',
		red:     '\x1b[31m',
		green: 	 '\x1b[32m',
		yellow:  '\x1b[33m',
		blue:    '\x1b[34m',
		magenta: '\x1b[35m',
		cyan: 	 '\x1b[36m',
		white:	 '\x1b[37m'
	};
	// This allows uss to print objects to a limit of a single depth
	let arg_arr = [...arguments]
		  .slice()
		  .map((index) => {
			if (typeof index === 'object') index = (
				`\n{${
				Object.entries(index).map((sub_index) => {
					return '\n\t' + sub_index[0] + ': '+ sub_index[1]
					})
				}\n}\n`
			);

		return index;
	});
	let possible_color = arg_arr.pop(); // TODO || Possible color should not be popped and allowed to stay in arg_arr
	// I am adding another parameter to suit this as a required value
	console.log((colors[possible_color]||possible_color), ...arg_arr, colors['clear']);
};


/**
 *	Single depth object inspection prevents recursion
*	Log('stuff here', [1,2,3,4,5], new Set(), {body: 'asdasdasd', scripts: { init: { asd:'asdasd' } } }, 'and more stuff here', 'green');
*/
module.exports = Log;
