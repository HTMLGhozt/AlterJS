/**
 * The zcope of this file will be to decompose a static asset to its respective monolith
 * allowing override to recomposition. We will have an alias to the class we wish to
 * construct and the filename to represent that.
 *
 * If what we have is newer to a hardcoded and dynamicly updated variable, we will
 * seek the content of header, seperating title and style to its blocks.
 * Seeking all body content we will split scripts to their own block.
 *
 * The compilation shall beable to reproduce the source.
 * Capture blocks using the keywords of the tags producing arrays of results we will
 * concatonate through the functions provided in the monolith.
 */
const fs = require('fs');

function grepField(pathToFile) {
  let extracted = {};
  let enumerations = [ "title", "style", "head", "script", "body"];
  function sliceWithRegex(memRef, type) {
    let openIndex = null;
    let closeIndex = null;
    let tagExpOpen  = `<${type}>`;
    let tagExpClose = `</${type}>`;
    let sampleSet = memRef.payload.join('')
    let tagRegexOpen  = new RegExp(tagExpOpen ).exec(sampleSet);
    let tagRegexClose = new RegExp(tagExpClose).exec(sampleSet);
    // This does not allow for attributes to be present on the element itself, regex can expand this to the closing character.
    // The only attr I could see as valid in these instances would be script sources so as that would be contrary to motive, I'll pass.
    if (tagRegexOpen) openIndex = tagRegexOpen.index;
    if (tagRegexClose) closeIndex = tagRegexClose.index + type.length + 3;
    if (typeof openIndex == 'number' && typeof closeIndex == 'number') {
      let sampleDecomposition = memRef.payload
        .splice(openIndex, closeIndex - openIndex)
        .slice(type.length + 2, -(type.length + 3));

      memRef[type] = sampleDecomposition.join('');
    } else {
      console.log(`Unable to find a complete entry for ${type}.`);
    };
  };
  const sourceFile = ('' + fs.readFileSync(pathToFile));
  extracted.payload = [...sourceFile];
  enumerations.forEach((label) => sliceWithRegex(extracted, label));
  extracted.payload = sourceFile;

  return extracted;
};

console.log(grepField(`${__dirname}\\test.html`));
