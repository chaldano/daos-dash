import { requestData } from 'TkbbFolder/net/client.js';

// import 'TkbbFolder/dom/html.js';
import { createDisplayBox } from 'TkbbFolder/dom/html.js';
import { createContentBox } from 'TkbbFolder/dom/html.js';
import { createDetailBox } from 'TkbbFolder/dom/html.js';
import { createTaskBox } from 'TkbbFolder/dom/html.js';

import { removeTaskBox } from 'TkbbFolder/dom/html.js';
import { removeAllBox } from 'TkbbFolder/dom/html.js';

import { createTable } from 'TkbbFolder/tables/tabbasic.js';
import { putTableHeader } from 'TkbbFolder/tables/tabbasic.js';
import { putTable } from 'TkbbFolder/tables/tabbasic.js';
import { putTableDetail } from 'TkbbFolder/tables/tabbasic.js';
import { putAdrDetail } from 'TkbbFolder/tables/tabbasic.js';
import { RunFirewallD3 } from 'TkbbFolder/eventbuttons/b-d3fwAddresses.js';

import * as d3 from "d3";
import { easeCircle } from 'd3';
// import { DomElement } from 'TkbbFolder/dom/html.js';


function RunFirewall() {
  removeAllBox()
  var rules
  requestData('GET', 'http://localhost:8080/fwservice')
    .then(csvdata => {
      rules = csvdata[0];
      // const target= createDisplayBox()     
      analyzeRules(rules)
    })
}

function analyzeRules(rules) {

  const targetDetail = createDetailBox()

  
  var targetGroup = [
    { "id": 0, "value": "Trust" },
    { "id": 1, "value": "DMZ" },
    { "id": 2, "value": "DMZ_PUBLIC" },
    { "id": 3, "value": "ANY" },
    { "id": 4, "value": "HAECKER-IT-LAB" },
    { "id": 5, "value": "DISABLED" }
  ]
  var sourceGroup = [
    { "id": 0, "value": "SA" },
    { "id": 1, "value": "SB" },
    { "id": 2, "value": "SC" },
    { "id": 3, "value": "SD" },
    { "id": 4, "value": "SE" }
  ]

  var allDestinations = getDestinations(rules)
  console.log("AllDestinations", allDestinations)
  var allSources = getSources(rules)
  console.log("AllSources", allSources)

  const ExcludedSources = ["DMZ", "DMZ_PUBLIC", "SSL-VPN", "SITE2SITE"]
  const Destinations = ["TRUST"]
  var matrixdata = extractData(rules, ExcludedSources, Destinations, true) // true - extrahieren 
  matrixdata = createHash(matrixdata)
  matrixdata = createMatrix(matrixdata)
  
  var sadr = matrixdata.sadrip
  console.log("SADR",sadr)
  // sadr.forEach(ipitem => {
    
  //   // console.log ("service/App (",adr"): source: "+adr.source+" svc: "+adr['service.app'] + " s: " + adr.saddress + " d:" + adr.daddress )
  //   console.log("IPList",ipitem)
  // })

  showTable(matrixdata)




}
function showTable(matrixdata) {
  const targetContent = createContentBox()
  
  var sources = matrixdata.source
  var targets = matrixdata.target
  var matrix = matrixdata.matrix

  // Table Data aus Matrix erzeugen

  var tablerules = []
  var indextab = 0
  matrix.forEach((node, index) => {
    if (node.action == "ALLOW") {
      var tablerule = {}
      indextab++
      var ids = node.id.split('-')
      var sourceindex = ids[0]
      var targetindex = ids[1]

      var source = sources[sourceindex]
      var target = targets[targetindex]

      tablerule["id"] = indextab
      tablerule["source"] = source["source"]
      tablerule["service"] = target["service.app"]
      tablerule["ruleid"] = node["ruleid"]

      tablerules.push(tablerule)
    }
  })

  // Sortiere Rules
  tablerules.sort(compare)

  const tableSelection = {
    hnames: ["ID", "Source", "Service/App", "RuleID"],
    hvalues: ["id", "source", "service", "ruleid"]
  }

  const tabID = 'tabFW'
  createTable(targetContent, tabID)
  // Anzeige Table-Header
  putTableHeader(tabID, tableSelection);
  // Anzeige Table-Body
  putTable(tabID, tableSelection, tablerules);

  // Auflösung von Mehrfachnennung von Source und Target ) 
  const targetDisplay = createDisplayBox()

  // const svghome = homeMatrix(targetGroup, targetDisplay)
  const svgtarget = runMatrix(matrixdata, targetDisplay)

  // Anzeige von Details nach Auswahl einer Zeile
  
  // $('tbody tr').click(function () {
  //   putTableDetail($(this), tableSelection, tablerules)
  // })
  $('tbody tr').click(function () {
    putAdrDetail($(this), tablerules, matrixdata)
  })
}

