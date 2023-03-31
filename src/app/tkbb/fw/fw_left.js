import { requestData } from 'TkbbFolder/net/client.js';

// import 'TkbbFolder/dom/html.js';
import { createTaskBox } from 'TkbbFolder/dom/html.js';
import { DomElement } from 'TkbbFolder/dom/html.js';
import { analyseRules } from 'TkbbFolder/fw/fw_main.js';

import * as d3 from "d3";

var selectedSource = ""
var selectedTarget = ""
var selectedZones = {}

function selectZones(rules, szones, dzones) {
  const target = createTaskBox()
  const screenwidth = "350"
  const screenheight = "300"
  const textdistance = "10"

  const rectwidth = 15              // Matrixelementgröße
  const matrixwidth = 12 * rectwidth  // Matrixhome

  const baseX = screenwidth / 2 - matrixwidth / 2;
  const baseY = screenheight / 2 - matrixwidth / 2;

  const svgid = "svgleft"

  // Matrixbereich
  const matrixX1 = baseX
  const matrixY1 = baseY
  const matrixid1 = "matrix1"

  // Beschriftungsbereich und Parameter der Matrix
  const matrixhead = 3 * rectwidth

  const selectSource = "selectSZone"
  const selectTarget = "selectTZone"
  selectedSource = szones[0]
  selectedTarget = dzones[0]

  const matrixT1id = "matrixT1"
  const matrixT1x = matrixX1 + matrixwidth / 2
  const matrixT1y = matrixY1 - matrixhead


  const strokewidthMax = "4px"
  const strokewidthMin = "1px"

  // Source
  const sButtonid = "sButtonID"
  // const sButtonX
  // const sButtonY

  const sourceTid = "sTextID"
  const sourceTx = matrixX1 - textdistance
  const sourceTy = matrixY1


  // Button "Source" setzen
  var b1 = d3.select("#" + target)
  b1
    .append("select")
    .attr("id", selectSource)
    .classed("position-absolute", true)
    .classed("bottom-50", true)
    .classed("end-50", true)
    .classed("me-2", true)
    .selectAll('myOptions') // Next 4 lines add 6 options = 6 colors
    .data(szones)
    .enter()
    .append('option')
    .text(function (d) { return d; }) // text showed in the menu
    .attr("value", function (d) { return d; }) // corresponding value returned by the button
  // .on('click', tSelectionClick)

  // Button "Target" setzen
  var b2 = d3.select("#" + target)
  b2
    .append("select")
    .attr("id", selectTarget)
    .classed("position-absolute", true)
    .classed("bottom-50", true)
    .classed("start-50", true)
    .classed("ms-2", true)
    .selectAll('myOptions') // Next 4 lines add 6 options = 6 colors
    .data(dzones)
    .enter()
    .append('option')
    .text(function (d) { return d; }) // text showed in the menu
    .attr("value", function (d) { return d; }) // corresponding value returned by the butto
  // .on('click', tSelectionClick)

  // Button "Auswahl zur Analyse" setzen
  const Banalyse = new DomElement({ targetid: target, ownid: 'BanalyseID', type: 'button' })
  Banalyse.addClass('btn')
  Banalyse.addClass('btn-primary')
  Banalyse.addClass('btn-sm')
  Banalyse.addAttribute('role', 'button')
  // Banalyse.addAttribute('href', 'RunAnalyse')
  Banalyse.addContent('Analyse')
  Banalyse.addClass('position-absolute')
  Banalyse.addClass('bottom-0')
  Banalyse.addClass('end-0')
  Banalyse.addClass('m-2')


  // Setze SVG-Box
  const box = d3.select('#' + target)
  box
    .append('svg')
    .attr("width", screenwidth)
    .attr("height", screenheight)
    .attr("id", svgid)

  // Setze Matrix-Bereiche  
  var canvas = d3.select("#" + svgid)
  canvas
    .append("g")
    .attr("transform", "translate(" + matrixX1 + "," + matrixY1 + ")")
    .attr("id", matrixid1)

    .append("rect")
    .attr("class", "fwgrid")
    .attr("width", matrixwidth)
    .attr("height", matrixwidth)
    .attr("x", 0)
    .attr("y", 0)

  // M1 Axen-Beschriftung
  // Linie
  var canvas = d3.select("#" + svgid)
  canvas
    .append("g")
    .attr("transform", "translate(" + matrixT1x + "," + matrixT1y + ")")
    .attr("id", matrixT1id)

  // M1-Service Überschrift
  var matrixT = d3.select("#" + matrixT1id)
  matrixT
    .append("text")
    .classed("skala", true)
    .attr("x", rectwidth)
    .attr("y", rectwidth / 2)
    .attr("class", "matrixT")
    // .text("Services of Zone: " + targetzone)
    .text("Target Zone ")
    .style("text-anchor", "start")

  // M1-Source Überschrift
  var sourcename = "Source Zone"
  matrixT
    .append("text")
    // .classed("skala", true)
    .attr("x", -sourcename.length - rectwidth / 2)
    .attr("y", rectwidth / 2)
    .attr("class", "matrixT")
    .text(sourcename)
    .style("text-anchor", "end")

  // M1 Fw
  var matrix1 = d3.select("#" + matrixid1)
  matrix1
    .append("line")
    .attr("class", "fwline")
    .attr("x1", matrixwidth / 2)
    .attr("y1", 0 - matrixhead)
    .attr("x2", matrixwidth / 2)
    .attr("y2", matrixwidth + matrixhead)

  // Source-Text-Bereich
  canvas
    .append("g")
    .attr("transform", "translate(" + sourceTx + "," + sourceTy + ")")
    .attr("id", sourceTid)

  // Auswahl Source - übernehmen
  $('#' + selectSource).on("change", function (){
    selectedSource = $(this).val()
  })
  
  // Auswahl Target - übernehmen
  $('#' + selectTarget).on("change", function (){
    selectedTarget = $(this).val()  
  })

  // Auswahl packen und an Analyse übergeben
  $('#BanalyseID').on("click", function () {
    selectedZones['rules']=rules
    selectedZones['source']=selectedSource
    selectedZones['target']=selectedTarget
    // Weiter mit Analyse  
    analyseRules(selectedZones)
  })
}


export { selectZones };