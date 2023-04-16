import { createDisplayBox } from 'TkbbFolder/dom/html.js';
import { showTableSource } from 'TkbbFolder/fw/fw_middle.js';
import { removeTable } from 'TkbbFolder/fw/fw_middle.js';
import * as d3 from "d3";

function drawMatrix(matrixdata) {
  // console.log("DisplayTarget", target)
  const target = createDisplayBox()
  
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

  const baseX = 150;
  const offsetX = 0;
  const baseY = 50;
  const offsetY = 0;

  const svgid = "svgupper"

  // Matrixbereich
  const matrixX = baseX
  const matrixY = baseY
  const rectwidth = 15            // Matrixelementgröße

  // Beschriftungsbereich und Parameter der Matrix
  const matrixTid = "matrixTL"
  const matrixhead = 2 * rectwidth
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
    .attr("x2", matrixhead)
    .attr("y2", matrixhead)

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
    .classed("matrixT", true)
    .attr("x", rectwidth)
    .attr("y", rectwidth / 2)
    // .style("color", "bs-white")
    .text("Services of Zone: " + targetzone)
  // .style("text-anchor", "start")

  // Source Überschrift
  matrixT
    .append("text")
    .attr("class", "matrixT")
    .attr("x", -rectwidth / 2)
    .attr("y", rectwidth / 2)
    .text("Sources To")
    .style("text-anchor", "end")


  // Target Button-Leiste
  // var tButton = d3.select("#" + tButtonid)
  // tButton
  //   .selectAll("circle.cout")
  //   .data(targetGroup)
  //   .enter()
  //   .append('circle')
  //   .classed("cout", true)
  //   .classed("targetcircle", true)
  //   .attr("cx", (d, i) => { return rectwidth + i * rectwidth + rectwidth / 2 })
  //   .attr("cy", 0.5)
  //   .attr("id", (d, i) => { return "cb" + i })
  //   .attr("r", rectwidth / 2)

  //   .on('click', tButtonClick)
  //   .on('mouseover', tButtonOver)
  //   .on('mouseout', tButtonOut)


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