// Sortieren von "Arrays of Objects"
function compare(a, b) {
  // Use toUpperCase() to ignore character casing
  // const bandA = a.band.toUpperCase();
  // const bandB = b.band.toUpperCase();
  let comparison = 0;
  if (a.source > b.source) {
    comparison = 1;
  } else if (a.source < b.source) {
    comparison = -1;
  }
  return comparison;
}
function TrustAll(){

}

// Löst Rgeln nach Destinations auf
function getDestinations(rules) {

  var fwList = setupFwList(rules)
  var resolvedDestination = resolveTargetsfromList(fwList, 'destination')
  const destinations = getNodeList(resolvedDestination, 'destination')
  return destinations
}
// Löst Regeln nach Sources auf
function getSources(rules) {
  var fwList = setupFwList(rules)
  var resolvedSources = resolveTargetsfromList(fwList, 'source')
  const sources = getNodeList(resolvedSources, 'source')
  console.log("Sources", sources)
}
// Extrahiert Regeln auf Grundlage von Zonen
function extractData(rules, SourceFilter, Destination, NEGATION) {
  // console.log("Exludes", exSources)

  // Initialisiere Firewallliste
  var fwList = setupFwList(rules)
  console.log("FwRules", fwList)

  // DISABLE RULE EXTRAHIEREN
  var selection = ["[DISABLED]  ALLOW"]
  var DisabledRules = filterList(fwList, "action", selection, false); // DISABLE filtern
  console.log("DisabledRules", DisabledRules)

  var AllowedRules = filterList(fwList, "action", selection, true); // DISABLE extrahieren
  console.log("AllowedRules", AllowedRules)

  // (1) Alle Regeln nach DESTINATION aufschlüsseln

  // Auflösen von Destination
  var resolvedDestination = resolveTargetsfromList(AllowedRules, 'destination')
  console.log("AllowsDestinationRules", resolvedDestination)

  // Zielzone (Destination) aus Destination filtern
  var DestinationRules = filterList(resolvedDestination, "destination", Destination, false); // false: nur destination filtern
  console.log("TrustRules", DestinationRules)

  // Auflösen von Source für DestinationRules
  var SourceRules = resolveTargetsfromList(DestinationRules, 'source')
  console.log("SourceRules", SourceRules)

  // Exclude Regeln ?
  var SourceRulesExtracted = SourceRules
  console.log("SourceRulesExtracted", SourceRulesExtracted)

  SourceRulesExtracted = filterList(SourceRulesExtracted, "source", SourceFilter, NEGATION);
  console.log("SourceRulesExtracted", SourceRulesExtracted)
  // })
  // }
  // else {
  //   SourceRulesExtracted = filterList(SourceRules, "source", Sources, false);
  //   console.log("SourceRulesSelected", SourceRulesExtracted)

  // }

  //SERVICE Rules aus SourceRules
  var ServiceRules = resolveTargetsfromList(SourceRulesExtracted, 'service')
  console.log("ServiceRules", ServiceRules)

  const AppRules = resolveTargetsfromList(ServiceRules, 'app')
  console.log("AppRules", AppRules)

  // Combine rules with "service" + "app"
  const ServiceRulesCombined = newListAttribute(AppRules, "service", "app")
  console.log("ServiceRulesCombined", ServiceRulesCombined)

  const DadrRules = resolveTargetsfromList(ServiceRulesCombined, 'daddress')
  console.log("Dadr-Rules", DadrRules)

  // Resolve S-Addr
  const SadrRules = resolveTargetsfromList(DadrRules, 'saddress')
  console.log("Sadr-Rules", SadrRules)


  // Liste von Services
  const serviceNodes = getNodeList(ServiceRulesCombined, 'service.app')
  console.log("ServiceNodes", serviceNodes)

  // Liste von Sources
  const sourceNodes = getNodeList(SourceRulesExtracted, 'source')
  console.log("SourceNodes", sourceNodes)

  const ipaddresses = getAdrs(SadrRules, serviceNodes)

  console.log("SourceNodes(sadr-dadr)", ipaddresses)
  // console.log("ServiceNodes with Addresses", serviceNodes)


  // Grid-Elemente für Matrix ermitteln
  const matrixdata = {
    zone: Destination[0],
    source: sourceNodes,
    target: serviceNodes,
    sadr: SadrRules ,
    sadrip: ipaddresses,
    state: "Selectable",
  }
  return matrixdata
}

