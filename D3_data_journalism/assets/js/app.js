// Establish SVG and chart area dimensions
var svgWidth = 1000;
var svgHeight = 570;

var margin = {
    top: 20,
    right: 40,
    bottom: 135,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


// Create SVG element and compensate positioning for margins
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append group for the chart
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Axis selections for initizlization
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

// Function for applying data elements(circles and state initials) onto chart
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

// Begin active handling of data and execute functions above
d3.csv("./assets/data/data.csv").then(function(healthData, err) {
    if (err) throw err;

// Clean data into proper data types
    healthData.forEach(function(d){
        d["obesity"] = +d["obesity"];
        d["smokes"] = +d["smokes"];
        d["healthcare"] = +d["healthcare"];
        d["poverty"] = +d["poverty"];
        d["age"] = +d["age"];
        d["income"] = +d["income"];
    });


    // Create scalers functions
    var xLinearScale = xScale(healthData, chosenXAxis);
    var yLinearScale = yScale(healthData, chosenYAxis);

    // Create axes functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

  // Append y axis
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);


//  Import and build tooltip;

// Create conditional to show "%" for tooltip

//  Used recommended tooltip library
var tool_tip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-8, 0])
    .html(function(d) { return `${d.state}<br>
    ${chosenXAxis}: ${d[chosenXAxis]}%<br>
    ${chosenYAxis}: ${d[chosenYAxis]}%
    `; })
chartGroup.call(tool_tip);


    // Append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 15)
        .attr("fill", "blue")
        .attr("opacity", ".5")
        .on('mouseover', tool_tip.show)
        .on('mouseout', tool_tip.hide);

    // Append state abbreviations
    var textsGroup = chartGroup.selectAll("null")
        .data(healthData)
        .enter()
        .append("text")
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

    // Create a label for each field on this axis
    var povertyLabel = xlabelsGroup.append("text")
        .attr("value", "poverty")
        .classed("axis-text", true)
        .classed("active", true)
        .text("In Poverty (%)");

    var ageLabel = xlabelsGroup.append("text")
        .attr("value", "age")
        .classed("axis-text", true)
        .classed("active", false)
        .text("Age (Median)")
        .attr("y", xlabelSpacer)
        .attr("x", 0);

    var incomeLabel = xlabelsGroup.append("text")
        .attr("value", "income")
        .classed("axis-text", true)
        .classed("active", false)
        .text("Household Income (Median)")
        .attr("y", xlabelSpacer * 2)
        .attr("x", 0);


    // Create group for y-axis labels
    var ylabelSpacer = 20;
    var ylabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(-30, ${height / 2}), rotate(-90)`)
        .attr("text-anchor", "middle");

    // Create a label for each field on this axis
    var healthcareLabel = ylabelsGroup.append("text")
        .attr("value", "healthcare")
        .classed("axis-text", true)
        .text("Healthcare (%)");

    var smokesLabel = ylabelsGroup.append("text")
        .attr("value", "smokes")
        .classed("axis-text", true)
        .text("Smokes (%)")
        .attr("y", -ylabelSpacer)
        .attr("x", 0);

    var obesityLabel = ylabelsGroup.append("text")
        .attr("value", "obesity")
        .classed("axis-text", true)
        .classed("active", true)
        .text("Obesity (%)")
        .attr("y", -ylabelSpacer * 2)
        .attr("x", 0);


  // X axis labels event listener to change field
    xlabelsGroup.selectAll("text")
        .on("click", function() {
            // Get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {

            // Replaces chosenXAxis with value
            chosenXAxis = value;
            console.log(chosenXAxis)

            // Updates x scale for new data
            xLinearScale = xScale(healthData, chosenXAxis);

            // Updates x axis with transition
            xAxis = renderXAxes(xLinearScale, xAxis);

            // Updates circles with new x values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale,chosenXAxis, chosenYAxis);
            textsGroup = renderText(textsGroup, xLinearScale, yLinearScale,chosenXAxis, chosenYAxis);

            // Changes classes to change bold text
            if (chosenXAxis === "poverty") {
                povertyLabel
                    .classed("active", true)
                    .classed("inactive", false);
                ageLabel
                    .classed("active", false)
                    .classed("inactive", true);
                incomeLabel
                    .classed("active", false)
                    .classed("inactive", true)
                tool_tip // Reformat tooltip to compensate for showing percentage sign dependent on field
                    .html(function(d) { return `${d.state}%<br>
                    ${chosenXAxis}: ${d[chosenXAxis]}%<br>
                    ${chosenYAxis}: ${d[chosenYAxis]}`;
                    });
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
                tool_tip // Reformat tooltip to compensate for hiding percentage sign dependent on field
                .html(function(d) { return `${d.state}<br>
                ${chosenXAxis}: ${d[chosenXAxis]}<br>
                ${chosenYAxis}: ${d[chosenYAxis]}%`;
                });
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
                tool_tip
                .html(function(d) { return `${d.state}<br>
                ${chosenXAxis}: ${d[chosenXAxis]}<br>
                ${chosenYAxis}: ${d[chosenYAxis]}%`;
                });
            }
        }
    });


  // Y axis labels event listener
    ylabelsGroup.selectAll("text")
    .on("click", function() {

        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenYAxis) {

        // replaces chosenTAxis with value
        chosenYAxis = value;
        console.log(chosenYAxis)

        // Updates x scale for new data
        yLinearScale = yScale(healthData, chosenYAxis);

        // Updates x axis with transition
        yAxis = renderYAxes(yLinearScale, yAxis);

        // Updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
        textsGroup = renderText(textsGroup, xLinearScale, yLinearScale,chosenXAxis, chosenYAxis);

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


// Watch for and return errors
}).catch(function(error) {
    console.log(error);
});
