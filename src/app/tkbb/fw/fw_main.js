import { requestData } from 'TkbbFolder/net/client.js';
import { selectZones } from 'TkbbFolder/fw/fw_left.js';
// import { resolveZones } from 'TkbbFolder/fw/fw_right.js';
import { drawMatrix } from 'TkbbFolder/fw/fw_upper.js';

// import { createTaskBox } from 'TkbbFolder/dom/html.js';
// import { removeDisplayBox } from 'TkbbFolder/dom/html.js';
// import * as d3 from "d3";

function runFirewall() {
  // removeDisplayBox()
  var rules
  requestData('GET', 'http://localhost:8080/fwservice')
    .then(csvdata => {
      rules = csvdata[0];

      // Initialisiere fwrules
      var fwList = setupFwList(rules)
      console.log("fwlist")
      console.log(fwList)

      // Extrahiere DISABLE Rules
      var selection = ["[DISABLED]  ALLOW"]
      // AllowedRules
      var arules = filterList(fwList, "action", selection, true); // DISABLE extrahieren

      // Berechne Zonenliste
      const szones = getZones(arules, 'source')
      const dzones = getZones(arules, 'destination')
      // resolveZones(arules, szones, dzones)
      // resolveZones()
      selectZones(arules, szones, dzones)
    })
}

function analyseRules(zoneSelection) {
  // var zoneSelection=initZoneSelection(szones, dzones)
  console.log(zoneSelection['rules'])
  console.log(zoneSelection['source'])
  console.log(zoneSelection['target'])

  var rules = zoneSelection['rules']

  var allDestinations = getDestinations(rules)
  console.log("AllDestinations", allDestinations)
  var allSources = getSources(rules)
  console.log("AllSources", allSources)

  // Auflösung von Mehrfachnennung von Source und Target ) 
  var matrixdata = extractData(rules, zoneSelection['source'], zoneSelection['target']) // true - extrahieren 
  matrixdata = createHash(matrixdata)
  matrixdata = createMatrix(matrixdata)
  console.log("Initialer Matrixstatus:",matrixdata.state)
  
  const svgtarget = drawMatrix(matrixdata)

  var sadr = matrixdata.sadrip
  console.log("SADR", sadr)
}

// Zeigt initialisierte Liste an
function ShowRules(rules) {
  var fwList = setupFwList(rules)
  console.log("SourceZones")
  fwList.forEach(rule => {
    console.log(rule.source)
  })
  console.log("DestinationZones")
  fwList.forEach(rule => {
    console.log(rule.destination)
  })
}

// Schreibt fwList um
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
// Extrahiert Zonen (source, destination)
function getZones(rules, zone) {
  var zonelist = []
  // var fwList = setupFwList(rules)

  // // DISABLE RULE EXTRAHIEREN
  // var selection = ["[DISABLED]  ALLOW"]
  // var AllowedRules = filterList(fwList, "action", selection, true); // DISABLE extrahieren

  var resolvedZones = resolveTargetsfromList(rules, zone)
  const zones = getNodeList(resolvedZones, zone)
  zones.forEach(target => {
    zonelist.push(target[zone])
  })
  return zonelist
}

function resolveRules(rules) {

  var allDestinations = getDestinations(rules)
  console.log("AllDestinations", allDestinations)
  var allSources = getSources(rules)
  console.log("AllSources", allSources)

  // const ExcludedSources = ["DMZ", "DMZ_PUBLIC", "SSL-VPN", "SITE2SITE"]
  // const Destinations = ["TRUST"]
  // var matrixdata = extractData(rules, ExcludedSources, Destinations, true) // true - extrahieren 
  // matrixdata = createHash(matrixdata)
  // matrixdata = createMatrix(matrixdata)

  // var sadr = matrixdata.sadrip
  // console.log("SADR",sadr)

  // showTable(matrixdata)




}

