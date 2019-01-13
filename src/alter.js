module.exports = (sources = {
	head: 	 null,
	styles:  null,
	body:	   null,
	scripts: null
}) => (
	// This function will take each of the fields on a monolith and provide an interface to edit them
	// Via theDevoted api and allow remapping and editting of the content with a live view
`\t\t<form id='edit' name='edit' method='post' action='https://localhost:3443/'>
\t\t\t<input type='submit' />
${ Object.entries(sources).map((entry) => ( entry[0] !== 'filepath' ?
	`\t\t\t<textarea cols='40' name='${entry[0]}'>${(entry[1]).trim()}</textarea>` : ''
)).join('\n')
}
\t\t</form>`
);
