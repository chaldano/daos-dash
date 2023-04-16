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

export class Canvas {
    constructor(target, width, height) {
        // this._id = "svg" + this._generateID()
        this._height = height
        this._width = width
        this._baseY = 0
        this._baseX = 0
        this._target = target
        this._unit = 0
        this._id = "svg"+target
        
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

export class Daos {
    constructor(name) {
        this.dname = name
    }
    toString() {
        return this.name
    }
}

export class Circle  {
    constructor (r){
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
        this.r  = 5
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
        this._adr = ipadr
        this._svc = service
        this._geo = 'rect'
        this._width   = 10
        this._height  = 10
    }
    get Name() {
        return this._name
    }
    get Service() {
        return this._svc
    }
    get Adr() {
        return this.__adr
    }
}

export class Service {
    constructor(name) {
        this._name = name
        this._geo = 'rect'
        this._width   = 10
        this._height  = 10
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
        this._width   = 10
        this._height  = 10
    }
    get Name() {
        return this._name
    }
    get Class() {
        return this._class
    }
}

export function setCanvas(canvas) {
    // var id = canvas.ID
    const box = d3.select('#' + canvas.Target)
    console.log("Canvas", canvas.ID)
    box
      .append('svg')
      .attr("class","canvas")
      .attr("width", canvas.Width)
      .attr("height", canvas.Height)
      .attr("id", canvas.ID)
  }