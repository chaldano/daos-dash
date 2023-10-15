
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


function removeAllBox() {
    removeDisplayBox()
    removeContentBox()
    removeDetailBox()
    removeTaskBox()
}

function createDisplayBox() {
    const boxID = 'displayBoxID'
    removeBox(boxID)
    const DisplayBox = new DomElement({ targetid: 'upperid', ownid: boxID, type: 'div' })
    // DisplayBox.addClass('col')
    // DisplayBox.addClass('bg-info')
    // DisplayBox.addClass('text-white')
    DisplayBox.addClass('displayBox')
    DisplayBox.addClass('svg-container')
    return boxID
}

function removeDisplayBox() {
    const boxID = 'displayBoxID'
    removeBox(boxID)
}


function createTaskBox() {
    const boxID = 'taskBoxID'
    removeBox(boxID)
    const TaskBox = new DomElement({ targetid: 'leftid', ownid: boxID, type: 'div' })
    TaskBox.addClass('taskBox')
    TaskBox.addClass('position-relative')
    TaskBox.addClass('d-flex')
    TaskBox.addClass('justify-content-center')
    return boxID
}
function removeTaskBox() {
    const boxID = 'taskBox'
    removeBox(boxID)
}


function createContentBox() {
    const boxID = 'contentBoxID'
    removeBox(boxID)
    const ContentBox = new DomElement({ targetid: 'middleid', ownid: boxID, type: 'div' })
    ContentBox.addClass('contentBox')
    return boxID
}
function removeContentBox() {
    const boxID = 'contentBoxID'
    removeBox(boxID)
}

function createDetailBox() {
    const boxID = 'detailBoxID'
    removeBox(boxID)
    const DetailBox = new DomElement({ targetid: 'rightid', ownid: boxID, type: 'div' })
    DetailBox.addClass('detailBox')
    DetailBox.addClass('position-relative')
    DetailBox.addClass('d-flex')
    DetailBox.addClass('justify-content-center')
    return boxID
}

function removeDetailBox() {
    const boxID = 'detailBoxID'
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
        // console.log("(" + index + ") " + element + ": " + tValue[index])
    })

}

function listRecordSelectionHTML(tid, tHeader, tValue) {


    const Record = new DomElement({ targetid: tid, ownid: 'recordid', type: 'div' })

    tHeader.forEach((element, index) => {
        // console.log("(" + index + ") " + element + ": " + tValue[index])

        const Label = new DomElement({ targetid: 'recordid', ownid: 'label' + index, type: 'label' })
        Label.addContent(element)

        const Output = new DomElement({ targetid: 'recordid', ownid: 'output' + index, type: 'output' })
        Output.addAttribute('for', 'label' + index)
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
export { createTaskBox };
export { removeDisplayBox };
export { removeContentBox };
export { removeDetailBox };
export { removeTaskBox };

export { removeAllBox };
