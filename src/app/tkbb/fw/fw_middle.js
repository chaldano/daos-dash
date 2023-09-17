import { createContentBox } from 'TkbbFolder/dom/html.js';
import { removeContentBox } from 'TkbbFolder/dom/html.js';

// import { createTable }      from 'TkbbFolder/tables/tabbasic.js';
// import { putTable }         from 'TkbbFolder/tables/tabbasic.js';
// import { putTableHeader }   from 'TkbbFolder/tables/tabbasic.js';
import * as tab from 'TkbbFolder/tables/tabbasic.js';


// import { prepareZoneDetail }     from 'TkbbFolder/fw/fw_right.js';
import * as right     from 'TkbbFolder/fw/fw_right.js';

function removeTable(matrixdata) {
  // const targetContent = createContentBox()
  removeContentBox()
}

function showTableSource(matrixdata, selectedSourceIndex) {
  const targetContent = createContentBox()

  var sources = matrixdata.sourceNodes
  var targets = matrixdata.serviceNodes
  var matrix = matrixdata.matrix
  console.log("Matrix-Table",matrix)
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
      console.log("Split:",ids)
      if (sourceindex == selectedSourceIndex) {
        var source = sources[sourceindex]
        var target = targets[targetindex]
        tablerule["id"] = indextab
        tablerule["source"] = source["source"]
        tablerule["service"] = target["service.app"]
        tablerule["ruleid"] = node["ruleid"]
        tablerules.push(tablerule)
      }
    }
  // showRule(sources,targets)
  
  })

  // Sortiere Rules
  tablerules.sort(compare)
// console.log("TableRules", tablerules)
  const tableSelection = {
    // hnames: ["ID", "Source", "Service/App", "R-ID","R-UUID"],
    // hvalues: ["id", "source", "service", "ruleid","ruleuid",]
    hnames: ["ID", "Source", "Service/App", "R-ID"],
    hvalues: ["id", "source", "service", "ruleid"]
  }

  const tabID = 'tabFW'
  tab.createTable(targetContent, tabID)
  // Anzeige Table-Header
  tab.putTableHeader(tabID, tableSelection);
  // Anzeige Table-Body
  console.log("TableRules",tablerules)
  tab.putTable(tabID, tableSelection, tablerules);

  $('tbody tr').click(function () {
    let tabkeys = Object.keys(tablerules[0])
    let contentKey = tabkeys[0]
    let selectedContent = $(this).find('td:eq(0)').text()
    // Suche ausgewählte Zeile in Tabelle      
    let rowContent = tab.getRowByIndex(contentKey, selectedContent, tablerules)
    
    let sourceZone = rowContent.source
    let targetZone = matrixdata.zone
    let serviceapp = rowContent.service
    let data = matrixdata

    right.prepareZoneDetail(sourceZone, targetZone,serviceapp,data)
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
function showRule(source,target){
  console.log("Show selected Rule")
  console.log(source)
  console.log(target)
}
export { showTableSource };
export { removeTable };
// export { RunTableRow };

