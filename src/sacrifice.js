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

/**
 *
 * @param {*} type header, title, style, body, script
 * @param {*} source
 */
function grepField(type, source) {

};