function createHash(matrixdata) {
  var sourceNodes = matrixdata.source
  var serviceNodes = matrixdata.target
  var SadrRules = matrixdata.sadr
  var ipaddresses = matrixdata.sadrip

  const relationhash = {}
  sourceNodes.forEach(srcnode => {
    SadrRules.forEach(item => {
      // console.log("Item",item.source,srcnode.source)
      if (item.source == srcnode.source) {
        var ipadr
        // console.log("Src:",srcnode.source)
        var grid = {}
        // grid.id = `${item.source}-${item.service}.${item.app}`
        var sourceid = srcnode.id
        var serviceid
        for (var obj of serviceNodes) {
          if (obj["service.app"] == item["service.app"]) {
            serviceid = obj.id
            ipadr = ipaddresses[`${srcnode.source}-${obj['service.app']}`]
            // console.log("Paar",ipadr)
            break
          } else {
            // console.log("raus",`${sourceid}-${serviceid}` )
          }

        }
        grid.ipadr = ipadr
        grid.id = `${sourceid}-${serviceid}`
        grid.action = item.action
        grid.ruleid = item.ruleid
        // Object mit attribute als Differenz
        relationhash[grid.id] = grid
      }
    })
  })
  console.log("Hash", relationhash)
  // const zone = Destination[0] // TargetZone

  matrixdata['rhash'] = relationhash
  return matrixdata
}

function createMatrix(matrixdata) {
  var targets = matrixdata.target
  var sources = matrixdata.source
  var relationhash = matrixdata.rhash

  var matrix = []
  targets.forEach((target, a) => {
    sources.forEach((source, b) => {
      var grid = {
        id: `${source.id}-${target.id}`,
        x: a,
        y: b, action: 0, weight: 0
      };
      if (relationhash[grid.id]) {
        grid.action = relationhash[grid.id].action;
        grid.ruleid = relationhash[grid.id].ruleid;
        if (grid.action == "ALLOW") {
          grid.weight = 5
        }
        matrix.push(grid);
      }
      else {
        matrix.push(grid);
      }
    });
  });
  matrixdata['matrix'] = matrix
  return matrixdata
}

