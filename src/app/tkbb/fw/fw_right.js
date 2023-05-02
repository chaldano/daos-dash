import * as tab from 'TkbbFolder/tables/tabbasic.js';
import * as main from 'TkbbFolder/fw/fw_main.js';
import * as dom from 'TkbbFolder/dom/html.js';

import * as d3 from "d3";
import * as daos from 'TkbbFolder/daos.js';
import { max } from 'd3';
// import { drawFirewall } from './fw_main';


export function prepareZoneDetail(selectedRow, tableArray, matrixdata) {
  

  var sadrip = matrixdata.sadrip
  var tabkeys = Object.keys(tableArray[0])
  var contentKey = tabkeys[0]

  var selectedContent = selectedRow.find('td:eq(0)').text()

  // Suche ausgewählte Zeile in Tabelle      
  var rowContent = tab.getRowByIndex(contentKey, selectedContent, tableArray)
  
  var serviceKey = `${rowContent.source}-${rowContent.service}`
  var targets = []
  var sources = []

  sadrip[serviceKey].dadr.forEach(adr=> {
    var adrobj = {}
    adrobj['adr'] = adr
    targets.push(adrobj)
  })
  
  sadrip[serviceKey].sadr.forEach(adr=> {
    var adrobj = {}
    adrobj['adr'] = adr
    sources.push(adrobj)
  })
  
  var zones = []
  var sz = new daos.Zone(rowContent.source, 'sourcezone')  
  var tz = new daos.Zone(matrixdata.zone,'targetzone')
  zones.push(sz)
  zones.push(tz)

  var proxy = []
  var prx = new daos.Proxy("PaloAlto", "10.10.1.200", rowContent.service)
  proxy.push(prx)
  
  var service = new daos.Service(rowContent.service)
  
  showZoneDetail(proxy, sources, targets, zones)

}

function showZoneDetail(proxy, sources, targets, zones) {

  const target = dom.createDetailBox()

  const screenwidth = "650"
  const screenheight = "300"
  
  const unit = 15                // Matrixelementgröße
  const objectwidth = 12 * unit  // Matrixhome

  // Canvas Umgebung definieren
  const canvas = new daos.Canvas(target, screenwidth, screenheight)
  canvas.BaseX = screenwidth / 2 - objectwidth / 2;
  canvas.BaseY = screenheight / 2 - objectwidth / 2;
  canvas.Unit = unit
  canvas.ObjWidth = objectwidth;

  // Canvas einrichten
  daos.setCanvas(canvas, target)
  main.drawFirewall(canvas)
  
  // Paramterobjekt anlegen
  var par = {}
  // par['adrpdistance'] = canvas.ObjWidth/2
  par['objwidth'] = canvas.ObjWidth
  par['rl'] = 5                   // Radius einer Node
  par['dl'] = 5 * par['rl']       // Abstand zwischen Nodes = 6 * Radius
  par['plength'] = proxy.length
  par['slength'] = sources.length
  par['tlength'] = targets.length
  par['zlength'] = zones.length
  par['maxl'] = 9             // max. Anzahl an Nodes
  // Anzeige Header 
  par['header'] = 13                                     // Max. Anzahl Zeichen im Header
  // par['charlength'] = canvas.ObjWidth/par['header']      // Pixel pro Zeichen
  par['charlength'] =       6.92
  
  par['twol'] = false     // false: 1 spaltig true:= 2 spaltig

  // Zonen ausrichten

  par['xl'] = canvas.BaseX - canvas.ObjWidth/2 / 2
  par['yl'] = canvas.BaseY
  par['heightz']  = 20
  par['yz'] = canvas.BaseY - par['heightz']
  // Länge für Zonennamen anpassen
  
  


  // Source-List
  par['xl'] = canvas.BaseX - par['rl']
  
  if (par['slength'] > 1) {
    var diff = par['slength']
    par['yl'] = smartY(diff, par)
  
  }
  else {
      par['yl'] = canvas.BaseY + canvas.ObjWidth/2
  }

  setPoints(sources, 'src', par, canvas.ID)

  // Destination List
  par['xl'] = canvas.BaseX + canvas.ObjWidth + par['rl'] 
  par['yl'] = canvas.BaseY
  
  if (par['tlength'] > 1) {
    var diff = par['tlength']
    par['yl'] = smartY(diff, par)  
  }
  else {
      par['yl'] = canvas.BaseY + canvas.ObjWidth/2
  }
  // par['yl'] = canvas.BaseY
  // if (par['tlength'] > par['maxl']) {
  //   par['twol'] = true
  //   var targetsTwo = []
  //   var targetsOne = []
  //   targets.forEach((target, index) => {
  //     if (index >= par['maxl']) {
  //       targetsTwo.push(target)
  //     }
  //     else {
  //       targetsOne.push(target)
  //     }
  //   })
    
    setPoints(targets, 'dst', par, canvas.ID)
  //   par['xl'] = canvas.BaseX + par['adrpdistance'] / 2
  //   par['yl'] = canvas.BaseY + + par['dl']/2
  //   setPoints(targetsTwo, 'dst', par, canvas.ID)
    
  //   par['targetTwo'] = targetsTwo
  //   par['targetOne'] = targetsOne

  //   console.log("TargetTwo", par['targetTwo'])
  //   console.log("TargetOne", par['targetOne'])
  // }
  // else {
  //   setPoints(targets, 'dst', par, canvas.ID)
  // }
  
  
  
  
  // Proxy
  par['xl'] = canvas.BaseX + canvas.ObjWidth/2
  par['yl'] = canvas.BaseY + canvas.ObjWidth/2
  par['objwidth'] = canvas.ObjWidth
  
  // if (par['twol'] == true) {
  //   console.log("TwoCol")
  //   var diff = (par['maxl'] - par['plength']) / 2
  //   par['yl'] = smartY(diff, par)
  // }
  // else {
  //   if (par['slength'] < par['tlength']) {
  //     var diff = (par['tlength'] - par['plength']) / 2
  //     par['yl'] = smartY(diff, par)
  //   }
  //   else {
  //     var diff = (par['slength'] - par['plength']) / 2
  //     par['yl'] = smartY(diff, par)
  //   }
  // }
  setPoints(proxy, 'proxy', par, canvas.ID)
  drawLink(proxy, sources, targets, par, canvas.ID)

  zones.forEach(zone => {
    console.log("Zone", zone)
  })

  // Anzeige ausgewählter Zonen
  // console.log("Zones2",zones)
  par['xl'] = canvas.BaseX
  par['objwidth'] = canvas.ObjWidth
  
  var sz = zones[0].Name
  console.log("SZ:", sz +":"+ sz.length)
  var tz = zones[1].Name
  console.log("TZ:", tz +":"+tz.length)
  console.log("ObjWidth:", canvas.ObjWidth)

  zones[0].Width = canvas.ObjWidth/2
  zones[1].Width = canvas.ObjWidth/2
  
  if ((canvas.ObjWidth/2 / sz.length < par['charlength']) || ((canvas.ObjWidth/2 / tz.length < par['charlength'])) ) {
    var max = sz.length > tz.length ? sz.length : tz.length 
    console.log("Max:", max)
    console.log("Width:", canvas.ObjWidth/2)
    
    // var diff = (max-par['zeichenbreite']) * par['zeichenbreite']
    var diff = (max-par['header']) * par['charlength']
    
    // Verschiebung der x-Koordinate
    par['xl'] = par['xl'] - diff
    par['objwidth'] = canvas.ObjWidth + 2 * diff
  }

  setZones(zones, par, canvas.ID)

}

