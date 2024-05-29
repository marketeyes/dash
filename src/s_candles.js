var timeParse = d3.timeParse("%Y-%m-%dT%H:%M:%S");
var gdateParse = d3.timeParse("%Y-%m-%d %H:%M:%S");
var ymdParse = d3.timeParse("%Y-%m-%d");
var niceFormat = d3.format("~s");
// Create Dropdown for Expiration Dates 
var exp_dropdown = d3.select("#exp-selector").append("select");

function isDateInArray(needle, haystack) {
    for (var i = 0; i < haystack.length; i++) {
      if (needle.getTime() === haystack[i].getTime()) {
        return true;
      }
    }
    return false;
  }


function candleChart(data, title, gl, rl){
    // set flip to the last close
    const candles = Plot.plot({
        // inset: 10,
        width: Math.max(800, window.innerWidth),
        height: Math.min(600, window.innerHeight),
        marginLeft: 50,
        marginRight: 25,
        x: {
            x: "Date",
            label: null,
            type: "time",
        },
        y: {
            label: title + " Price",
            grid:true,
            padding: 0.5,
            domain: [d3.min(data, d => d.Low), d3.max(data, d => d.High)],
        },
        color: {domain: [-1, 0, 1], range: ["#e41a1c", "currentColor", "#4daf4a"]},
        marks: [
            // Plot.frame(),
            Plot.ruleY(gl, {stroke: "green", strokeWidth: 3, strokeDasharray: "3,2"}, ),
            Plot.ruleY(rl, {stroke: "red", strokeWidth: 3, strokeDasharray: "3,2"}),
            // Plot.ruleY(data, Plot.selectFirst({y: d => d.Open,stroke: 'grey',strokeDasharray: "3,2",})),
            Plot.ruleX(data, {
                x: "Date",
                y1: "Low",
                y2: "High",
                strokeWidth: 0.05,
            }),
            Plot.ruleX(data, {
              x: "Date",
              y1: "Open",
              y2: "Close",
              stroke: d => Math.sign(d.Close - d.Open),
              strokeWidth: 2,
              strokeLinecap: "round",
            }),
            // Plot.crosshair(data, {x: "Date", y: "Close", textFill:'black'}),
            Plot.dot(data, Plot.pointerX({x: "Date", y: "Close", stroke: "yellow"})),
            Plot.ruleY(data, Plot.pointerY({px: "Date", y: "Close", stroke: "red"})),
            Plot.text(data, Plot.pointerX({px: "Date", py: "Close", dy: -17, frameAnchor: "top-right", fontVariant: "tabular-nums", text: (d) => [`Time ${d.Date}`, `Close ${d.Close.toFixed(2)}`].join("   ")}))
          ]
    
      })
        //   candles.setAttribute("font-size", "2vmax");

    return candles
}

