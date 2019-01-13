const Log = require('./log.js');

// Composing the arguments this way allows full inspection of the expected parameters.
class Monolith
{
	constructor(props = {
		filepath: null,
		title:	  null,
		head:	  null,
		styles:	  null,
		body:	  null,
		scripts:  null
	}, init, fs) {
		// Default to empty strings, abstract alias to the object
		// this could also be handled by using . notation and default
		// in constructor to string, TODO: Smell this later
		let {
			filepath = __dirname,
			title    = '',
			head     = '',
			styles   = '',
			body     = '',
			scripts  = ''
		} = props;
		this.filepath	= filepath;
		this.title		= title;
		this.head			= head;
		this.styles		= styles;
		this.body			= body;
		this.scripts	= scripts;

		// This means that VP will not have the ability to encode images
		if (!!fs) { // I will use !! to cast a boolean true expectation if the origin means that we're not expecting a boolean
			this.images = [];
			// We check if the file exists
			this.check = (filepath) => {

				try { fs.accessSync(filepath, fs.F_OK); }
				catch (e) { return false; };

				return true;
			};
			// sep is a required variable, this should be reflected in the function signature
			this.write = (sep, overridePath = null) => {
				// If a path is provided, use that
				let outputPath = (
					(typeof overridePath === 'string')
					? overridePath
					: `${this.filepath}${sep}${this.title}.html`
				);
				// Check that there is literally anything to write
				if (typeof this.payload === 'string') {
					fs.writeFileSync(outputPath, this.payload);
					Log(`Exported ${outputPath}`, 'cyan');
				}
				else { Log('Please invoke init before attempting to write to file.', 'red'); };
			};

			this.read = (filepath, key, refresh = false, append = true, encoding = 'utf8') => {
				// filepath and key are required to know what and where we put the desired file contents
				// however no key is my short hand for this is an image, this may need to be reworked
				// a bad read will be caught and encoded, I'm not sure how to leverage this
				// TODO: Clean up image handling
				// if the file exists proceed else log unsuccessful
				if (this.check(filepath)) {
					let data = fs.readFileSync(filepath, encoding);
					// if key isn't present we are importing an image

					if (!key) {
						return data;
					} else if (key == "images") {
						this.images.push(data.toString('base64'));
						Log(`[${this.images.length - 1}] Image read successfully and stored.`, 'blue');
					} else {
						this.reassign({
							[key]: data
						}, append, refresh);
					};

					Log(`Imported ${filepath}`, 'cyan');
				}
				else {
					Log(`Unable to read ${filepath}`, 'red');
				};
			};
		}
		if (!!init) this.initToHTML();
	}
	// Use supplied fields to populate a html scaffold
	// Allow indentation to reset to 0
	initToHTML() {
		this.payload = (
`<!DOCTYPE html>
<html>
	<head>
		<title>${this.title}</title>${
			!!this.head    ? '\n\t\t' + this.head : ''
		}${
			!!this.styles  ? `\n\t\t<style>\n${this.styles}\n\t\t</style>` : ''
		}
	</head>
	<body>${
			!!this.body    ? '\n\t\t' + this.body	 : ''
		}${
			!!this.scripts ? `\n\t\t<script>\n${this.scripts}\n\t\t</script>` : ''
		}
	</body>
</html>
`	);};

	reassign(props = {
		filepath: null,
		title: 	  null,
		head:	  	null,
		styles:	  null,
		body:	  	null,
		scripts:  null,
	}, append = false, initToHTML = true) {
		const ownedProps = Object.keys(props);
		for (let ownedKey = 0; ownedKey < ownedProps.length; ownedKey++) {
			let accessKey = ownedProps[ownedKey];
			let flag = (typeof props[accessKey] === 'string'); // I'll leave this since its used twice
			// Append the content or nothing
			if (!!append) this[accessKey] += (!!flag ? props[accessKey] : '');
			else {
				// Overwrite the content completely
				this[accessKey] = (!!flag ? props[accessKey] : this[accessKey]);
			}
		}
		// If you can compose the entire file in the constructor do
		if (!!initToHTML) this.initToHTML();
	}
}

module.exports = Monolith;
