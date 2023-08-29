import * as tab from 'TkbbFolder/tables/tabbasic.js';
import * as main from 'TkbbFolder/fw/fw_main.js';
import * as dom from 'TkbbFolder/dom/html.js';

import * as d3 from "d3";
import * as daos from 'TkbbFolder/daos.js';
import { max } from 'd3';
// import { drawFirewall } from './fw_main';


function prepareIPDetail(par, ipadr) {

  let sadripService = par['sourcesService']
  let serviceKey = par['servicekey']

  var targets = []
  var sources = []
  // var prx = []

  if (ipadr.pointtype == "src") {
    let adrobj = {}
    adrobj['adr'] = ipadr.adr
    adrobj['pointtype'] = "src"
    sources.push(adrobj)

    sadripService[serviceKey].forEach(rule => {
      let adrobj = {}
      if (rule.sadr == ipadr.adr) {
        adrobj['adr'] = rule.dadr
        adrobj['pointtype'] = "dst"
        targets.push(adrobj)
      }
    })
  }

  if (ipadr.pointtype == "dst") {
    let adrobj = {}
    adrobj['adr'] = ipadr.adr
    adrobj['pointtype'] = "dst"
    targets.push(adrobj)

    sadripService[serviceKey].forEach(rule => {
      let adrobj = {}
      if (rule.dadr == ipadr.adr) {
        adrobj['adr'] = rule.sadr
        adrobj['pointtype'] = "src"
        sources.push(adrobj)
      }
    })
  }

  if (ipadr.pointtype == "proxy") {
    sources = par['sourcesPush']
    targets = par['targetsPush']
  }

  par['sources'] = sources
  par['targets'] = targets

  firewallRules(par)

}

export function prepareZoneDetail(selectedSourceZone, selectedTargetZone, selectedService, data) {

  let sadrip        = data.sadrip
  let sadripService = data.sadripService

  console.log("sadrip-all", sadrip)
  console.log("sadrip-byService", sadripService)
  console.log("SelectedService", selectedService)

  let serviceKey = `${selectedSourceZone}-${selectedService}`
  var targets = []
  var sources = []
  // var prx = []

  sadrip[serviceKey].dadr.forEach(adr => {
    let adrobj = {}
    adrobj['adr'] = adr
    adrobj['pointtype'] = "dst"
    targets.push(adrobj)
  })

  sadrip[serviceKey].sadr.forEach(adr => {
    let adrobj = {}
    adrobj['adr'] = adr
    adrobj['pointtype'] = "src"
    sources.push(adrobj)
  })

  console.log("Selektierte: sadrip-source", sources)
  console.log("Selektierte: sadrip-target", targets)

  var zones = []
  // let sz = new daos.Zone(rowContent.source, 'sourcezone')
  let sz = new daos.Zone(selectedSourceZone, 'sourcezone')
  let tz = new daos.Zone(selectedTargetZone, 'targetzone')
  zones.push(sz)
  zones.push(tz)

  var proxy = []
  // let prx = new daos.Proxy("PaloAlto", "10.10.1.200", rowContent.service)
  let prx = new daos.Proxy("PaloAlto", "10.10.1.200", selectedService)
  proxy.push(prx)

  // var service = new daos.Service(rowContent.service)
  var service = new daos.Service(selectedService)

  let par = {}
  
  // Sichern der Haupauswahl in den Stack (Push)
  par['sourcesPush'] = sources
  par['targetsPush'] = targets
  
  par['proxy'] = proxy
  par['sources'] = sources
  par['targets'] = targets
  
  par['zones'] = zones
  par['sourcesService'] = sadripService
  par['servicekey'] = serviceKey

  firewallRules(par)
}
// Übernahme der Daten und seitenweise (Pages) Anzeige der Firewall-Rules

