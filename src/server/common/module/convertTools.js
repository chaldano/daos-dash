// 
// Wandelt eine Array of Array in ein Array of Objects
// Feld 0 enthält dies Objekt-Keys
// Feld 1 .. Max sind die Objekt-Werte
//
function convertArrayToObjects(arraydata) {
    let arrayOfObjects = [];
    let keys;
    arraydata.forEach((element, i) => {
        if (i == 0) {
            keys = element;
        }
        else {
            let object = {};
            keys.forEach((key, j) => {
                object[key] = element[j];
            })
            arrayOfObjects.push(object);
        }
    });
    return arrayOfObjects;
};

export { convertArrayToObjects };