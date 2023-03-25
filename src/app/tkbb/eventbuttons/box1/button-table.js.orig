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


export { RunTable };
// export { RunTableRow };

