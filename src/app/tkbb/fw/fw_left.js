import { requestData } from 'TkbbFolder/net/client.js';

// import 'TkbbFolder/dom/html.js';
import * as dom           from 'TkbbFolder/dom/html.js';
import * as daos          from 'TkbbFolder/daos.js';
import * as main          from 'TkbbFolder/fw/fw_main.js';

import * as d3 from "d3";

var selectedSource = ""
var selectedTarget = ""
var selectedZones = {}


function selectZones(rules, szones, dzones) {
  
  // Source: Wildcard hinzufügen (alle Sources)
  // Destination: ist explizit
  szones.unshift('*')
  // dzones.unshift('*')
  
  selectedSource = [] 
  selectedTarget = []
  
  // Default: 1:1 Source/Target
  selectedSource.push(szones[0])
  selectedTarget.push(dzones[0])

  
  const target = dom.createTaskBox()
  
  const selectSource = "selectSZone"
  const selectTarget = "selectTZone"

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

  // Target Botton setzen
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

  // Analyse Botton setzen
  const Banalyse = new dom.DomElement({ targetid: target, ownid: 'BanalyseID', type: 'button' })
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
 
  // Setze Firewall Image

  
  const screenwidth = "350"
  const screenheight = "300"
  const unit = 15                // Matrixelementgröße
  const objectwidth = 12 * unit  // Matrixhome

  const canvas = new daos.Canvas(target, screenwidth, screenheight)
  canvas.BaseX = screenwidth / 2 - objectwidth / 2;
  canvas.BaseY = screenheight / 2 - objectwidth / 2;
  canvas.Unit = unit;
  canvas.ObjWidth = objectwidth;

  // Canvas einrichten
  daos.setCanvas(canvas)
  main.drawFirewall(canvas)
  

  // Auswahl Source - übernehmen
  $('#' + selectSource).on("change", function (){
    selectedSource.shift()  
    selectedSource.push($(this).val())
    // console.log("SelectedSource: ",selectedSource)
  })
  
  // Auswahl Target - übernehmen
  $('#' + selectTarget).on("change", function (){
    selectedTarget.shift()  
    selectedTarget.push($(this).val())  
    // console.log("SelectedTarget: ",selectedTarget)
  })

  // Auswahl packen und an Analyse übergeben
  $('#BanalyseID').on("click", function () {
    selectedZones['rules']=rules
    selectedZones['source']=selectedSource
    selectedZones['target']=selectedTarget
    // Weiter mit Analyse  
    main.analyseRules(selectedZones)
  })
}


export { selectZones };