function firewallRules(par) {
  // par['sreenWidth'] = "750"
  // par['sreenHeight'] = "300"
  par['sreenWidth'] = "1000"
  par['sreenHeight'] = "500"
  
  par['unit'] = 15
  par['objwidth'] = 12 * par['unit']
  par['BaseX'] = par['sreenWidth'] / 2 - par['objwidth'] / 2;
  par['BaseY'] = par['sreenHeight'] / 2 - par['objwidth'] / 2;


  par['rl'] = 5                   // Radius einer Node
  par['dl'] = 5 * par['rl']       // Abstand zwischen Nodes = 6 * Radius
  par['plength'] = par['proxy'].length
  par['slength'] = par['sources'].length
  par['tlength'] = par['targets'].length
  par['zlength'] = par['zones'].length
  par['maxNodes'] = 7             // max. Anzahl sichtbarer Nodes

  // Max. Ganzahlige Menge an SourcePages
  par['SPageMax'] = Math.floor(par['slength'] / par['maxNodes'])
  if (par['slength'] % par['maxNodes'] > 0) {
    par['SPageMax']++
  }
  // Rest für letzte Page
  par['SPageRest'] = par['slength'] % par['maxNodes']
  par['SPageCurrent'] = 0

  // Max. Ganzzahlige Menge an TargetPages
  par['TPageMax'] = Math.floor(par['tlength'] / par['maxNodes'])
  // console.log("MaxTargetPages:",par['TPageMax'])
  if (par['tlength'] % par['maxNodes'] > 0) {
    par['TPageMax']++
  }
  // Rest für letzte Page
  par['TPageRest'] = par['tlength'] % par['maxNodes']
  // console.log("TargetPageRest:",par['TPageRest'])

  par['TPageCurrent'] = 0

  // Anzeige Header 
  par['header'] = 13              // Max. Anzahl Zeichen im Header
  par['charlength'] = 6.92  // Pixel pro Zeichen

  // Zonen ausrichten
  par['xl'] = par['BaseX'] - par['objwidth'] / 2 / 2
  par['yl'] = par['BaseY']
  par['heightz'] = 20
  par['yz'] = par['BaseY'] - par['heightz']

  // par['canvas'] = canvas






  showFirewallPage(par)


}

