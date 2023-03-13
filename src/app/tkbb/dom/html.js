
class DomElement {
    constructor({ targetid, ownid, type }) {

        this._targetid = targetid;
        this._ownid = ownid;
        this._domtype = type;
        this._class = ''
        this._attributes = [];

        let node = document.getElementById(this._targetid);
        let element = document.createElement(this._domtype);
        element.id = this._ownid;
        node.appendChild(element);
    }
    addClass(className) {
        let element = document.getElementById(this._ownid);
        element.classList.add(className);
    }
    removeClass(className) {
        let element = document.getElementById(this._ownid);
        element.classList.remove(className);
    }
    addAttribute(attrName, attrValue) {
        let element = document.getElementById(this._ownid);
        element.setAttribute(attrName, attrValue);
    }
    removeAttribute(attrName) {
        let element = document.getElementById(this._ownid);
        element.removeAttribute(attrName);
    }
    addContent(domelementContent) {
        let element = document.getElementById(this._ownid);
        element.innerHTML = domelementContent;
    }
    removeContent(elementID) {
        let element = document.getElementById(this._ownid);
        element.innerHTML = "";
    }
    removeElement() {
        let element = document.getElementById(this._ownid);
        element.parentElement.removeChild(this._ownid);
    }
}

// Funktionen zur Button-Registrierung

function removeDomElement(targetID) {

    let node = document.getElementById(targetID);
    if (node.parentNode) {
        node.parentNode.removeChild(node);
    }
}

// function registerButtonFunction(buttonId, buttonFunction) {
//     $(document).ready(function(){
//       $('button#'+buttonId).on("click",buttonFunction)
//     }
//     )}


// Display Funktionen

function createDisplayBox() {
    const boxID = 'displayBox'
    removeBox(boxID)
    const DisplayBox = new DomElement({ targetid: 'displayRow', ownid: boxID, type: 'div' })
      DisplayBox.addClass('col')
      DisplayBox.addClass('bg-info')
      DisplayBox.addClass('text-white')  
      DisplayBox.addClass('monitor')
    return boxID
    }
function removeAllBox(){
    removeDisplayBox()
    removeContentBox()
    removeDetailBox
}

function removeDisplayBox() {
    const boxID = 'displayBox'
    removeBox(boxID)
    }

function createContentBox() {
    const boxID = 'contentBox'
    removeBox(boxID)
    const ContentBox = new DomElement({ targetid: 'leftid', ownid: boxID, type: 'div' })
      ContentBox.addClass('boxContent')      
    return boxID
    }
function removeContentBox() {
    const boxID = 'contentBox'
    removeBox(boxID)
    }

function createDetailBox() {
    const boxID = 'detailBox'
    removeBox(boxID)
    const FormBox = new DomElement({ targetid: 'rightid', ownid: boxID, type: 'div' })
      FormBox.addClass('boxDetail')
    return boxID
    }

function removeDetailBox() {
    const boxID = 'detailBox'
    removeBox(boxID)
    }


  // Funktion zur Löschung einer Display-Box
function removeBox(boxID) {
  let existBox = !!document.getElementById(boxID);
    if (existBox) {
      removeDomElement(boxID)
    }
}



function registerFormFunction(formId, submitFunction) {
    // console.log("id:=" + navid);
    let b = document.getElementById(formId);
    // Registriere Funktion
    b.addEventListener('submit', submitFunction);
}

function listRecordSelection(tHeader, tValue) {

    tHeader.forEach((element, index) => {
        console.log("(" + index + ") " + element + ": " + tValue[index])
    })

}

function listRecordSelectionHTML(tid, tHeader, tValue) {

    
    const Record = new DomElement({ targetid: tid, ownid: 'recordid', type: 'div' })
      
    tHeader.forEach((element, index) => {
        console.log("(" + index + ") " + element + ": " + tValue[index])
        
        const Label = new DomElement({ targetid: 'recordid', ownid: 'label'+index, type: 'label' })
          Label.addContent(element)
        
          const Output = new DomElement({ targetid: 'recordid', ownid: 'output'+index, type: 'output' })
          Output.addAttribute('for','label'+index)
          Output.addContent(tValue[index])
    })
    
}


// export { registerButtonFunction };
export { registerFormFunction };
export { listRecordSelection };
export { listRecordSelectionHTML };
export { DomElement };
export { removeDomElement };

export { createDisplayBox };
export { createContentBox };
export { createDetailBox };
export { removeDisplayBox };
export { removeContentBox };
export { removeDetailBox };

export { removeAllBox };
