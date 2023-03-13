import { requestData } from 'TkbbFolder/net/client.js';
import { removeDomElement } from 'TkbbFolder/dom/html.js';
import * as d3 from "d3";
// import { DomElement } from 'TkbbFolder/dom/html.js';


function FB3Button1() {
  // console.log("B3 Button1 gedrückt");
  // let nodes, edges
  requestData('GET', 'http://localhost:8080/sfrclass')
    .then(xmldata => {
      // console.log(xmldata)
      // showClasses(xmldata);
      // CC-Daten in Klasse->Familie-Komponente Hierarchy wandeln
      let data = createHierarchy(xmldata);
      
      let existSVG = !!document.getElementById("b3svg1");
      if (existSVG) {
        removeDomElement("b3svg1")
      }
      showHierarchy(data);

      // console.log(hierarchy)
      // buildHierarchy();
    }
      //     createAdjacencyMatrix(nodes, edges)
    )
}


function showClasses(classes) {
  classes.forEach((classelement, index) => {
    console.log("Class" + index + "[" + classelement.$.id + "] => " + classelement.$.name)
    classarray[index] = classelement.$.name
    console.log("Familien:")
    classelement['f-family'].forEach(famelement => {
      console.log("[" + famelement.$.id + "] => " + famelement.$.name)
      console.log("Komponenten:")
      famelement['f-component'].forEach(comelement => {
        console.log("[" + comelement.$.id + "] => " + comelement.$.name)
      })
    })
  });
};
function createHierarchy(classes) {
  let myObject = new Object();

  myObject['root'] = 'cc';
  myObject['children'] = new Array();
  // Aufnahme aller CC-Klassen
  let classArray = myObject['children'];
  classes.forEach((classelement, classindex) => {
    let classObj = new Object();
    classObj['name'] = classelement.$.name;
    classObj['id'] = classelement.$.id;
    classObj['children'] = new Array();
    // Klasse speichern
    classArray.push(classObj);

    // Aufnahme aller CC-Familien pro Klasse
    let famArray = classArray[classindex]['children'];
    classelement['f-family'].forEach((famelement, famindex) => {
      let famObj = new Object();
      famObj['name'] = famelement.$.name;
      famObj['id'] = famelement.$.id;
      famObj['children'] = new Array();
      // Familie speichern
      famArray.push(famObj);

      // Aufnahme aller CC-Komponenten pro Familie
      let comArray = famArray[famindex]['children'];
      famelement['f-component'].forEach((comelement, comindex) => {
        let comObj = new Object();
        comObj['name'] = comelement.$.name;
        comObj['id'] = comelement.$.id;
        // Komponente speichern
        comArray.push(comObj);
      })
    })
  });
  return myObject
};

function showHierarchy(data) {
  // console.log("showHierarchy is running");
  var depthScale = d3.scaleOrdinal()
    .range(["#5EAFC6", "#FE9922", "#93c464", "#75739F"]);
  // .range(["blue", "red", "green", "orange"]);

  // var nestedTweets = d3.nest()  // Package Nest
  //   .key(d => d.user)           // Bestimmt das Key Element aus der JSON-Datei
  //   .entries(data.tweets);      // Array Eignagsdaten:= tweets


  // Baut ein verdichtetes Array mit (id:Key, values: als Array aller Werte zum Key )
  // var packableTweets = { key: "All Tweets", values: nestedTweets, user: "Admin" };
  var root = d3.hierarchy(data, d => d.children)
    .sum(() => 1);
  // .sum(d => d.retweets ? d.retweets.length + d.favorites.length + 1 : undefined);  // Die Größe der Kreise dynamisch durch die Werte bestimmen.
  var packChart = d3.pack();    // Package Pack -- Formatierung der Hierarchien
  packChart.size([600, 600]);
  packChart.padding(10);        // Abstand zwischen den Kreisen

  // g-Container setzen
  const box = d3.select("#b3")
  //var node = d3.select("#fig4")
  box
    .append("svg:svg")
    .attr("width", "800")
    .attr("height", "800")
    .attr("id", 'b3svg1')
    .append("g")
    .attr("class", "area")
    .attr("transform", "translate(180,10)")
    .selectAll("g")
    .data(packChart(root).descendants())        // Übergabe einer formatierten Hierarchie
    .enter()
    .append("g")
    .attr("class", "areas")
    .attr("transform", (d) => "translate(" + (d.x) + "," + (d.y) + ") ") // g container auf X-Achse ausrichten

  // Kreise und Text im g-Container schreiben
  var circle = box.selectAll(".areas")
  // .data(packChart(root).descendants())        // Übergabe einer formatierten Hierarchie
  // .enter()
  circle
    .append("circle")
    .attr("r", d => d.r)
    .style("fill", d => depthScale(d.depth))
    .style("stroke", "black");

  circle
    .insert("text")
    .attr("y", d => 0 - (d.r / 2))
    // .attr("x", d => 0- (d.r/3))
    // // .attr("class", "titlealter")
    // .text(d => d.data.id);
}



