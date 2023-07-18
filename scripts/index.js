// import { createLineChart } from './charts.js';

const slides = d3.selectAll('.slide');
const slideCount = slides.size();
let currentSlide = 0;

function showSlide(index) {
    slides.style('display', 'none');
    slides.filter((d, i) => i === index).style('display', 'block');
}

function previousSlide() {
    currentSlide = (currentSlide - 1 + slideCount) % slideCount;
    showSlide(currentSlide);
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slideCount;
    showSlide(currentSlide);
}

function goToSlide(index) {
    currentSlide = index - 1;
    showSlide(currentSlide);
}

showSlide(currentSlide);


const dataCache = {};
var annotations = [{}];
var allData = [];


async function init() {
    let data = await loadData("data/nationaldebt.csv")
    let data2 = await loadData("data/inflation.csv")
    // let data2 = await loadData("data/studentdebt.csv")
    // let data = await loadData("data/totalpublicdebt.csv")
    // let data = await loadData("data/USGDPvsDebt.csv")
    console.log(data);
    // data = data.filter(d => d.TotalPublicDebtMil != "")
    // console.log(data);
    let lineData1 = [];
    let lineData2 = [];
    let lineData3 = [];
    parittionData(data, lineData1, lineData2, lineData3);
    console.log(lineData1);
    console.log(lineData2);
    console.log(lineData3);
    options = {
        "selector": "#chart", "drawLine": false, "yAxisLabel": "Percent of GDP", "xAxisLabel": "Year",
        "sourceCredit": "Source: Federal Reserve Economic Data (FRED)\nhttps://fred.stlouisfed.org/"
    }
    var svg = createLineChart(data, "DATE", "PERCENTOFGDP", options)
    // var line1 = addLine(svg, data, "DATE", "PERCENTOFGDP",)
    // var line1 = drawLine(svg, lineData1, "DATE", "PERCENTOFGDP", { "xRangeEnd": 110 })
    // var line2 = drawLine(svg, lineData2, "DATE", "PERCENTOFGDP", { "xRangeStart": 110, "xRangeEnd": 220 })
    // var line3 = drawLine(svg, lineData3, "DATE", "PERCENTOFGDP", { "xRangeStart": 220, "xRangeEnd": 330 })

    d3.select("#button1").on("click", function () {
        console.log('click1');
        allData = [];
        drawLine(svg, lineData1, "DATE", "PERCENTOFGDP", { "xRangeEnd": 110 });
        console.log(allData.length)
    });
    d3.select("#button2").on("click", function () {
        if (allData.length < lineData1.length) allData = lineData1;
        if (allData.length == lineData1.length + lineData2.length) allData = lineData1;
        if (allData.length > lineData1.length + lineData2.length) allData = lineData1;
        drawLine(svg, lineData2, "DATE", "PERCENTOFGDP", { "xRangeStart": 110, "xRangeEnd": 220 });
        console.log(allData.length)
    });
    d3.select("#button3").on("click", function () {
        if (allData.length < lineData1.length + lineData2.length) allData = lineData1.concat(lineData2);
        if (allData.length == lineData1.length + lineData2.length + lineData3.length) allData = lineData1.concat(lineData2);
        drawLine(svg, lineData3, "DATE", "PERCENTOFGDP", { "xRangeStart": 220, "xRangeEnd": 330 })
        console.log(allData.length);
    });
    // // Append line to SVG
    // var line = svg.append("path")
    //     .datum(data)
    //     .attr("d", line1)
    //     .attr("stroke", "steelblue")
    //     .attr("stroke-width", 2)
    //     .attr("fill", "none");



    // createLineChart(data, "DATE", "FPCPITOTLZGUSA", options)
    // createLineChart(data, "DATE", "SLOAS", options)
    // createLineChart(data, "DATE", "GFDEBTN", options)
    // createLineChart(data, "Quarter", "TotalPublicDebtMil", options)
    options2 = { "svg": svg, "addAxis": false }
    // var svg2 = createLineChart(data2, "DATE", "FPCPITOTLZGUSA", options2)

}
var previousPath = null;

