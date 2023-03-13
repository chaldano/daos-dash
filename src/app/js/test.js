
let Adresse = [
  {
    name: 'Kebbedies',
    vorname: 'Joerg',
  },
  {
    name: 'Schmidt',
    vorname: 'Jörgen',
  }
];
console.log("Test is running");
Adresse.forEach(element => {
  console.log(element);
  console.log(element.name);
});
console.log("Test2 is running");
let keys = Object.keys(Adresse[0]);
let values = Object.values(Adresse[0]);
console.log(values);

Adresse.forEach(element => {
    keys.forEach(key => {
      console.log(element[key])    
    
    // console.log(key+" : "+element)
  });
  console.log("Ende Zeile");
});

