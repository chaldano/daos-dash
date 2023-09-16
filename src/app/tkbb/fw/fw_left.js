// import { requestData } from 'TkbbFolder/net/client.js';

// import 'TkbbFolder/dom/html.js';
import * as dom from 'TkbbFolder/dom/html.js';
import * as daos from 'TkbbFolder/daos.js';
import * as main from 'TkbbFolder/fw/fw_main.js';

import * as d3 from "d3";

function selectZones(rules, szones, dzones, hostnames) {

  var selectedSource = []
  var selectedTarget = []
  var selectedHost = []
  var selectedZones = {}

  let index = getDefaultSelection(szones)
  selectedSource[0] = szones[index]
  index = getDefaultSelection(dzones)
  selectedTarget[0] = dzones[index]
  index = getDefaultSelection(hostnames)
  selectedHost[0] = hostnames[index]


  const target = dom.createTaskBox()

  const selectSource = "selectSZone"
  const selectTarget = "selectTZone"
  const selectHost = "selectHost"

  // Button "Source" setzen
  var b0 = d3.select("#" + target)
  b0
    .append("select")
    .attr("id", selectHost)
    .classed("position-absolute", true)
    .classed("top-50", true)
    .classed("start-50", true)
    .classed("translate-middle", true)
    .classed("mt-2", true)
    .classed("hostSelect", true)
    .selectAll('myOptions') // Next 4 lines add 6 options = 6 colors
    .data(hostnames)
    .enter()
    .append('option')
    .text(function (d) {
      if (d.substr(0, 1) == "!") {
        // ! in der Anzeige ausblenden 
        return d.substr(1)
      }
      else {
        return d
      }
    })     // text showed in the menu
    .attr("value", function (d) {
      return d;
    }) // selected Attribut als Default setzen
    .attr("selected", function (d) {
      if (d.substr(0, 1) == "!") {
        return ""
      } else {
        return null;
      }
    })



  // .on('click', tSelectionClick)
  var b1 = d3.select("#" + target)
  b1
    .append("select")
    .attr("id", selectSource)
    .classed("position-absolute", true)
    .classed("bottom-50", true)
    .classed("end-50", true)
    .classed("me-2", true)
    .classed("sourceSelect", true)
    .selectAll('myOptions') // Next 4 lines add 6 options = 6 colors
    .data(szones)
    .enter()
    .append('option')
    // .text(function (d) { return d; }) // text showed in the menu
    .text(function (d) {
      if (d.substr(0, 1) == "!") {
        // ! in der Anzeige ausblenden 
        return d.substr(1)
      }
      else {
        return d
      }
    })     // text showed in the menu
    .attr("value", function (d) { return d; }) // corresponding value returned by the button
    .attr("selected", function (d) {
      if (d.substr(0, 1) == "!") {
        return ""
      } else {
        return null;
      }
    })
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
    .classed("targetSelect", true)
    .selectAll('myOptions') // Next 4 lines add 6 options = 6 colors
    .data(dzones)
    .enter()
    .append('option')
    // .text(function (d) { return d; }) // text showed in the menu
    .text(function (d) {
      if (d.substr(0, 1) == "!") {
        // ! in der Anzeige ausblenden 
        return d.substr(1)
      }
      else {
        return d
      }
    })     // text showed in the menu
    .attr("value", function (d) { return d; }) // corresponding value returned by the butto
    .attr("selected", function (d) {
      if (d.substr(0, 1) == "!") {
        return ""
      } else {
        return null;
      }
    })
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

  // Auswahl Host 
  $('#' + selectHost).on("change", function () {
    selectedHost.length = 0
    selectedHost.push($(this).val())
    // Setze ausgewählte Host als Default-Host
    setDefaultSelection(hostnames, selectedHost[0])
    getHostZones(rules, hostnames)
  })


  // Auswahl Source
  $('#' + selectSource).on("change", function () {
    selectedSource.length = 0
    selectedSource.push($(this).val())
    console.log("Source nach Click", selectedSource)

    if (selectedHost[0] != '!*') {
      // Hostmodus
      setDefaultSelection(szones, selectedSource[0])
      setDefaultSelection(dzones, '*')
      selectZones(rules, szones, dzones, hostnames)
    }
    // else{
    //   // Zonemodus
    //   setDefaultSelection(szones, selectedSource[0])
    //   setDefaultSelection(dzones, selectedSource[0])

    // }
  })

  // Auswahl Target
  $('#' + selectTarget).on("change", function () {
    // Zonenmodus
    selectedTarget.length = 0
    selectedTarget.push($(this).val())
    console.log("Target nach Click", selectedTarget)

    if (selectedHost[0] != '!*') {
      // Hostmodus
      setDefaultSelection(dzones, selectedTarget[0])
      setDefaultSelection(szones, '*')
      selectZones(rules, szones, dzones, hostnames)
    }
  })

  // Auswahl Analyse
  $('#BanalyseID').on("click", function () {
    selectedZones['rules'] = rules
    if (selectedHost == '!*') {
      console.log("Enter into Zonemodus")

      // Zonenmodus
      if (selectedSource == '!*') {
        let selectedSourceDefault = []
        selectedSourceDefault.push('*')
        selectedZones['source'] = selectedSourceDefault
        // selectedSource = '*'
      }
      else {
        selectedZones['source'] = selectedSource
      }
      console.log("Auswahl Source:", selectedSource)

      if (selectedTarget == '!*') {
        let selectedTargetDefault = []
        selectedTargetDefault.push('*')
        selectedZones['target'] = selectedTargetDefault
      }
      else {
        selectedZones['target'] = selectedTarget
      }
      selectedZones['host'] = '*'
      console.log("SelectedZonesCall", selectZones)
      // Weiter mit Analyse  
      main.analyseRules(selectedZones)
    }
    if (selectedHost != '!*') {
      // Hostmodus
      // Source:Target-Paare trennen
      // Nur Source oder Target ist ausgewählt
      console.log("Enter into Hostmodus")

      if (!(selectedSource == '!*' && selectedTarget == '!*')) {

        let selection = []
        // Source oder Target-Zone ist ausgewählt
        if (selectedSource == '!*') {
          selection = selectedTarget[0].split(':')
        }
        if (selectedTarget == '!*') {
          selection = selectedSource[0].split(':')
        }

        selectedSource.length = 0
        selectedTarget.length = 0
        // Default ! entfernen

        
        selection[0] = selection[0].substring(1)
        selectedHost[0] = selectedHost[0].substring(1)

        selectedTarget.push(selection.pop())
        selectedSource.push(selection.pop())

        selectedZones['source'] = selectedSource
        selectedZones['target'] = selectedTarget
        selectedZones['host'] = selectedHost[0]


        // Nur wenn eine Source- oder Target-Zone ausgewählt wurde
        main.analyseRules(selectedZones)
      }
      else {
        console.log("Keine Zone im Hostmodus ausgewählt")
        console.log("Keine-Zone-Hostmodus: selectedTarget", selectedTarget)
        console.log("Keine-Zone-Hostmodus: selectedSource", selectedSource)

      }
    }
    // console.log("SelectedZones")
    // console.log(selectedZones)

    // main.analyseRules(selectedZones)
  })
}

