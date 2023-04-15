import { requestData } from 'TkbbFolder/net/client.js';

// import { createDisplayBox } from 'TkbbFolder/dom/html.js';
// import { createContentBox } from 'TkbbFolder/dom/html.js';
import { createDetailBox } from 'TkbbFolder/dom/html.js';
// import { removeDetailBox } from 'TkbbFolder/dom/html.js';

import { getRowByIndex } from 'TkbbFolder/tables/tabbasic.js';
// import { putTableHeader } from 'TkbbFolder/tables/tabbasic.js';
// import { putTable } from 'TkbbFolder/tables/tabbasic.js';
// import { putTableDetail } from 'TkbbFolder/tables/tabbasic.js';

// import { removeAllBox } from 'TkbbFolder/dom/html.js';
import * as d3 from "d3";
// import { easeCircle } from 'd3';
// import { DomElement } from 'TkbbFolder/dom/html.js';
import * as Daos from 'TkbbFolder/daos.js';
// import { Canvas } from '../daos';


function putAdrDetail(selectedRow, tableArray, matrixdata) {
  console.log("Matrixdata", matrixdata)
  console.log("TableArray", tableArray)
  console.log("SelectdRow", selectedRow)

  var sadrip = matrixdata.sadrip
  var tabkeys = Object.keys(tableArray[0])
  var contentKey = tabkeys[0]

  const targetDetail = createDetailBox()
  var selectedContent = selectedRow.find('td:eq(0)').text()

  // Suche ausgewählte Zeile in Tabelle      
  var rowContent = getRowByIndex(contentKey, selectedContent, tableArray)
  console.log("RowContent", rowContent)
  
  var serviceKey = `${rowContent.source}-${rowContent.service}`
  // console.log ("Zone",rowContent.source)
  console.log ("Service",sadrip[serviceKey])
  
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
  var sz = new Daos.Zone(rowContent.source, 'sourcezone')

  var svc = new Daos.Zone("Service",'servicezone')
  var tz = new Daos.Zone(matrixdata.zone,'targetzone')
  
  zones.push(sz)
  zones.push(svc)
  zones.push(tz)

  var proxy = []
  var prx = new Daos.Proxy("PaloAlto", "10.10.1.200", rowContent.service)
  proxy.push(prx)
  
  var service = new Daos.Service(rowContent.service)
  
  console.log ("Targets",targets)
  console.log ("Sources",sources)
  console.log ("Zones",zones)
  console.log ("Proxy",proxy)
  // console.log ("Service",service)
  
  ShowAdrRelation(proxy, sources, targets, zones)

}

