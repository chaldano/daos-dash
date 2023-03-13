import { requestData } from 'TkbbFolder/net/client.js';

import { createDisplayBox } from 'TkbbFolder/dom/html.js';
import { removeContentBox } from 'TkbbFolder/dom/html.js';
import { removeDetailBox } from 'TkbbFolder/dom/html.js';

import * as d3 from "d3";

function RunAnalyse() {
  console.log("Analyse pressed")
  // Create 'Display'
  removeContentBox() 
  removeDetailBox()
  const target= createDisplayBox()     

  const box = d3.select('#'+target)
  
  const width = 600;
  const height = 600;
  const svgID = 'svgDisplay'
  box
    .append("svg:svg")
    .attr("width", width)
    .attr("height", height)
    .attr("id", svgID)
 
  const canvas = box.select("svg")
  canvas
    .append("g")
    .attr("transform", "translate(20,50)")

  const scale = d3.scaleLinear().domain([0, 100]).range([0, 500]);
  const axis = d3.axisBottom(scale);
    
    d3.select('svg g')
      .call(axis);
  }


export { RunAnalyse };

