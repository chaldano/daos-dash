
const xml2js = require('xml2js');
const fs = require('fs')
const path = require('path')
const { URL } = require('url');

// const list1 = require('ServerData/edgelist.csv')
const ccdoc = require('ServerData/cc3R4.xml')
parser = new xml2js.Parser();

// let lists = [ccdoc.default];
let liste = ccdoc.default;
let xmlfile
// Asynchrones Lesen von XML-Files
// Jedes XML-File muß vorher importiert werden.

function getAll() {
  return new Promise((resolve, reject) => {
    const xmlpath = path.join(__dirname, liste)
    fs.readFile(xmlpath, function (err, data) {
      try {
        parser.parseString(data, (err, result) => {
          // results.push(data)
          let fclasses = result['cc']['f-class'];
          resolve(fclasses);
        })
      } catch (err) {
        reject("XML-Parse-Error: " + err)
      }
    })
  })
}

module.exports = { getAll };