function addLine(svg, data, xValue, yValue, options) {
    console.log(data)
    options = options || {};
    var margin = options.margin || { top: 10, right: 30, bottom: 30, left: 100 };
    // var parseDate = options.parseDate || d3.timeParse("%Y-%m-%d");

    var width = (options.width || 460) - margin.left - margin.right;
    var height = (options.height || 400) - margin.top - margin.bottom;
    var xDomainStart = options.xDomainStart || 0;
    var xRangeStart = options.xRangeStart || 0;
    var xRangeEnd = options.xRangeEnd || width;
    var yDomainStart = options.yDomainStart || 0;
    var yRangeStart = options.yRangeStart || height;
    var yRangeEnd = options.yRangeEnd || 0;

    // Set X & Y scales 
    var x = d3.scaleTime()
        .domain(d3.extent(data, (d) => parseDate(d[xValue])))
        .nice()
        .rangeRound([xRangeStart, xRangeEnd]);
    var y = d3.scaleLinear()
        .domain([yDomainStart, d3.max(data, (d) => parseFloat(+d[yValue]))])
        .nice()
        .rangeRound([height, yRangeEnd]);

    var line = d3.line()
        .x(function (d) { return x(parseDate(d[xValue])) })
        .y(function (d) { return y(parseFloat(d[yValue])) });


    // const path = svg.selectAll('path.line').data([data]);

    // path.enter().append('path')
    //     .attr('class', 'line')
    //     .merge(path)
    //     .attr('d', line)
    //     .style('stroke', 'orange')
    //     .style('stroke-width', 2)
    //     .style('fill', 'none')
    //     .attr("stroke-dasharray", function () {
    //         return this.getTotalLength();
    //     })
    //     .attr("stroke-dashoffset", function () {
    //         return this.getTotalLength();
    //     })
    //     .transition()
    //     .duration(1000)
    //     .attr("stroke-dashoffset", 0);
    // path.exit().remove();

    var path = svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line(data))
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("fill", "none")
        .attr("stroke-dasharray", function () {
            return this.getTotalLength();
        })
        .attr("stroke-dashoffset", function () {
            return this.getTotalLength();
        })
        .transition()
        .duration(1000)
        .attr("stroke-dashoffset", 0);

    // if (previousPath) {
    //     var previousTotalLength = previousPath.node().getTotalLength();
    //     previousPath.attr("stroke-dasharray", previousTotalLength + " " + previousTotalLength)
    //         .attr("stroke-dashoffset", previousTotalLength)
    //         .transition()
    //         .duration(2000)
    //         .ease(d3.easeLinear)
    //         .attr("stroke-dashoffset", 0);
    // }


    // previousPath = path;

    addLineDots(svg, width, height, xValue, x, data, y, yValue);


    return line;
}



function drawLine(svg, data, xValue, yValue, options) {
    console.log(data)
    options = options || {};
    var margin = options.margin || { top: 10, right: 30, bottom: 30, left: 100 };
    // var parseDate = options.parseDate || d3.timeParse("%Y-%m-%d");

    var width = (options.width || 460) - margin.left - margin.right;
    var height = (options.height || 400) - margin.top - margin.bottom;
    var xDomainStart = options.xDomainStart || 0;
    var xRangeStart = options.xRangeStart || 0;
    var xRangeEnd = options.xRangeEnd || width;
    var yDomainStart = options.yDomainStart || 0;
    var yRangeStart = options.yRangeStart || height;
    var yRangeEnd = options.yRangeEnd || 0;
    allData = allData.concat(data);

    // // Set X & Y scales
    // var x = d3.scaleTime()
    //     .domain(d3.extent(data, (d) => parseDate(d[xValue])))
    //     .nice()
    //     .rangeRound([xRangeStart, xRangeEnd]);
    // var y = d3.scaleLinear()
    //     .domain([yDomainStart, d3.max(data, (d) => parseFloat(+d[yValue]))])
    //     .nice()
    //     .rangeRound([yRangeStart, yRangeEnd]);

    // Scale the x-axis (timestamps)
    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    const xAxisGroup = svg.select('x-axis');
    const yAxisGroup = svg.select('y-axis');

    var line = d3.line()
        .x(function (d) { return x(parseDate(d[xValue])) })
        .y(function (d) { return y(parseFloat(d[yValue])) });

    let path = svg.selectAll('path.line')
        .data([allData]);
    // Get existing path length

    let oldPathLength = path.node() ? path.node().getTotalLength() : 0;

    // Handle new data
    path.enter().append('path')
        .attr('class', 'line')
        .merge(path)
        .attr('d', line)
        .style('stroke', 'steelblue')
        .style('stroke-width', 2)
        .style('fill', 'none')
        .attr("stroke-dasharray", function () {     // total line length
            var totalLength = this.getTotalLength();
            return totalLength + " " + totalLength;
        })
        .attr("stroke-dashoffset", oldPathLength)  // starting from the last offset
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);             // animate to the end of the line

    path.exit().remove();

    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);

    addLineDots(svg, width, height, xValue, x, allData, y, yValue);

    return line;
}