function barChart(data, uqs){  
    var bar_width = Math.min(400, window.innerWidth-100);
    var bar_height = Math.min(400, window.innerHeight-100);
    var bar_padding = 0.05;
    // If uqs is less than 5; strikes = 1 else strikes = 5
    var strikes = uqs < 5 ? 3 : 5;
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    const openInterest_bar = Plot.plot({
        width: bar_width,
        height: bar_height,
        // aspectRatio: 1,

        x: {
            label: "Open Interest",
            labelAnchor: "center",
            grid: true,
            reverse: false,
            nice:true,
            tickFormat: d3.format("~s")
        },
        y: {
            labelAnchor:"top",
            label: "",
            grid: true,
            padding: bar_padding, 
            tickSpacing: 50,
            reverse:true, 
            nice:true, 
            tickFormat: (d, i) => i % strikes === 0 ? d : ""

        },
        // facet: { data: data, y: "strike", columns: 3},
        marks: [
            // Plot.frame(),
            Plot.barX(data,{y: "strike", x: "call_oi",fill: "green", opacity: 0.9,}),
            Plot.barX(data,{y: "strike", x: "put_oi",fill: "red", opacity: 0.9,}),
            Plot.crosshair(data, {x: "call_oi", y: "strike", textFill:'black'}),
            Plot.crosshair(data, {x: "put_oi", y: "strike", textFill:'black'}),
            Plot.dot(data, Plot.pointerY({x: "call_oi", y: "strike", stroke: "red"})),
            Plot.dot(data, Plot.pointerY({x: "put_oi", y: "strike", stroke: "red"})),
            Plot.ruleY(data, Plot.pointerY({px: "call_oi", y: "strike", stroke: "red"})),
            Plot.text(data, Plot.pointerY({px: "call_oi", py: "strike", dy: -17, frameAnchor: "top-right", fontVariant: "tabular-nums", text: (d) => [`Strike: ${d.strike}`, `Open Interest: ${niceFormat(d.call_oi + (-1 * d.put_oi))}`].join("   ")}))
            ]
        });


    // ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    const volume_bar = Plot.plot({
        width: bar_width,
        height: bar_height,
        // aspectRatio: 1,
        // inset: 10,
        x: {
            label: "Volume",
            labelAnchor: "center",
            grid: true,
            reverse: false,
            nice:true,
            tickFormat: d3.format("~s"),
        },
        y: {
            labelAnchor:"top",
            label: "",
            grid: true,
            padding: bar_padding, 
            tickSpacing: 50,
            reverse:true, 
            nice:true,
            tickFormat: (d, i) => i % strikes === 0 ? d : ""
        },
        // facet: { data: data, y: "strike", columns: 3},
        marks: [
            // Plot.frame(),
            Plot.barX(data,{y: "strike", x: "call_volume",fill: "green", opacity: 0.9}),
            Plot.barX(data,{y: "strike", x: "put_volume",fill: "red", opacity: 0.9}),
            Plot.dot(data, Plot.pointerY({x: "call_volume", y: "strike", stroke: "red"})),
            Plot.dot(data, Plot.pointerY({x: "put_volume", y: "strike", stroke: "red"})),
            Plot.ruleY(data, Plot.pointerY({px: "call_volume", y: "strike", stroke: "red"})),
            Plot.text(data, Plot.pointerY({px: "call_volume", py: "strike", dy: -17, frameAnchor: "top-right", fontVariant: "tabular-nums", text: (d) => [`Strike: ${d.strike}`, `Volume: ${niceFormat(d.call_volume +(-1 * d.put_volume) )}`].join("   ")}))
            ]
        });
        
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    const gamma_bar = Plot.plot({
            width: bar_width ,
            height: bar_height,
            // aspectRatio: 1,
            // inset: 0,
            // make the text larger and legible,
            x: {
                label: "Gamma Exposure",
                labelAnchor: "center",
                grid: true,
                reverse: false,
                nice:true,
                padding: 0.5,
                tickFormat: d3.format("~s"),
                
            },
            y: {
                labelAnchor:"top",
                label: "",
                grid: true,
                padding: bar_padding, 
                tickSpacing: 50,
                reverse:true, 
                nice:true,
                tickFormat: (d, i) => i % strikes === 0 ? d : "", 
            },
            // facet: { data: data, y: "strike", columns: 3},
            marks: [
                // Plot.frame(),
                Plot.barX(data,{y: "strike", x: "gamma",fill: d => d.gamma > 0 ? "green" : "red",}),
                // Plot.crosshair(data, {x: "gamma", y: "strike", textFill:'black'}),
                Plot.dot(data, Plot.pointerY({x: "gamma", y: "strike", stroke: "red"})),
                Plot.ruleY(data, Plot.pointerY({px: "gamma", y: "strike", stroke: "red"})),
                Plot.text(data, Plot.pointerY({px: "gamma", py: "strike", dy: -17, frameAnchor: "top-right", fontVariant: "tabular-nums", text: (d) => [`Strike: ${d.strike}`, `Exposure: ${niceFormat(d.gamma)}`].join("   ")}))
            ]
        });

    // ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    const vanna_bar = Plot.plot({
        width: bar_width,
        height: bar_height,
        // aspectRatio: 1,
        // inset: 10,
        x: {
            label: "Vanna Exposure",
            labelAnchor: "center",
            grid: true,
            reverse: false,
            nice:true,
            tickFormat: d3.format("~s"),
        },
        y: {
            labelAnchor:"top",
            label: "",
            grid: true,
            padding: bar_padding, 
            tickSpacing: 50,
            reverse:true, 
            nice:true, 
            tickFormat: (d, i) => i % strikes === 0 ? d : ""
            
        },
        // facet: { data: data, y: "strike", columns: 3},
        marks: [
            // Plot.frame(),
            Plot.barX(data,{y: "strike", x: "vanna",fill: d => d.vanna > 0 ? "green" : "red",}),
            Plot.dot(data, Plot.pointerY({x: "vanna", y: "strike", stroke: "red"})),
            Plot.ruleY(data, Plot.pointerY({px: "vanna", y: "strike", stroke: "red"})),
            Plot.text(data, Plot.pointerY({px: "vanna", py: "strike", dy: -17, frameAnchor: "top-right", fontVariant: "tabular-nums", text: (d) => [`Strike: ${d.strike}`, `Exposure: ${niceFormat(d.vanna)}`].join("   ")}))
            ]
        });
    
        // openInterest_bar.setAttribute("font-size",  Math.min(12, Math.max(12, window.innerWidth / 10)));
        d3.select("#p7-1").append(() => openInterest_bar);
        d3.select("#p7-2").append(() => volume_bar);
        d3.select("#p7-3").append(() => gamma_bar);
        d3.select("#p7-4").append(() => vanna_bar);

    
}