function createAdjacencyMatrix(nodes, edges) {
  var edgeHash = {};
  edges.forEach(edge => {
    var id = `${edge.source}-${edge.target}`;
    edgeHash[id] = edge;
  });

  var matrix = [];
  nodes.forEach((source, a) => {
    nodes.forEach((target, b) => {
      var grid = {
        id: `${source.id}-${target.id}`,
        x: b,
        y: a, weight: 0
      };
      if (edgeHash[grid.id]) {
        grid.weight = edgeHash[grid.id].weight;
      }
      matrix.push(grid);
    });
  });
  // console.log("Matrix is established: ");
  // console.log(matrix);
  // console.log("Matrix END: ");

  const box = d3.select("#b2")
  const offsetX = 130;
  const offsetY = 20;
  const baseX = 70;
  const baseY = 70;

  box
    .append("svg:svg")
    .attr("width", "600")
    .attr("height", "600")
    .attr("id", 'b2svg1')
    .append("g")
    // .attr("transform", "translate("+baseX+","+baseY+")")
    .attr("transform", "translate(" + (baseX + offsetX) + "," + (baseY + 5 + offsetY) + ")")
    .attr("id", "adjacencyG")
    .selectAll("rect")
    .data(matrix)
    .enter()
    .append("rect")
    .attr("class", "grid")
    .attr("width", 25)
    .attr("height", 25)
    .attr("x", d => d.x * 25)
    .attr("y", d => d.y * 25)
    .style("fill-opacity", d => d.weight * .2);

  const canvas = box.select("svg")
  canvas
    .append("g")
    // .attr("transform", "translate(70,65)")
    .attr("transform", "translate(" + (baseX + offsetX) + "," + (baseY + offsetY - 5) + ")")

    .selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .attr("x", (d, i) => i * 25 + 12.5)
    .text(d => d.id)
    .style("text-anchor", "end")
    .style("writing-mode", "tb");


  // d3.select("svg")
  canvas
    .append("g")
    .attr("transform", "translate(50,75)")
    .attr("transform", "translate(" + (baseX - 20 + offsetX) + "," + (baseY + 5 + offsetY - 5) + ")")
    .selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .attr("y", (d, i) => i * 25 + 12.5)
    .text(d => d.id)
    .style("text-anchor", "end");

  box.selectAll("rect.grid").on("mouseover", gridOver);
  function gridOver(event, d) {
    // d3.select("#b0").selectAll("rect")
    //   .style("stroke-width", function (p) {
    //     return p.x == d.x || p.y == d.y ? "4px" : "1px";
    //   });
    box.selectAll("rect.grid").on("mouseover", gridOver);
    function gridOver(event, d) {
      box.selectAll("rect").style("stroke-width", p =>
        p.x == d.x || p.y == d.y ? "4px" : "1px");
    };
  }
}


export { FB3Button1 };

