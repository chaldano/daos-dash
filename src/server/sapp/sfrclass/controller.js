const model = require('../../common/models/model-box3-xml');
const view = require('./view');
const path = require('path')
const fs = require('fs');


function listAction(request, response) {
    model.getAll()
        .then(results => {
            console.log("Habe XML erhalten:");
            console.dir(results);
            response.json(view.render(request, results))
            // saveJson(results);
        })
        .catch((reject) => console.log("SFR-List: Controller is unable to access the model : " + reject));

    }

function saveJson(xmldata) {
    console.log("Speichere JSONFile")
    let data = createHierarchy(xmldata);
    let jsonData = JSON.stringify(data);
    const jsonpath = path.join(__dirname, "CCJsonFile")
    console.log(jsonpath);
    fs.writeFile(jsonpath, jsonData, function (err) {
        if (err) {
            console.log("JsonFile Fehler beim Schreiben" + err)
        }
    })
}

function createHierarchy(classes) {
    let myObject = new Object();

    myObject['root'] = 'cc';
    myObject['children'] = new Array();
    // Aufnahme aller CC-Klassen
    let classArray = myObject['children'];
    classes.forEach((classelement, classindex) => {
        let classObj = new Object();
        classObj['name'] = classelement.$.name;
        classObj['id'] = classelement.$.id;
        classObj['children'] = new Array();
        // Klasse speichern
        classArray.push(classObj);

        // Aufnahme aller CC-Familien pro Klasse
        let famArray = classArray[classindex]['children'];
        classelement['f-family'].forEach((famelement, famindex) => {
            let famObj = new Object();
            famObj['name'] = famelement.$.name;
            famObj['id'] = famelement.$.id;
            famObj['children'] = new Array();
            // Familie speichern
            famArray.push(famObj);

            // Aufnahme aller CC-Komponenten pro Familie
            let comArray = famArray[famindex]['children'];
            famelement['f-component'].forEach((comelement, comindex) => {
                let comObj = new Object();
                comObj['name'] = comelement.$.name;
                comObj['id'] = comelement.$.id;
                // Komponente speichern
                comArray.push(comObj);
            })
        })
    });
    return myObject
};

module.exports = {
    listAction,
};