function charts(pricePath, expPath, level_file, title){
    const flip =  d3.json(level_file).then(function(lev_data){
                fp = new Number(lev_data.flip_point);
                green_line = lev_data.green_lines;
                red_line = lev_data.red_lines;
                // console.log(fp)
            
    const qqq_price = d3.csv(pricePath).then(function(pdata) { 
    pdata.forEach(function(pd) {
        pd.Date = new Date(timeParse(pd.Date));
        pd.Open = +pd.Open;
        pd.High = +pd.High;
        pd.Low = +pd.Low;
        pd.Close = +pd.Close;
        pd.Volume = +pd.Volume;
    });
    // Save Min and Max price bounds
    const min_price = d3.extent(pdata, d => d.Low)[0]
    const max_price = d3.extent(pdata, d => d.High)[1]
    // const fp = min_price + (max_price - min_price) * 0.5

    const exp_data = d3.csv(expPath).then(function(data) { 
    data.forEach(function(d) {
            d.gatherdate = new Date(gdateParse(d.gatherdate));
            d.expiry = new Date(ymdParse(d.expiry)); 
            d.timevalue = +d.timevalue;
            d.strike = +d.strike;
            d.gamma = +d.gexp;
            d.delta = +d.dexp;
            d.vanna = +d.vexp;
            d.charm = +d.cexp;
            d.call_volume = +d.call_volume;
            d.put_volume = -d.put_volume;
            d.call_oi = +d.call_oi;
            d.put_oi = -d.put_oi;
            // console.log(d)
        });

    
        // ------------------------------------------------------
        data.sort((a, b) => a.strike - b.strike);
        var c_chart = candleChart(pdata, title, green_line, red_line);
        c_chart.setAttribute("font-size", "1vmin");
        d3.select("#p6").append(() => c_chart);
        
        // ------------------------------------------------------
        // function to update the dropdown 
        function updateDropdown(data){
            var exps = data.map(d => new Date(d.expiry));
            var uniqueDate = [];
            for (var i = 0; i < exps.length; i++){
                if (!isDateInArray(exps[i], uniqueDate)){
                    uniqueDate.push(exps[i]);
                }
            };
            uniqueDate.sort((a, b) => a - b);
            exp_dropdown.selectAll("option").remove();
            uniqueDate.forEach(function(exp) {
                exp_dropdown.append("option").text(exp.toDateString()).property("value", exp);
            });
            return uniqueDate;
        }

        // function to update the plot
        function updatePlot(exp) {
            var filteredData = data.filter(d => d.expiry.getTime() === exp.getTime());
            // filteredData = filteredData.filter(d => d.call_volume > 0 | d.put_volume < 0);
            // Exclude the strikes where both call and put volume are zero
            // filteredData = filteredData.filter(d => d.call_volume > 0 | d.put_volume < 0);
            d3.select("#p7-1").selectAll("*").remove();
            d3.select("#p7-2").selectAll("*").remove();
            d3.select("#p7-3").selectAll("*").remove();
            d3.select("#p7-4").selectAll("*").remove();
            var uniqueStrike = [... new Set(filteredData.map(d => d.strike))];
            barChart(filteredData, uniqueStrike.length);

        }

        // Function to handle the change event
        function handleChange(event) {
            var exp = new Date(this.value);
            updatePlot(exp);
        }

        // update the plot
        var ud = updateDropdown(data);
        // update the plot with the first date in the uniqueDate array
        updatePlot(ud[0]);
        // updatePlot(ud[ud.length - 1]);
        // add event listener to the dropdown
        exp_dropdown.on("change", handleChange);

        }).catch(function(error) {
        console.log(error);
        });


    }).catch(function(error) {
        console.log(error);
    });}).catch(function(error){
        console.log(error);
    });
};