function showFirewallPage(parameter) {

  const target = dom.createDetailBox()

  let par = parameter
  par['target'] = target

  const canvas = new daos.Canvas(target, par['sreenWidth'], par['sreenHeight'])
  canvas.BaseX = par['BaseX'];
  canvas.BaseY = par['BaseY'];
  canvas.Unit = par['unit']
  canvas.ObjWidth = par['objwidth'];

  daos.setCanvas(canvas, target)
  main.drawFirewall(canvas)


  let proxyW = par['proxy']
  let sourcesW = par['sources']
  let targetsW = par['targets']

  // console.log("TargetsW",targetsW)
  // console.log("TCurrentPage",par['TPageCurrent'])

  let zonesW = par['zones']

  // Setze Navigation
  if (par['SPageCurrent'] == 0 && par['SPageMax'] > 1) {
    // resLeftButtonUp(target)
    setLeftButtonDown(par)
  }
  if (par['SPageCurrent'] > 0 && par['SPageCurrent'] < par['SPageMax'] - 1) {
    // resLeftButtonUp(target)
    setLeftButtonDown(par)
  }

  if (par['SPageCurrent'] > 0) {
    setLeftButtonUp(par)
  }
  if (par['TPageCurrent'] == 0 && par['TPageMax'] > 1) {
    // resRightButtonUp(target)
    setRightButtonDown(par)
  }
  if (par['TPageCurrent'] > 0 && par['TPageCurrent'] < par['TPageMax'] - 1) {
    setRightButtonDown(par)
  }
  if (par['TPageCurrent'] > 0) {
    setRightButtonUp(par)
  }


  // Source-List
  par['xl'] = canvas.BaseX - par['rl']
  par['yl'] = canvas.BaseY


  let diff = par['maxNodes']
  if (par['SPageCurrent'] == par['SPageMax'] - 1) {
    if (par['SPageRest'] > 0) {
      diff = par['SPageRest']
    }
  }
  par['yl'] = smartY(diff, par)

  let sourceP = []
  if (par['SPageMax'] > 1) {
    sourceP = sourcesW.slice(par['SPageCurrent'] * par['maxNodes'], (par['SPageCurrent'] + 1) * par['maxNodes'])
    // setLeftButtonDown(target)
  }
  else {
    sourceP = sourcesW.slice()
  }
  // Setze Source-Points

  // setPoints(sourceP, 'src', par, canvas.ID)
  setPoints(sourceP, par, canvas.ID, "psid")

  // Destination List
  par['xl'] = canvas.BaseX + canvas.ObjWidth + par['rl']
  par['yl'] = canvas.BaseY

  diff = par['maxNodes']
  if (par['TPageCurrent'] == par['TPageMax'] - 1) {
    if (par['TPageRest'] > 0) {
      diff = par['TPageRest']
    }
  }
  par['yl'] = smartY(diff, par)

  // Page of Target: Load page based on TPageCurrent
  let targetP = []
  if (par['TPageMax'] > 1) {
    targetP = targetsW.slice(par['TPageCurrent'] * par['maxNodes'], (par['TPageCurrent'] + 1) * par['maxNodes'])
  }
  else {
    targetP = targetsW.slice()
  }

  // Setze Target-Points
  // setPoints(targetP, 'dst', par, canvas.ID)
  setPoints(targetP, par, canvas.ID, "ptid")

  // Proxy
  par['xl'] = canvas.BaseX + canvas.ObjWidth / 2
  par['yl'] = canvas.BaseY + canvas.ObjWidth / 2
  par['objwidth'] = canvas.ObjWidth

  // Setze Proxy-Point
  // setPoints(proxyW, 'proxy', par, canvas.ID)
  setPoints(proxyW, par, canvas.ID, "ppid")
  // drawLinkLine(proxy, sourceW, targetsW, par, canvas.ID)

  drawLink(proxyW, sourceP, targetP, par, canvas.ID)

  // Anzeige Zonen
  par['xl'] = canvas.BaseX
  par['objwidth'] = canvas.ObjWidth

  let sz = zonesW[0].Name
  let tz = zonesW[1].Name

  zonesW[0].Width = canvas.ObjWidth / 2
  zonesW[1].Width = canvas.ObjWidth / 2

  if ((canvas.ObjWidth / 2 / sz.length < par['charlength']) || ((canvas.ObjWidth / 2 / tz.length < par['charlength']))) {
    let max = sz.length > tz.length ? sz.length : tz.length

    // var diff = (max-par['zeichenbreite']) * par['zeichenbreite']
    diff = (max - par['header']) * par['charlength']

    // Verschiebung der x-Koordinate
    par['xl'] = par['xl'] - diff
    par['objwidth'] = canvas.ObjWidth + 2 * diff
  }

  setZones(zonesW, par, canvas.ID)


  // $('circle').on("click", function () {
  //   console.log("Click auf Kreis: ",$(this))
  // })

}


function setPageRightDown(par) {
  // var targetP = targets.slice(par['TPageCurrent'] * par['maxNodes'], (par['TPageCurrent'] + 1) * par['maxNodes'])
  par['TPageCurrent']++
  // dom.removeDetailBox()
  showFirewallPage(par)

}
function setPageRightUp(par) {
  // var targetP = targets.slice(par['TPageCurrent'] * par['maxNodes'], (par['TPageCurrent'] + 1) * par['maxNodes'])
  par['TPageCurrent']--
  // dom.removeDetailBox()
  showFirewallPage(par)

}
function setPageLeftDown(par) {
  // var targetP = targets.slice(par['TPageCurrent'] * par['maxNodes'], (par['TPageCurrent'] + 1) * par['maxNodes'])
  par['SPageCurrent']++
  // dom.removeDetailBox()
  showFirewallPage(par)

}
function setPageLeftUp(par) {
  // var targetP = targets.slice(par['TPageCurrent'] * par['maxNodes'], (par['TPageCurrent'] + 1) * par['maxNodes'])
  par['SPageCurrent']--
  // dom.removeDetailBox()
  showFirewallPage(par)

}