// Erstelle sortierte und eindeutige Node-Liste
// Node: Source or Target-Node
function getNodeList(list, target) {
  const Nodes = []
  var Selected = []
  // Lauf 1: Nur Items sammeln
  list.forEach(item => {
    if (!(Selected.includes(item[target]))) {
      Selected.push(item[target])
    }
  })
  // Lauf 2: Items sortieren
  var SelectedSort = Selected.sort()
  SelectedSort.forEach((item, index) => {
    var itemNode = {}
    itemNode.id = index
    // itemNode.ruleid = item.ruleid
    itemNode[target] = item
    Nodes.push(itemNode)
  })
  return Nodes
}
// ermittelt IP-Adressen für eine Service.App Kombination
function getAdrs(list, target) {
  var addresslist = {}
  list.forEach(rule => {
    if (addresslist[`${rule.source}-${rule['service.app']}`]) {
      if (!(addresslist[`${rule.source}-${rule['service.app']}`].sadr.includes(rule.saddress))) {
        addresslist[`${rule.source}-${rule['service.app']}`].sadr.push(rule.saddress)
      }
      if (!(addresslist[`${rule.source}-${rule['service.app']}`].dadr.includes(rule.daddress))) {
        addresslist[`${rule.source}-${rule['service.app']}`].dadr.push(rule.daddress)
      }
    }
    else {
      var saddress = []
      var daddress = []

      var adrs = {
        sadr: saddress,
        dadr: daddress
      }
      adrs['sadr'].push(rule.saddress)
      adrs['dadr'].push(rule.daddress)
      addresslist[`${rule.source}-${rule['service.app']}`] = adrs
    }
  })
  return addresslist
}
// Fügt zwei Attribute (Service/App) zu einem Attribut (Service.App) zusammen 
function newListAttribute(list, index1, index2) {
  const Nodes = []
  // const v1= index1
  // const v2= index2

  list.forEach(item => {
    var itemNode = {}
    Object.assign(itemNode, item)
    // itemNode[`${v1}.${v2}`] = item[`${v1}`]+"."+item[`${v2}`]
    itemNode[index1 + "." + index2] = item[index1] + "." + item[index2]
    Nodes.push(itemNode)
  })
  return Nodes
}
function resolveTargetsfromList(list, target) {

  var resolvedTarget = [];
  // Auflösung von Targets
  list.forEach(listItem => {

    if (listItem[target].indexOf(';') > -1) {
      var targets = listItem[target].split(';')
      // console.log("ListItem",listItem[target])

      targets.forEach(tgt => {
        var listItemNew = {}
        Object.assign(listItemNew, listItem)
        listItemNew[target] = tgt
        // listItemNew.fullname = svc + "." + rule.app + "." + rule.daddress
        listItemNew.id = resolvedTarget.length
        resolvedTarget.push(listItemNew)
      })
    }
    else {
      var listItemNew = {}
      Object.assign(listItemNew, listItem)
      listItemNew.id = resolvedTarget.length
      // rule.fullname = rule.service + "." + rule.app + "." + rule.daddress
      resolvedTarget.push(listItemNew)
    }
  })
  return resolvedTarget
}
// Umschreiben von CSV auf Objekt-Attribute
function setupFwList(list) {
  var fwList = []
  list.forEach(rule => {
    var listitem = new Object()

    listitem.ruleid = rule[""]
    listitem.source = rule["Source Zone"].toUpperCase()
    // listitem.destination = rule["Destination Zone"]
    listitem.destination = rule["Destination Zone"].toUpperCase()
    listitem.saddress = rule["Source Address"]
    listitem.daddress = rule["Destination Address"]
    listitem.service = rule["Service"].toUpperCase()
    listitem.app = rule["Application"].toUpperCase()
    listitem.action = rule["Action"].toUpperCase()
    listitem.name = rule["Name"]
    fwList.push(listitem)
  })
  return fwList
}

// Filterung der Liste in Feld "target" nach Wert "filter und Negation = false"
// Filterung der Liste in Feld "target" außer Wert "filter" und Negation = true