// Sucht für einen Host alle Source- oder Target-Zonen
// function getHostZones(rules, selectedHost, hostnames) {
function getHostZones(rules, hostnames) {

  // Ausgewählte Host ermittlen
  let index = getDefaultSelection(hostnames)

  var szones = []
  var dzones = []
  var selectedHost = []
  var hostSelection = []

  selectedHost.push(hostnames[index])
  // Zonenmodus (Host wurde auf * gesetzt)
  if (selectedHost[0] == '!*') {
    // Alle Zonen ermitteln und * als Default einstellen
    szones = main.getZones(rules, 'source')
    dzones = main.getZones(rules, 'destination')
    szones.unshift('*')
    dzones.unshift('*')

    //  Hostmodus
    //  Sources und Targets für Host erzeugen 
  } else {
    
    let zoneSource ='*'
    let zoneTarget ='*'
    hostSelection.push(selectedHost[0].substring(1))
    // console.log("SelectedHost",selectedHost)
    
    // console.log("ZoneSource",zoneSource)
    // console.log("ZoneTarget",zoneTarget)
    // console.log("SelectedHost",selectedHost)
    // console.log("HostSelection",selectedHost)
    // console.log("Rules",rules)
    let matrixdata = main.extractData(rules, zoneSource, zoneTarget, hostSelection)
    // let resolvedDestination = main.resolveTargetsfromList(rules, 'destination')
    // let resolvedDestinationHosts = main.resolveTargetsfromList(resolvedDestination, 'daddress')
    // let dhosts = main.filterList(resolvedDestinationHosts, "daddress", hostSelection, false);
    // console.log("DHosts:",dhosts)

    // let resolvedSource = main.resolveTargetsfromList(resolvedDestination, 'source')
    // let resolvedSourceHosts = main.resolveTargetsfromList(resolvedSource, 'saddress')
    // let shosts = main.filterList(resolvedSourceHosts, "saddress", hostSelection, false);

    // const matrixdata = {
    //   rsrc: SadrRules,
    //   rsrcUser: SadrRulesUser,
    //   rdst: DadrRules,
    //   zone: zoneTarget[0],
    //   source: sourceNodes,
    //   target: serviceNodes,
    //   sadr: SadrRules,
    //   sadrip: ipaddresses,
    //   sadripService: ipaddrByService,
    //   state: "Selectable",

    // let ipadr = matrixdata.sadr
    // let ipaddrByService = matrixdata.sadripService
    // let ServiceNodes = matrixdata.target

    let shosts = []
    let dhosts = []

    let resolvedDestinationHosts = matrixdata.rdst
    dhosts = main.filterList(resolvedDestinationHosts, "daddress", hostSelection, false);
    let resolvedSourceHosts = matrixdata.sadr
    shosts = main.filterList(resolvedSourceHosts, "saddress", hostSelection, false);

    
    // let service = []
    // for (var key in ipaddrByService) {
    //   service = ipaddrByService[key]
    //   // console.log("Service",service)

    //   service.forEach((adr, index) => {
    //     // console.log("Adresse",adr)
    //     if (adr.sadr.includes(selectedHost)) {
    //       console.log("Treffer-src", adr.sadr + ":" + key)
    //       adr.sadr = "!" + adr.sadr
    //       shosts.push(adr.sadr)
    //       // ipaddrByService[key][index].sadr = adr.sadr
    //     }
    //     if (adr.dadr.includes(selectedHost)) {
    //       console.log("Treffer-dst", adr.dadr + ":" + key)
    //       adr.dadr = "!" + adr.dadr
    //       dhosts.push(adr.dadr)
    //       // ipaddrByService[key][index].dadr = adr.dadr
    //     }

    //   })
    // }
    
    shosts.forEach(element => {
      let pair = element.source + ":" + element.destination
      if (!szones.includes(pair))
        szones.push(pair)
    })
    szones.unshift('*')
    console.log("Szones:",szones)

    dhosts.forEach(element => {
      let pair = element.source + ":" + element.destination
      if (!dzones.includes(pair))
        dzones.push(pair)
    })
    dzones.unshift('*')
    console.log("Dzones:",dzones)
  }

  // Lösche alte Default-Werte und setze aktuelle Werte
  setDefaultSelection(dzones, "*")
  setDefaultSelection(szones, "*")
  selectZones(rules, szones, dzones, hostnames)
}

// Löscht Default und setzt neuen Default
function setDefaultSelection(field, value) {
  // lösche alten Default-Wert
  let index = field.findIndex(element => element.includes("!"))
  if (index >= 0) {
    field[index] = field[index].substring(1)
  }
  index = field.indexOf(value)
  field[index] = "!" + value
}

// Index für Default-Selection (mit ! gekennzeichnet)übergeben
function getDefaultSelection(field) {
  // lösche alten Default-Wert
  let index = field.findIndex(element => element.includes("!"))
  return index
}

export { selectZones };