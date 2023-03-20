// import 'bootstrap'
import 'bootstrap/js/dist/util';
import 'bootstrap/js/dist/dropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import logMessage from 'JsFolder/logger'
import { createPage } from 'TkbbFolder/homepage.js'
// import * as d3 from "d3";

// CSS-Moduel einbinden
// import 'CssFolder/container.css'
// import 'CssFolder/tablebs.css'
import 'CssFolder/table.css'
import 'CssFolder/matrix.css'
import 'CssFolder/main.css'
// import 'CssFolder/flexTable.scss'

// Log message to console
logMessage('Web-GUI has been created')

// Needed for Hot Module Replacement
// if(typeof(module.hot) !== 'undefined') {
//     module.hot.accept() // eslint-disable-line no-undef  
//   }
createPage();