// Löst Rgeln nach Destinations auf
function getDestinations(rules) {

  // var fwList = setupFwList(rules)
  var resolvedDestination = resolveTargetsfromList(rules, 'destination')
  const destinations = getNodeList(resolvedDestination, 'destination')
  return destinations
}
// Löst Regeln nach Sources auf
function getSources(rules) {
  // var fwList = setupFwList(rules)
  var resolvedSources = resolveTargetsfromList(rules, 'source')
  const sources = getNodeList(resolvedSources, 'source')
  console.log("Sources", sources)
  return sources
}
// Extrahiert Regeln auf Grundlage von Zonen
function extractData(rules, zoneSource, zoneTarget) {
  // console.log("Exludes", exSources)

  // Initialisiere Firewallliste
  // var fwList = setupFwList(rules)
  // console.log("FwRules", fwList)

  // DISABLE RULE EXTRAHIEREN
  // var selection = ["[DISABLED]  ALLOW"]
  // var DisabledRules = filterList(rules, "action", selection, false); // DISABLE filtern
  // console.log("DisabledRules", DisabledRules)

  // var AllowedRules = filterList(rules, "action", selection, true); // DISABLE extrahieren
  // console.log("AllowedRules", AllowedRules)

  // (1) Alle Regeln nach zoneTarget aufschlüsseln

  // Auflösen von zoneTarget
  var resolvedDestination = resolveTargetsfromList(rules, 'destination')
  // console.log("DestinationRules", resolvedDestination)

  // Zielzone (Destination) aus Destination filtern
  // console.log("Filter: ", zoneTarget)
  var DestinationRules = filterList(resolvedDestination, "destination", zoneTarget, false); // false: nur destination filtern
  // console.log("TrustRules", DestinationRules)

  // Auflösen von Source für DestinationRules
  var SourceRules = resolveTargetsfromList(DestinationRules, 'source')
  // console.log("SourceRules", SourceRules)

  if (zoneSource == "*") {
    // Exclude Regeln ?
    var SourceRulesExtracted = SourceRules
    // console.log("SourceRulesExtracted-Wildcard", SourceRulesExtracted)
  } else {
    
    SourceRulesExtracted = filterList(SourceRules, "source", zoneSource, false);
    // console.log("SourceRulesExtracted-Filter", SourceRulesExtracted)
  }
  // })
  // }
  // else {
  //   SourceRulesExtracted = filterList(SourceRules, "source", Sources, false);
  //   console.log("SourceRulesSelected", SourceRulesExtracted)

  // }

  //SERVICE Rules aus SourceRules
  var ServiceRules = resolveTargetsfromList(SourceRulesExtracted, 'service')
  // console.log("ServiceRules", ServiceRules)

  const AppRules = resolveTargetsfromList(ServiceRules, 'app')
  // console.log("AppRules", AppRules)

  // Combine rules with "service" + "app"
  const ServiceRulesCombined = newListAttribute(AppRules, "service", "app")
  // console.log("ServiceRulesCombined", ServiceRulesCombined)

  const DadrRules = resolveTargetsfromList(ServiceRulesCombined, 'daddress')
  // console.log("Dadr-Rules", DadrRules)

  // Resolve S-Addr
  const SadrRules = resolveTargetsfromList(DadrRules, 'saddress')
  // console.log("Sadr-Rules", SadrRules)


  // Liste von Services
  const serviceNodes = getNodeList(ServiceRulesCombined, 'service.app')
  // console.log("ServiceNodes", serviceNodes)

  // Liste von Sources
  const sourceNodes = getNodeList(SourceRulesExtracted, 'source')
  // console.log("SourceNodes", sourceNodes)

  const ipaddresses = getAdrs(SadrRules, serviceNodes)

  // console.log("SourceNodes(sadr-dadr)", ipaddresses)
  // console.log("ServiceNodes with Addresses", serviceNodes)


  // Grid-Elemente für Matrix ermitteln
  const matrixdata = {
    zone: zoneTarget[0],
    source: sourceNodes,
    target: serviceNodes,
    sadr: SadrRules,
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

// Filterung der Liste in Feld "target" nach Wert "filter und Negation = false"
// Filterung der Liste in Feld "target" außer Wert "filter" und Negation = true

function filterList(list, target, selections, NEGATION) {
  var filteredList = list
  var newList
  var newLists = []
  console.log("Selection:", selections)
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
  console.log("FilteredList", filteredList)
  console.log("NewList", newList)
  return (NEGATION) ? filteredList : newLists
}

function drawFirewall (canvas) {
  
  const textdistance = "10"

  const objectID = "obj"+canvas.Target

  // Beschriftungsbereich und Parameter der Matrix
  const matrixhead = 3 * canvas.Unit

  const targetTid = "targetT"+objectID
  const targetTx = canvas.BaseX + canvas.ObjWidth / 2
  const targetTy = canvas.BaseY - matrixhead

  const sourceTid = "sourceT"+objectID
  const sourceTx = canvas.BaseX - textdistance
  const sourceTy = canvas.BaseY

  // Setze Matrix-Bereiche  
  var can = d3.select("#" + canvas.ID)
  can
    .append("g")
    .attr("transform", "translate(" + canvas.BaseX + "," + canvas.BaseY + ")")
    .attr("id", objectID)

    .append("rect")
    .attr("class", "fwgrid")
    .attr("width", canvas.ObjWidth)
    .attr("height", canvas.ObjWidth)
    .attr("x", 0)
    .attr("y", 0)

  // M1 Axen-Beschriftung
  // Linie
  var can = d3.select("#" + canvas.ID)
  can
    .append("g")
    .attr("transform", "translate(" + targetTx + "," + targetTy + ")")
    .attr("id", targetTid)

  // M1-Service Überschrift
  var matrixT = d3.select("#" + targetTid)
  matrixT
    .append("text")
    .classed("skala", true)
    .attr("x", canvas.Unit)
    .attr("y", canvas.Unit / 2)
    .attr("class", "matrixT")
    // .text("Services of Zone: " + targetzone)
    .text("Target Zone ")
    .style("text-anchor", "start")

  // M1-Source Überschrift
  var sourcename = "Source Zone"
  matrixT
    .append("text")
    // .classed("skala", true)
    .attr("x", -sourcename.length - canvas.Unit / 2)
    .attr("y", canvas.Unit / 2)
    .attr("class", "matrixT")
    .text(sourcename)
    .style("text-anchor", "end")

  // M1 Fw
  var matrix1 = d3.select("#" + objectID)
  matrix1
    .append("line")
    .attr("class", "fwline")
    .attr("x1", canvas.ObjWidth / 2)
    .attr("y1", 0 - matrixhead)
    .attr("x2", canvas.ObjWidth / 2)
    .attr("y2", canvas.ObjWidth + matrixhead/2)

  // Source-Text-Bereich
  can
    .append("g")
    .attr("transform", "translate(" + sourceTx + "," + sourceTy + ")")
    .attr("id", sourceTid)

    // return svgid
}

export { runFirewall };
export { analyseRules }
export { drawFirewall }
// export { setCanvas }