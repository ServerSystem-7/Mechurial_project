// let array1 = [
//     { name: 'Minjin', email: '2018065@sungshin.ac.kr', zipCode: 123 },
//     { name: 'Minjin22', email: '201806522@sungshin.ac.kr', zipCode: 123 }
//   ]


// let result = array1.map(a => a.name);
// console.log(result)

// let satisfied = array1.map(a => ({name: a.name, satisfied: false}));
// console.log(satisfied)

key1 = "Sandeep Jain"
key2 = "p"
key3 = "성신 여대"
keywords = [key1, key2, key3]

const cheerio = require("cheerio"),
   fs = require("fs");

file_path = "/home/kkmjkim1528/Mechurial_project/public/crawl_results/file1.html"
const $ = cheerio.load(fs.readFileSync(file_path));
const div_text = $.text();

// let i = 0;
// while (i < 3){
//     if (div_text.includes(keywords[i])){
//         console.log(keywords[i]);
//     }
//     i = i + 1;
// }

let every = keywords.every(x => {
    return div_text.includes(x)
})

let or = keywords.some(x => {
    return div_text.includes(x)
})

console.log(every)
console.log(or)