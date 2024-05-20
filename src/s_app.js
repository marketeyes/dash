
// level_file = 'data/exposure/spy_levels.json'
// function levels(level_file){
//     d3.json(level_file).then(function(data){
//         console.log(data.flip_point)
//     }).catch(function(error){
//         console.log(error)
//     })
// }

// levels(level_file)



// function heatMap(data, min_price, max_price){
//     const scatter = Plot.plot({
//       width: width/5,
//       height: height,
//       x: {
//           label: "Time",
//           labelAnchor: "center",
//           reverse:true,
//           type:'time',
//       },
//       y: {
//           label: "",
//           orient: "right", 
//           domain: [min_price+1, max_price+1],
//           padding: 0.5,   
//       },
//       color: {
//           type: "diverging",
//           label: "Gamma",
//           // put the legend on the bottom and format the text 
//       },
//       marks: [
//           Plot.axisY({anchor: "right",  labelAnchor: "center"}),
//           Plot.axisX({anchor: "top",  tickSpacing: 80,}),
//           // Plot.raster(data, {x: "gatherdate", y: "strike", fill: "gamma", fillOpacity: 0.6, interpolate: "random-walk"}),
//           Plot.raster(data, {x: "gatherdate", y: "strike", fill: "gamma", fillOpacity: 0.6, interpolate: "nearest"}),
//           // Plot.contour(data, {x: "gatherdate", y: "strike", fill: "gamma", interpolate: "random-walk"}),            
//       ]
//       });
//       return scatter;
// }

// var margin = {top: 20, right: 10, bottom: 30, left: 180},
//     width = window.innerWidth - margin.left - margin.right,
//     height = window.innerHeight - margin.top - margin.bottom; 
// var timeParse = d3.timeParse("%Y-%m-%dT%H:%M:%S");
// var gdateParse = d3.timeParse("%Y-%m-%d %H:%M:%S");
// var ymdParse = d3.timeParse("%Y-%m-%d");
// function candleChart(data, title){
//     const candles = Plot.plot({
//         inset: 10,
//         width: Math.min(1500, window.innerWidth - 100),
//         height: Math.min(500, window.innerHeight - 100),
//         aspectRatio: 1,
//         x: {
//             x: "Date",
//             label: null,
//             type: "time",
//         },
//         y: {
//             label: title + " Price",
//             grid:true,
//             padding: 0.5,
//         },
//         color: {domain: [-1, 0, 1], range: ["#e41a1c", "currentColor", "#4daf4a"]},
//         marks: [
//             Plot.frame(),
//             // Plot.ruleY(data, Plot.selectFirst({y: d => d.Open,stroke: 'grey',strokeDasharray: "3,2",})),
//             Plot.ruleX(data, {
//                 x: "Date",
//                 y1: "Low",
//                 y2: "High",
//                 strokeWidth: 1,
//             }),
//             Plot.ruleX(data, {
//               x: "Date",
//               y1: "Open",
//               y2: "Close",
//               stroke: d => Math.sign(d.Close - d.Open),
//               strokeWidth: 2,
//               strokeLinecap: "round",
//             }),
//             // Plot.crosshairX(data, {x: "Date", y: "Close", textFill:'black'}),
//             // Plot.bollingerY(data, {x: "Date", y: "Close", stroke: "none", n: 4, k: 2}),
//             Plot.linearRegressionY(data, {x: "Date", y: "Close", stroke: "steelblue"}),
//           ]
    
//       })
//     return candles
// }

// function barChart(data, min_price, max_price){  
//     const gamma_bar = Plot.plot({
//         width: Math.min(500, window.innerWidth - 100),
//         height: Math.min(500, window.innerHeight - 100),
//         aspectRatio: 1,
//         inset: 10,
//         x: {
//             label: "Gamma Exposure",
//             labelAnchor: "center",
//             grid: true,
//             tickFormat: d3.format("~s"),
//             type:"linear",
//             domain: [d3.min(data, d => d.gamma), d3.max(data, d => d.gamma)],
//         },
//         y: {
//             labelAnchor:"top",
//             label: "strike",
//             grid: true,
//             padding: 0.5,
//             tickSpacing: 50,
//             reverse:true, 
//             nice:true
//         },
//         marks: [
//             Plot.frame(),
//             Plot.barX(data, {y: "strike", x: "gamma",fill: d => d.gamma > 0 ? "green" : "red",}),
//         ]
//         });
//     const delta_bar = Plot.plot({
//         width: Math.min(500, window.innerWidth - 100),
//         height: Math.min(500, window.innerHeight - 100),
//         aspectRatio: 1,
//         inset: 10,
//         x: {
//             label: "Delta Exposure",
//             labelAnchor: "center",
//             grid: true,
//             tickFormat: d3.format("~s"),
//             type:"linear",
//             domain: [d3.min(data, d => d.delta), d3.max(data, d => d.delta)],
//         },
//         y: {
//             labelAnchor:"top",
//             label: "strike",
//             grid: true,
//             padding: 0.5,
//             tickSpacing: 50,
//             reverse:true, 
//             nice:true
//         },
//         marks: [
//             Plot.frame(),
//             Plot.barX(data, {y: "strike", x: "delta",fill: d => d.delta > 0 ? "green" : "red",}),
//         ]
//         });
//     const vanna_bar = Plot.plot({
//         width: Math.min(500, window.innerWidth - 100),
//         height: Math.min(500, window.innerHeight - 100),
//         aspectRatio: 1,
//         inset: 10,
//         x: {
//             label: "Vanna Exposure",
//             labelAnchor: "center",
//             grid: true,
//             tickFormat: d3.format("~s"),
//             type:"linear",
//             domain: [d3.min(data, d => d.vanna), d3.max(data, d => d.vanna)],
//         },
//         y: {
//             labelAnchor:"top",
//             label: "strike",
//             grid: true,
//             padding: 0.5,
//             tickSpacing: 50,
//             reverse:true, 
//             nice:true
//         },
//         marks: [
//             Plot.frame(),
//             Plot.barX(data, {y: "strike", x: "vanna",fill: d => d.vanna > 0 ? "green" : "red",}),
//         ]
//         });
//     const charm_bar = Plot.plot({
//         width: Math.min(500, window.innerWidth - 100),
//         height: Math.min(500, window.innerHeight - 100),
//         aspectRatio: 1,
//         inset: 10,
//         x: {
//             label: "Charm Exposure",
//             labelAnchor: "center",
//             grid: true,
//             tickFormat: d3.format("~s"),
//             type:"linear",
//             domain: [d3.min(data, d => d.charm), d3.max(data, d => d.charm)],
//         },
//         y: {
//             labelAnchor:"top",
//             label: "strike",
//             grid: true,
//             padding: 0.5,
//             tickSpacing: 50,
//             reverse:true, 
//             nice:true
//         },
//         marks: [
//             Plot.frame(),
//             Plot.barX(data, {y: "strike", x: "charm",fill: d => d.charm > 0 ? "green" : "red",}),
//         ]
//         });

