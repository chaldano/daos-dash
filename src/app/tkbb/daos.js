// Objektklassen 

export const coordinates = {
    xd: 0,
    yd: 0,
    weight: 0,
    height: 0
}

export const circle = {
    cr: 0,
    xr: 0,
    yr: 0
}

// Canvas: Klasse zur Steuerung von Anzeigebereichen
export class Canvas {
    constructor(target, width, height) {
        // this._id = "svg" + this._generateID()
        this._height = height
        this._width = width
        this._baseY = 0
        this._baseX = 0
        this._target = target
        this._unit = 0
        this._id = "canvas" + target

    }

    get ID() {
        return this._id
    }
    get Target() {
        return this._target
    }
    set BaseX(x) {
        this._baseX = x
    }
    set BaseY(y) {
        this._baseY = y
    }
    set Unit(x) {
        this._unit = x
    }
    set ObjWidth(x) {
        this._objwidth = x
    }
    get BaseX() {
        return this._baseX
    }
    get BaseY() {
        return this._baseY
    }
    get Width() {
        return this._width
    }
    get Height() {
        return this._height
    }
    get Unit() {
        return this._unit
    }
    get ObjWidth() {
        return this._objwidth
    }

    // _generateID() {
    //     return Math.random();
    // }
}

// Funktion zum Anlegen einer Canvas

export function setCanvas(canvas) {
    // Wähle container aus
    const box = d3.select('#' + canvas.Target)
    // console.log("Canvas", canvas.ID)
    box
        .append('svg')
        .attr("class", "canvas")
        .attr("width", canvas.Width)
        .attr("height", canvas.Height)
        .attr("id", canvas.ID)
}

export function setCanvasRes(target, height, width) {
    // Wähle container aus
    const canbox = d3.select('#' + target)
    const canid = "canvas" + target
    const svgid = "svg" + canid

    // console.log("Canvas", canvas.ID)
    canbox
        // .append('canvas')
        // .attr("class", "canvas")
        // .attr("width", width)
        // .attr("height", height)
        // .attr("id", canid)
        // svg anlegen

        .append('svg')
        .classed("svg-content", true)
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 " + width + " " + height + "")
        .attr("id", svgid)
    return svgid
}


// Klasse für einen Raum
export class Daos {
    constructor(name) {
        this.dname = name
    }
    toString() {
        return this.name
    }
}

export class Circle {
    constructor(r) {
        this._r = r
        this._x = 0
        this._y = 0
    }
}

export class Net {
    constructor(name, ipadr) {
        this._name = name
        this._adr = ipadr
        this.geo = 'circle'
        this.r = 5
    }
    get Name() {
        return this._name
    }
    get Adr() {
        return this.__adr
    }
}

export class Proxy {
    constructor(name, ipadr, service) {
        this._name = name
        this.pointtype = 'proxy'
        this.adr = ipadr
        this._svc = service
        this._geo = 'rect'
        this._width = 10
        this._height = 10
    }
    get Name() {
        return this._name
    }
    get Service() {
        return this._svc
    }
    get Adr() {
        return this.adr
    }
}

export class Service {
    constructor(name) {
        this._name = name
        this._geo = 'rect'
        this._width = 10
        this._height = 10
    }
    get Name() {
        return this._name
    }
}
export class Zone {
    constructor(name, type) {
        this._name = name,
            this._class = type
        this._geo = 'rect'
        this._width = 20
        this._height = 10
        this._test = 5
    }
    get Name() {
        return this._name
    }
    get Class() {
        return this._class
    }
    set Width(x) {
        this._width = x
    }
}

// Berechnet aus einer Feldlänge eine passene Witdh für die Abbildung 
// in einer viewBox
export function WidthResolution(a) {

    const hres = 300

    let restvalue = {
        ganz: 0,
        diff: 0
    }

    restvalue.ganz = Math.floor(a / hres)
    restvalue.diff = a % hres

    console.log("Ganz", restvalue.ganz)
    console.log("Rest", restvalue.diff)

    let screenwidth = restvalue.ganz * hres
    if (restvalue.diff > 0) {
        screenwidth = screenwidth + hres
    }
    return screenwidth

}