// function update(data, xValue, svg, line) {
//     let group = svg.select("g").selectAll("path")
//         .data(data, (d) => parseDate(d[xValue]))
//         .join(
//             enter => enter.append("path")
//                 .attr("class", "line")
//                 .attr("d", line(data))
//                 .attr("stroke", "blue")
//                 .attr("stroke-width", 2)
//                 .attr("fill", "none"),
//             update => update,
//             exit => exit.call(path => path.transition().duration(1000).attr("d", line(data))
//             )
//         ).call(path => path.transition().duration(5).attr("d", line(data)))
// }


function parittionData(data, lineData1, lineData2, lineData3) {
    data.forEach(obj => {
        const date = new Date(obj.DATE);
        // Compare the parsed date with the desired date ranges
        if (date >= new Date('1966-01-01') && date <= new Date('1985-12-31')) {
            lineData1.push(obj);
        } else if (date >= new Date('1985-01-01') && date <= new Date('2004-12-31')) {
            lineData2.push(obj);
        } else if (date >= new Date('2004-01-01') && date <= new Date('2023-12-31')) {
            lineData3.push(obj);
        }
    });
}

async function loadData(filename) {
    if (dataCache[filename]) {
        var data = dataCache[filename];
        console.log("Loaded data from cache for csv: " + filename);
        return data;
    } else {
        try {
            var data = await d3.csv(filename);
            dataCache[filename] = data;
            console.log("Fetched data using D3 for csv: " + filename);
            return data;
        } catch (err) {
            console.error("Error loading data for csv: " + filename);
            console.error(err);
            return null; // or any other appropriate action to handle the error
        }
    }
}

function animateLineChart() {
    // Define your data and initial chart setup here

    // Append the initial line
    const svg = d3.select("#chart");
    const line = svg.append("path")
        .attr("d", initialLineData)
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("fill", "none");

    // Animate the line
    line.transition()
        .duration(1000)
        .attr("d", finalLineData)
        .attr("stroke", "red");

    // You can update other attributes of the line in each step of the animation

}

function addSVG(element, margin, width, height) {
    // append the svg object to the body of the page
    var svg = d3.select(element)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    return svg;
}

function addToolTip(element) {

    var tooltip = d3.select(element)
        .append("div")
        .attr("class", "tooltip")
        .styles({
            "opacity": 0,
            "background-color": "#f8f8ff",
            "border": "solid",
            "border-width": "1px",
            "border-radius": "5px",
            "padding": "10px",
            "width": "auto",
            "position": "absolute",
            "font-size": "13px"
        });
    return tooltip;

}

