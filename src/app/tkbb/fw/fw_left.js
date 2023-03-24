import { requestData } from 'TkbbFolder/net/client.js';

// import 'TkbbFolder/dom/html.js';
import { createTaskBox } from 'TkbbFolder/dom/html.js';
import * as d3 from "d3";



function homeMatrix() {
  var allGroup1 = ["yellow", "blue", "red", "green", "purple", "black"]
  var allGroup2 = ["A", "B", "C", "D", "E", "F"]

  // removeAllBox()
  const target = createTaskBox()
  // var target = 'taskBox'
  console.log("Target:", target)
  const screenwidth = "350"
  const screenheight = "300"
  const textdistance = "10"

  const rectwidth = 15              // Matrixelementgröße
  const matrixwidth = 12 * rectwidth  // Matrixhome

  const baseX = screenwidth / 2 - matrixwidth / 2;
  // const baseX = 200;
  // const baseY = 0;
  const baseY = screenheight / 2 - matrixwidth / 2;

  const svgid = "svgleft"

  // Matrixbereich
  const matrixX1 = baseX
  const matrixY1 = baseY
  const matrixid1 = "matrix1"

  // Beschriftungsbereich und Parameter der Matrix
  const matrixhead = 3 * rectwidth

  const selectSource = "selectSZone"
  const selectTarget = "selectTZone"

  const matrixT1id = "matrixT1"
  const matrixT1x = matrixX1 + matrixwidth / 2
  const matrixT1y = matrixY1 - matrixhead


  const strokewidthMax = "4px"
  const strokewidthMin = "1px"

  // Konstante als Text- und Buttonbereiche (Source-Target)
  // Target
  // var targetzone = matrixdata.zone
  // const tButtonid = "tButtonID"
  // const tButtonX = matrixX+targets.length * rectwidth - (targetGroup.length+1) * rectwidth
  // const tButtonY = matrixTy

  // const tButtonTid = "tButtonTextID"
  // // const tButtonTx = tButtonX+rectwidth/2
  // const tButtonTx = tButtonX+rectwidth
  // const tButtonTy = tButtonY - textdistance


  // // var serviceSkala = (targets.length * rectwidth + matrixhead) - targetGroup.length * rectwidth
  // const targetTid = "tTextID"
  // const targetTx = matrixX
  // const targetTy = matrixY - textdistance


  // Source
  const sButtonid = "sButtonID"
  // const sButtonX
  // const sButtonY

  const sourceTid = "sTextID"
  const sourceTx = matrixX1 - textdistance
  const sourceTy = matrixY1


  // Auswahl 1 setzen
  var b1 = d3.select("#" + target)
  b1
    .append("select")
    .attr("id", selectSource)
    .classed("position-absolute", true)
    .classed("bottom-50", true)
    .classed("end-50", true)
    .classed("me-2", true)
    .selectAll('myOptions') // Next 4 lines add 6 options = 6 colors
    .data(allGroup1)
    .enter()
    .append('option')
    .text(function (d) { return d; }) // text showed in the menu
    .attr("value", function (d) { return d; }) // corresponding value returned by the button

  // Auswahl 2 setzen
  var b2 = d3.select("#" + target)
  b2
    .append("select")
    .classed("position-absolute", true)
    .classed("bottom-50", true)
    .classed("start-50", true)
    .classed("ms-2", true)
    .attr("id", selectTarget)
    .selectAll('myOptions') // Next 4 lines add 6 options = 6 colors
    .data(allGroup2)
    .enter()
    .append('option')
    .text(function (d) { return d; }) // text showed in the menu
    .attr("value", function (d) { return d; }) // corresponding value returned by the butto


  // Setze SVG-Box
  const box = d3.select('#' + target)
  box
    .append('svg')
    .attr("width", screenwidth)
    .attr("height", screenheight)
    .attr("id", svgid)
  // .classed("position-absolute", true)
  // .classed("top-0", true)

  // Setze Matrix-Bereiche  
  var canvas = d3.select("#" + svgid)
  canvas
    .append("g")
    .attr("transform", "translate(" + matrixX1 + "," + matrixY1 + ")")
    .attr("id", matrixid1)

    .append("rect")
    .attr("class", "fwgrid")
    .attr("width", matrixwidth)
    .attr("height", matrixwidth)
    .attr("x", 0)
    .attr("y", 0)

  // Auswahl Button einhängen



  // M1 Axen-Beschriftung
  // Linie
  var canvas = d3.select("#" + svgid)
  canvas
    .append("g")
    .attr("transform", "translate(" + matrixT1x + "," + matrixT1y + ")")
    .attr("id", matrixT1id)

  // M1-Service Überschrift
  var matrixT = d3.select("#" + matrixT1id)
  matrixT
    .append("text")
    .classed("skala", true)
    .attr("x", rectwidth)
    .attr("y", rectwidth / 2)
    .attr("class", "matrixT")
    // .text("Services of Zone: " + targetzone)
    .text("Target Zone ")
    .style("text-anchor", "start")

  // M1-Source Überschrift
  var sourcename = "Source Zone"
  matrixT
    .append("text")
    // .classed("skala", true)
    .attr("x", -sourcename.length - rectwidth / 2)
    .attr("y", rectwidth / 2)
    .attr("class", "matrixT")
    .text(sourcename)
    .style("text-anchor", "end")

  // M1 Fw
  var matrix1 = d3.select("#" + matrixid1)
  matrix1
    .append("line")
    .attr("class", "fwline")
    .attr("x1", matrixwidth / 2)
    .attr("y1", 0 - matrixhead)
    .attr("x2", matrixwidth / 2)
    .attr("y2", matrixwidth + matrixhead)

  // Source-Text-Bereich
  canvas
    .append("g")
    .attr("transform", "translate(" + sourceTx + "," + sourceTy + ")")
    .attr("id", sourceTid)


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

}


export { homeMatrix };