function ShowAdrRelation(proxy, sources, targets, zones) {

  const targetDisplay = createDetailBox()

  const svgid = "svg2"
  const canvas = new Daos.Canvas(svgid, "500", "500")
  canvas.BaseX = 200
  canvas.BaseY = 60

  setCanvas(canvas, targetDisplay)

  var par = {}

  par['adrpdistance'] = 100
  par['xl'] = canvas.BaseX - par['adrpdistance'] / 2
  par['yl'] = canvas.BaseY
  par['rl'] = 5            // Radius einer Node
  par['dl'] = 5 * par['rl'] // Abstand zwischen Nodes = 6 * Radius
  par['plength'] = proxy.length
  par['slength'] = sources.length
  par['tlength'] = targets.length
  par['zlength'] = zones.length
  par['maxl'] = 10
  par['twol'] = false     // false: 1 spaltig true:= 2 spaltig

  par['adrlength'] = 85

  par['xz'] = canvas.BaseX - par['adrpdistance'] / 2 - 2 * par['rl'] - par['adrlength']
  par['widthz'] = (par['adrpdistance'] + 4 * par['rl'] + 2 * par['adrlength']) / par['zlength']
  par['heightz'] = 20
  par['yz'] = canvas.BaseY - 2.5 * par['heightz']

  // Source-List
  par['xl'] = canvas.BaseX - par['adrpdistance'] / 2

  if (par['tlength'] > par['maxl']) {
    var diff = (par['maxl'] - par['slength']) / 2
    par['yl'] = smartY(diff, par)
  }
  else {
    if (par['slength'] < par['tlength']) {
      var diff = (par['tlength'] - par['slength']) / 2
      par['yl'] = smartY(diff, par)

    }
  }
  setPoints(sources, 'src', par, canvas.ID)

  // Destination List
  par['xl'] = canvas.BaseX + par['adrpdistance'] / 2,
  par['yl'] = canvas.BaseY
  if (par['tlength'] > par['maxl']) {
    par['twol'] = true
    var targetsTwo = []
    var targetsOne = []
    targets.forEach((target, index) => {
      if (index >= par['maxl']) {
        targetsTwo.push(target)
      }
      else {
        targetsOne.push(target)
      }
    })
    setPoints(targetsOne, 'dst', par, canvas.ID)
    par['xl'] = canvas.BaseX + par['adrpdistance'] / 2
    par['yl'] = canvas.BaseY + + par['dl']/2
    setPoints(targetsTwo, 'dst', par, canvas.ID)
    
    par['targetTwo'] = targetsTwo
    par['targetOne'] = targetsOne

    console.log("TargetTwo", par['targetTwo'])
    console.log("TargetOne", par['targetOne'])
  }
  else {
    setPoints(targets, 'dst', par, canvas.ID)
  }
  // Proxy
  par['xl'] = canvas.BaseX,
  par['yl'] = canvas.BaseY

  if (par['twol'] == true) {
    console.log("TwoCol")
    var diff = (par['maxl'] - par['plength']) / 2
    par['yl'] = smartY(diff, par)
  }
  else {
    if (par['slength'] < par['tlength']) {
      var diff = (par['tlength'] - par['plength']) / 2
      par['yl'] = smartY(diff, par)
    }
    else {
      var diff = (par['slength'] - par['plength']) / 2
      par['yl'] = smartY(diff, par)
    }
  }
  setPoints(proxy, 'proxy', par, canvas.ID)
  drawLink(proxy, sources, targets, par, canvas.ID)

  zones.forEach(zone => {
    console.log("Zone", zone.Name)
  })

  setZones(zones, par, canvas.ID)

}

function smartY(diff, par) {
  var y = par.yl + diff * par.dl
  return y
}

function setCanvas(canvas, target) {
  var id = canvas.ID
  const box = d3.select('#' + target)
  box
    .append('svg')
    .attr("width", canvas.Weight)
    .attr("height", canvas.Height)
    .attr("id", id)
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
  var zone = d3.select("#" + target)
  zone
    .append("g")
    .selectAll("rect")
    .data(zlist)
    // .join('circle')
    .enter()
    .append("rect")
    .attr("id", (d) => { return d.Name })
    .attr("class", (d) => { return d.Class })
    .attr("x", (d, i) => {
      d['x'] = par.xz + i * par.widthz
      return d['x']
    })
    .attr("y", (d, i) => {
      d['y'] = par.yz
      return d['y']
    })
    .attr("width", d => {
      d['width'] = par.widthz
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
    // .join("text")
    .text((d) => d.Name)
    .attr("x", (d) => { return (d.x + d.width / 5) })
    .attr("y", (d) => { return (d.y + d.height * 2 / 3) })
    .classed("zone", true)
    // .attr("class", (d) => { return d.Name})
    .style("fill", "white")
    .style("text-anchor", "start")



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
    .attr("y", (d) => { return d.cy + 3 * par.dl })
    .classed("zone", true)
    .style("fill", "white")
    .style("text-anchor", "end")
  // .style("writing-mode", "horizontal-tb") // from Top to Bottom
  // .attr("transform", (d) => { return "translate(" + d.cx + "," + d.cy + ") rotate(90)"})

}
// export { ShowAdrRelation };
export { putAdrDetail }