function filterList(list, target, selections, NEGATION) {
  var filteredList = list
  var newList
  var newLists = []

  selections.forEach(selection => {
    if (NEGATION) {
      filteredList = filteredList.filter(item => {
        return item[target] !== selection
      })
    }
    else {
      newList = filteredList.filter(item => {
        return item[target] === selection
      })
      newLists = newLists.concat(newList)
    }
  })
  return (NEGATION) ? filteredList : newLists
}
function runMatrix(matrixdata, target) {
  // console.log("DisplayTarget", target)
  var sources = matrixdata.source
  var targets = matrixdata.target
  var matrix = matrixdata.matrix

  // console.log("Targets", targets)

  // var relationhash = matrixdata.rhash
  // const matrix = [];
  var matrixState = matrixdata.state;


  var targetGroup = [
    { "id": 0, "value": "Trust" },
    { "id": 1, "value": "DMZ" },
    { "id": 2, "value": "DMZ_PUBLIC" },
    { "id": 3, "value": "ANY" },
    { "id": 4, "value": "HAECKER-IT-LAB" }
  ]
  var sourceGroup = [
    { "id": 0, "value": "SA" },
    { "id": 1, "value": "SB" },
    { "id": 2, "value": "SC" },
    { "id": 3, "value": "SD" },
    { "id": 4, "value": "SE" }
  ]

  console.log("Matrix", matrixdata.matrix)

  const screenwidth = "1300"
  const screenheight = "700"
  const textdistance = "10"

  const baseX = 200;
  const offsetX = 0;
  const baseY = 75;
  const offsetY = 0;

  const svgid = "svg1"

  // Matrixbereich
  const matrixX = baseX
  const matrixY = baseY
  const rectwidth = 15            // Matrixelementgröße

  // Beschriftungsbereich und Parameter der Matrix
  const matrixTid = "matrixT"
  const matrixhead = 3 * rectwidth
  const matrixid = "matrix"
  const matrixTx = matrixX - matrixhead
  const matrixTy = matrixY - matrixhead

  const strokewidthMax = "4px"
  const strokewidthMin = "1px"

  // Konstante als Text- und Buttonbereiche (Source-Target)
  // Target
  var targetzone = matrixdata.zone
  const tButtonid = "tButtonID"
  const tButtonX = matrixX + targets.length * rectwidth - (targetGroup.length + 1) * rectwidth
  const tButtonY = matrixTy

  const tButtonTid = "tButtonTextID"
  // const tButtonTx = tButtonX+rectwidth/2
  const tButtonTx = tButtonX + rectwidth
  const tButtonTy = tButtonY - textdistance


  // var serviceSkala = (targets.length * rectwidth + matrixhead) - targetGroup.length * rectwidth
  const targetTid = "tTextID"
  const targetTx = matrixX
  const targetTy = matrixY - textdistance


  // Source
  const sButtonid = "sButtonID"
  // const sButtonX
  // const sButtonY

  const sourceTid = "sTextID"
  const sourceTx = matrixX - textdistance
  const sourceTy = matrixY



  // Source-Text-Beschriftung
  // // Target-Text-Beschriftung




  // Setze SVG-Box
  const box = d3.select('#' + target)
  box
    .append('svg')
    .attr("width", screenwidth)
    .attr("height", screenheight)
    .attr("id", svgid)

  // Setze Matrix-Bereich  
  var canvas = d3.select("#" + svgid)
  canvas
    .append("g")
    // .attr("transform", "translate("+baseX+","+baseY+")")
    .attr("transform", "translate(" + matrixX + "," + matrixY + ")")
    .attr("id", matrixid)

    .selectAll("rect")
    .data(matrix)
    .enter()
    .append("rect")
    .attr("class", "grid")
    .attr("width", rectwidth)
    .attr("height", rectwidth)
    .attr("x", d => d.x * rectwidth)
    .attr("y", d => d.y * rectwidth)
    .style("fill-opacity", d => d.weight * .2);


  // Setze Matrix Axen-Beschriftung
  // var canvas = d3.select("#" + svgid)
  canvas
    .append("g")
    .attr("transform", "translate(" + matrixTx + "," + matrixTy + ")")
    .attr("id", matrixTid)
    .append("line")
    .attr("class", matrixTid)
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 3 * rectwidth)
    .attr("y2", 3 * rectwidth)

  // tButton-Bereich  
  canvas
    .append("g")
    .attr("transform", "translate(" + tButtonX + "," + tButtonY + ")")
    .attr("id", tButtonid)

  // tButton-Textbereich
  canvas
    .append("g")
    .attr("transform", "translate(" + tButtonTx + "," + tButtonTy + ")")
    .attr("id", tButtonTid)

  // Source-Text-Bereich
  canvas
    .append("g")
    .attr("transform", "translate(" + sourceTx + "," + sourceTy + ")")
    .attr("id", sourceTid)

  // Service-Text-Bereich
  canvas
    .append("g")
    .attr("transform", "translate(" + targetTx + "," + targetTy + ")")
    .attr("id", targetTid)

  // Matrix-T-Bereich
  // canvas = d3.select("#" + matrixTid)
  // var serviceSkala = (targets.length * rectwidth + matrixhead) - targetGroup.length * rectwidth


  // Service Überschrift einfügen
  var matrixT = d3.select("#" + matrixTid)
  matrixT
    .append("text")
    // .classed("skala", true)
    .attr("x", rectwidth)
    .attr("y", rectwidth / 2)
    .attr("class", "matrixT")
    .text("Services of Zone: " + targetzone)
    .style("text-anchor", "start")

  // Source Überschrift
  matrixT
    .append("text")
    // .classed("skala", true)
    .attr("x", -rectwidth / 2)
    .attr("y", rectwidth / 2)
    .attr("class", "matrixT")
    .text("Sources To")
    .style("text-anchor", "end")


  // Target Button-Leiste
  var tButton = d3.select("#" + tButtonid)
  tButton
    .selectAll("circle.cout")
    .data(targetGroup)
    .enter()
    .append('circle')
    .classed("cout", true)
    .classed("targetcircle", true)
    .attr("cx", (d, i) => { return rectwidth + i * rectwidth + rectwidth / 2 })
    .attr("cy", 0.5)
    .attr("id", (d, i) => { return "cb" + i })
    .attr("r", rectwidth / 2)

    .on('click', tButtonClick)
    .on('mouseover', tButtonOver)
    .on('mouseout', tButtonOut)


  // Hier wird der Source-Text angezeigt
  var sourceT = d3.select("#" + sourceTid)
  sourceT
    // .append("g")
    // .attr("transform", "translate(" + (baseX - textdistance + offsetX) + "," + (baseY + offsetY) + ")")
    .selectAll("text")
    .data(sources)
    .enter()
    .append("text")
    .attr("class", "skala")
    .attr("y", (d, i) => i * rectwidth + rectwidth / 2)
    .text(d => d.source)
    .style("text-anchor", "end");

  box.selectAll("rect.grid").on("mouseover", gridOver);
  box.selectAll("rect.grid").on("mouseout", gridOut);
  box.selectAll("rect.grid").on("click", gridState);

  function gridOver(event, d) {
    // console.log("State:", matrixState)
    if (matrixState == "Selectable") {
      // console.log("Durch..")
      box.selectAll("rect.grid").attr("class", p => {
        if (p.x == d.x || p.y == d.y) {
          return "gridovered"
        }
        else {
          return "grid"
        }
      })
      // 
      const serviceObject = targets[d.x]
      // Service Text
      const zeile = d3.select("#" + targetTid)
      zeile.append("text")
        .classed("current", true)
        .classed("skala", true)
        .attr("x", d.x * rectwidth + rectwidth / 2)
        .text(serviceObject["service.app"])
        .style("text-anchor", "middle")
        .style("visibility", "visible")
    }
  };

  function gridOut(event, d) {
    if (matrixState == "Selectable") {
      box.select("text.current").remove()
      box.selectAll("rect.gridovered").attr("class", p => { return "grid" });
    }
  }

  function tButtonClick(e, d, i) {
    // alert("A circle was clicked and it's value is " + d.id);
    d3.selectAll("circle.targetcircle")
      .classed("cout", true)
      .classed("coutselected", false)
    d3.select("circle#cb" + d.id)
      .classed("coutselected", true)
  }

  function tButtonOver(e, d, i) {
    d3.select("#" + tButtonTid)
      .append("text")
      .attr("x", d.id * rectwidth + rectwidth / 2)
      .classed("coutover", true)
      .classed("targettext", true)
      .classed("skala", true)
      .text(d.value)
      .style("text-anchor", "middle")
    // console.log("N-te Element:", d.id)
  }
  function tButtonOut(e, d, i) {
    d3.select("text.coutover").remove()
      .classed("cout", true)

    // alert("A circle was clicked and it's value is " + d.id);
  }

  // States: "Selected" (einfrieren; "Selectable" (mouseover))
  function gridState(event, d) {
    if (matrixState == "Selected") {
      // console.log("Durch1")
      matrixState = "Selectable"
      box.selectAll("rect.gridselected").attr("class", p => { return "gridovered" })

    }
    else {
      console.log("Durch2")
      matrixState = "Selected"
      box.selectAll("rect.gridovered").attr("class", p => { return "gridselected" })
    }
  }

}