function setRightButtonDown(par) {

  const target = par['target']

  const RightDown = new dom.DomElement({ targetid: target, ownid: 'PageRightDownID', type: 'button' })
  RightDown.addClass('btn')
  // RightDown.addClass('btn-primary')
  RightDown.addClass('btn-default')
  RightDown.addClass('btn-sm')
  RightDown.addAttribute('role', 'button')
  // RightDown.addAttribute('href', 'RunAnalyse')
  // RightDown.addContent('Page')
  RightDown.addClass('position-absolute')
  RightDown.addClass('bottom-0')
  RightDown.addClass('start-50')
  // RightDown.addClass('me-2')
  RightDown.addClass('mb-5')
  RightDown.addClass('pb-2')

  const ArrowRightDown = new dom.DomElement({ targetid: 'PageRightDownID', ownid: 'ArrowRightDownID', type: 'span' })
  // Arrow.addContent('DownArrow')
  ArrowRightDown.addClass('arrow')
  ArrowRightDown.addClass('down')

  $('#PageRightDownID').on("click", function () {
    setPageRightDown(par)
  })

}

function setRightButtonUp(par) {
  const target = par['target']

  const RightUp = new dom.DomElement({ targetid: target, ownid: 'PageRightUpID', type: 'button' })
  RightUp.addClass('btn')
  // RightUp.addClass('btn-primary')
  RightUp.addClass('btn-default')
  RightUp.addClass('btn-sm')
  RightUp.addAttribute('role', 'button')
  // RightUp.addAttribute('href', 'RunAnalyse')
  // RightUp.addContent('Page')
  RightUp.addClass('position-absolute')
  RightUp.addClass('top-50')
  RightUp.addClass('start-50')
  RightUp.addClass('mt-5')
  RightUp.addClass('pt-3')

  const ArrowRightUp = new dom.DomElement({ targetid: 'PageRightUpID', ownid: 'ArrowRightUpID', type: 'span' })
  ArrowRightUp.addClass('arrow')
  ArrowRightUp.addClass('up')

  $('#PageRightUpID').on("click", function () {
    setPageRightUp(par)
  })

}

function resRightButtonUp() {
  var targetID = 'PageRightUpID'
  dom.removeDomElement(targetID)
}
function setLeftButtonDown(par) {

  const target = par['target']

  const LeftDown = new dom.DomElement({ targetid: target, ownid: 'PageLeftDownID', type: 'button' })
  LeftDown.addClass('btn')
  // LeftDown.addClass('btn-primary')
  LeftDown.addClass('btn-default')
  LeftDown.addClass('btn-sm')
  LeftDown.addAttribute('role', 'button')
  // LeftDown.addAttribute('href', 'RunAnalyse')
  // LeftDown.addContent('Page')
  LeftDown.addClass('position-absolute')
  LeftDown.addClass('bottom-0')
  LeftDown.addClass('end-50')
  LeftDown.addClass('pb-2')
  LeftDown.addClass('mb-5')


  const ArrowLeftDown = new dom.DomElement({ targetid: 'PageLeftDownID', ownid: 'ArrowLeftDownID', type: 'span' })
  // Arrow.addContent('DownArrow')
  ArrowLeftDown.addClass('arrow')
  ArrowLeftDown.addClass('down')

  $('#PageLeftDownID').on("click", function () {
    // console.log("PageLeftDown-Click")
    setPageLeftDown(par)

  })

}

