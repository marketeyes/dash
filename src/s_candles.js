
var margin = {top: 20, right: 10, bottom: 30, left: 180},
    width = window.innerWidth - margin.left - margin.right,
    height = window.innerHeight - margin.top - margin.bottom; 

var timeParse = d3.timeParse("%Y-%m-%dT%H:%M:%S");
var gdateParse = d3.timeParse("%Y-%m-%d %H:%M:%S");
var ymdParse = d3.timeParse("%Y-%m-%d");

function candleChart(data, title, gl, rl){
    // set flip to the last close
    const candles = Plot.plot({
        inset: 10,
        width: Math.min(1500, window.innerWidth - 100),
        height: Math.min(500, window.innerHeight - 100),
        aspectRatio: 1,
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
            Plot.frame(),
            Plot.ruleY(gl, {stroke: "green", strokeWidth: 3, strokeDasharray: "3,2"}),
            Plot.ruleY(rl, {stroke: "red", strokeWidth: 3, strokeDasharray: "3,2"}),
            // Plot.ruleY(data, Plot.selectFirst({y: d => d.Open,stroke: 'grey',strokeDasharray: "3,2",})),
            Plot.ruleX(data, {
                x: "Date",
                y1: "Low",
                y2: "High",
                strokeWidth: 1,
            }),
            Plot.ruleX(data, {
              x: "Date",
              y1: "Open",
              y2: "Close",
              stroke: d => Math.sign(d.Close - d.Open),
              strokeWidth: 2,
              strokeLinecap: "round",
            }),
            Plot.crosshairY(data, {x: "Date", y: "Close", textFill:'black'}),
            // Plot.bollingerY(data, {x: "Date", y: "Close", stroke: "none", n: 4, k: 2}),
            // Plot.linearRegressionY(data, {x: "Date", y: "Close", stroke: "grey", inset: 10}),
          ]
    
      })
    return candles
}

function barChart(data, min_price, max_price){  
    const gamma_bar = Plot.plot({
        width: Math.min(500, window.innerWidth - 100),
        height: Math.min(500, window.innerHeight - 100),
        aspectRatio: 1,
        inset: 10,
        x: {
            label: "Gamma Exposure (Millions)",
            labelAnchor: "center",
            grid: true,
            reverse: false,
            nice:true,
            padding: 0.5,
            tickFormat: d3.format("~s"),

        },
        y: {
            labelAnchor:"top",
            label: "strike",
            grid: true,
            padding: 0.5,
            tickSpacing: 50,
            reverse:true, 
            nice:true
        },
        // facet: { data: data, y: "strike", columns: 3},
        marks: [Plot.frame(),Plot.barX(data, {y: "strike", x: "gamma",fill: d => d.gamma > 0 ? "green" : "red",}),]
        });
    const delta_bar = Plot.plot({
        width: Math.min(500, window.innerWidth - 100),
        height: Math.min(500, window.innerHeight - 100),
        aspectRatio: 1,
        inset: 10,
        x: {
            label: "Delta Exposure (Millions)",
            labelAnchor: "center",
            grid: true,
            reverse: false,
            nice:true,
            tickFormat: d3.format("~s"),
        },
        y: {
            labelAnchor:"top",
            label: "strike",
            grid: true,
            padding: 0.5,
            tickSpacing: 50,
            reverse:true, 
            nice:true
        },
        // facet: { data: data, y: "strike", columns: 3},
        marks: [Plot.frame(),Plot.barX(data, {y: "strike", x: "delta",fill: d => d.delta > 0 ? "green" : "red",}),]
        });
    const vanna_bar = Plot.plot({
        width: Math.min(500, window.innerWidth - 100),
        height: Math.min(500, window.innerHeight - 100),
        aspectRatio: 1,
        inset: 10,
        x: {
            label: "Vanna Exposure (Millions)",
            labelAnchor: "center",
            grid: true,
            reverse: false,
            nice:true,
            tickFormat: d3.format("~s"),
        },
        y: {
            labelAnchor:"top",
            label: "strike",
            grid: true,
            padding: 0.5,
            tickSpacing: 50,
            reverse:true, 
            nice:true
        },
        // facet: { data: data, y: "strike", columns: 3},
        marks: [Plot.frame(),Plot.barX(data, {y: "strike", x: "vanna",fill: d => d.vanna > 0 ? "green" : "red",}),]
        });
    const charm_bar = Plot.plot({
        width: Math.min(500, window.innerWidth - 100),
        height: Math.min(500, window.innerHeight - 100),
        aspectRatio: 1,
        inset: 10,
        x: {
            label: "Charm Exposure (Millions)",
            labelAnchor: "center",
            grid: true,
            reverse: false,
            nice:true,
            tickFormat: d3.format("~s"),
        },
        y: {
            labelAnchor:"top",
            label: "strike",
            grid: true,
            padding: 0.5,
            tickSpacing: 50,
            reverse:true, 
            nice:true
        },
        // facet: { data: data, y: "strike", columns: 3},
        marks: [Plot.frame(),Plot.barX(data, {y: "strike", x: "charm",fill: d => d.charm > 0 ? "green" : "red",}),]
        });

    d3.select("#p7-1").append(() => gamma_bar);
    d3.select("#p7-2").append(() => delta_bar);
    d3.select("#p7-3").append(() => vanna_bar);
    d3.select("#p7-4").append(() => charm_bar);

    
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
            // console.log(d)
        });

        // sort data by strike
        data.sort((a, b) => a.strike - b.strike);
        // Min Expiration Date for line chart     
        d3.select("#p6").append(() => candleChart(pdata, title, green_line, red_line));
        barChart(data, min_price, max_price);

        // Plotly.newPlot('p8', lineChart(data));
        }).catch(function(error) {
        console.log(error);
        });


    }).catch(function(error) {
        console.log(error);
    });}).catch(function(error){
        console.log(error);
    });
}



