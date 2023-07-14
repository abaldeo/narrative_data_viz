
function createTickValues(start, end, numTicks) {
    return d3.ticks(start, end, numTicks);
}

function createBarChart(csvData, xValue, yValue) {
    // Set the dimensions and margins of the graph
    var margin = { top: 20, right: 20, bottom: 30, left: 40 },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;


    // Set the ranges
    var xScale = d3.scaleBand()
        .domain(csvData.map(function (d) { return d[xValue]; }))
        .range([0, width])
        .padding(0.1);
    var yScale = d3.scaleLinear()
        .domain([0, d3.max(csvData, function (d) { return +d[yValue]; })])
        .range([height, 0]);

    // Append the SVG object to the body of the page
    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    // Create the bars
    svg.selectAll("bar")
        .data(csvData)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d, i) { return xScale(i); })
        .attr("y", function (d) { return yScale(d[yValue]); })
        .attr("width", xScale.bandwidth())
        .attr("height", function (d) { return height - yScale(d[yValue]); });

    // Create the Y axis
    svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(d3.axisLeft(yScale));

    // Create the X axis
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(" + margin.left + "," + (height + margin.top) + ")")
        .call(d3.axisBottom(xScale));

}


function createScatterPlot(csvData, xValue, yValue) {
    var margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // Create scales
    var xScale = d3.scaleLog()
        .domain([0, d3.max(csvData, function (d) { return d[xValue]; })])
        .range([0, width]);
    var yScale = d3.scaleLog()
        .domain([0, d3.max(csvData, function (d) { return +d[yValue]; })])
        .range([height, 0]);

    // Append SVG object to the body of the page
    var svg = d3.select("body")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Add dots
    svg.selectAll("dot")
        .data(csvData)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return xScale(d[xValue]); })
        .attr("cy", function (d) { return yScale(d[yValue]); })
        .attr("r", 5)
        .style("fill", "#69b3a2");


    var xAxis = d3.axisBottom(xScale)
        .tickValues(createTickValues(xScale.domain()[0], xScale.domain()[1], 5))
        .tickFormat(d3.format("~s"));

    var yAxis = d3.axisLeft(yScale)
        .tickValues(createTickValues(yScale.domain()[0], yScale.domain()[1], 5))
        .tickFormat(d3.format("~s"));

    // Add Y axis
    svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(yAxis);

    // Add X axis
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(" + margin.left + "," + (height + margin.top) + ")")
        .call(xAxis);

}


function createLineChart(csvData, xValue, yValue) {
    // Define sizes
    var margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // Set X & Y scales 
    var x = d3.scaleTime()
        .domain(d3.extent(csvData, function (d) { return d[xValue]; }))
        .range([0, width]);
    var y = d3.scaleLinear()
        .domain([0, d3.max(csvData, function (d) { return +d[yValue]; })])
        .range([height, 0]);


    // Append SVG to body of page
    var svg = d3.select("body")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Create line
    var line = d3.line()
        .x(function (d) { return x(d[xValue]) })
        .y(function (d) { return y(d[yValue]) });

    // Append line to SVG
    svg.append("path")
        .datum(csvData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line);

    // Append Y axis
    svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", "translate(" + margin.left + "," + (height + margin.top) + ")")
        .call(d3.axisLeft(y));


    // Append X axis
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(" + margin.left + "," + (height + margin.top) + ")")
        .call(d3.axisBottom(x));


}

function addAnnotations(svg, xScale, yScale, annotationsArray) {
    var makeAnnotations = d3.annotation()
        .type(d3.annotationLabel)
        .accessors({
            x: d => xScale(d.x),
            y: d => yScale(d.y)
        })
        .annotations(annotationsArray);
    var annotationGroup = svg.select(".annotation-group");
    if (annotationGroup.empty()) {
        annotationGroup = svg.append("g")
            .attr("class", "annotation-group");
    } else {
        annotationGroup.selectAll("*").remove();
    }
    annotationGroup.call(makeAnnotations);
}

/**
var myAnnotation = {
    x: "2005-07-03",  // a date or number that corresponds to a value in your data
    y: 200,  // a number that corresponds to a value in your data
    note: {  // annotation info
        title: "Important Event",
        label: "This event is important because...",
        wrap: 100  // text will wrap to the next line if it exceeds this width
    },
    dx: 50,  // offset of the note text in x direction
    dy: -20  // offset of the note text in y direction
};
*/

function addTooltip(chart, data, xScale, yScale) {
    const annotations = data.map((d) => {
        return {
            note: {
                label: d.label,
                title: d.title,
            },
            x: xScale(d.x),
            y: yScale(d.y),
            dx: 20,
            dy: -20,
        };
    });
    return annotations;
}

/**
    // Add the annotations to the chart
    const makeAnnotations = d3.annotation()
        .type(d3.annotationLabel)
        .annotations(annotations);

    chart.append("g")
        .attr("class", "annotation-group")
        .call(makeAnnotations);
 */