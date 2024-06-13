

var stock_cp_path = "../data/contracts/all_cp.json";


// Use call_prem_chng as bullish flow, and put_prem_chng as bearish flow. 
// Create a Bar Chart to show the top 10 bullish and bearish flow for all stocks
// Use observable to create the plot 

// Create a function to update the plot
fetch(stock_cp_path).then((response) => response.json()).then(function(data) {
    // console.log(data);
    data.forEach(function(d) {
        // Check if $ is already in front of the stock symbol
        if (d.stock[0] !== "$") {
        d.stock = "$" + d.stock.toUpperCase();
        d.call_prem_chng = +d.call_prem_chng;
        d.call_oi = +d.call_oi;
        d.call_vol = +d.call_vol;
        d.call_vol_chng = +d.call_vol_chng;
        d.call_oi_chng = +d.call_oi_chng;

        d.put_oi = +d.put_oi;
        d.put_vol = +d.put_vol;
        d.put_vol_chng = +d.put_vol_chng;
        d.put_oi_chng = +d.put_oi_chng;
        d.put_prem_chng = +d.put_prem_chng;
        return d;}
        // else {return d;}
        else {
            return d;
        }
    });

    function top_10_BB(data, key1, key2, top_n){
        data.forEach(function(d) {
            d.stock = d.stock.toUpperCase();
            d.key1 = +d[key1];
            d.key2 = +d[key2];
            return d;
        });
        // Top 10 bullish Flow 
        var bullishFlow = data.sort((a, b) => b.key1 - a.key1).slice(0, top_n);
        // Top 10 bearish Flow
        var bearishFlow = data.sort((a, b) => b.key2 - a.key2).slice(0, top_n);
        bearishFlow.forEach(function(d) {d.key2 = +d.key2;});
        const max_bullish = d3.max(bullishFlow, d => d.key1) / 2;
        const max_bearish = d3.max(bearishFlow, d => d.key2) / 2;


        const bullishBars = Plot.plot({
            marks: [
                Plot.barX(bullishFlow, { y: "stock", x: key1, fill: "green", sort: {y: "x", reverse: true}}),
                Plot.text(bullishFlow, { 
                    x: key1, 
                    y: "stock", 
                    text:"stock",
                    textAnchor: "start",
                    dx: 3,
                    fill: "white",
                    fontWeight: "bold",
                    filter: d => d.key1 < max_bullish
                }),
                Plot.text(bullishFlow, {
                    x: key1, 
                    y: "stock", 
                    text:"stock",
                    textAnchor: "end",
                    dx: -3,
                    fill: "white",
                    fontWeight: "bold",
                    filter: d => d.key1 >= max_bullish,
                }),
                Plot.text(bullishFlow, Plot.pointerY({px: key1, py: "stock", dy: -17, frameAnchor: "top-left", fontVariant: "tabular-nums", text: d => d.stock + " "+ d3.format("~s")(d[key1])}))
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
                Plot.barX(bearishFlow, { y: "stock", x: "key2", fill: "red", sort: {y: "x", reverse: true}}),
                Plot.text(bearishFlow, {
                    x: "key2", 
                    y: "stock", 
                    text:"stock",
                    textAnchor: "end",
                    dx: -3,
                    fill: "white", 
                    fontWeight: "bold",
                    filter: d => d.key2 < max_bearish
                }),
                Plot.text(bearishFlow, {
                    x: "key2", 
                    y: "stock", 
                    text:"stock",
                    textAnchor: "start",
                    dx: 3,
                    fill: "white", 
                    fontWeight: "bold",
                    filter: d => d.key2 >= max_bearish
                }),
                Plot.text(bearishFlow, Plot.pointerY({px: key2, py: "stock", dy: -17, frameAnchor: "top-right", fontVariant: "tabular-nums", text: d => d.stock + " "+ d3.format("~s")(d[key2])})),
                Plot.axisY({anchor: "right", label: "", labelAnchor: "top", tickFormat: () => ""}),

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
    return [bullishBars, bearishBars];
    };
    var put_flow_selector = d3.select("#put-flow-selector").append("select");
    var range_slider = d3.select("#call-flow-selector").append("input").attr("type", "range").attr("min", 1).attr("max", 50).attr("value", 20);
    var keys = Object.keys(data[0]);
    keys.forEach(function(key) {
        // console.log(names_desc[names.indexOf(key.split("_")[1])]);
        if (key.includes("_pct")) {return;}
        if (key.includes("avg")){return;}
        if (key.includes("std")){return;}
        if (key.includes("put_")) {
            // put_flow_selector.append("option").text(key.replace("put_", "")).property("value", key);
            if (key.endsWith('_oi')) { put_flow_selector.append("option").text("Open Interest").property("value", key);}
            if (key.includes('_oi_chng')) { put_flow_selector.append("option").text("OI Change").property("value", key);}
            if (key.endsWith('_vol')) { put_flow_selector.append("option").text("Volume").property("value", key);}
            if (key.includes('vol_chng')) { put_flow_selector.append("option").text("Vol. Change").property("value", key);}
            if (key.endsWith('_prem')) { put_flow_selector.append("option").text("Premium").property("value", key);}
            if (key.includes('prem_chng')) { put_flow_selector.append("option").text("Prem Change").property("value", key);}
        }
    });

    // Function to add descriptions for the flow chosen 
    function add_desc(key) {
        if (key.endsWith('_oi')) {
            return "Stocks with the highest Call and Put Open Interest Contracts Today:";
        }
        if (key.includes('_oi_chng')) {
            return "Stocks with the highest Call and Put Open Interest Change Today:";
        }
        if (key.endsWith('_vol')) {
            return "Stocks with the highest Call and Put Volume Today:";
        }
        if (key.includes('vol_chng')) {
            return "Stocks with the highest Call and Put Volume Change Today:";
        }
        if (key.endsWith('_prem')) {
            return "Stocks with the highest Call and Put Premium Today:";
        }
        if (key.includes('prem_chng')) {
            return "Stocks with the highest Call and Put Premium Change Today:";
        }
    };
    // Create a function to update the plot when a new key is selected
    function update_plot(data, key1, key2) {
        top_n = range_slider.property("value");
        var [bullishBars, bearishBars] = top_10_BB(data, key1, key2, top_n);
        document.getElementById("flow_plot2").innerHTML = "";
        document.getElementById("flow_plot").innerHTML = "";
        document.getElementById("flow_plot2").appendChild(bullishBars);
        document.getElementById("flow_plot").appendChild(bearishBars);
        document.getElementById("flow_desc").innerHTML = add_desc(key1);
    }

    // Link Both Selectors to the same event listener
    put_flow_selector.on("change", function() {
        var selected_key = d3.select(this).property("value");
        // replace put_ with call_ to get the corresponding call key
        var call_key = selected_key.replace("put_", "call_");
        // get the value of the range slider
        var top_n = range_slider.property("value");
        console.log(top_n);
        update_plot(data, selected_key, call_key, top_n);
        document.getElementById("flow_desc").innerHTML = add_desc(selected_key);
    });

    // Add an event listener for the range slider
    range_slider.on("input", function() {
        var selected_key = put_flow_selector.property("value");
        var call_key = selected_key.replace("put_", "call_");
        var top_n = range_slider.property("value");
        update_plot(data, selected_key, call_key, top_n);
    });

    // Initialize the plot
    update_plot(data, "call_prem_chng", "put_prem_chng");

});
