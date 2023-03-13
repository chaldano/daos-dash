
const csv = require('csv-parser')
const fs = require('fs')
const path = require('path')
const { URL } = require('url');

const list1 = require('ServerData/edgelist.csv')
const list2 = require('ServerData/nodelist.csv')

let lists = [list1.default, list2.default];

// Asynchrones Lesen von x-CSV-Files
// Jedes CSV-File muß vorher importiert werden.

function getAll() {
  return new Promise(resolve => {
    let listeResult = [];
    let listsanzahl = lists.length;
    lists.forEach((liste, index) => {
      let results = [];
      const csvpath = path.join(__dirname, liste)
      rs = fs.createReadStream(csvpath)
      rs.on('error', (e) => reject(console.log("Error-CSV-File" + e)))
      rs.pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
          if (index < listsanzahl-1) {
            listeResult.push(results);
          } else {
            listeResult.push(results);
            resolve(listeResult)
          }
        })
    })
  })
}

module.exports = { getAll };
