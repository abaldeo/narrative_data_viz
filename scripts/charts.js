/*function createTickValues(start, end, numTicks) {
    return d3.ticks(start, end, numTicks);
}

function createBarChart(csvData, xValue, yValue, options) {
    // Set the dimensions and margins of the graph
    options = options || {};
    var margin = options.margin || { top: 20, right: 20, bottom: 30, left: 40 };
    var width = options.width || 960 - margin.left - margin.right;
    var height = options.height || 500 - margin.top - margin.bottom;
    var xRangeStart = options.xRangeStart || 0;
    var xScalePading = options.xScalePading || 0.1;
    var yDomainStart = options.yDomainStart || 0;
    var yRangeEnd = options.yRangeEnd || 0;
    var parseDate = options.parseDate || d3.timeParse("%Y-%m-%d");
    var selector = options.selector || "body";
    var svg = options.svg || d3.select(selector).select("svg");

    // Set the ranges
    var xScale = d3.scaleBand()
        .domain(csvData.map(function (d) { return d[xValue]; }))
        .range([xRangeStart, width])
        .padding(xScalePading);
    var yScale = d3.scaleLinear()
        .domain([yDomainStart, d3.max(csvData, function (d) { return +d[yValue]; })])
        .range([height, yRangeEnd]);

    // Append the SVG object to the body of the page
    if (svg.empty()) {
        svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
    }

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

function createPieChart(csvData, xValue, yValue, options) {
    // Set default options if not provided
    options = options || {};
    var width = options.width || 500;
    var height = options.height || 500;
    var margin = options.margin || { top: 20, right: 20, bottom: 30, left: 40 };
    var radius = Math.min(width, height) / 2 - margin;
    var color = options.color || d3.scaleOrdinal(d3.schemeCategory10);
    // Create SVG element
    var svg = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    // Create pie function
    var pie = d3.pie()
        .value(function (d) { return d[yValue]; });
    // Create arc function
    var arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);
    // Build the pie chart
    var paths = svg.selectAll('path')
        .data(pie(csvData))
        .enter()
        .append("g")
        .append('path')
        .attr('d', arc)
        .attr('fill', function (d, i) {
            return color(d.data[xValue]);
        })
        .attr("stroke", "black")
        .style("stroke-width", "2px")
        .style("opacity", 0.7);
    // Append text labels to the pie slices
    paths.append("text")
        .attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
        .attr("text-anchor", "middle")
        .text(function (d) { return d.data[xValue]; });
}   

function createScatterPlot(csvData, xValue, yValue, options) {
    options = options || {};
    var margin = options.margin || { top: 10, right: 30, bottom: 30, left: 60 };
    var width = options.width || 460 - margin.left - margin.right;
    var height = options.height || 400 - margin.top - margin.bottom;
    var xDomainStart = options.xDomainStart || 0;
    var xRangeStart = options.xRangeStart || 0;
    var yDomainStart = options.yDomainStart || 0;
    var yRangeEnd = options.yRangeEnd || 0;
    var radius = options.radius || 5;
    var fill = options.fill || "#69b3a2";
    var tickFormat = options.tickFormat || d3.format("~s");
    var parseDate = options.parseDate || d3.timeParse("%Y-%m-%d");
    var selector = options.selector || "body";
    var svg = options.svg || d3.select(selector).select("svg");
    var addAxis = options.addAxis || true;

    // Create scales
    var xScale = d3.scaleLinear()
        .domain([xDomainStart, d3.max(csvData, function (d) { return d[xValue]; })])
        .range([xRangeStart, width]);
    var yScale = d3.scaleLinear()
        .domain([yDomainStart, d3.max(csvData, function (d) { return +d[yValue]; })])
        .range([height, yRangeEnd]);

    if (svg.empty()) {

        // Append SVG object to the body of the page
        svg = d3.select(selector)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
    }
    // Add dots
    svg.selectAll("dot")
        .data(csvData)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return xScale(d[xValue]); })
        .attr("cy", function (d) { return yScale(d[yValue]); })
        .attr("r", radius)
        .style("fill", fill);

    if (addAxis) {
        var xAxis = d3.axisBottom(xScale)
            .tickValues(createTickValues(xScale.domain()[0], xScale.domain()[1], 5))
            .tickFormat(d3.format(tickFormat));

        var yAxis = d3.axisLeft(yScale)
            .tickValues(createTickValues(yScale.domain()[0], yScale.domain()[1], 5))
            .tickFormat(d3.format(tickFormat));

        // Add Y axis
        svg.append("g")
            .attr("class", "y-axis")
            .attr("transform", "translate(" + 0 + "," + margin.top + ")")
            .call(yAxis);

        // Add X axis
        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(" + 0 + "," + (height + margin.top) + ")")
            .call(xAxis);
    }
    return svg;
}

*/

var parseDate = d3.timeParse("%Y-%m-%d");
var x;
var y;

