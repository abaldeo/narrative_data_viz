const parseDate = d3.timeParse("%Y-%m-%d");
const timeFormat = d3.timeFormat("%Y-%m-%d")

var x;
var y;

function createLineChart(csvData, xValue, yValue, options) {
    options = options || {};
    var margin = options.margin || { top: 50, right: 50, bottom: 75, left: 75 };
    var width = options.width || 800 - margin.left - margin.right;
    var height = options.height || 600 - margin.top - margin.bottom;
    var xDomainStart = options.xDomainStart || 0;
    var xRangeStart = options.xRangeStart || 0;
    var yDomainStart = options.yDomainStart || 0;
    var yRangeEnd = options.yRangeEnd || 0;
    // var parseDate = options.parseDate || d3.timeParse("%Y-%m-%d");
    var selector = options.selector || "body";
    var svg = options.svg || d3.select(selector).select("svg");
    var addAxis = options.addAxis == false ? false : true;
    var drawLine = options.drawLine == false ? false : true;
    var chartTitle = options.title;
    var yAxisLabel = options.yAxisLabel || "";
    var xAxisLabel = options.xAxisLabel || "";
    var sourceCredit = options.sourceCredit || "";
    var sourceLink = options.sourceLink || "";
    var legendTitle = options.legendTitle || "";
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
            .append("svg").style('border', '2px solid gray')  // Chart border

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
            .attr("transform", "translate(" + 0 + "," + (0) + ")")
            .call(d3.axisLeft(y));


        // Append X axis
        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(" + 0 + "," + (height) + ")")
            .call(d3.axisBottom(x));
    }
    // addVerticalGridLines(svg, x, height);
    addHorizontalGridLines(svg, y, width);
    addChartTitle(svg, margin, width, chartTitle);
    addYAxisLabel(svg, margin, height, yAxisLabel);
    addXAxisLabel(svg, margin, width, height, xAxisLabel);
    addSourceCredit(svg, margin, height, sourceCredit, sourceLink);
    // addLineDots(svg, width, height, xValue, x, csvData, y, yValue);
    addChartLegend(legendTitle, width, margin);
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
            // .style("top", (event.pageY) + "px")
            // .style("left", (event.pageX) + "px")
            .style("left", `${xPos + 400}px`)
            .style("top", `${yPos + 100}px`)
            .style("opacity", 0.7)
            .html(`<strong>Date:</strong> ${d[xValue]}<br><strong>Value:</strong> ${d[yValue]}`)
    });

    listeningRect.on("mouseleave", () => {
        circle.transition().duration(50).attr("r", 0);
        tooltip.style("display", "none");
    });
}

function addAnnotations(svg, xScale, yScale, annotationsArray) {
    const annotype = d3.annotationCalloutCircle//d3.annotationCallout

    var makeAnnotations = d3.annotation()
        .type(annotype)
        .accessors({
            x: d => xScale(parseDate(d.x)),
            y: d => yScale(d.y)
        })
        // .accessorsInverse({
        //     DATE: d => timeFormat(xScale.invert(d.x)),
        //     PERCENTOFGDP: d => yScale.invert(d.y)
        // })
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


function addXAxisLabel(svg, margin, width, height, label) {
    svg.append("text")
        .attr("class", "x-axis-label")
        .attr("x", width / 2) // Adjust the position as needed
        .attr("y", height + 30) // Adjust the position as needed
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .style("font-family", "sans-serif")
        .text(label);
    return svg
}


function addSourceCredit(svg, margin, height, sourceText, sourceLink) {
    svg.append("text")
        .attr("class", "source-credit")
        .attr("x", 0)
        .attr("y", height + margin.top + 20)
        .style("font-size", "12px")
        .style("font-family", "sans-serif")
        .append("a") // Add an anchor element
        .attr("href", sourceLink) // Set the href attribute to the source link
        .attr("target", "_blank") // Open the link in a new tab
        .text(sourceText);
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

function addChartLegend(text, width, margin) {
    // Define legend colors and labels
    var svg = d3.select("svg")
    // Handmade legend
    svg.append("circle").attr("cx", width - (.07 * width)).attr("cy", margin.top - 20).attr("r", 6).style("fill", "steelblue")

    svg.append("text").attr("x", width - (.05 * width)).attr("y", margin.top - 20).text(text).style("font-size", "15px").attr("alignment-baseline", "middle")

}