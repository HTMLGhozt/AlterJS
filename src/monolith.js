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

		if (!!fs) {
			this.images = [];

			this.check = (filepath) => {
				try { fs.accessSync(filepath, fs.F_OK); }
				catch (e) { return false; };
				return true;
			};

			this.write = (sep, overridePath = null) => {
				let outputPath = (
					(typeof overridePath === 'string')
					? overridePath
					: `${this.filepath}${sep}${this.title}.html`
				);
				if (typeof this.payload === 'string') {
					fs.writeFileSync(outputPath, this.payload);
					Log(`Exported ${outputPath}`, 'cyan');
				}
				else { Log('Please invoke init before attempting to write to file.', 'red'); };
			};

			this.read = (filepath, key, refresh = false, append = true, encoding = 'utf8') => {
				if (this.check(filepath)) {
					let data = fs.readFileSync(filepath, encoding);
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
				} else {
					Log(`Unable to read ${filepath}`, 'red');
				};
			};
		}
		if (!!init) this.initToHTML();
	};

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
			let flag = (typeof props[accessKey] === 'string');
			if (!!append) this[accessKey] += (!!flag ? props[accessKey] : '');
			else {
				// Overwrite the content completely
				this[accessKey] = (!!flag ? props[accessKey] : this[accessKey]);
			}
		}
		if (!!initToHTML) this.initToHTML();
	}
}

module.exports = Monolith;
