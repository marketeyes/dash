
// Format Date Function
var formatDate = d3.timeFormat("%A %B %d, %Y");
var formatUTC = d3.utcFormat("%Y-%m-%d");
var quidkDate = d3.timeFormat("%m/%d");
var band_slider = d3.select("#band-slider").append("input").attr("type", "range").attr("min", 1).attr("max", 50).attr("value", 20);


function daily_candle_chart(data, title, n=20){
    // set flip to the last close
    const candles = Plot.plot({
        // inset: 10,
        width: Math.max(400, window.innerWidth),
        height: Math.min(400, window.innerHeight),
        marginLeft: 50,
        marginRight: 25,
        x: {
            x: "Date",
            // domain: d3.utcDays(...d3.extent(data, (d) => d.Date)).filter((d) => d.getUTCDay() > 0 && d.getUTCDay() < 6),
          // Monday ticks
          ticks: d3.utcMondays(...d3.extent(data, (d) => d.Date)),
        },
        y: {
            label: title + " Price",
            grid:true,
            padding: 0.5,
            // domain: [d3.min(data, d => d.Low) - 1, d3.max(data, d => d.High)+ 2],
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
            Plot.text(data, Plot.pointerX({px: "Date", py: "Close", dy: -17, frameAnchor: "top-right", fontVariant: "tabular-nums", text: (d) => [`Date: ${formatDate(d.Date)}`, `Close: \$${d.Close.toFixed(2)}`].join("   ")})),
            // Plot.lineY(data, Plot.windowY({k: 10, fn: d3.mean, stroke: "black"}, {x: "Date", y: "Close"})),
            Plot.lineY(data, Plot.mapY(Plot.bollinger({n: n, k: -2}), {x: "Date", y: "Close", stroke: "red"})),
            Plot.lineY(data, Plot.mapY(Plot.bollinger({n: n, k: 0}), {x: "Date", y: "Close", stroke: "white"})),
            Plot.lineY(data, Plot.mapY(Plot.bollinger({n: n, k: 2}), {x: "Date", y: "Close", stroke: "green"})),

          ]
    
      });

    return candles
}

var sidePanel = d3.select("#text-box-em").append("div");
function em_text(stock){
    d3.json("../data/contracts/em_ext.json").then(function(data) {
        data.forEach(function(d) {
            d.stock = d.stock;
            d.expiry = new Date(d.expiry);
            d.last_close = +d.stk_price;
            d.em = +d.em;
            d.pct_change = +d['%'];
            return d;
            }); // forEach Loop 

            var filteredData = data.filter(d => d.stock === stock);
            var sidePanelData = filteredData.map(d => d);
            sidePanel.html("");
            sidePanel.append("p").text(
                "$" + stock.toUpperCase() + " " +
                "Pricing in ± $" + sidePanelData[0].em + 
                " ( ±" + (100 * round(sidePanelData[0].pct_change)) + "%)" + 
                " by " + quidkDate(sidePanelData[0].expiry)
            ).attr("class", "card-text");
            sidePanel.append("p").text("Last Close: $" + sidePanelData[0].last_close);

    }).catch(function(error) {
        console.log(error);
    });

};



candle_selector = d3.select("#candle-selection").append("select");

d3.json('../data/prices/ohlcv.json').then(function(data){
    stocks = Object.keys(data);
    stocks.forEach(function(stock){
        candle_selector.append("option").text("$" + stock.toUpperCase()).property("value", stock);
    })

    function updateCandle(stock, n = 10){
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
        // console.log(candle_data);
        var title = stock.toUpperCase();
        var candle_chart = daily_candle_chart(candle_data, title);
        d3.select("#candles-chart").append(() => candle_chart);
        sidePanel.selectAll("*").remove();
        em_text(stock);

    }
    


    // update the plot with the selection 
    candle_selector.on("change", function(){
        var stock = d3.select(this).property("value");
        updateCandle(stock);
    });

    // update the bollinger band
    band_slider.on("input", function(){
        var stock = candle_selector.property("value");
        var n = this.value;
        updateCandle(stock, n);
    });

    // initial plot
    var stock = candle_selector.property("value");
    updateCandle(stock);


}).catch(function(error){
    console.log(error)
});