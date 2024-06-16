// file: em_ext.json 
// Create a plot that shows the current close and the projected close for the next expiration dates based on the dates in the em_ext.json file

// Create a Dropbox for each stock in the data
var stockDrop = d3.select("#stock-selection").append("select");

// Create div for the side panel body 
var sidePanel = d3.select("#text-box-em").append("div");

// Format Date Function
var formatDate = d3.timeFormat("%B %d, %Y");

// Rounding Function 
function round(num) {
    return +(Math.round(num + "e+2")  + "e-2");
}
    
// Load the data from the em_ext.json file
d3.csv("../data/prices/close.csv").then(function(price_data) {
    price_data.Date = new Date(price_data.Date);
    // console.log(price_data);
    d3.json("../data/contracts/em_ext.json").then(function(data) {
        data.forEach(function(d) {
            d.stock = d.stock;
            d.expiry = new Date(d.expiry);
            d.last_close = +d.stk_price;
            d.em = +d.em;
            d.pct_change = +d['%'];
            return d;
            // append the stock to the dropdown

            }); // forEach Loop 
            // append the stock to the dropdown
            var stocks = data.map(d => d.stock);
            var uniqueStocks = [...new Set(stocks)];
            // sort uniqueStocks
            uniqueStocks.sort();
            uniqueStocks.forEach(function(stock) {
                stockDrop.append("option").text("$"+stock.toUpperCase()).property("value", stock);
            }); // forEach Loop

            // Create a function to update the plot
            function updatePlot(stock) {
                var closeData = price_data.filter(d => d[stock.toUpperCase()]);
                var filteredData = data.filter(d => d.stock === stock);
                var last_close = closeData[closeData.length - 1][stock.toUpperCase()];
                var last_close_up = Number(last_close) + 0;
                var last_close_down = Number(last_close) - 0;
                // console.log(last_close);

                var trace1 = {
                    // x: filteredData.map(d => d.expiry),
                    // y: filteredData.map(d => d.last_close),
                    x: closeData.map(d => new Date(d.Date)),
                    y: closeData.map(d => +d[stock.toUpperCase()]),
                    mode: 'lines',
                    name: 'Close',
                    line: {
                        color: 'white',
                        width: 1
                    }
                };
                // Upper Line Chart 
                var trace2 = {
                    // x: filteredData.map(d => d.expiry),
                    // y: filteredData.map(d => d.em + d.last_close),
                    //  Add the last data point from closeData to the begining of the filteredData
                    x: [closeData[closeData.length - 1].Date, ...filteredData.map(d => d.expiry)],
                    y: [last_close_up, ...filteredData.map(d => d.em + d.last_close)],
                    mode: 'lines+markers',
                    name: 'Upper Expectations',
                    line: {
                        color: 'green',
                        width: 1.5
                    }
                };
                // Lower Line Chart
                var trace3 = {
                    // x: filteredData.map(d => d.expiry),
                    // y: filteredData.map(d => -d.em + d.last_close),
                    x: [closeData[closeData.length - 1].Date, ...filteredData.map(d => d.expiry)],
                    y: [last_close_down, ...filteredData.map(d => -d.em + d.last_close)],
                    mode: 'lines+markers',
                    name: 'Lower Expectations',
                    line: {
                        color: 'red',
                        width: 1.5
                    }
                };
                var trace4 = {
                    x: filteredData.map(d => d.expiry),
                    y: filteredData.map(d => -d.em + d.last_close),
                    fill: 'tonexty',
                    fillcolor: "rgba(68, 68, 70, 0.9)", 
                    line: {width: 0}
                };
                
                var gauge_indicator = [
                    {
                      type: "indicator",
                      mode: "number+gauge+delta",
                      gauge: { shape: "bullet" },
                      delta: { reference: 300 },
                      value: 220,
                      domain: { x: [0, 1], y: [0, 1] },
                      title: { text: "Profit" }
                    }
                  ];

                // var traces = [trace1, trace2, trace4, trace3];
                var traces = [trace1, trace2,  trace3];
                var layout = {
                    title: '',
                    xaxis: {
                        title: 'Date',
                        showgrid: true,
                        zeroline: false,
                        showline: true,
                        tickfont: {color: 'white', size: 8}, 
                        titlefont: {color: 'white', size: 10},
                        gridcolor: 'rgba(255, 255, 255, 0.1)',
                    },
                    yaxis: {
                        title: 'Close',
                        showline: true, 
                        showgrid: true,
                        tickfont: {color: 'white', size: 8},
                        titlefont: {color: 'white', size: 10},
                        gridcolor: 'rgba(255, 255, 255, 0.1)',
                    },
                    // Horizontal Legend above the plot
                    legend: {
                        x: 0,
                        y: 1.12,
                        bgcolor: 'rgba(255, 255, 255, 0)',
                        bordercolor: 'rgba(255, 255, 255, 0)',
                        orientation: 'h'
                    }, 
                    showlegend: false,
                    paper_bgcolor: 'rgba(0,0,0,0)',
                    plot_bgcolor: 'rgba(0,0,0,0)',
                    

                    margin: {l:50,r: 50,b: 90,t: 50,pad: 1}, 
                };
                Plotly.newPlot('plot_area', traces, layout, {staticPlot: false, responsive: true, displayModeBar: false});
            } // updatePlot function

            // Create a function to update the side panel
            function updateSidePanel(stock) {
                var filteredData = data.filter(d => d.stock === stock);
                var sidePanelData = filteredData.map(d => d);
                sidePanel.html("");
                sidePanel.append("p").text(
                    "$" + stock.toUpperCase() + " " +
                    "Pricing in ± $" + sidePanelData[0].em + 
                    " ( ±" + (100 * round(sidePanelData[0].pct_change)) + "%)" + 
                    " by " + formatDate(sidePanelData[0].expiry)
                ).attr("class", "card-text");
                sidePanel.append("p").text("Last Close: $" + sidePanelData[0].last_close);
            } // updateSidePanel function

            // Create a function to handle the change event
            function optionChanged(stock) {
                updatePlot(stock);
                updateSidePanel(stock);
            } // optionChanged function

            // Call the updatePlot function
            updatePlot(uniqueStocks[0]);

            // Call the updateSidePanel function
            updateSidePanel(uniqueStocks[0]);

            // Call the optionChanged function
            stockDrop.on("change", function() {
                var stock = d3.select(this).property("value");
                optionChanged(stock);
            }); // on change event





        }).catch(function(error) {
        console.log(error);
    });}).catch(function(error) {
    console.log(error);
}); // d3.json function