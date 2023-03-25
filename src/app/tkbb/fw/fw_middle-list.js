import { requestData } from 'TkbbFolder/net/client.js';
import { createTable } from 'TkbbFolder/tables/tabbasic.js';
import { putTableDetail } from 'TkbbFolder/tables/tabbasic.js';
import { putTable } from 'TkbbFolder/tables/tabbasic.js';
import { putTableHeader } from 'TkbbFolder/tables/tabbasic.js';
import { putTableFooter } from 'TkbbFolder/tables/tabbasic.js';

import { createContentBox } from 'TkbbFolder/dom/html.js';
import { removeAllBox } from 'TkbbFolder/dom/html.js';

// import { JQTDselect } from 'TkbbFolder/dom/rulesjs.js';
// import { listRecordSelection } from 'TkbbFolder/dom/html.js';
// import { listRecordSelectionHTML } from 'TkbbFolder/dom/html.js';
import { registerRowHandlers } from '../../dom/html';


function FBxDefault(buttonName) {
  console.log("Button has no function");
}

function RunTable(tHeader) {
  removeAllBox()      
  const tableSelection = {
    hnames: ["EAID","Description"],
    hvalues: ["object_id","name"],
    fnames: ["EAID","Description"],
  }
  
  requestData('GET', 'http://localhost:8080/tabledb')
    .then(movies => {      
      const targetContent=createContentBox()
      
      const tabID = 'tabEA'
      createTable(targetContent, tabID)
      // Anzeige Table-Header
      putTableHeader(tabID, tableSelection);
      // Anzeige Table-Body
      putTable(tabID, tableSelection, movies);
      // Anzeige Table-Footer
      putTableFooter(tabID, tableSelection);

      // Detailsicht für eine Zeile
      // Ereignis:(Click) Zeilenweise Elemente auslesen
      $('tbody tr').click(function () {
        
      putTableDetail($(this), tableSelection, movies) 

      })
    })
}

function showTable(matrixdata) {
  const targetContent = createContentBox()

  var sources = matrixdata.source
  var targets = matrixdata.target
  var matrix = matrixdata.matrix

  // Table Data aus Matrix erzeugen

  var tablerules = []
  var indextab = 0
  matrix.forEach((node, index) => {
    if (node.action == "ALLOW") {
      var tablerule = {}
      indextab++
      var ids = node.id.split('-')
      var sourceindex = ids[0]
      var targetindex = ids[1]

      var source = sources[sourceindex]
      var target = targets[targetindex]

      tablerule["id"] = indextab
      tablerule["source"] = source["source"]
      tablerule["service"] = target["service.app"]
      tablerule["ruleid"] = node["ruleid"]

      tablerules.push(tablerule)
    }
  })

  // Sortiere Rules
  tablerules.sort(compare)

  const tableSelection = {
    hnames: ["ID", "Source", "Service/App", "RuleID"],
    hvalues: ["id", "source", "service", "ruleid"]
  }

  const tabID = 'tabFW'
  createTable(targetContent, tabID)
  // Anzeige Table-Header
  putTableHeader(tabID, tableSelection);
  // Anzeige Table-Body
  putTable(tabID, tableSelection, tablerules);

  // Auflösung von Mehrfachnennung von Source und Target ) 
  const targetDisplay = createDisplayBox()

  // const svghome = homeMatrix(targetGroup, targetDisplay)
  const svgtarget = runMatrix(matrixdata, targetDisplay)

  // Anzeige von Details nach Auswahl einer Zeile

  // $('tbody tr').click(function () {
  //   putTableDetail($(this), tableSelection, tablerules)
  // })
  $('tbody tr').click(function () {
    putAdrDetail($(this), tablerules, matrixdata)
  })
}

// Sortieren von "Arrays of Objects"
function compare(a, b) {
  // Use toUpperCase() to ignore character casing
  // const bandA = a.band.toUpperCase();
  // const bandB = b.band.toUpperCase();
  let comparison = 0;
  if (a.source > b.source) {
    comparison = 1;
  } else if (a.source < b.source) {
    comparison = -1;
  }
  return comparison;
}


export { RunTable };
// export { RunTableRow };

