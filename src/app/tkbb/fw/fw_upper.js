// import { createDisplayBox } from 'TkbbFolder/dom/html.js';
import { showTableSource } from 'TkbbFolder/fw/fw_middle.js';
import { removeTable } from 'TkbbFolder/fw/fw_middle.js';
import * as dom from 'TkbbFolder/dom/html.js';
import * as daos from 'TkbbFolder/daos.js';

import * as d3 from "d3";

function drawMatrix(matrixdata) {
  const target = dom.createDisplayBox()

  var sources = matrixdata.sourceNodes
  var targets = matrixdata.serviceNodes
  var matrix = matrixdata.matrix

  var matrixState = matrixdata.state;

  console.log("Matrix", matrix)
  console.log("Targets", targets)
  console.log("Sources", sources)

  // const screenwidth = "2600"
  // const screenheight = "650"
  
   
  
  const BaseX = 150;
  const BaseY = 50;
  const textdistance = "10"
  const unit = 15                   // Matrixelementgröße
  const rectwidth = unit            // Matrixelementgröße
  const matrixhead = 2 * rectwidth
  
  const screenwidth = daos.WidthResolution(targets.length * unit + 1.1*BaseX)
  const screenheight = "700"

  console.log("ViewBox-width", screenwidth)
  console.log("ViewBox-height", screenheight)

  // Canvas anlegen
  const svgid = daos.setCanvasRes(target,screenheight, screenwidth)
  
  // Matrixbereich
  const matrixX = BaseX
  const matrixY = BaseY
  
  // Beschriftungsbereich und Parameter der Matrix
  const matrixTid = "matrixTL"
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

  console.log("SVGID",svgid)


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
  var sel = d3.select("#" + svgid)
  sel
    .append("g")
    .attr("transform", "translate(" + matrixX + "," + matrixY + ")")
    .attr("id", matrixid)

    .selectAll("rect")
    .data(matrix)
    .enter()
    .append("rect")
    .attr("class", "grid")
    // .attr("class", d => d.class)
    .attr("width", rectwidth)
    .attr("height", rectwidth)
    .attr("x", d => d.x * rectwidth)
    .attr("y", d => d.y * rectwidth)
    .style("fill", d => {
      if (d.weight == 2) {
        return "red"
      }
      if (d.weight == 3) {
        return "yellow"
      }
      if (d.weight == 1) {
        // spezielles blau
        return "#2669bf"
      }
    });

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
  // box.selectAll("rect.gridhost").on("mouseover", gridOver);
  box.selectAll("rect.grid").on("mouseout", gridOut);
  // box.selectAll("rect.gridhost").on("mouseout", gridOut);
  box.selectAll("rect.grid").on("click", gridState);
  // box.selectAll("rect.gridhost").on("click", gridState);

  function gridOver(event, d) {
    // console.log("Durch over", matrixState)

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
    // console.log("Click-jetzt:",matrixState)
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
        return "gridselected"
      })
      // p.y kennzeichnet die selektierte Zeile
      showTableSource(matrixdata, index)
    }
  }

}

export { drawMatrix };