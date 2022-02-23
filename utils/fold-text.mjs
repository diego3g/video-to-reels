/**
 * 
 * @param {String} s 
 * @param {Number} n 
 * @param {Boolean} useSpaces 
 * @param {String[]} a 
 * @returns {String[]}
 */
export function fold(s, n, useSpaces, a) {
  a = a || [];

  if (s.length <= n) {
      a.push(s);
      return a;
  }

  var line = s.substring(0, n);

  if (!useSpaces) {
    a.push(line);

    return fold(s.substring(n), n, useSpaces, a);
  } else { 
    var lastSpaceRgx = /\s(?!.*\s)/;
    var idx = line.search(lastSpaceRgx);
    var nextIdx = n;

    if (idx > 0) {
        line = line.substring(0, idx);
        nextIdx = idx;
    }

    a.push(line);

    return fold(s.substring(nextIdx), n, useSpaces, a);
  }
}