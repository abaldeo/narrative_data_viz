const dataCache = {};
let allAnnotations = [
    {
        note: {
            title: "1973 Oil Crisis",
            label: "This event started on 1973-10-17 and ended on 1974-03-18.",
            wrap: 100

        },
        data: { "x": "1973-10-17", "y": 31 },
        // x: "1973-10-17",
        // y: 31,
        dx: 0,
        dy: -100,
        // subject: {
        //     width: -20,
        //     height: 105
        // }
    },
    {
        note: {
            title: "Latin American Debt Crisis",
            label: "This event started on 1982-07-01 and ended on 1990-12-31.",
            wrap: 100
        },
        data: { x: "1982-07-01", y: 33.92530 },
        // x: "1982-07-01",
        // y: 33.92530,
        dx: 30,
        dy: -150
    },
    {
        note: {
            title: "Asian Financial Crisis",
            label: "This event started on 1997-07-02 and ended on 1999-02-01.",
            wrap: 100
        },
        data: { x: "1997-07-02", y: 62.48709 },
        // x: "1997-07-02",
        // y: 62.48709,        
        dx: 50,
        dy: -100
    },
    {
        note: {
            title: "Great Recession",
            label: "This event started on 2007-12-01 and ended on 2009-06-30.",
            // wrap: 100
        },
        data: { x: "2007-12-01", y: 64.17278 },
        // x: "2007-12-01",
        // y: 64.17278,        
        dx: -10,
        dy: -20
    },
    {
        note: {
            title: "Coronavirus Pandemic",
            label: "This event started on 2019-12-31 and ended on 2023-05-23.",
            // wrap: 100
        },
        data: { x: "2019-12-31", y: 107.827 },
        // x: "2019-12-31",
        // y: 107.827,
        dx: -1,
        dy: 200
    }
]

let allData = [];
let currentPage = 1;



function previousPage() {
    if (currentPage > 1) {
        currentPage--;
    } else {
        currentPage = 3;
    }
    goToPage(currentPage);

}

function nextPage() {
    if (currentPage < 3) {
        currentPage++;

    } else {
        currentPage = 1;
    }
    goToPage(currentPage);
}

function goToPage(page) {
    if (page == 1) {
        console.log("go to page:" + page)
        document.getElementById("button1").click();
    }
    else if (page == 2) {
        console.log("go to page:" + page)
        document.getElementById("button2").click();
    }
    else if (page == 3) {
        console.log("go to page:" + page)
        document.getElementById("button3").click();
    }
}

let data;
let lineData1 = [];
let lineData2 = [];
let lineData3 = [];
let svg = [];

const intervals = [
    { start: '1966-01-01', end: '1985-12-31' },
    { start: '1986-01-01', end: '2004-12-31' },
    { start: '2005-01-01', end: '2023-12-31' }
];


let partitions = [];
let annotations = [];

async function init() {
    data = await loadData("data/nationaldebt.csv")
    console.log(data);
    partitions = partitionData(data, intervals);
    lineData1 = partitions[0];
    lineData2 = partitions[1];
    lineData3 = partitions[2];
    console.log('scene 1 data')
    console.log(lineData1);
    console.log('scene 2 data')
    console.log(lineData2);
    console.log('scene 3 data')
    console.log(lineData3);

    annotations = partitionAnnotations(allAnnotations, intervals);
    first_scene_annotations = annotations[0];
    second_scene_annotations = annotations[1];
    third_scene_annotations = annotations[2];

    options = {
        "selector": "#chart", "drawLine": false, "yAxisLabel": "Percent of GDP", "xAxisLabel": "Year",
        "sourceCredit": "Source: Federal Reserve Economic Data (FRED)",
        "sourceLink": "https://fred.stlouisfed.org/series/GFDEGDQ188S",
        "legendTitle": "National Debt",

    }
    d3.select('#narrative-detail').html(scene1HTML);
    svg = createLineChart(data, "DATE", "PERCENTOFGDP", options)
    line_opt = { 'annotationarray': first_scene_annotations };
    var line1 = drawLine(svg, lineData1, "DATE", "PERCENTOFGDP", line_opt)
    updateMinMaxDate(lineData1);

    d3.select("#button1").on("click", function () {
        d3.select('#narrative-detail').html(scene1HTML);

        lineData1 = partitions[0];
        // resetLineData();
        first_scene_annotations = annotations[0];
        drawScene1();

    });
    d3.select("#button2").on("click", function () {
        d3.select('#narrative-detail').html(scene2HTML);

        lineData2 = partitions[1];
        // resetLineData();
        second_scene_annotations = annotations[1];
        drawScene2();

    });
    d3.select("#button3").on("click", function () {
        d3.select('#narrative-detail').html(scene3HTML);

        lineData3 = partitions[2];
        // resetLineData();
        third_scene_annotations = annotations[2];
        drawScene3();
    });

}

