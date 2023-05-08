import { requestData } from 'TkbbFolder/net/client.js';
import { selectZones } from 'TkbbFolder/fw/fw_left.js';
import { drawMatrix } from 'TkbbFolder/fw/fw_upper.js';

export function runFirewall() {
  var rules
  requestData('GET', 'http://localhost:8080/fwservice')
    .then(csvdata => {
      rules = csvdata[0];

      // Initialisiere fwrules
      var fwList = setupFwList(rules)
      console.log("fwlist",fwList)
      
      // Extrahiere DISABLE Rules
      var selection = ["[DISABLED]  ALLOW"]
      // AllowedRules
      var arules = filterList(fwList, "action", selection, true); // DISABLE extrahieren
      console.log("Arules",arules)
      
      // Berechne Zonenliste
      const szones = getZones(arules, 'source')
      const dzones = getZones(arules, 'destination')
      const hostnames = getHostNames(arules)

      // Default-Auswahl einfügen
      szones.unshift('!*')
      dzones.unshift('!*')
      hostnames.unshift('!*')

      selectZones(arules, szones, dzones, hostnames)
    })
}


export function analyseRules(zoneSelection) {
  
  var rules = zoneSelection['rules']

  // Auflösung von Mehrfachnennung von Source und Target ) 
  var matrixdata = extractData(rules, zoneSelection['source'], zoneSelection['target'], zoneSelection['host']) // true - extrahieren 

  matrixdata = createHash(matrixdata)
  matrixdata = createMatrix(matrixdata)
  const svgtarget = drawMatrix(matrixdata)
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
export function getZones(rules, zone) {
  var zonelist = []
  var resolvedZones = resolveTargetsfromList(rules, zone)
  const zones = getNodeList(resolvedZones, zone)
  zones.forEach(target => {
    zonelist.push(target[zone])
  })
  return zonelist
}


// Extrahiert Regeln auf Grundlage von Zonen
function extractData(rules, zoneSource, zoneTarget) {
  // Auflösen von zoneTarget
  // console.log("Rules",rules)
  
  let DestinationRules
  let resolvedDestination = resolveTargetsfromList(rules, 'destination')
  DestinationRules = filterList(resolvedDestination, "destination", zoneTarget, false); // false: nur destination filtern
  let SourceRules = resolveTargetsfromList(DestinationRules, 'source')

  let SourceRulesExtracted

  if (zoneSource == "*") {
    // Exclude Regeln ?
    SourceRulesExtracted = SourceRules
  } else {

    SourceRulesExtracted = filterList(SourceRules, "source", zoneSource, false);
  }


  //SERVICE Rules aus SourceRules
  var ServiceRules = resolveTargetsfromList(SourceRulesExtracted, 'service')
  const AppRules = resolveTargetsfromList(ServiceRules, 'app')

  // Combine rules with "service" + "app"
  const ServiceRulesCombined = newListAttribute(AppRules, "service", "app")

  const DadrRules = resolveTargetsfromList(ServiceRulesCombined, 'daddress')
  const SadrRules = resolveTargetsfromList(DadrRules, 'saddress')
  // console.log("DadrRules",DadrRules)
  // console.log("SadrRules",SadrRules)
  
  const serviceNodes = getNodeList(ServiceRulesCombined, 'service.app')
  const sourceNodes = getNodeList(SourceRulesExtracted, 'source')

  const ipaddresses = getAdrs(SadrRules, serviceNodes)

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
      if (item.source == srcnode.source) {
        var ipadr
        var grid = {}
        var sourceid = srcnode.id
        var serviceid
        for (var obj of serviceNodes) {
          if (obj["service.app"] == item["service.app"]) {
            serviceid = obj.id
            ipadr = ipaddresses[`${srcnode.source}-${obj['service.app']}`]
            break
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
// Sucht initial alle Hostname / IP-Adressen
function getHostNames(list, target) {
  let hostsSource = []
  let hostsTarget = []
  let hostsAll = []

  const shosts = resolveTargetsfromList(list, 'saddress')
  shosts.forEach(item => {
    if (!(hostsSource.includes(item['saddress']))) {
      hostsSource.push(item['saddress'])
    }
    if (!(hostsAll.includes(item['saddress']))) {
      hostsAll.push(item['saddress'])
    }

  })
  const hostsSourceS = hostsSource.sort()
  const thosts = resolveTargetsfromList(list, 'daddress')
  thosts.forEach(item => {
    if (!(hostsTarget.includes(item['daddress']))) {
      hostsTarget.push(item['daddress'])
    }
    if (!(hostsAll.includes(item['daddress']))) {
      hostsAll.push(item['daddress'])
    }

  })
  const hostsTargetS = hostsTarget.sort()
  const hostsAllS = hostsAll.sort()
  
  // Auswahl beliebiger Host
  // hostsAllS.unshift('*')
  return hostsAllS
  // return addresslist
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
export function resolveTargetsfromList(list, target) {

  var resolvedTarget = [];
  // Auflösung von Targets
  list.forEach(listItem => {

    if (listItem[target].indexOf(';') > -1) {
      var targets = listItem[target].split(';')
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
export function filterList(list, target, selections, NEGATION) {
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

export function drawFirewall(canvas) {

  const textdistance = "10"

  const objectID = "obj" + canvas.Target

  // Beschriftungsbereich und Parameter der Matrix
  const matrixhead = 3 * canvas.Unit

  const targetTid = "targetT" + objectID
  const targetTx = canvas.BaseX + canvas.ObjWidth / 2
  const targetTy = canvas.BaseY - matrixhead

  const sourceTid = "sourceT" + objectID
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
    .attr("y2", canvas.ObjWidth + matrixhead / 2)

  // Source-Text-Bereich
  can
    .append("g")
    .attr("transform", "translate(" + sourceTx + "," + sourceTy + ")")
    .attr("id", sourceTid)

  // return svgid
}
