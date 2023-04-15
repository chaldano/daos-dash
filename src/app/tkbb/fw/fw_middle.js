import { createContentBox } from 'TkbbFolder/dom/html.js';
import { removeContentBox } from 'TkbbFolder/dom/html.js';

import { createTable }      from 'TkbbFolder/tables/tabbasic.js';
import { putTable }         from 'TkbbFolder/tables/tabbasic.js';
import { putTableHeader }   from 'TkbbFolder/tables/tabbasic.js';

import { putAdrDetail }     from 'TkbbFolder/fw/fw_right.js';

function removeTable(matrixdata) {
  // const targetContent = createContentBox()
  removeContentBox()
}

function showTableSource(matrixdata, selectedSourceIndex) {
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

export { showTableSource };
export { removeTable };
// export { RunTableRow };

