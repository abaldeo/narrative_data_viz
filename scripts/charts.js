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
    svg.selectAll(".bar")
        .data(csvData)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) { return xScale(d[xValue]); })
        .attr("y", function (d) { return yScale(d[yValue]); })
        .attr("width", xScale.bandwidth())
        .attr("height", function (d) { return height - yScale(d[yValue]); });

    // Create the X axis
    xScale.domain(csvData.map(function (d) { return d[xValue]; }));
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));

    yScale.domain([0, d3.max(csvData, function (d) { return d[yValue]; })]);
    svg.append("g")
        .call(d3.axisLeft(yScale).ticks(10));

}


function createScatterPlot(csvData, xValue, yValue) {
    var margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // Append SVG object to the body of the page
    var svg = d3.select("body")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Create scales
    var xScale = d3.scaleLinear()
        .domain([0, d3.max(csvData, function (d) { return +d[xValue]; })])
        .range([0, width]);
    var yScale = d3.scaleLinear()
        .domain([0, d3.max(csvData, function (d) { return +d[yValue]; })])
        .range([height, 0]);

    // Add dots
    svg.append('g')
        .selectAll("dot")
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
        .attr("transform", "translate(0," + width + ")")
        .call(yAxis);

    // Add X axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

}

function createTickValues(start, end, numTicks) {
    return d3.ticks(start, end, numTicks);
}


function createLineChart(csvData, xValue, yValue) {
    // Define sizes
    var margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // Append SVG to body of page
    var svg = d3.select("body")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Set X & Y scales 
    var x = d3.scaleTime()
        .domain(d3.extent(csvData, function (d) { return d[xValue]; }))
        .range([0, width]);
    var y = d3.scaleLinear()
        .domain([0, d3.max(csvData, function (d) { return +d[yValue]; })])
        .range([height, 0]);

    // Append X axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Append Y axis
    svg.append("g")
        .call(d3.axisLeft(y));

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
}

function addAnnotations(svg, xScale, yScale, annotationsArray) {
    var makeAnnotations = d3.annotation()
        .type(d3.annotationLabel)
        .accessors({
            x: d => xScale(d.x),
            y: d => yScale(d.y)
        })
        .annotations(annotationsArray);

    svg.append("g")
        .attr("class", "annotation-group")
        .call(makeAnnotations);
}

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

function addTooltip(chart, data, xScale, yScale) {
    const annotations = [];

    // Create an annotation for each data point
    data.forEach((d) => {
        const annotation = {
            note: {
                label: d.label,
                title: d.title,
            },
            x: xScale(d.x),
            y: yScale(d.y),
            dx: 20,
            dy: -20,
        };
        annotations.push(annotation);
    });

    // Add the annotations to the chart
    const makeAnnotations = d3.annotation()
        .type(d3.annotationLabel)
        .annotations(annotations);

    chart.append("g")
        .attr("class", "annotation-group")
        .call(makeAnnotations);
}