//     d3.select("#p7-1").append(() => gamma_bar);
//     d3.select("#p7-2").append(() => delta_bar);
//     d3.select("#p7-3").append(() => vanna_bar);
//     d3.select("#p7-4").append(() => charm_bar);

    
// }


// function charts(pricePath, expPath, title){
//     const qqq_price = d3.csv(pricePath).then(function(pdata) { 
//     pdata.forEach(function(pd) {
//         pd.Date = new Date(timeParse(pd.Date));
//         pd.Open = +pd.Open;
//         pd.High = +pd.High;
//         pd.Low = +pd.Low;
//         pd.Close = +pd.Close;
//         pd.Volume = +pd.Volume;
//     });
//     // Save Min and Max price bounds
//     const min_price = d3.extent(pdata, d => d.Low)[0]
//     const max_price = d3.extent(pdata, d => d.High)[1]

//     const exp_data = d3.csv(expPath).then(function(data) { 
//     data.forEach(function(d) {
//             d.gatherdate = new Date(gdateParse(d.gatherdate));
//             d.expiry = new Date(ymdParse(d.expiry)); 
//             d.timevalue = +d.timevalue;
//             d.strike = +d.strike;
//             d.gamma = +d.gexp;
//             d.delta = +d.dexp;
//             d.vanna = +d.vexp;
//             d.charm = +d.cexp;
//             // console.log(d)
//         });

//         // sort data by strike
//         data.sort((a, b) => a.strike - b.strike);
//         // Min Expiration Date for line chart     
//         d3.select("#p6").append(() => candleChart(pdata, title));
//         barChart(data, min_price, max_price);


//         // Plotly.newPlot('p8', lineChart(data));
//         }).catch(function(error) {
//         console.log(error);
//         });


//     }).catch(function(error) {
//         console.log(error);
//     });}



// function chartSPY(){
//     d3.select("#p6").selectAll("*").remove();
//     d3.select("#p7-1").selectAll("*").remove();
//     d3.select("#p7-2").selectAll("*").remove();
//     d3.select("#p7-3").selectAll("*").remove();
//     d3.select("#p7-4").selectAll("*").remove();
//     const pricePath = 'data/prices/spy.csv';
//     const expPath = 'data/exposure/spy_exposure.csv';
//     charts(pricePath, expPath, "$SPY");
// }


// function chartQQQ(){
//     d3.select("#p6").selectAll("*").remove();
//     d3.select("#p7-1").selectAll("*").remove();
//     d3.select("#p7-2").selectAll("*").remove();
//     d3.select("#p7-3").selectAll("*").remove();
//     d3.select("#p7-4").selectAll("*").remove();
//     const pricePath = 'data/prices/qqq.csv';
//     const expPath = 'data/exposure/qqq_exposure.csv';
//     charts(pricePath, expPath, "$QQQ");
// }


// function chartIWM(){
//     d3.select("#p6").selectAll("*").remove();
//     d3.select("#p7-1").selectAll("*").remove();
//     d3.select("#p7-2").selectAll("*").remove();
//     d3.select("#p7-3").selectAll("*").remove();
//     d3.select("#p7-4").selectAll("*").remove();
//     const pricePath = 'data/prices/iwm.csv';
//     const expPath = 'data/exposure/iwm_exposure.csv';
//     charts(pricePath, expPath, "$IWM");
// }


// function chartVXX(){
//     d3.select("#p6").selectAll("*").remove();
//     d3.select("#p7-1").selectAll("*").remove();
//     d3.select("#p7-2").selectAll("*").remove();
//     d3.select("#p7-3").selectAll("*").remove();
//     d3.select("#p7-4").selectAll("*").remove();
//     const pricePath = 'data/prices/vxx.csv';
//     const expPath = 'data/exposure/vxx_exposure.csv';
//     charts(pricePath, expPath, "$VXX");
// }


// chartSPY();