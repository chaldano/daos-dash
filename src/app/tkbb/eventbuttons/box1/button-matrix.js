import { requestData } from 'TkbbFolder/net/client.js';
import { createDisplayBox } from 'TkbbFolder/dom/html.js';
import { removeContentBox } from 'TkbbFolder/dom/html.js';
import { removeDetailBox } from 'TkbbFolder/dom/html.js';
import * as d3 from "d3";
import _ from 'lodash';
// import { removeContentBox } from '../../dom/html';
// import { removeDetailBox } from '../../dom/html';


function RunMatrix() {
  console.log("B0 Button2 gedrückt");
  let nodes, edges
  requestData('GET', 'http://localhost:8080/route-matrix')
  // requestData('GET', 'http://localhost:8080/route')
    .then(csvdata => {
      console.log("Nodes")
      nodes = csvdata[1];
      console.log(nodes);
      console.log("Edges")
      edges = csvdata[0]
      console.log(edges);
      
            
      // Create 'Display'
      removeContentBox()
      removeDetailBox()
      const target= createDisplayBox()      
      
      createEAMatrix(target, nodes, edges)
    })
}

function createEAMatrix(target, nodes, edges) {
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

  const box = d3.select('#'+target)
  
  const offsetX = 130;
  const offsetY = 20;
  const baseX = 70;
  const baseY = 70;

  box
    .append("svg:svg")
    .attr("width", "600")
    .attr("height", "600")
    .attr("id", 'svgDisplay')
    .append("g")
    // .attr("transform", "translate("+baseX+","+baseY+")")
    .attr("transform", "translate("+(baseX+offsetX)+","+(baseY+5+offsetY)+")")
    .attr("id", "AdjacentMatrix")
    
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
    .attr("transform", "translate("+(baseX+offsetX)+","+(baseY+offsetY-5)+")")
    
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
    // .attr("transform", "translate(50,75)")
    .attr("transform", "translate("+(baseX-20+offsetX)+","+(baseY+5+offsetY-5)+")")
    .selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .attr("y", (d, i) => i * 25 + 12.5)
    .text(d => d.id)
    .style("text-anchor", "end");

  box.selectAll("rect.grid").on("mouseover", gridOver);
  function gridOver(event, d) {
    box.selectAll("rect.grid").on("mouseover", gridOver);
    function gridOver(event, d) {
      box.selectAll("rect").style("stroke-width", p =>
        p.x == d.x || p.y == d.y ? "4px" : "1px");
    };
  }
}


export { RunMatrix };