function setLeftButtonUp(par) {
  const target = par['target']

  const LeftUp = new dom.DomElement({ targetid: target, ownid: 'PageLeftUpID', type: 'button' })
  LeftUp.addClass('btn')
  // LeftUp.addClass('btn-primary')
  LeftUp.addClass('btn-default')
  LeftUp.addClass('btn-sm')
  LeftUp.addAttribute('role', 'button')
  // LeftUp.addAttribute('href', 'RunAnalyse')
  // LeftUp.addContent('Page')
  LeftUp.addClass('position-absolute')
  LeftUp.addClass('top-50')
  LeftUp.addClass('end-50')
  LeftUp.addClass('mt-5')
  LeftUp.addClass('pt-3')


  const ArrowLeftUp = new dom.DomElement({ targetid: 'PageLeftUpID', ownid: 'ArrowLeftUpID', type: 'span' })
  // Arrow.addContent('DownArrow')
  ArrowLeftUp.addClass('arrow')
  ArrowLeftUp.addClass('up')

  $('#PageLeftUpID').on("click", function () {
    // console.log("PageLeftUp-Click")
    setPageLeftUp(par)
  })
}

function resLeftButtonUp() {
  var targetID = 'PageLeftUpID'
  dom.removeDomElement(targetID)
}
// Berechnet den symmetrischen Versatz zwischen den Nodes, 
// wenn mehr als eine Node vorhanden
function smartY(diff, par) {
  // var y = (par.yl + par.objwidth/2) - ((diff-1) * par.dl + (diff-1)*par.rl)/2
  var y = (par.yl + par.objwidth / 2) - ((diff - 1) * par.dl) / 2
  return y
}

function setPoints(plist, par, target, pid) {

  let source = d3.select("#" + target)
  source
    .append("g")
    .attr("id", pid)
    .selectAll("circle")
    .data(plist)
    // .join('circle')
    .enter()
    .append("circle")
    .attr("class", (d, i) => { return d.pointtype })
    .attr("id", (d, i) => {
      if (d.pointtype == "src") {
        return d.pointtype + (par['SPageCurrent'] * par['maxNodes'] + i)
      }
      if (d.pointtype == "dst") {
        return d.pointtype + (par['TPageCurrent'] * par['maxNodes'] + i)
      }
      if (d.pointtype == "proxy") {
        return d.pointtype + i
      }

    })
    .attr("adr", (d, i) => { return d.adr })
    .attr("cx", (d) => {
      d['cx'] = par.xl
      return par.xl
    })
    .attr("cy", (d, i) => {
      d['cy'] = par.yl + i * par.dl
      return d['cy']
    })
    .attr("r", (d, i) => {
      d['r'] = par.rl
      return d['r']
    })


    // const box = d3.select('#' + target)
    // box.selectAll("rect.grid").on("mouseover", gridOver);

    .on("mouseover", function (event, d) {
      console.log("Over-Point:", d)
    })

  source.selectAll("circle").on("click", resolveIPLinks);

  // .style("fill-opacity", d => d.weight * .2)
  function resolveIPLinks(event, d) {
    if (d.pointtype == "src") {
      console.log("Click src", d.adr)
      console.log("Page", par['SPageCurrent'])
      prepareIPDetail(par, d)
    }
    if (d.pointtype == "dst") {
      console.log("Click dst", d.adr)
      prepareIPDetail(par, d)

    }
    if (d.pointtype == "proxy") {
      console.log("Click proxy", d.adr)
      prepareIPDetail(par, d)
    }
  }

}

// function selectsrc(event, d) {
//   console.log("Click-Point:", d)
//   console.log("Objekte:",plist)
//   // if (matrixState == "Selected") {
//   //   // Status aufheben
//   //   matrixState = "Selectable"
//   //   box.selectAll("rect.gridselected").attr("class", p => { return "gridovered" })
//   //   removeTable()
//   // }
//   // else {
//   //   // Status setzen
//   //   matrixState = "Selected"
//   //   var index
//   //   box.selectAll("rect.gridovered").attr("class", p => { 
//   //     index = p.y
//   //     return "gridselected" })
//   //   // p.y kennzeichnet die selektierte Zeile
//   //   showTableSource(matrixdata, index)
//   // }
// }

