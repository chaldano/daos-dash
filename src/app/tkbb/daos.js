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
    constructor(id, height, weight) {
        // this._id = "svg" + this._generateID()
        this._id = id
        this._height = height
        this._weight = weight
        this._baseY = 0
        this._baseX = 0

    }
        
    get ID() {
        return this._id
    }
    set BaseX(x) {
        this._baseX = x
    }
    set BaseY(y) {
        this._baseY = y
    }
    get BaseX() {
        return this._baseX
    }
    get BaseY() {
        return this._baseY
    }
    get Weight() {
        return this._weight
    }
    get Height() {
        return this._height
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

