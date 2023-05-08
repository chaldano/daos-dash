// import { createDisplayBox } from 'TkbbFolder/dom/html.js';
import { showTableSource } from 'TkbbFolder/fw/fw_middle.js';
import { removeTable } from 'TkbbFolder/fw/fw_middle.js';
import * as dom from 'TkbbFolder/dom/html.js';
import * as daos from 'TkbbFolder/daos.js';

import * as d3 from "d3";

function drawMatrix(matrixdata) {
  const target = dom.createDisplayBox()
  
  var sources = matrixdata.source
  var targets = matrixdata.target
  var matrix = matrixdata.matrix

  var matrixState = matrixdata.state;

  console.log("Matrix", matrixdata.matrix)

  const screenwidth = "1600"
  const screenheight = "400"
  const unit = 15                // Matrixelementgröße
  
  // Canvas Umgebung einrichten
  const canvas = new daos.Canvas(target, screenwidth, screenheight)
  canvas.BaseX = 100;
  canvas.BaseY =  50;
  canvas.Unit = unit
  
  // Canvas anlegen
  daos.setCanvas(canvas, target)
  // canvas.ObjWidth = objectwidth;

  const textdistance = "10"

  // Matrixbereich
  const matrixX = canvas.BaseX
  const matrixY = canvas.BaseY
  const rectwidth = 15            // Matrixelementgröße

  // Beschriftungsbereich und Parameter der Matrix
  const matrixTid = "matrixTL"
  const matrixhead = 2 * rectwidth
  const matrixid = "matrix"
  const matrixTx = matrixX - matrixhead
  const matrixTy = matrixY - matrixhead

  // const strokewidthMax = "4px"
  // const strokewidthMin = "1px"

  // Konstante als Text- und Buttonbereiche (Source-Target)
  // Target
  var targetzone = matrixdata.zone
  const targetTid = "tTextID"
  const targetTx = matrixX
  const targetTy = matrixY - textdistance


  // Source
  // const sButtonid = "sButtonID"
  // const sButtonX
  // const sButtonY

  const sourceTid = "sTextID"
  const sourceTx = matrixX - textdistance
  const sourceTy = matrixY



  // Source-Text-Beschriftung
  // // Target-Text-Beschriftung



  // Setze SVG-Box
  // const box = d3.select('#' + target)
  // box
  //   .append('svg')
  //   .attr("width", screenwidth)
  //   .attr("height", screenheight)
  //   .attr("id", svgid)

  // Setze Matrix-Bereich  
  var sel = d3.select("#" + canvas.ID)
  sel
    .append("g")
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
  sel
    .append("g")
    .attr("transform", "translate(" + matrixTx + "," + matrixTy + ")")
    .attr("id", matrixTid)
    .append("line")
    .attr("class", matrixTid)
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", matrixhead)
    .attr("y2", matrixhead)

  // Source-Text-Bereich
  sel
    .append("g")
    .attr("transform", "translate(" + sourceTx + "," + sourceTy + ")")
    .attr("id", sourceTid)

  // Service-Text-Bereich
  sel
    .append("g")
    .attr("transform", "translate(" + targetTx + "," + targetTy + ")")
    .attr("id", targetTid)

  // Service Überschrift einfügen
  var matrixT = d3.select("#" + matrixTid)
  matrixT
    .append("text")
    .classed("matrixT", true)
    .attr("x", rectwidth)
    .attr("y", rectwidth / 2)
    .text("Services of Zone: " + targetzone)

  // Source Überschrift
  matrixT
    .append("text")
    .attr("class", "matrixT")
    .attr("x", -rectwidth / 2)
    .attr("y", rectwidth / 2)
    .text("Sources To")
    .style("text-anchor", "end")

  // Source-Text angezeigen
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
  
  const box = d3.select('#' + target)
  box.selectAll("rect.grid").on("mouseover", gridOver);
  box.selectAll("rect.grid").on("mouseout", gridOut);
  box.selectAll("rect.grid").on("click", gridState);

  function gridOver(event, d) {
    console.log("Durch over", matrixState)
    
    if (matrixState == "Selectable") {
      box.selectAll("rect.grid").attr("class", p => {
        if (p.x == d.x || p.y == d.y) {
          // console.log("Punkt:",d.x +"-"+d.y )
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
      zeile
        .append("text")
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
    console.log("Click-jetzt:",matrixState)
    if (matrixState == "Selected") {
      // Status aufheben
      matrixState = "Selectable"
      box.selectAll("rect.gridselected").attr("class", p => { return "gridovered" })
      removeTable()
    }
    else {
      // Status setzen
      matrixState = "Selected"
      var index
      box.selectAll("rect.gridovered").attr("class", p => { 
        index = p.y
        return "gridselected" })
      // p.y kennzeichnet die selektierte Zeile
      showTableSource(matrixdata, index)
    }
  }

}

export { drawMatrix };