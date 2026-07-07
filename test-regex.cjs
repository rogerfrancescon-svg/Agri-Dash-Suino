const delimiter = '\t';
const re = new RegExp(`\\${delimiter}(?=(?:(?:[^"]*"){2})*[^"]*$)`);
console.log(re);
console.log('a\tb'.split(re));

const delimiter2 = ';';
const re2 = new RegExp(`\\${delimiter2}(?=(?:(?:[^"]*"){2})*[^"]*$)`);
console.log(re2);
console.log('a;b'.split(re2));
