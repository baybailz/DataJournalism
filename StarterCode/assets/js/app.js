// Bailey Thompson 
// Data Analytics Bootcamp 
// 12/22/2018
// ============================


// basic setup 
var svgWidth = 750;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// svg setup
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// chart group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.select(".chart")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 1);

d3.csv("/assets/data/data.csv").then(function(myData) {
    
    // looping through data to get something we can use 
    myData.forEach(function(xdata) {
        xdata.poverty = +xdata.poverty;
        xdata.healthcare = +xdata.healthcare;
    });

    // set x scale 
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(myData, d=>d.poverty)*0.9, 
            d3.max(myData, d => d.poverty)*1.1])
        .range([0, width]);

    // set y scale
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(myData, d => d.healthcare)*1.1])
        .range([height, 0]);

		// x and y axis scaling 
    var xAxis = d3.axisBottom(xLinearScale);
    var yAxis = d3.axisLeft(yLinearScale);

    // append x axis
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .style("font-size", "18px")
        .call(xAxis);

    // append y axis
    chartGroup.append("g")
        .style("font-size", "18px")
        .call(yAxis);
	
		// cannot get the tool tip to work... have tried multiple functions
		// var toolTip = d3.tip()
	  // 	.attr("class", "toolTip")
	  // 	.offset([80, -60])
	  // 	.html(function(data) {
	  //   	var state = data.state;
	  //   	var poverty = +data.poverty;
	  //   	var healthcare = +data.healthcare;
	  //   	return (state + "<br> Poverty Rate: " + poverty + "<br> Percentage of the population with healthcare: " + healthcare);
	  // });

	 	// chartGroup.call(toolTip);

    // append data 
    chartGroup.selectAll("circle")
        .data(myData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", 12)
        .attr("fill", "green")
				.style("opacity", ".25")
				// cannot get the tool tip to work... 
				// .on("click", d => toolTip.show(d))
				// .on("mouseout", function(data, index) {
				// toolTip.hide(data);
		

    // putting state abbr. in circles 
    chartGroup.selectAll("text.text-circles")
        .data(myData)
        .enter()
        .append("text")
        .classed("text-circles",true)
        .text(d => d.abbr)
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare))
        .attr("dy",5)
        .attr("text-anchor","middle")
				.attr("font-size","12px");
				

    // y axis attributes
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 30 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .classed("aText", true)
        .text("Lacking Healthcare (%)");

    // x axis attributes 
    chartGroup.append("text")
        .attr("y", height + margin.bottom/2 - 10)
        .attr("x", width / 2)
        .attr("dy", "1em")
        .classed("aText", true)
        .text("Poverty Rate (%)");
});