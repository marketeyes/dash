let gridApi;

// Rounding Function 
function round(num) {
    return +(Math.round(num + "e+2")  + "e-2");
}

const columndefsEM = [
    {
      field: 'stock',
      sortable: true,
      valueFormatter: function(params) {
        return "$" + params.value.toUpperCase();
      },
      pinned: "left",
      lockPinned: true,
      cellClass: 'lock-pinned',
      maxWidth: 100,
    },
    {
      field: 'expiry',
      headerName: 'Expiration Date',
      sortable: true, 
        // Format the date
        valueFormatter: function(params) {
            return new Date(params.value).toLocaleDateString();
        }
    },
    {
      field: 'stk_price',
      headerName: 'Last Stock Price',
      sortable: true,
      valueFormatter: function(params) {
        return "$" + params.value.toFixed(2);
      }
    },
    {
      field: 'em',
      headerName: 'Expected Move',
      sortable: true,
      valueFormatter: function(params) {
        return "± $" + params.value.toFixed(2);
      }
    },
    {
      field: '%',
      sortable: true,
      valueFormatter: function(params) {
        return round(100 * params.value) + "%";
      }
    }
];


var csv_path = 'data/prices/close.csv';
// Log the data to the console and handle any errors
let close_prices = d3.csv(csv_path).then(function(data) {
    // console.log(data.columns);    
    return data;
}).catch(function(error) {
    console.log(error);
});


function showEM(){
  const selected_row = gridApi.getSelectedRows();
  const stock = selected_row[0].stock.toUpperCase();
    // console.log(stock);

  // Print the Stock name, and close prices to #section5
  close_prices.then(function(data) {
    // Print the data for the SPECIFIC STOCK to the console
    stock_data = data.map(function(d) {
          return {
              Date: d['Date'],
              Close: d[stock]
          }
      }.bind(stock));


    // console.log(stock_data)
    d3.select('#section5').html('');
    d3.select('#section5').append('h2').text(stock + ':').style('color', 'white').style('font-size', '50px').style('text-align', 'center');

    // Create the SVG
    var margin = {top: 20, right: 0, bottom: 30, left: 150}
      , width = window.innerWidth - margin.left - margin.right // Use the window's width 
      , height = (window.innerHeight - 1000) - margin.top - margin.bottom; // Use the window's height


    var svg = d3.select('#section5').append('svg')
          .attr('width', width - margin.left - margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


    // Parse the date / time
    var parseTime = d3.timeParse('%Y-%m-%d');
      // Set the ranges
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);
      // Define the line
    var valueline = d3.line()
          .x(function(d) { return x(d.Date); })
          .y(function(d) { return y(d.Close); });

      // Scatterplot 
    var scatter = svg.selectAll('dot')
          .data(stock_data)
          .enter().append('circle')
          .attr('r', 5)
          .attr('cx', function(d) { return x(d.Date); })
          .attr('cy', function(d) { return y(d.Close); })
          .style('fill', 'white')
          .style('stroke', 'black')
          .style('stroke-width', '2px');

    // Format the data
    stock_data.forEach(function(d) {
          d.Date = parseTime(d.Date);
          d.Close = +d.Close;
      });
    // Scale the range of the data
    x.domain(d3.extent(stock_data, function(d) { return d.Date; }));
    y.domain([
          d3.min(stock_data, function(d) { return d.Close; }),
          d3.max(stock_data, function(d) { return d.Close; })
      ])
    // Add the valueline path
    svg.append('path')
      .data([stock_data])
      .attr('class', 'line')
      .attr('d', valueline)
      .attr('fill', 'none')
      .on('mouseover', function(d) {
          d3.select(this).attr('fill', 'red');
      })
      .attr('stroke', 'white')
      .on('mouseover', function(d) {
          d3.select(this).attr('stroke', 'red');
      })
      ;

    // add points 
    svg.selectAll('dot')
      .data(stock_data)
      .enter().append('circle')
      .attr('r', 2)
      .attr('cx', function(d) { return x(d.Date); })
      .attr('cy', function(d) { return y(d.Close); })
      .style('fill', 'white')
      .style('stroke-width', '2px');
      

      // Add the X Axis
    svg.append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x));
      // Add the Y Axis
    svg.append('g')
        .call(d3.axisLeft(y));

    var svg2 = d3.select()
    });
}
  
const gridOptionsEM = {
      rowData: [],
      columnDefs: columndefsEM,
      rowSelection:'single',
      onSelectionChanged: showEM,
  };
// Set Up the grid after the page has loaded 
document.addEventListener('DOMContentLoaded', () => {
  const gridDiv = document.querySelector('#em_grid');
  gridApi = agGrid.createGrid(gridDiv, gridOptionsEM);

  fetch('data/em.json')
      .then(response => response.json())
      .then((data) => gridApi.setGridOption('rowData', data));
    
});