function chartSPY(folder){
    d3.select("#p6").selectAll("*").remove();
    d3.select("#p7-1").selectAll("*").remove();
    d3.select("#p7-2").selectAll("*").remove();
    d3.select("#p7-3").selectAll("*").remove();
    d3.select("#p7-4").selectAll("*").remove();
    const pricePath = folder + '/prices/spy.csv';
    const expPath = folder + '/exposure/spy_exposure.csv';
    const level_file = folder + '/exposure/spy_levels.json';
    charts(pricePath, expPath,level_file, "$SPY");
}


function chartQQQ(folder){
    d3.select("#p6").selectAll("*").remove();
    d3.select("#p7-1").selectAll("*").remove();
    d3.select("#p7-2").selectAll("*").remove();
    d3.select("#p7-3").selectAll("*").remove();
    d3.select("#p7-4").selectAll("*").remove();
    const pricePath = folder + '/prices/qqq.csv';
    const expPath = folder + '/exposure/qqq_exposure.csv';
    const level_file = folder + '/exposure/qqq_levels.json';
    charts(pricePath, expPath, level_file, "$QQQ");
}


function chartIWM(folder){
    d3.select("#p6").selectAll("*").remove();
    d3.select("#p7-1").selectAll("*").remove();
    d3.select("#p7-2").selectAll("*").remove();
    d3.select("#p7-3").selectAll("*").remove();
    d3.select("#p7-4").selectAll("*").remove();
    const pricePath = folder + '/prices/iwm.csv';
    const expPath = folder + '/exposure/iwm_exposure.csv';
    const level_file = folder + '/exposure/iwm_levels.json';
    charts(pricePath, expPath, level_file, "$IWM");
}


function chartVXX(folder){
    d3.select("#p6").selectAll("*").remove();
    d3.select("#p7-1").selectAll("*").remove();
    d3.select("#p7-2").selectAll("*").remove();
    d3.select("#p7-3").selectAll("*").remove();
    d3.select("#p7-4").selectAll("*").remove();
    const pricePath = folder + '/prices/vxx.csv';
    const expPath = folder + '/exposure/vxx_exposure.csv';
    const level_file = folder + '/exposure/vxx_levels.json';
    charts(pricePath, expPath, level_file, "$VXX");
}

chartSPY('../data');




// // Append Unique Expiration Dates to the dropdown 
// var exps = data.map(d => new Date(d.expiry));
// var uniqueDate = [];
// for (var i = 0; i < exps.length; i++){
//     if (!isDateInArray(exps[i], uniqueDate)){
//         uniqueDate.push(exps[i]);
//     }
// };
// uniqueDate.sort((a, b) => a - b);
// exp_dropdown.selectAll("option").remove();
// // Append the unique dates to the dropdown
// uniqueDate.forEach(function(date) {
//     exp_dropdown.append("option").text(date).property("value", date);
// });

// // Update the plot when the dropdown changes
// exp_dropdown.on("change", function() {
// // Filter the data by the selected date
// var filteredData = data.filter(d => d.expiry === new Date(this.value));
// console.log(filteredData);
// barChart(filteredData, min_price, max_price);
// });


// // Filter the data by the first date in the uniqueDate array
// var filteredData = data.filter(d => d.expiry === uniqueDate[0]);
// barChart(filteredData, min_price, max_price);