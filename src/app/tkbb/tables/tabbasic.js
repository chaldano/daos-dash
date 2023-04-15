import { DomElement } from 'TkbbFolder/dom/html.js';
// import { removeDisplayBox } from 'TkbbFolder/dom/html.js';
import { createDetailBox } from 'TkbbFolder/dom/html.js';
// import  * as Daos from 'TkbbFolder/daos.js';
// import { ShowAdrRelation } from 'TkbbFolder/eventbuttons/b-d3fwAddresses.js';




// Basisfunktionen mit Tabellen

function createTable(target, tabID) {

  // removeDisplayBox('tabBox' + tabID)
  // removeDisplayBox('displayBox')

  const TabContainer = new DomElement({ targetid: target, ownid: 'tabBox' + tabID, type: 'div' })
  TabContainer.addClass('tabBox')
  TabContainer.addClass('col')
  TabContainer.addClass('table-responsive')

  // TableHeader anlegen
  const Table = new DomElement({ targetid: 'tabBox' + tabID, ownid: tabID, type: 'table' })
  Table.addClass('table')
  // Table.addClass('table-secondary')
  // Table.addClass('table-responsive')
  Table.addClass('table-dark')
  // Table.addClass('table-light')
  Table.addClass('table-striped')
  Table.addClass('table-hover')
  // compact table
  Table.addClass('table-sm')


  // Table.addClass('table-primary')
  const TableHeader = new DomElement({ targetid: tabID, ownid: 'Header' + tabID, type: 'thead' })
  // TableHeader.addClass('table-light')
  TableHeader.addClass('thead-light')
 

  const TableBody = new DomElement({ targetid: tabID, ownid: 'Body' + tabID, type: 'tbody' })
  TableBody.addClass('table-group-divider')

  const TableFoot = new DomElement({ targetid: tabID, ownid: 'Footer' + tabID, type: 'tfoot' })
}


// Tabellen Funktionen

function putTableHeader(targetId, tableSelection) {
  var target = 'Header' + targetId

  console.log("Target", target)
  const TableHeaderTr = new DomElement({ targetid: target, ownid: 'table-header-row', type: 'tr' })
  tableSelection['hnames'].forEach((header, index) => {
    const TableHeader = new DomElement({ targetid: 'table-header-row', ownid: 'header-cell' + index, type: 'th' })
    TableHeader.addClass('table-header')
    TableHeader.addContent(header)
    TableHeader.addAttribute('scope', 'col')
  })
}


function putTable(targetId, tableSelection, tableArray) {
  var target = 'Body' + targetId

  let keys = tableSelection['hvalues'];

  tableArray.forEach((element, indexRow) => {
    const TableRow = new DomElement({ targetid: target, ownid: target + indexRow, type: 'tr' })
    keys.forEach((key, indexCell) => {
      var TableCell = new DomElement({ targetid: target + indexRow, ownid: 'table-cell' + target + indexRow + indexCell, type: 'td' })
      TableCell.addContent(element[key]);
      TableCell.addClass('table-cell');
    })
  });
}

function putTableFooter(targetId, tableSelection) {
  var target = 'Footer' + targetId
  const TableRow = new DomElement({ targetid: target, ownid: 'table-footer-row', type: 'tr' })
  tableSelection['fnames'].forEach((footer, index) => {
    if (index === 0) {
      const FooterCellH = new DomElement({ targetid: 'table-footer-row', ownid: 'footer-cell' + index, type: 'th' })
      FooterCellH.addAttribute('scope', 'row')
    } else {
      const FooterCell = new DomElement({ targetid: 'table-footer-row', ownid: 'footer-cell' + index, type: 'td' })
      FooterCell.addClass('table-primary')
    }
    let text = footer
    let cell = document.getElementById('footer-cell' + index);
    cell.innerHTML = text;
  })
}

// Die Inhalte einer ausgewählten Zeile werden als Key-Value Paare (pro Spalte) ausgelesen
// rowSelection: ausgewählte Zeile
// tableSelection: Flder einer Zeile
// tableArray: Array aus Zeilen

function putTableDetail(selectedRow, tableSelection, tableArray) {
  const tableSelectionDetail = {
    hnames: ["KEY", "Value"],
    hvalues: ["detailkey", "detailvalue"],
    fnames: ["KEY", "VALUE"],
  }

  var tabkeys = Object.keys(tableArray[0])
  var contentKey = tabkeys[0]

  const targetDetail = createDetailBox()
  var selectedContent = selectedRow.find('td:eq(0)').text()

  // Suche ausgewählte Zeile in Tabelle      
  var rowContent = getRowByIndex(contentKey, selectedContent, tableArray)
  console.log("RowContent", rowContent)

  // Extrahiere Key-Value Paare aus Zeile
  var rowDetails = getRowDetails(rowContent)
  // console.log("RowDetails",rowDetails)

  // Anzeige als Tabelle in Detailsicht 
  const tabID = 'tabDetail'
  createTable(targetDetail, tabID)
  putTable(tabID, tableSelectionDetail, rowDetails);
}


// Lese ausgewählte Zeile aus Tabelle
function getRowByIndex(contentKey, selectedContent, tabArray) {
  // Suche Key-Object im Object-Array
  // console.log("CKey", contentKey)
  // var key = tableSelection['hvalues'][0]
  var rowIndex = tabArray.findIndex(x => x[contentKey] == selectedContent);
  var rowContent = tabArray[rowIndex]
  return (rowContent)
}

// Lese Felder einer Zeile (Key-Value)
function getRowDetails(rowContent) {
  var rowContentArray = []
  let objectKeys = Object.keys(rowContent);
  objectKeys.forEach(element => {
    var Detail = {
      detailkey: element + ':',
      detailvalue: rowContent[element]
    }
    rowContentArray.push(Detail)
  })
  return rowContentArray
}

export { createTable }
export { putTable }
export { putTableDetail }
export { getRowByIndex }
export { putTableFooter }
export { putTableHeader }