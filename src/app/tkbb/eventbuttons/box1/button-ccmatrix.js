import { requestData } from 'TkbbFolder/net/client.js';

import { createDisplayBox } from 'TkbbFolder/dom/html.js';
import { removeAllBox } from 'TkbbFolder/dom/html.js';

import * as d3 from "d3";
// import { DomElement } from 'TkbbFolder/dom/html.js';


function RunCCMatrix() {
  removeAllBox()

  let objectives, edges, problems
  requestData('GET', 'http://localhost:8080/ccmatrix')
    .then(csvdata => {
      console.log("Problems")
      problems = csvdata[2];
      console.log(problems);
      console.log("Objectives")
      objectives = csvdata[1];
      console.log(objectives);
      console.log("EdgesProblems")
      edges = csvdata[0]
      console.log("Edges: ",edges);

      const target= createDisplayBox()      
      createCCMatrix(target, objectives, problems, edges)
    })
}

function createCCMatrix(target,nodes, problems, edges) {
  console.log("Edges",edges)
  var edgeHash = {};
  edges.forEach(edge => {
    var id = `${edge.source}-${edge.target}`;
    edgeHash[id] = edge;
  });
  // console.log("edgeHash is established: ");
  console.log("EdgeHash",edgeHash);

  var matrix = [];
  nodes.forEach((source, a) => {
    problems.forEach((target, b) => {
      var grid = {
        id: `${source.id}-${target.id}`,
        x: a,
        y: b, weight: 0
      };
      if (edgeHash[grid.id]) {
          // console.log("edgeValue")
          // console.log(edgeHash[grid.id])
          // console.log("gridId")
          // console.log(grid.id)
        grid.weight = edgeHash[grid.id].weight;
        // matrix.push(grid);
      }
      matrix.push(grid);
    });
  });
  console.log("Matrix is established: ");
  console.log(matrix);
  // console.log("Matrix END: ");
  
  const box = d3.select('#'+target)
  const offsetX = 130;
  const offsetY = 20;
  const baseX = 110;
  const baseY = 150;

  box
    .append("svg:svg")
    .attr("width", "800")
    .attr("height", "800")
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
    .attr("transform", "translate(" + (baseX - 20 + offsetX) + "," + (baseY + 12 + offsetY - 5) + ")")
    .selectAll("text")
    .data(problems)
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

export { RunCCMatrix };

