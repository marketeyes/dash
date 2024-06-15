
// Format Date Function
var formatDate = d3.timeFormat("%A %B %d, %Y");

function daily_candle_chart(data, title){
    // set flip to the last close
    const candles = Plot.plot({
        // inset: 10,
        width: Math.max(400, window.innerWidth),
        height: Math.min(400, window.innerHeight),
        marginLeft: 50,
        marginRight: 25,
        x: {
            x: "Date",
            // type:"time",
            // domain: d3.extent(data, d => d.Date).filter((d) => d.getUTCDay() > 0 && d.getUTCDay() < 6),
            // tickFormat: (d, i) => i % 5 === 0 ? formatDate(d) : "",
            // label: null,
            // domain: d3.utcDays(...d3.extent(data, (d) => d.Date)).filter((d) => d.getUTCDay() > 0 && d.getUTCDay() < 6), 
        },
        y: {
            label: title + " Price",
            grid:true,
            padding: 0.5,
            domain: [d3.min(data, d => d.Low) - 1, d3.max(data, d => d.High)+ 0.5],
        },
        color: {domain: [-1, 0, 1], range: ["#e41a1c", "currentColor", "#4daf4a"]},
        marks: [
            // Plot.frame(),
            // Plot.ruleY(data, Plot.selectFirst({y: d => d.Open,stroke: 'grey',strokeDasharray: "3,2",})),
            Plot.ruleX(data, {
                x: "Date",
                y1: "Low",
                y2: "High",
                strokeWidth: 0.5,
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
            Plot.text(data, Plot.pointerX({px: "Date", py: "Close", dy: -17, frameAnchor: "top-right", fontVariant: "tabular-nums", text: (d) => [`Date: ${formatDate(d.Date)}`, `Close: \$${d.Close.toFixed(2)}`].join("   ")}))

          ]
    
      });

    return candles
}

candle_selector = d3.select("#candle-selection").append("select");

d3.json('../data/prices/ohlcv.json').then(function(data){
    stocks = Object.keys(data);
    stocks.forEach(function(stock){
        candle_selector.append("option").text("$" + stock.toUpperCase()).property("value", stock);
    })

    function updateCandle(stock){
        d3.select("#candles-chart").selectAll("*").remove();
        var candle_data = data[stock];
            candle_data.forEach(function(d){
            d.Date = new Date(d.Date);
            d.Open = +d.Open;
            d.High = +d.High;
            d.Low = +d.Low;
            d.Close = +d.Close;
            d.Volume = +d.Volume;
            return d;
        });
        console.log(candle_data);
        var title = stock.toUpperCase();
        var candle_chart = daily_candle_chart(candle_data, title);
        d3.select("#candles-chart").append(() => candle_chart);

    }
    


    // update the plot with the selection 
    candle_selector.on("change", function(){
        var stock = d3.select(this).property("value");
        updateCandle(stock);
    });

    // initial plot
    var stock = candle_selector.property("value");
    updateCandle(stock);


}).catch(function(error){
    console.log(error)
});