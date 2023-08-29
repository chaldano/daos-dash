import { requestData } from 'TkbbFolder/net/client.js';
import { selectZones } from 'TkbbFolder/fw/fw_left.js';
import { drawMatrix } from 'TkbbFolder/fw/fw_upper.js';

export function runFirewall() {
  var rules
  requestData('GET', 'http://localhost:8080/fwservice')
    .then(csvdata => {
      rules = csvdata[0];
      console.log("fwlistRow", rules)

      // Initialisiere fwrules
      var fwList = setupFwList(rules)
      console.log("fwlist", fwList)

      // Extrahiere DISABLE Rules
      var selection = ["[DISABLED]  ALLOW"]
      // AllowedRules
      var arules = filterList(fwList, "action", selection, true); // DISABLE extrahieren

      // arules.forEach(item => {
      //   if (item.sdevice != 'any' || item.ddevice != 'any') {
      //     console.log("UUID: ", item.ruleid + ":" + item.sdevice + ":" + item.ddevice)
      //   }
      // })

      // arules.forEach(item => {
      //   if (item.suser != 'any') {
      //     console.log("UUID-User: ", item.ruleid + ":" + item.suser + "Hosts:" + item.saddress) 
      //   }
      // })

      // Berechne Zonenliste
      const szones = getZones(arules, 'source')
      const dzones = getZones(arules, 'destination')
      const hostnames = getHostNames(arules)
      console.log("Liste-HostName", hostnames)

      // Default-Auswahl einfügen
      szones.unshift('!*')
      dzones.unshift('!*')
      hostnames.unshift('!*')

      selectZones(arules, szones, dzones, hostnames)
    })
}


export function analyseRules(zoneSelection) {
  console.log("ZoneSelection:", zoneSelection)

  var rules = zoneSelection['rules']

  // Auflösung von Mehrfachnennung von Source und Target ) 
  var matrixdata
  matrixdata = extractData(rules, zoneSelection['source'], zoneSelection['target'], zoneSelection['host']) // true - extrahieren 

  console.log("selectedTarget", zoneSelection['target'])
  console.log("selectedSource", zoneSelection['source'])
  console.log("Host:", zoneSelection['host'])

// resolveUser(matrixdata)
  matrixdata = createHash(matrixdata)
  matrixdata = createMatrix(matrixdata)
  const svgtarget = drawMatrix(matrixdata)
}

