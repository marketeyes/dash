// file: em_ext.json 
// Create a plot that shows the current close and the projected close for the next expiration dates based on the dates in the em_ext.json file

// Create a Dropbox for each stock in the data
var stockDrop = d3.select("#candle-selection");

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

            // Create a function to update the side panel
            function updateSidePanel(stock) {
                var filteredData = data.filter(d => d.stock === stock);
                var sidePanelData = filteredData.map(d => d);
                sidePanel.html("");
                sidePanel.append("p").text(
                    "$" + stock + " " +
                    "Pricing in ± $" + sidePanelData[0].em + 
                    " ( ±" + (100 * round(sidePanelData[0].pct_change)) + "%)" + 
                    " by " + formatDate(sidePanelData[0].expiry)
                ).attr("class", "card-text");
                sidePanel.append("p").text("Last Close: $" + sidePanelData[0].last_close);
            }; // updateSidePanel function

            // Create a function to handle the change event
            function optionChanged(stock) {
                updateSidePanel(stock);
            }; // optionChanged function


            // Call the optionChanged function
            d3.select("candle-selector").on("change", function() {
                var stock = d3.select(this).property("value");
                console.log(stock)
                // optionChanged(stock);
            }); // on change event





        }).catch(function(error) {
        console.log(error);
    });}).catch(function(error) {
    console.log(error);
}); // d3.json function