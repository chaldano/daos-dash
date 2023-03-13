const Router = require('express').Router;

const { listPostAction } = require('./controller');
const router = Router(); 

router.get('/',function (req, res) {
  res.send('NOT IMPLEMENTED: Adressen GET');
})

router.post('/',function(req, res) {
  // res.send('NOT IMPLEMENTED: Adressen Post');
  console.log("POST received");

let body = req.body[Object.keys(req.body)]

// listPostAction(req,res)
formValues=parseBody(body)
console.log(formValues)

})

function parseBody(Text) {
  
  let keyvalue = /\"(\w+)\"([\w\s])+/gm;  // keys + values
  let trenner = /[\r\n]+/gm;
  
  // alle Zeilenumbrüche raus
  let tresult = Text.replace(trenner,'');   
  // Key/Value Paare extrahieren
  let result = tresult.match(keyvalue)
  // Paare in Array aufnehmen
  let formValues = [];
  result.forEach((element) => {
    let sresult = element.split('\"')
    sresult.shift() // leeres 1. Element raus
    // Teilarray übernehmen 
    formValues.push(sresult)
  })  
  return formValues
}


// router.post('/', listAction);
// console.log("Adressen is exported");
// router.post('/', function(req, res) {
  
  // console.log("Keys.Body: "+Object.keys(req.body))
  // console.log("Body: "+req.body)
  //   // res.send('Post-Request: '+Object.keys(req.body));
    // res.send('Post-Request: '+req.body.lvorname + " "+ req.body.lnachname);
  // }
  // );
module.exports = router;