function chartSPY(){
    d3.select("#p6").selectAll("*").remove();
    d3.select("#p7-1").selectAll("*").remove();
    d3.select("#p7-2").selectAll("*").remove();
    d3.select("#p7-3").selectAll("*").remove();
    d3.select("#p7-4").selectAll("*").remove();
    const pricePath = 'data/prices/spy.csv';
    const expPath = 'data/exposure/spy_exposure.csv';
    const level_file = 'data/exposure/spy_levels.json';
    charts(pricePath, expPath,level_file, "$SPY");
}


function chartQQQ(){
    d3.select("#p6").selectAll("*").remove();
    d3.select("#p7-1").selectAll("*").remove();
    d3.select("#p7-2").selectAll("*").remove();
    d3.select("#p7-3").selectAll("*").remove();
    d3.select("#p7-4").selectAll("*").remove();
    const pricePath = 'data/prices/qqq.csv';
    const expPath = 'data/exposure/qqq_exposure.csv';
    const level_file = 'data/exposure/qqq_levels.json';
    charts(pricePath, expPath, level_file, "$QQQ");
}


function chartIWM(){
    d3.select("#p6").selectAll("*").remove();
    d3.select("#p7-1").selectAll("*").remove();
    d3.select("#p7-2").selectAll("*").remove();
    d3.select("#p7-3").selectAll("*").remove();
    d3.select("#p7-4").selectAll("*").remove();
    const pricePath = 'data/prices/iwm.csv';
    const expPath = 'data/exposure/iwm_exposure.csv';
    const level_file = 'data/exposure/iwm_levels.json';
    charts(pricePath, expPath, level_file, "$IWM");
}


function chartVXX(){
    d3.select("#p6").selectAll("*").remove();
    d3.select("#p7-1").selectAll("*").remove();
    d3.select("#p7-2").selectAll("*").remove();
    d3.select("#p7-3").selectAll("*").remove();
    d3.select("#p7-4").selectAll("*").remove();
    const pricePath = 'data/prices/vxx.csv';
    const expPath = 'data/exposure/vxx_exposure.csv';
    const level_file = 'data/exposure/vxx_levels.json';
    charts(pricePath, expPath, level_file, "$VXX");
}


chartSPY();