function homeMatrix() {
  
  // removeAllBox()
  const target = createTaskBox()
  // var target = 'taskBox'
  console.log("Target:",target)
  const screenwidth = "350"
  const screenheight = "300"
  const textdistance = "10"

  const rectwidth = 15              // Matrixelementgröße
  const matrixwidth = 12 * rectwidth  // Matrixhome

  const baseX = screenwidth/2-matrixwidth/2;
  // const baseX = 0;
  // const baseY = 0;
  const baseY = screenheight/2-matrixwidth/2;

  const svgid = "svg1"

  // Matrixbereich
  const matrixX1 = baseX
  const matrixY1 = baseY
  const matrixid1 = "matrix1"

  // Beschriftungsbereich und Parameter der Matrix
  const matrixhead = 3 * rectwidth

  const matrixT1id = "matrixT1"
  const matrixT1x = matrixX1 + matrixwidth/2
  const matrixT1y = matrixY1 - matrixhead


  const strokewidthMax = "4px"
  const strokewidthMin = "1px"

  // Konstante als Text- und Buttonbereiche (Source-Target)
  // Target
  // var targetzone = matrixdata.zone
  // const tButtonid = "tButtonID"
  // const tButtonX = matrixX+targets.length * rectwidth - (targetGroup.length+1) * rectwidth
  // const tButtonY = matrixTy

  // const tButtonTid = "tButtonTextID"
  // // const tButtonTx = tButtonX+rectwidth/2
  // const tButtonTx = tButtonX+rectwidth
  // const tButtonTy = tButtonY - textdistance


  // // var serviceSkala = (targets.length * rectwidth + matrixhead) - targetGroup.length * rectwidth
  // const targetTid = "tTextID"
  // const targetTx = matrixX
  // const targetTy = matrixY - textdistance


  // Source
  const sButtonid = "sButtonID"
  // const sButtonX
  // const sButtonY

  const sourceTid = "sTextID"
  const sourceTx = matrixX1 - textdistance
  const sourceTy = matrixY1



  // Source-Text-Beschriftung
  // // Target-Text-Beschriftung




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
    .attr("class", "grid")
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
    // .classed("skala", true)
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
    .attr("x", -sourcename.length-rectwidth / 2)
    .attr("y", rectwidth / 2)
    .attr("class", "matrixT")
    .text(sourcename)
    .style("text-anchor", "end")

  // M1 Fw
  var matrix1 = d3.select("#" + matrixid1)
  matrix1
    .append("line")
    .attr("class", "fwline")
    .attr("x1", matrixwidth/2)
    .attr("y1", 0-matrixhead)
    .attr("x2", matrixwidth/2)
    .attr("y2", matrixwidth+matrixhead)

  // Source-Text-Bereich
  canvas
    .append("g")
    .attr("transform", "translate(" + sourceTx + "," + sourceTy + ")")
    .attr("id", sourceTid)


  function tButtonClick(e, d, i) {
    // alert("A circle was clicked and it's value is " + d.id);
    d3.selectAll("circle.targetcircle")
      .classed("cout", true)
      .classed("coutselected", false)
    d3.select("circle#cb" + d.id)
      .classed("coutselected", true)
  }

  function tButtonOver(e, d, i) {
    d3.select("#" + tButtonTid)
      .append("text")
      .attr("x", d.id * rectwidth + rectwidth / 2)
      .classed("coutover", true)
      .classed("targettext", true)
      .classed("skala", true)
      .text(d.value)
      .style("text-anchor", "middle")
    // console.log("N-te Element:", d.id)
  }
  function tButtonOut(e, d, i) {
    d3.select("text.coutover").remove()
      .classed("cout", true)

    // alert("A circle was clicked and it's value is " + d.id);
  }

}


export { RunFirewall };
export { homeMatrix };