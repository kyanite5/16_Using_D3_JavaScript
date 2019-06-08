// @TODO: YOUR CODE HERE!
//dic id scatter
// Define SVG area dimensions
var svgWidth = 800;
var svgHeight = 500;

var chartMargin = {
  top: 10,
  right: 40,
  bottom: 60,
  left: 100
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3
  .select("body")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and down to adhere
// to the margins set in the "chartMargin" object.
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

//load data
d3.csv("data/data.csv", function(d) {
    return {
      id : parseFloat(d.id),
      state : d.state,
      abbr: d.abbr,
      poverty : parseFloat(d.poverty),
      povertyMoe : parseFloat(d.povertyMoe),
      age : parseFloat(d.age),
      ageMoe : parseFloat(d.ageMoe),
      income : parseFloat(d.income),
      incomeMoe: parseFloat(d.incomeMoe),
      healthcare : parseFloat(d.healthcare),
      healthcareLow : parseFloat(d.healthcareLow),
      healthcareHigh : parseFloat(d.healthcareHigh),
      obesity : parseFloat(d.obesity),
      obesityLow : parseFloat(d.obesityLow),
      obesityHigh : parseFloat(d.obesityHigh),
      smokes : parseFloat(d.smokes),
      smokesLow : parseFloat(d.smokesLow),
      smokesHigh : parseFloat(d.smokesHigh),
    };

  }).then(function(censusData) {
    console.log(censusData[43]);


  // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([35000, d3.max(censusData, d => d.income)])
      .range([0, chartWidth]);

    var yLinearScale = d3.scaleLinear()
      .domain([15, d3.max(censusData, d => d.obesity)])
      .range([chartHeight, 10]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

  //  Step 5: Create Circles
  //  ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.income))
    .attr("cy", d => yLinearScale(d.obesity))
    .attr("r", "15")
    .attr("fill", "royalBlue")
    .attr("opacity", ".75");

  // Append text to circles
    var circlesGroup = chartGroup.selectAll()
    .data(censusData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.income))
    .attr("y", d => yLinearScale(d.obesity))
    .style("font-size", "13px")
    .style("text-anchor", "middle")
    .style("fill", "white")
    .text(d => (d.abbr));


    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br> ${d.obesity}`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("click", function(censusData) {
      toolTip.show(censusData, this);
    })
      // onmouseout event
      .on("mouseout", function(censusData, index) {
        toolTip.hide(censusData);
      });


    // Create axes labels
    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - chartMargin.left +30)
    .attr("x", 0 - (chartHeight / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Obesity (%)");

    chartGroup.append("text")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + chartMargin.top + 40})`)
    .attr("class", "axisText")
    .text("Median Income ($USD)");



  });