// Setze vertikale Zonen
function setZones(zlist, par, target) {
  let zone = d3.select("#" + target)
  zone
    .append("g")
    .selectAll("rect")
    .data(zlist)
    .enter()
    .append("rect")
    .attr("id", (d) => { return d.Name })
    .attr("class", (d) => { return d.Class })
    .attr("x", (d, i) => {
      d['x'] = par.xl + i * par['objwidth'] / 2
      return d['x']
    })
    .attr("y", (d, i) => {
      d['y'] = par.yz
      return d['y']
    })
    .attr("width", d => {
      d['width'] = par['objwidth'] / 2
      return d['width']
    })
    .attr("height", (d, i) => {
      d['height'] = par.heightz
      return par.heightz
    })
  // Setze Zonen-Text 
  zone
    .append("g")
    .selectAll("rect")
    .data(zlist)
    // .join('circle')
    .enter()
    .append("text")
    .text((d) => d.Name)
    .attr("x", (d) => { return (d.x + d.width / 2) })
    .attr("y", (d) => { return (d.y + d.height * 2 / 3) })
    .classed("zone", true)
    .style("fill", "white")
    .style("text-anchor", "middle")



  // .style("fill-opacity", d => d.weight * .2)


}
// Zeichne Links und beschrifte Endpunkte
function drawLink(proxy, sourceW, targets, par, targetid) {

  // Proxy
  let fw = proxy[0]
  // console.log("fw",fw)
  let NodeData = []

  let linkObject = {}
  linkObject['id'] = fw['net']
  linkObject['position'] = [fw['cx'], fw['cy']]
  linkObject['parentposition'] = [fw['cx'], fw['cy']]
  NodeData.push(linkObject)

  // Verbinde sourceW mit Proxy
  // console.log("SourceW",sourceW)

  sourceW.forEach(source => {
    let linkObject = {}
    linkObject['id'] = source['net']
    linkObject['position'] = [source['cx'] + source['r'], source['cy']]
    linkObject['parentposition'] = [fw['cx'] - fw['r'], fw['cy']]
    NodeData.push(linkObject)
  });

  // Verbinde Targets mit Proxy
  // console.log("Target",targets)

  targets.forEach(target => {
    let linkObject = {}
    linkObject['id'] = target['net']
    linkObject['position'] = [target['cx'] - target['r'], target['cy']]
    linkObject['parentposition'] = [fw['cx'] + fw['r'], fw['cy']]
    NodeData.push(linkObject)
  });
  // console.log("NodeData",NodeData)

  let link = d3.linkHorizontal()
  link
    .source(d => d.parentposition)
    .target(d => d.position);

  d3.select("#" + targetid)
    .selectAll("path")
    .data(NodeData)
    .join("path")
    .attr("d", link)
    .attr("fill", "none")
    .attr("stroke", "white");

  // Destination-Text
  d3.select('#ptid')
    .selectAll("text")
    .data(targets)
    .enter()
    .append("text")
    // .join("text")
    .text((d) => d.adr)
    .attr("x", (d) => { return d.cx + 2 * d.r })
    .attr("y", (d) => { return d.cy + d.r / 2 })
    // .attr("y", (d) => { return d.cy })
    .attr("class", "zone")
    .style("fill", "white")
    .style("text-anchor", "start")

  // Sourcen-Text 
  d3.select('#psid')
    .selectAll("text")
    .data(sourceW)
    .enter()
    .append("text")
    // .text((d) => d.adr)
    .text((d) => d.adr)
    .attr("x", (d) => { return d.cx - 2 * d.r })
    .attr("y", (d) => { return d.cy + d.r / 2 })
    // .attr("y", (d) => { return d.cy })
    .attr("class", "zone")
    .style("fill", "white")
    .style("text-anchor", "end")

  d3.select('#ppid')
    .selectAll("text")
    .data(proxy)
    .enter()
    .append("text")
    // .text((d) => { return d.Name+"("+d.Service+")" })
    .text((d) => { return d.Service })
    .attr("x", (d) => { return d.cx })
    // .attr("y", (d) => { return d.cy + 3 * par.dl })
    .attr("y", (d) => {
      // console.log("Cy",d.cy)
      // console.log("Längen:", par.objwidth)
      // console.log("DL:",3*par.dl)
      return d.cy + par.objwidth / 1.5
    })

    .classed("zone", true)
    .style("fill", "white")
    // .style("opacity", 0.5)
    .style("background", "blue")
    .style("text-anchor", "middle")
  // .style("writing-mode", "horizontal-tb") // from Top to Bottom
  // .attr("transform", (d) => { return "translate(" + d.cx + "," + d.cy + ") rotate(90)"})

}
function drawLinkLine(proxy, sourceW, targets, par, targetid) {

  // Proxy
  var fw = proxy[0]
  // console.log("fw:")
  // console.log(fw)

  var linkObject = {}
  var NodeData = []
  // linkObject['id'] = fw['net']
  linkObject['id'] = fw.Name
  linkObject['position'] = [fw['cx'], fw['cy']]
  linkObject['parentposition'] = [fw['cx'], fw['cy']]
  NodeData.push(linkObject)


  // console.log("NodeDataSource")
  // console.log(NodeData)


  // console.log("NodeDataTarget")
  // console.log(NodeData)


  var path = d3.path()
  // Verbinde Targets mit Proxy
  // Linie direkt 
  targets.forEach(target => {
    path.moveTo(fw['cx'] + target['r'], fw['cy'])
    path.lineTo(target['cx'] - target['r'], target['cy'])
  });

  // Verbinde sourceW mit Proxy
  // Linie als Rechteck
  sourceW.forEach(source => {
    path.moveTo(fw['cx'] - source['r'], fw['cy'])
    path.lineTo(fw['cx'] - source['r'], source['cy'])
    path.moveTo(fw['cx'] - source['r'], source['cy'])
    path.lineTo(source['cx'] + source['r'], source['cy'])

    // path.rect(source['cx']+ source['r'],source['cy']-source['r']/2,fw['cx']-source['cx']- source['r'], source['r'],)


  });


  d3.select("#" + targetid)
    .append("path")
    .attr("d", path)
    // .attr("fill", "none")
    .attr("stroke", "white");

  // Destination-Text
  d3.select('#dst')
    .selectAll("text")
    .data(targets)
    .enter()
    .append("text")
    // .join("text")
    .text((d) => d.adr)
    .attr("x", (d) => { return d.cx + 2 * d.r })
    // .attr("y", (d) => { return d.cy + d.r })
    .attr("y", (d) => { return d.cy + d.r / 2 })
    .attr("class", "zone")
    .style("fill", "white")
    .style("text-anchor", "start")

  // Sourcen-Text 
  d3.select('#src')
    .selectAll("text")
    .data(sourceW)
    .enter()
    .append("text")
    // .text((d) => d.adr)
    .text((d) => d.adr)
    .attr("x", (d) => { return d.cx - 2 * d.r })
    // .attr("y", (d) => { return d.cy + d.r })
    .attr("y", (d) => { return d.cy + d.r / 2 })
    .attr("class", "zone")
    .style("fill", "white")
    .style("text-anchor", "end")

  d3.select('#proxy')
    .selectAll("text")
    .data(proxy)
    .enter()
    .append("text")
    // .text((d) => { return d.Name+"("+d.Service+")" })
    .text((d) => { return d.Service })
    .attr("x", (d) => { return d.cx })
    // .attr("y", (d) => { return d.cy + 3 * par.dl })
    .attr("y", (d) => {
      // console.log("Cy",d.cy)
      // console.log("Längen:", par.objwidth)
      // console.log("DL:",3*par.dl)
      return d.cy + par.objwidth / 1.5
    })

    .classed("zone", true)
    .style("fill", "white")
    // .style("opacity", 0.5)
    .style("background", "blue")
    .style("text-anchor", "middle")
  // .style("writing-mode", "horizontal-tb") // from Top to Bottom
  // .attr("transform", (d) => { return "translate(" + d.cx + "," + d.cy + ") rotate(90)"})

}

// function resolveZones(rules, szones, dzones) {
function resolveZones() {
  const target = dom.createDetailBox()
  // drawFirewall(target)
}


export { resolveZones }
