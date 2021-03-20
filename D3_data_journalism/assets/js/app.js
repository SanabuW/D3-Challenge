// @TODO: YOUR CODE HERE!

/* Fields list:
id
abbr

ylables
obesity
smokes
healthcare

xlabels
poverty
age
income
*/

var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 85,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "obesity";

// Create scaling and axes building functions
function xScale(healthData, chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.85,
          d3.max(healthData, d => d[chosenXAxis]) * 1.1
    ])
        .range([0, width]);
    return xLinearScale;
}

function yScale(healthData, chosenYAxis) {
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d[chosenYAxis]) * 0.85,
            d3.max(healthData, d => d[chosenYAxis]) * 1.1
        ])
        .range([height, 0]);
    return yLinearScale;
}

function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    return xAxis;
}

function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    return yAxis;
}

// Function for applying data elements onto chart
function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]));
    return circlesGroup;
}
function renderText(textsGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
    textsGroup.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]))
        .attr("y", d => newYScale(d[chosenYAxis]));
    return textsGroup;
}
  // LEAVE OUT FOR NOW
  /*
function updateToolTip() {

}*/



d3.csv("./assets/data/data.csv").then(function(healthData, err) {
    if (err) throw err;



    healthData.forEach(function(d){
        d["obesity"] = +d["obesity"];
        d["smokes"] = +d["smokes"];
        d["healthcare"] = +d["healthcare"];
        d["poverty"] = +d["poverty"];
        d["age"] = +d["age"];
        d["income"] = +d["income"];
        d["abbr"] = String(d["abbr"]);
    });

    // healthData.forEach(function(d){
    //     d[chosenYAxis] = +d[chosenYAxis];
    // });

    // healthData.forEach(function(d){
    //     d[chosenXAxis] = +d[chosenXAxis];
    // });


    // Create scalers functions
    var xLinearScale = xScale(healthData, chosenXAxis);
    var yLinearScale = yScale(healthData, chosenYAxis);

    // Create axes functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

  // append y axis
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);

    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 12)
        .attr("fill", "blue")
        .attr("opacity", ".5");

     var textsGroup = chartGroup.selectAll("null")
        .data(healthData)
        .enter()
        .append("text")
        // .attr("class", "text")
        // .attr("cy", "1.3em")
        .attr("fill", "white")
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]))
        .text(function (d) {
            return d.abbr })
        .attr("text-anchor", "middle")
        .attr("font-size", 10)
        ;







    // Create group for x-axis labels
    var xlabelSpacer = 20;

    var xlabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 40})`)
        .attr("text-anchor", "middle");

    var povertyLabel = xlabelsGroup.append("text")
        .attr("value", "poverty") // value to grab for event listener
        .classed("axis-text", true)
        .classed("active", true)
        .text("In Poverty (%)");

    var ageLabel = xlabelsGroup.append("text")
        .attr("value", "age") // value to grab for event listener
        .classed("axis-text", true)
        .classed("active", false)
        .text("Age (Median)")
        .attr("y", xlabelSpacer)
        .attr("x", 0);

    var incomeLabel = xlabelsGroup.append("text")
        .attr("value", "income") // value to grab for event listener
        .classed("axis-text", true)
        .classed("active", false)
        .text("Household Income (Median)")
        .attr("y", xlabelSpacer * 2)
        .attr("x", 0);


    // Create group for y-axis labels
    var ylabelSpacer = 20;
    var ylabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(-30, ${height / 2}), rotate(-90)`)
        .attr("text-anchor", "middle")
;

    var healthcareLabel = ylabelsGroup.append("text")
        .attr("value", "healthcare") // value to grab for event listener
        .classed("axis-text", true)
        .text("Healthcare (%)");

    var smokesLabel = ylabelsGroup.append("text")
        .attr("value", "smokes") // value to grab for event listener
        .classed("axis-text", true)
        .text("Smokes (%)")
        .attr("y", -ylabelSpacer)
        .attr("x", 0);

    var obesityLabel = ylabelsGroup.append("text")
        .attr("value", "obesity") // value to grab for event listener
        .classed("axis-text", true)
        .classed("active", true)
        .text("Obesity (%)")
        .attr("y", -ylabelSpacer * 2)
        .attr("x", 0);

//   var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

  // x axis labels event listener
    xlabelsGroup.selectAll("text")
        .on("click", function() {
            // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {

            // replaces chosenXAxis with value
            chosenXAxis = value;
            console.log(chosenXAxis)
            // console.log(chosenXAxis)

            // functions here found above csv import
            // updates x scale for new data
            xLinearScale = xScale(healthData, chosenXAxis);

            // updates x axis with transition
            xAxis = renderXAxes(xLinearScale, xAxis);

            // updates circles with new x values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale,chosenXAxis, chosenYAxis);
            textsGroup = renderText(textsGroup, xLinearScale, yLinearScale,chosenXAxis, chosenYAxis);

            // updates tooltips with new info
            // circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

            // changes classes to change bold text
            if (chosenXAxis === "poverty") {
                povertyLabel
                    .classed("active", true)
                    .classed("inactive", false);
                ageLabel
                    .classed("active", false)
                    .classed("inactive", true);
                incomeLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else if(chosenXAxis === "age"){
                povertyLabel
                    .classed("active", false)
                    .classed("inactive", true);
                ageLabel
                    .classed("active", true)
                    .classed("inactive", false);
                incomeLabel
                    .classed("active", false)
                    .classed("inactive", true);
            } else if (chosenXAxis === "income") {
                povertyLabel
                    .classed("active", false)
                    .classed("inactive", true);
                ageLabel
                    .classed("active", false)
                    .classed("inactive", true);
                incomeLabel
                    .classed("active", true)
                    .classed("inactive", false);
            }
        }
    });

  // t axis labels event listener
    ylabelsGroup.selectAll("text")
    .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenYAxis) {

        // replaces chosenTAxis with value
        chosenYAxis = value;
        console.log(chosenYAxis)
        // console.log(chosenTAxis)

        // functions here found above csv import
        // updates x scale for new data
        yLinearScale = yScale(healthData, chosenYAxis);

        // updates x axis with transition
        yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
        textsGroup = renderText(textsGroup, xLinearScale, yLinearScale,chosenXAxis, chosenYAxis);

        // updates tooltips with new info
        // circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenYAxis === "obesity") {
            healthcareLabel
                .classed("active", false)
                .classed("inactive", true);
            smokesLabel
                .classed("active", false)
                .classed("inactive", true);
            obesityLabel
                .classed("active", true)
                .classed("inactive", false);
        }
        else if(chosenYAxis === "smokes"){
            healthcareLabel
                .classed("active", false)
                .classed("inactive", true);
            smokesLabel
                .classed("active", true)
                .classed("inactive", false);
            obesityLabel
                .classed("active", false)
                .classed("inactive", true);
        } else if (chosenYAxis === "healthcare") {
            healthcareLabel
                .classed("active", true)
                .classed("inactive", false);
            smokesLabel
                .classed("active", false)
                .classed("inactive", true);
            obesityLabel
                .classed("active", false)
                .classed("inactive", true);
        }
    }
    });



}).catch(function(error) {
    console.log(error);
});
