

var stock_cp_path = "../data/contracts/all_cp.json";


// Use call_prem_chng as bullish flow, and put_prem_chng as bearish flow. 
// Create a Bar Chart to show the top 10 bullish and bearish flow for all stocks
// Use observable to create the plot 

// Create a function to update the plot
fetch(stock_cp_path).then((response) => response.json()).then(function(data) {
    data.forEach(function(d) {
        d.stock = "$" + d.stock.toUpperCase();
        d.call_prem_chng = +d.call_prem_chng;
        d.put_prem_chng = +d.put_prem_chng;
        return d;
    });

    // Top 10 bullish Flow 
    var bullishFlow = data.sort((a, b) => b.call_prem_chng - a.call_prem_chng).slice(0, 10);
    // Top 10 bearish Flow
    var bearishFlow = data.sort((a, b) => b.put_prem_chng - a.put_prem_chng).slice(0, 10);
    bearishFlow.forEach(function(d) {d.put_prem_chng = +d.put_prem_chng;});
    const max_bullish = d3.max(bullishFlow, d => d.call_prem_chng);
    const max_bearish = d3.max(bearishFlow, d => d.put_prem_chng);


    const bullishBars = Plot.plot({
        marks: [
            Plot.barX(bullishFlow, { y: "stock", x: "call_prem_chng", fill: "green", sort: {y: "x", reverse: true}}),
            Plot.text(bullishFlow, { 
                x: "call_prem_chng", 
                y: "stock", 
                text:"stock",
                textAnchor: "start",
                dx: 3,
                fill: "white",
                fontWeight: "bold",
                filter: d => d.call_prem_chng < max_bullish
            }),
            Plot.text(bullishFlow, {
                x: "call_prem_chng", 
                y: "stock", 
                text:"stock",
                textAnchor: "end",
                dx: -3,
                fill: "white",
                fontWeight: "bold",
                filter: d => d.call_prem_chng >= max_bullish
            }
            )
        ],
        y: { 
            label: "", 
            tickFormat: () => ""
            },
        x: { 
            label: "Flow",
            tickFormat: d3.format("~s"), 
            
            },

    });

    const bearishBars = Plot.plot({
        marks: [
            Plot.barX(bearishFlow, { y: "stock", x: "put_prem_chng", fill: "red", sort: {y: "x", reverse: true}}),
            Plot.text(bearishFlow, {
                x: "put_prem_chng", 
                y: "stock", 
                text:"stock",
                textAnchor: "end",
                dx: -3,
                fill: "white", 
                fontWeight: "bold",
                filter: d => d.put_prem_chng < max_bearish
            }),
            Plot.text(bearishFlow, {
                x: "put_prem_chng", 
                y: "stock", 
                text:"stock",
                textAnchor: "start",
                dx: 3,
                fill: "white", 
                fontWeight: "bold",
                filter: d => d.put_prem_chng >= max_bearish
            }
            )
        ],
        y: { 
            label: "", 
            tickFormat: () => ""
            },
        x: { 
            label: "Flow",
            tickFormat: d3.format("~s"),  
            reverse: true
            },

    });

    // Display the plot on id = "flow_plot"
    document.getElementById("flow_plot2").appendChild(bullishBars);
    document.getElementById("flow_plot").appendChild(bearishBars);

});