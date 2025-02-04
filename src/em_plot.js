// Rounding Function 
function round(num, precision = 2) {
    return +(Math.round(num + "e+" + precision)  + "e-" + precision);
}

var formatDate = d3.timeFormat("%b %d, %Y");

// Load data to determine which stocks have the highest expected moves
document.addEventListener('DOMContentLoaded', function() {
    d3.json("../data/contracts/em_ext.json").then(function(data) {
        // Sort data by date to ensure we get the closest expiration first
        data.sort((a, b) => new Date(a.expiry) - new Date(b.expiry));

        // Function to get unique stocks with their closest expiry data
        const uniqueStocks = {};
        data.forEach(stockData => {
            if (!uniqueStocks[stockData.stock]) {
                uniqueStocks[stockData.stock] = stockData;
            }
        });

        // Sort by expected move (em) for the closest expiry date, descending order
        const sortedStocks = Object.values(uniqueStocks).sort((a, b) => b.em - a.em);

        // Create buttons for the top 5 unique stocks based on expected move for closest expiry
        const stockButtons = d3.select("#stock-buttons");
        if (!stockButtons.node()) {
            console.error("Element with id 'stock-buttons' not found in the DOM.");
            return;
        }
        const usedStocks = new Set(); // Keep track of stocks we've added buttons for

        sortedStocks.forEach(function(stockData, index) {
            if (usedStocks.size < 5) { // Only add up to 5 buttons
                if (!usedStocks.has(stockData.stock)) { // Check if the stock has already been added
                    usedStocks.add(stockData.stock);
                    stockButtons.append("button")
                        .attr("class", "btn btn-primary m-1")
                        .text(stockData.stock.toUpperCase())
                        .on("click", function() {
                            loadStockChart(stockData.stock);
                        });
                }
            }
        });

        // Check if we've added less than 5 buttons due to lack of unique stocks
        if (usedStocks.size < 5) {
            console.warn("Not enough unique stocks to display 5 buttons.");
        }

        // Add a text input for manual stock entry
        stockButtons.append("input")
            .attr("type", "text")
            .attr("id", "manual-stock-input")
            .attr("placeholder", "Enter stock symbol")
            .on("keypress", function(e) {
                if (e.key === 'Enter') {
                    loadStockChart(this.value.toLowerCase());
                }
            });

        // Button to submit manual stock entry
        stockButtons.append("button")
            .attr("class", "btn btn-secondary m-1")
            .text("Search")
            .on("click", function() {
                const stock = d3.select("#manual-stock-input").property("value").toLowerCase();
                loadStockChart(stock);
            });

        // Function to load and display stock chart and expected move info
        function loadStockChart(stock) {
            const stock_data_full = data.find(d => d.stock === stock);
            const stockData = data.find(d => d.stock === stock && new Date(d.expiry) >= new Date());
            if (!stockData) {
                const textElement = d3.select("#text-box-em");
                if (!textElement.node()) {
                    console.error("Element with id 'text-box-em' not found in the DOM.");
                    return;
                }
                textElement.text("Stock not found or no future expiration.");
                const chartElement = d3.select("#candles-chart");
                if (!chartElement.node()) {
                    console.error("Element with id 'candles-chart' not found in the DOM.");
                    return;
                }
                chartElement.selectAll("*").remove();
                return;
            }
        
            // Update side panel with expected move information
            const sidePanel = d3.select("#text-box-em");
            if (!sidePanel.node()) {
                console.error("Element with id 'text-box-em' not found in the DOM.");
                return;
            }
            sidePanel.html("");
            sidePanel.append("p").text(
                "$" + stock.toUpperCase() + " " +
                "Pricing in ± $" + round(stockData.em, 2) + // Round to 2 decimal points
                " ( ±" + (round(stockData.empct * 100, 0)) + "%)" + // Round percentage to whole number
                " by " + formatDate(new Date(stockData.expiry)) // Format the date
            );
        
            // Load and display OHLCV data for the stock
            d3.json('../data/prices/ohlcv.json').then(function(ohlcvData){
                const candleData = ohlcvData[stock] ? ohlcvData[stock].map(d => ({
                    ...d,
                    Date: new Date(d.Date),
                    Open: +d.Open,
                    High: +d.High,
                    Low: +d.Low,
                    Close: +d.Close,
                    Volume: +d.Volume
                })) : [];
        
                // Calculate upper and lower expected move limits based on the last price and 'em'
                const lastPrice = stockData.stk_price;
                const upperLimit = lastPrice + stock_data_full.em;
                const lowerLimit = lastPrice - stock_data_full.em;
                const new_dates = stock_data_full.expiry;
        
                const candles = Plot.plot({
                    width: Math.max(400, window.innerWidth),
                    height: Math.min(400, window.innerHeight),
                    marginLeft: 50,
                    marginRight: 25,
                    x: {
                        x: "Date",
                    },
                    y: {
                        label: stock.toUpperCase() + " Price",
                        grid: true,
                        padding: 0.5,
                        // Adjusting domain to include expected move limits if they exceed current price range
                        domain: [Math.min(d3.min(candleData, d => d.Low), lowerLimit), Math.max(d3.max(candleData, d => d.High), upperLimit)],
                    },
                    color: {domain: [-1, 0, 1], range: ["#e41a1c", "currentColor", "#4daf4a"]},
                    marks: [
                        Plot.ruleX(candleData, {x: "Date", y1: "Low", y2: "High", strokeWidth: 0.5}),
                        Plot.ruleX(candleData, {
                          x: "Date",
                          y1: "Open",
                          y2: "Close",
                          stroke: d => Math.sign(d.Close - d.Open),
                          strokeWidth: 2,
                          strokeLinecap: "round",
                        }),
                        Plot.dot(candleData, Plot.pointerX({x: "Date", y: "Close", stroke: "yellow"})),
                        Plot.ruleY(candleData, Plot.pointerY({px: "Date", y: "Close", stroke: "red"})),
                        Plot.text(candleData, Plot.pointerX({px: "Date", py: "Close", dy: -17, frameAnchor: "top-right", fontVariant: "tabular-nums", text: (d) => [`Date: ${formatDate(d.Date)}`, `Close: \$${d.Close.toFixed(2)}`].join("   ")})),
                        // Adding lines for expected move limits
                        Plot.ruleY([{y: upperLimit, x: new Date()}], {stroke: "green", strokeWidth: 2}),
                        Plot.ruleY([{y: lowerLimit, x: new Date()}], {stroke: "red", strokeWidth: 2})
                    ]
                });

                const chartElement = d3.select("#candles-chart");
                if (!chartElement.node()) {
                    console.error("Element with id 'candles-chart' not found in the DOM.");
                    return;
                }
                chartElement.selectAll("*").remove();
                chartElement.append(() => candles);
            }).catch(function(error) {
                console.error('Error fetching OHLCV data:', error);
                const textElement = d3.select("#text-box-em");
                if (!textElement.node()) {
                    console.error("Element with id 'text-box-em' not found in the DOM.");
                    return;
                }
                textElement.text("An error occurred while fetching data.");
            });
        }

        // Load chart for the first stock by default if any
        if (sortedStocks.length > 0) {
            loadStockChart(sortedStocks[0].stock);
        } else {
            const textElement = d3.select("#text-box-em");
            if (!textElement.node()) {
                console.error("Element with id 'text-box-em' not found in the DOM.");
                return;
            }
            textElement.text("No stock data available.");
        }
    }).catch(function(error) {
        console.log(error);
    });
});