function smartY(diff, par) {
  // var y = (par.yl + par.objwidth/2) - ((diff-1) * par.dl + (diff-1)*par.rl)/2
  var y = (par.yl + par.objwidth/2) - ((diff-1) * par.dl)/2
  return y
}



function setPoints(plist, pointtype, par, target) {

  var source = d3.select("#" + target)
  source
    .append("g")
    .attr("id", pointtype)
    .selectAll("circle")
    .data(plist)
    // .join('circle')
    .enter()
    .append("circle")
    .attr("class", pointtype)
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

  // .style("fill-opacity", d => d.weight * .2)


}

// Setze vertikale Zonen
function setZones(zlist, par, target) {
  console.log("ZList",zlist)
  var zone = d3.select("#" + target)
  zone
    .append("g")
    .selectAll("rect")
    .data(zlist)
    .enter()
    .append("rect")
    .attr("id", (d) => { return d.Name })
    .attr("class", (d) => { return d.Class })
    .attr("x", (d, i) => {
      d['x'] = par.xl + i * par['objwidth']/2
      return d['x']
    })
    .attr("y", (d, i) => {
      d['y'] = par.yz
      return d['y']
    })
    .attr("width", d => {
      d['width'] = par['objwidth']/2
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
function drawLink(proxy, sources, targets, par, targetid) {

  // Proxy
  var fw = proxy[0]
  var linkObject = {}
  var NodeData = []
  linkObject['id'] = fw['net']
  linkObject['position'] = [fw['cx'], fw['cy']]
  linkObject['parentposition'] = [fw['cx'], fw['cy']]
  NodeData.push(linkObject)

  // Verbinde Sources mit Proxy
  sources.forEach(source => {
    var linkObject = {}
    linkObject['id'] = source['net']
    linkObject['position'] = [source['cx'] + source['r'], source['cy']]
    linkObject['parentposition'] = [fw['cx'] - fw['r'], fw['cy']]
    NodeData.push(linkObject)
  });

  // Verbinde Targets mit Proxy
  targets.forEach(target => {
    var linkObject = {}
    linkObject['id'] = target['net']
    linkObject['position'] = [target['cx'] - target['r'], target['cy']]
    linkObject['parentposition'] = [fw['cx'] + fw['r'], fw['cy']]
    NodeData.push(linkObject)
  });

  var link = d3.linkHorizontal()
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
  d3.select('#dst')
    .selectAll("text")
    .data(targets)
    .enter()
    .append("text")
    // .join("text")
    .text((d) => d.adr)
    .attr("x", (d) => { return d.cx + 2 * d.r })
    // .attr("y", (d) => { return d.cy + d.r })
    .attr("y", (d) => { return d.cy })
    .attr("class", "zone")
    .style("fill", "white")
    .style("text-anchor", "start")

  // Sourcen-Text 
  d3.select('#src')
    .selectAll("text")
    .data(sources)
    .enter()
    .append("text")
    // .text((d) => d.adr)
    .text((d) => d.adr)
    .attr("x", (d) => { return d.cx - 2 * d.r })
    // .attr("y", (d) => { return d.cy + d.r })
    .attr("y", (d) => { return d.cy })
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
      console.log("Längen:",par.objwidth)
      // console.log("DL:",3*par.dl)
      return d.cy + par.objwidth/1.5
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
