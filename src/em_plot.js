// file: em_ext.json 
// Create a plot that shows the current close and the projected close for the next expiration dates based on the dates in the em_ext.json file

// Create a Dropbox for each stock in the data
var stockDrop = d3.select("#stock-selection").append("select");

// Create div for the side panel body 
var sidePanel = d3.select("#text-box-em").append("div").attr("class", "card-body");
    
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
            uniqueStocks.forEach(function(stock) {
                stockDrop.append("option").text("$"+stock.toUpperCase()).property("value", stock);
            }); // forEach Loop

            // Create a function to update the plot
            function updatePlot(stock) {
                var closeData = price_data.filter(d => d[stock.toUpperCase()]);
                var filteredData = data.filter(d => d.stock === stock);
                var trace1 = {
                    // x: filteredData.map(d => d.expiry),
                    // y: filteredData.map(d => d.last_close),
                    x: closeData.map(d => new Date(d.Date)),
                    y: closeData.map(d => +d[stock.toUpperCase()]),
                    mode: 'lines',
                    name: 'Close',
                    line: {
                        color: 'white',
                        width: 3
                    }
                };
                var trace2 = {
                    x: filteredData.map(d => d.expiry),
                    y: filteredData.map(d => d.em + d.last_close),
                    mode: 'lines+markers',
                    name: 'Upper Expectations',
                    line: {
                        color: 'green',
                        width: 3
                    }
                };

                var trace3 = {
                    x: filteredData.map(d => d.expiry),
                    y: filteredData.map(d => -d.em + d.last_close),
                    mode: 'lines+markers',
                    name: 'Lower Expectations',
                    line: {
                        color: 'red',
                        width: 3
                    }
                };
                var trace4 = {
                    x: filteredData.map(d => d.expiry),
                    y: filteredData.map(d => -d.em + d.last_close),
                    fill: 'tonexty',
                    fillcolor: "rgba(68, 68, 68, 0.3)", 
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

                var traces = [trace1, trace2, trace4, trace3];
                var layout = {
                    title: '',
                    xaxis: {
                        title: 'Date',
                        showgrid: false,
                        zeroline: false,
                        tickfont: {color: 'white'}, 
                        titlefont: {color: 'white'}
                    },
                    yaxis: {
                        title: 'Close Price',
                        showline: false, 
                        showgrid: false,
                        tickfont: {color: 'white'},
                        titlefont: {color: 'white'}
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
                    
                    margin: {l: 70,r: 0,b: 90,t: 50,pad: 4}, 
                };
                Plotly.newPlot('plot_area', traces, layout, {staticPlot: true, responsive: true, });
            } // updatePlot function

            // Create a function to update the side panel
            function updateSidePanel(stock) {
                var filteredData = data.filter(d => d.stock === stock);
                var sidePanelData = filteredData.map(d => d);
                sidePanel.html("");
                sidePanel.append("h5").text("Stock: " + stock.toUpperCase()).attr("class", "card-title");
                sidePanel.append("p").text("Expiration Date: " + sidePanelData[0].expiry).attr("class", "card-text");
                sidePanel.append("p").text("Last Close: " + sidePanelData[0].last_close).attr("class", "card-text");
                sidePanel.append("p").text("Expected Move: " + sidePanelData[0].em).attr("class", "card-text");
                sidePanel.append("p").text("Percent Change: " + sidePanelData[0].pct_change).attr("class", "card-text");
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