// Schreibt fwList um
function setupFwList(list) {
  var fwList = []
  // console.log("List",list)

  list.forEach(rule => {
    var listitem = new Object()

    // listitem.ruleid = rule["\""]
    // console.log("RuleID-S",rule["Rid"])
    // console.log("RuleID-T",listitem.ruleid)

    var uuidparts = rule["Rule UUID"].split('-')
    listitem.ruleid = uuidparts[4]                   // Short
    listitem.rulelid = rule["Rule UUID"]             // Long
    // console.log("UUID-Parts",uuidparts)

    listitem.name = rule["Name"]
    listitem.location = rule["Location"]
    listitem.tags = rule["Tags"]
    listitem.groups = rule["Group"]

    listitem.source = rule["Source Zone"].toUpperCase()
    listitem.saddress = rule["Source Address"].toUpperCase()
    listitem.suser = rule["Source User"]
    listitem.sdevice = rule["Source Device"]

    listitem.destination = rule["Destination Zone"].toUpperCase()
    listitem.daddress = rule["Destination Address"].toUpperCase()
    listitem.ddevice = rule["Destination Device"]
    listitem.duser = rule["Destination User"]

    listitem.app = rule["Application"].toUpperCase()
    listitem.service = rule["Service"].toUpperCase()
    listitem.urlcat = rule["URL Category"]

    listitem.action = rule["Action"].toUpperCase()
    listitem.profile = rule["Profile"]
    listitem.options = rule["Options"]

    listitem.target = rule["Target"]
    listitem.usagedesc = rule["Rule Usage Description"]

    listitem.modified = rule["Modified"]
    listitem.created = rule["Created"]


    fwList.push(listitem)
  })
  // console.log("FWLIST", fwList)
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
export function extractData(rules, zoneSource, zoneTarget, selectedHost) {
  // Auflösen von zoneTarget
  
  console.log("SelectedHost",selectedHost)



  let DestinationRules

  let resolvedDestination = resolveTargetsfromList(rules, 'destination')
  let DestinationRulesExtracted

  // console.log("ZoneSource:", zoneSource)
  // console.log("ZoneTarget:", zoneTarget)

  if (zoneTarget == "*") {
    DestinationRulesExtracted = resolvedDestination
    // console.log("Target")
  
  }
  else {
    DestinationRulesExtracted = filterList(resolvedDestination, "destination", zoneTarget, false)
  }
  const targetNodes = getNodeList(DestinationRulesExtracted, 'destination')

  let SourceRules = resolveTargetsfromList(DestinationRulesExtracted, 'source')
  // console.log("SourceRules",SourceRules)
  let SourceRulesExtracted

  if (zoneSource == "*") {
    // Exclude Regeln ?
    SourceRulesExtracted = SourceRules
  } else {
    SourceRulesExtracted = filterList(SourceRules, "source", zoneSource, false);
  }
  const sourceNodes = getNodeList(SourceRulesExtracted, 'source')

  // console.log("SourceRuleExtracted", SourceRulesExtracted)
  //SERVICE Rules aus SourceRules
  var ServiceRules = resolveTargetsfromList(SourceRulesExtracted, 'service')
  const AppRules = resolveTargetsfromList(ServiceRules, 'app')

  // Combine rules with "service" + "app"
  const ServiceRulesCombined = newListAttribute(AppRules, "service", "app")

  const DadrRules = resolveTargetsfromList(ServiceRulesCombined, 'daddress')
  const SadrRules = resolveTargetsfromList(DadrRules, 'saddress')
  const SadrRulesUser = resolveTargetsfromList(SadrRules, 'suser')
  console.log("Auflösung-SourceAdrRulesUser", SadrRulesUser)

  const serviceNodes = getNodeList(ServiceRulesCombined, 'service.app')
  console.log("Liste der ServiceNodes", serviceNodes)
  // const sourceNodes = getNodeList(SourceRulesExtracted, 'source')

  // Services: Liste von src-Adressen und dadr-Adressen 
  const ipaddresses = getAdrsUser(SadrRulesUser, serviceNodes)
  console.log("Auflösung-IPAdresses")
  console.log(ipaddresses)

  // Service: Paare von (SourceAdressen -> TargetAdressen)
  var ipaddrByService = getAdrsByService(SadrRulesUser, serviceNodes)
  console.log("Services mit IPAdr:", ipaddrByService)


  console.log("Services mit IPAdr:(Host)", ipaddrByService)

  const matrixdata = {
    rsrc: SadrRules,
    rsrcUser: SadrRulesUser,
    rdst: DadrRules,
    zone: zoneTarget[0],
    sourceNodes: sourceNodes,
    targetNodes: targetNodes,
    serviceNodes: serviceNodes,
    sadr: SadrRules,
    sadrip: ipaddresses,
    sadripService: ipaddrByService,
    state: "Selectable",
  }
  return matrixdata
}

function resolveUser(matrixdata) {
  console.log("ResolveUser)")
  var rsrc = matrixdata.rsrcUser
  var rdst = matrixdata.rdst
  var ipaddrUser = matrixdata.sadripUser
  var ipaddr = matrixdata.sadrip

  var sourceNodes = matrixdata.source

  // Liste suser
  var userList = []
  rsrc.forEach(item => {
    if (!userList.includes(item.suser)) {
      userList.push(item.suser)
    }
  })

  console.log(userList.sort())

  // Liste suser mit saddr 

  var userListWithAdresses = {}
  userListWithAdresses = getUserbyAdr(rsrc)
  console.log("Anzahl Source-Adressen:", Object.keys(userListWithAdresses).length)
  console.log(userListWithAdresses)

  console.log("Anzahl Service-Targets mit Ipaddress:", Object.keys(ipaddr).length)
  console.log("ipaddress", ipaddr)

  console.log("Anzahl Service-Targets mit IpaddressUser:", Object.keys(ipaddrUser).length)
  console.log("ipaddressUser", ipaddrUser)
  // })
}

function createHash(matrixdata) {
  var sourceNodes = matrixdata.sourceNodes
  var serviceNodes = matrixdata.serviceNodes
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
  var targets = matrixdata.targetNodes
  var sources = matrixdata.sourceNodes
  var relationhash = matrixdata.rhash

  var matrix = []
  targets.forEach((target, a) => {
    sources.forEach((source, b) => {
      console.log("Source",source)
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
// ermittelt alle IP-Adressen-Paare pro Service.App Kombination
// List  = object
// Key   = sadr-service.app
// Value = Array of Pair:    sadr-user, dadr

function getAdrsByService(list, target) {
  var addresslist = {}
  list.forEach(rule => {
    if (addresslist[`${rule.source}-${rule['service.app']}`]) {
      var pair = {
        sadr: rule.saddress + "-" + rule.suser,
        dadr: rule.daddress
      }
      // console.log("IndexOfExitingPair:",`${rule.source}-${rule['service.app']}`)
      addresslist[`${rule.source}-${rule['service.app']}`].push(pair)
    }
    else {
      // console.log("IndexOfNewPair:",`${rule.source}-${rule['service.app']}`)

      var pairs = []

      var pair = {
        sadr: rule.saddress + "-" + rule.suser,
        dadr: rule.daddress
      }
      pairs.push(pair)
      addresslist[`${rule.source}-${rule['service.app']}`] = pairs
      // console.log("Erstes Paar",addresslist[`${rule.source}-${rule['service.app']}`])
    }
  })
  return addresslist
}

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

// Listet pro Services.app alle SourceIp-Adressen-SourceUser
// List  = object
// Key   = sadr-service.app
// Value = Array of sadr, Array of dadr

function getAdrsUser(list, target) {
  var addresslist = {}
  list.forEach(rule => {
    if (addresslist[`${rule.source}-${rule['service.app']}`]) {
      if (!(addresslist[`${rule.source}-${rule['service.app']}`].sadr.includes(`${rule.saddress}-${rule['suser']}`))) {
        addresslist[`${rule.source}-${rule['service.app']}`].sadr.push(`${rule.saddress}-${rule['suser']}`)
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
      adrs['sadr'].push(`${rule.saddress}-${rule['suser']}`)
      adrs['dadr'].push(rule.daddress)
      addresslist[`${rule.source}-${rule['service.app']}`] = adrs
    }
  })
  return addresslist
}
// Listet pro SourceUser alle Souce-Ip-Adressen
function getUserbyAdr(list) {
  var addresslist = {}
  list.forEach(rule => {
    if (addresslist[rule['suser']]) {
      if (!(addresslist[rule['suser']].sadr.includes(rule.saddress))) {
        addresslist[rule['suser']].sadr.push(rule.saddress)
      }
    }
    else {
      var saddress = []

      var adrs = {
        sadr: saddress,
      }
      adrs['sadr'].push(rule.saddress)
      addresslist[rule.suser] = adrs
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
      // let hostUpper= item['daddress'].toUpperCase()
      // hostsAll.push(item['daddress'].toUpperCase())
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