async function init2() {
    let data = await loadData("data/nationaldebt.csv")
    // let data2 = await loadData("data/inflation.csv")
    // let data2 = await loadData("data/studentdebt.csv")
    // let data = await loadData("data/totalpublicdebt.csv")
    // let data = await loadData("data/USGDPvsDebt.csv")
    console.log(data);
    // data = data.filter(d => d.TotalPublicDebtMil != "")
    // console.log(data);
    let lineData1 = [];
    let lineData2 = [];
    let lineData3 = [];
    parittionData(data, lineData1, lineData2, lineData3);
    console.log(lineData1);
    console.log(lineData2);
    console.log(lineData3);
    options = {
        "selector": "#chart", "drawLine": false, "yAxisLabel": "Percent of GDP", "xAxisLabel": "Year",
        "sourceCredit": "Source: Federal Reserve Economic Data (FRED)\nhttps://fred.stlouisfed.org/"
    }

    const svgWidth = 800;
    const svgHeight = 600;

    const svg = d3
        .select('body')
        .append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight)
        .style('border', '2px solid gray'); // Chart border
    const margin = { top: 20, right: 20, bottom: 100, left: 100 };
    const chartWidth = svgWidth - margin.left - margin.right;
    const chartHeight = svgHeight - margin.top - margin.bottom;
    // Initialize the chart
    const chart = svg
        .append('g')
        .attr('width', chartWidth)
        .attr('height', chartHeight)
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Scaling band for the x-axis(timestamps)
    const xScale = d3.scaleTime().range([0, chartWidth])
    // Linear scaling for the y-axis(temperature)
    const yScale = d3.scaleLinear().range([chartHeight, 0]);

    // Scale the x-axis (timestamps)
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    // Initialize each axis
    const xAxisGroup = chart.append('g')
        .attr("class", "x-axis")
        .attr('transform', `translate(0, ${chartHeight})`)
    // .call(xAxis);
    const yAxisGroup = chart.append('g').attr("class", "y-axis")
    // .call(yAxis);



    let allData = [];
    var update = (newdata) => {
        // Handle the scaling domains

        allData = allData.concat(newdata);

        xScale.domain(d3.extent(data, d => parseDate(d['DATE'])));
        yScale.domain([0, d3.max(data, (d) => +d['PERCENTOFGDP'])]);
        var line = d3.line()
            .x(function (d) { return xScale(parseDate(d['DATE'])) })
            .y(function (d) { return yScale(parseFloat(d['PERCENTOFGDP'])) });

        let path = chart.selectAll('path.line')
            .data([allData]);
        // Get existing path length

        let oldPathLength = path.node() ? path.node().getTotalLength() : 0;

        // Handle new data
        path.enter().append('path')
            .attr('class', 'line')
            .merge(path)
            .attr('d', line)
            .style('stroke', 'steelblue')
            .style('stroke-width', 2)
            .style('fill', 'none')
            .attr("stroke-dasharray", function () {     // total line length
                var totalLength = this.getTotalLength();
                return totalLength + " " + totalLength;
            })
            .attr("stroke-dashoffset", oldPathLength)  // starting from the last offset
            .transition()
            .duration(1000)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0);             // animate to the end of the line

        // oldPathLength = path.node() ? path.node().getTotalLength() : 0;

        path.exit().remove();
        // const path = chart.selectAll('path.line').data([allData]);

        // path.enter().append('path')
        //     .attr('class', 'line')
        //     .merge(path)
        //     .attr('d', line)
        //     .style('stroke', 'orange')
        //     .style('stroke-width', 2)
        //     .style('fill', 'none')
        //     .attr("stroke-dasharray", function () {
        //         return this.getTotalLength();
        //     })
        //     .attr("stroke-dashoffset", function () {
        //         return this.getTotalLength();
        //     })
        //     .transition()
        //     .duration(1000)
        //     .attr("stroke-dashoffset", 0);
        // path.exit().remove();

        xAxisGroup.call(xAxis);
        yAxisGroup.call(yAxis);

        // Handle the chart label styling
        xAxisGroup
            .selectAll('text')
            .attr('text-anchor', 'end')
            .attr('transform', 'rotate(-40)') // tilt the timestamps by 40 degrees
            // .attr('fill', 'orange') // Timestamp(x-axis) color
            .attr('font-size', '0.5rem'); //  Timestamp(x-axis) font size

        yAxisGroup
            .selectAll('text')
            .attr('text-anchor', 'end')
            // .attr('fill', 'orange') //  Temperature(y-axis) color
            .attr('font-size', '0.75rem'); // Temperature(y-axis) font size

        addLineDots(chart, svgWidth, svgHeight, 'DATE', xScale, allData, yScale, 'PERCENTOFGDP');

    };
    // update(lineData1);
    // update(lineData2);
    // update(lineData3);

    d3.select("#button1").on("click", function () {
        console.log('click1');
        allData = [];
        update(lineData1)
        console.log(allData.length)
    });
    d3.select("#button2").on("click", function () {
        if (allData.length < 80) allData = lineData1;
        if (allData.length == 156) allData = lineData1.concat(lineData2);
        if (allData.length == 229) allData = lineData1;
        update(lineData2); console.log(allData.length)
    });
    d3.select("#button3").on("click", function () {
        if (allData.length < 156) allData = lineData1.concat(lineData2);
        if (allData.length == 229) allData = lineData1.concat(lineData2);
        update(lineData3);
        console.log(allData.length);
    });
}