function resetLineData() {
    lineData1 = partitions[0];
    lineData2 = partitions[1];
    lineData3 = partitions[2];
}

function resetAnnoations() {
    first_scene_annotations = annotations[0];
    second_scene_annotations = annotations[1];
    third_scene_annotations = annotations[2];
}

function drawScene1(filter = false) {
    currentPage = 1;
    // d3.select(".line").remove();
    const lineToRemove = d3.select(".line");

    // Transition the line to fade out and remove it
    lineToRemove
        .transition()
        .duration(500) // Set the duration of the transition
        .style("opacity", 0) // Fade out the line
        .end() // Wait for the transition to finish
        .then(() => {
            // Remove the line from the DOM
            lineToRemove.remove();
            allData = [];
            opt = { 'annotationarray': first_scene_annotations };
            drawLine(svg, lineData1, "DATE", "PERCENTOFGDP", opt);
            console.log('after drawScene1')
            console.log(allData.length)
            updateMinMaxDate(lineData1);
        }).catch((error) => {
            console.log(error);
        });
};

function drawScene2(filter = false) {
    currentPage = 2;
    console.log('in draw scene2')
    console.log('all data length ' + allData.length)
    console.log('line data 1 length ' + lineData1.length)
    console.log('line data 2 length ' + lineData2.length)
    if (allData.length < lineData1.length) allData = lineData1;
    if (!filter && allData.length == lineData1.length + lineData2.length) return; //allData = lineData1;
    if (allData.length > lineData1.length + lineData2.length) allData = lineData1;
    if (filter) allData = lineData1;
    opt = { 'annotationarray': second_scene_annotations };
    drawLine(svg, lineData2, "DATE", "PERCENTOFGDP", opt);
    console.log('after drawScene2')
    console.log(allData.length)

    updateMinMaxDate(allData);

};

function drawScene3(filter = false) {
    currentPage = 3;
    console.log('in draw scene3')
    console.log('all data length ' + allData.length)
    console.log('line data 1 length ' + lineData1.length)
    console.log('line data 2 length ' + lineData2.length)
    console.log('line data 3 length ' + lineData3.length)
    if (allData.length < lineData1.length + lineData2.length) allData = lineData1.concat(lineData2);
    if (allData.length == lineData1.length + lineData2.length + lineData3.length) return; //allData = lineData1.concat(lineData2);
    if (filter) allData = lineData1.concat(lineData2);
    opt = { 'annotationarray': third_scene_annotations };
    drawLine(svg, lineData3, "DATE", "PERCENTOFGDP", opt)
    console.log('after drawScene3')
    console.log(allData.length);
    updateMinMaxDate(allData);

}

function drawLine(svg, data, xValue, yValue, options) {
    console.log('drawing line for:')
    console.log(data)
    options = options || {};
    var margin = options.margin || { top: 50, right: 50, bottom: 75, left: 75 };
    // var parseDate = options.parseDate || d3.timeParse("%Y-%m-%d");

    var width = (options.width || 800) - margin.left - margin.right;
    var height = (options.height || 600) - margin.top - margin.bottom;
    var xDomainStart = options.xDomainStart || 0;
    var xRangeStart = options.xRangeStart || 0;
    var xRangeEnd = options.xRangeEnd || width;
    var yDomainStart = options.yDomainStart || 0;
    var yRangeStart = options.yRangeStart || height;
    var yRangeEnd = options.yRangeEnd || 0;
    var annotationarray = options.annotationarray || [];
    allData = [...new Set(allData.concat(data))];


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
    addAnnotations(svg, x, y, annotationarray);

    return line;
}

function partitionData(data, intervals) {
    let partitions = [];
    intervals.forEach(interval => {
        const lineData = [];
        data.forEach(obj => {
            const date = new Date(obj.DATE);
            if (date >= new Date(interval.start) && date <= new Date(interval.end)) {
                lineData.push(obj);
            }
        });
        partitions.push(lineData);

    });
    return partitions;
}