function createLineChart(csvData, xValue, yValue, options) {
    options = options || {};
    var margin = options.margin || { top: 10, right: 30, bottom: 30, left: 100 };
    var width = options.width || 460 - margin.left - margin.right;
    var height = options.height || 400 - margin.top - margin.bottom;
    var xDomainStart = options.xDomainStart || 0;
    var xRangeStart = options.xRangeStart || 0;
    var yDomainStart = options.yDomainStart || 0;
    var yRangeEnd = options.yRangeEnd || 0;
    // var parseDate = options.parseDate || d3.timeParse("%Y-%m-%d");
    var selector = options.selector || "body";
    var svg = options.svg || d3.select(selector).select("svg");
    var addAxis = options.addAxis == false ? false : true;
    var drawLine = options.drawLine == false ? false : true;
    var chartTitle = options.title || "Line Chart";
    var yAxisLabel = options.yAxisLabel || "";
    var sourceCredit = options.sourceCredit || "";
    // Set X & Y scales 
    x = d3.scaleTime()
        .domain(d3.extent(csvData, d => parseDate(d[xValue])))
        .nice()
        .rangeRound([xRangeStart, width]);
    y = d3.scaleLinear()
        .domain([yDomainStart, d3.max(csvData, d => parseFloat(+d[yValue]))])
        .nice()
        .rangeRound([height, yRangeEnd]);

    if (svg.empty()) {
        // Append SVG to body of page
        svg = d3.select(selector)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
    }

    var line = d3.line()
        .x(function (d) { return x(parseDate(d[xValue])) })
        .y(function (d) { return y(parseFloat(d[yValue])) });


    // Create line
    if (drawLine) {

        // Append line to SVG
        svg.append("path")
            .datum(csvData)
            .attr("d", line)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 2);

    }

    if (addAxis) {

        // Append Y axis
        svg.append("g")
            .attr("class", "y-axis")
            .attr("transform", "translate(" + 0 + "," + (margin.top) + ")")
            .call(d3.axisLeft(y));


        // Append X axis
        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(" + 0 + "," + (height + margin.top) + ")")
            .call(d3.axisBottom(x));
    }
    addVerticalGridLines(svg, x, height);
    addHorizontalGridLines(svg, y, width);
    // addChartTitle(svg, margin, width, chartTitle);
    addYAxisLabel(svg, margin, height, yAxisLabel);
    // addSourceCredit(svg, margin, height, sourceCredit);
    // addLineDots(svg, width, height, xValue, x, csvData, y, yValue);

    return svg;

}

function addLineDots(svg, width, height, xValue, xScale, csvData, yScale, yValue) {
    const circle = svg.append("circle")
        .attr("r", 0)
        .attr("fill", "steelblue")
        .attr("stroke", "white")
        .attr("opacity", 0.7)
        .style("pointer-events", "none");

    const listeningRect = svg.append("rect")
        .attr("width", width)
        .attr("height", height);

    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip");

    listeningRect.on("mousemove", function (event) {
        const [xCoord] = d3.pointer(event, this);
        const bisectDate = d3.bisector(d => parseDate(d[xValue])).left;
        const x0 = xScale.invert(xCoord);
        const i = bisectDate(csvData, x0, 1);
        const d0 = csvData[i - 1];
        const d1 = csvData[i];
        const d = x0 - parseDate(d0[xValue]) > parseDate(d1[xValue]) - x0 ? d1 : d0;
        const xPos = xScale(parseDate(d[xValue]));
        const yPos = yScale(+d[yValue]);


        circle.attr("cx", xPos).attr("cy", yPos);
        circle.transition().duration(50).attr("r", 5);

        tooltip
            .style("display", "block")
            .style("left", `${xPos + 100}px`)
            .style("top", `${yPos + 50}px`)
            .html(`<strong>Date:</strong> ${d[xValue]}<br><strong>Value:</strong> ${d[yValue]}`)
        /*
        
            tooltip
              .style("display", "block")
              .style("left", `${xPos + 100}px`)
              .style("top", `${yPos + 50}px`)
              .html(`<strong>Date:</strong> ${d.date.toLocaleDateString()}<br><strong>Population:</strong> ${d.population !== undefined ? (d.population / 1000).toFixed(0) + 'k' : 'N/A'}`)
        
        */


    });

    listeningRect.on("mouseleave", () => {
        circle.transition().duration(50).attr("r", 0);
        tooltip.style("display", "none");
    });
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

/**
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


    // Add the annotations to the chart
    const makeAnnotations = d3.annotation()
        .type(d3.annotationLabel)
        .annotations(annotations);

    chart.append("g")
        .attr("class", "annotation-group")
        .call(makeAnnotations);
 */

function addChartTitle(svg, margin, width, titleText) {
    svg.append("text")
        .attr("class", "chart-title")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "24px")
        .style("font-weight", "bold")
        .style("font-family", "sans-serif")
        .text(titleText)
    return svg
}

function addYAxisLabel(svg, margin, height, label) {
    svg.append("text")
        .attr("class", "y-axis-label")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 10)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .style("font-family", "sans-serif")
        .text(label);
    return svg
}

function addSourceCredit(svg, margin, height, sourceText) {
    svg.append("text")
        .attr("class", "source-credit")
        .attr("x", 0)
        .attr("y", height + margin.bottom)
        .style("font-size", "12px")
        .style("font-family", "sans-serif")
        .text(sourceText)
    return svg
}

function addVerticalGridLines(svg, x, height) {
    // Add vertical gridlines
    svg.selectAll("xGrid")
        .data(x.ticks().slice(1))
        .join("line")
        .attr("x1", d => x(d))
        .attr("x2", d => x(d))
        .attr("y1", 0)
        .attr("y2", height)
        .attr("stroke", "#e0e0e0")
        .attr("stroke-width", .5);
}

function addHorizontalGridLines(svg, y, width) {
    svg.selectAll("yGrid")
        .data(y.ticks().slice(1))
        // .data(y.ticks((d3.max(data, d => +d[yValue]) - yDomainStart) / 5).slice(1))
        .join("line")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", d => y(d))
        .attr("y2", d => y(d))
        .attr("stroke", "#e0e0e0")
        .attr("stroke-width", .5);
}
