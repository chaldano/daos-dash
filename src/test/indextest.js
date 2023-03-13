// import { createHTML } from './../tkbb/homepage.js'

// createHTML();

// import 'CssFolder/style.css'
// import './../css/container.css'
// import './../css/CssFolder/lib.css'

console.log("Test is running");

// createHTML();
let node = !!document.getElementById('but3');
let element = document.getElementById('nav');
if (node) {
    node = document.getElementById('but3');
    console.log("Node vorhanden: " + node)
    console.log("Node löschen: " + node)    
    element.removeChild(node);

}
else{
    console.log("Node ist nicht vorhanden: " + node)    
}