function partitionAnnotations(annotations, intervals) {
    return intervals.map((interval) => {
        return annotations.filter((annotation) => {
            const annotationDate = new Date(annotation.data.x);
            const startDate = new Date(interval.start);
            const endDate = new Date(interval.end);
            return annotationDate >= startDate && annotationDate <= endDate;
        });
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

function filterAnnotationsByDate(annotations, startDate, endDate) {
    // console.log('filtering annotations by date')
    // console.log(annotations)
    // console.log(startDate)
    // console.log(endDate)
    return annotations.filter((annotation) => {
        const annotationDate = new Date(annotation.data.x);
        // console.log(annotationDate);
        return annotationDate >= startDate && annotationDate <= endDate;
    });
}

const startDateInput = document.getElementById("start");
const endDateInput = document.getElementById("end");

var oldStartDate = startDateInput.value;
var oldEndDate = endDateInput.value;



startDateInput.addEventListener("change", function () {
    endDateInput.min = startDateInput.value;
    oldStartDate = startDateInput.value;
    filterPageData();
    console.log('after start date input change')
    console.log(allData)

});

endDateInput.addEventListener("change", function () {
    startDateInput.max = endDateInput.value;
    oldEndDate = endDateInput.value;
    filterPageData();
    console.log('after end date input change')
    console.log(allData)

});

startDateInput.addEventListener("input", handleStartDateClear);
endDateInput.addEventListener("input", handleEndDateClear);

function handleStartDateClear(event) {
    if (event.target.value === "") {
        // "Clear" button was clicked
        let targetValue = "1966-01-01"
        resetLineData();
        resetAnnoations();

        startDateInput.value = targetValue;
        console.log("Start Clear button clicked");
    }
}

function handleEndDateClear(event) {
    if (event.target.value === "") {
        // "Clear" button was clicked
        let targetValue;
        if (currentPage === 1) {
            lineData1 = partitions[0];
            first_scene_annotations = annotations[0];
            targetValue = getMaxDate(lineData1);
        }
        else if (currentPage === 2) {
            lineData2 = partitions[1];
            second_scene_annotations = annotations[1];
            targetValue = getMaxDate(lineData2);
        }
        else if (currentPage === 3) {
            lineData3 = partitions[2];
            third_scene_annotations = annotations[2];
            targetValue = getMaxDate(lineData3);
        }
        endDateInput.value = targetValue;
        console.log("End Clear button clicked");
    }
}

function filterPageData() {
    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);
    if (currentPage === 1) {
        lineData1 = filterData(lineData1);
        first_scene_annotations = filterAnnotationsByDate(first_scene_annotations, startDate, endDate);
        console.log('lineData1 after filter, before draw')
        console.log(lineData1)
        drawScene1(true);

    }
    else if (currentPage === 2) {
        lineData1 = filterData(lineData1);
        first_scene_annotations = filterAnnotationsByDate(first_scene_annotations, startDate, endDate);
        lineData2 = filterData(lineData2);
        second_scene_annotations = filterAnnotationsByDate(second_scene_annotations, startDate, endDate);
        console.log('lineData2 after filter, before draw')
        console.log(lineData2)
        drawScene2(true);
    }
    else if (currentPage === 3) {
        lineData1 = filterData(lineData1);
        first_scene_annotations = filterAnnotationsByDate(first_scene_annotations, startDate, endDate);
        lineData2 = filterData(lineData2);
        second_scene_annotations = filterAnnotationsByDate(second_scene_annotations, startDate, endDate);
        lineData3 = filterData(lineData3);
        third_scene_annotations = filterAnnotationsByDate(third_scene_annotations, startDate, endDate);
        console.log('lineData3 after filter, before draw')
        console.log(lineData3)
        drawScene3(true);
    }
}

function filterData(data) {
    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);
    console.log("Current Start:" + startDate)
    console.log("Current End:" + endDate)
    const filteredData = data.filter(obj => {
        const date = new Date(obj.DATE);
        return date >= startDate && date <= endDate;
    });
    console.log('filtered data')
    console.log(filteredData)
    return filteredData;
};

function getMinDate(data) {
    const dates = data.map(obj => new Date(obj.DATE));
    const minDate = new Date(Math.min(...dates));
    console.log(minDate);
    return minDate.toISOString().split('T')[0];
}

function getMaxDate(data) {
    const dates = data.map(obj => new Date(obj.DATE));
    const maxDate = new Date(Math.max(...dates));
    console.log(maxDate);

    return maxDate.toISOString().split('T')[0];
}

function updateMinMaxDate(data) {
    console.log('update minmax')
    console.log(data);
    const minDate = getMinDate(data);
    const maxDate = getMaxDate(data);
    // startDateInput.min = minDate;
    // startDateInput.max = maxDate;
    // endDateInput.min = minDate;
    // endDateInput.max = maxDate;
    startDateInput.value = minDate;
    endDateInput.value = maxDate;
}