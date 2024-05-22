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


var csv_path = '../data/prices/close.csv';
// Log the data to the console and handle any errors
let close_prices = d3.csv(csv_path).then(function(data) {
    // console.log(data.columns);    
    return data;
}).catch(function(error) {
    console.log(error);
});

  
const gridOptionsEM = {
      rowData: [],
      columnDefs: columndefsEM,
      rowSelection:'single',
      // onSelectionChanged: showEM,
  };
// Set Up the grid after the page has loaded 
document.addEventListener('DOMContentLoaded', () => {
  const gridDiv = document.querySelector('#em_grid');
  gridApi = agGrid.createGrid(gridDiv, gridOptionsEM);

  fetch('../data/exp_move/em.json')
      .then(response => response.json())
      .then((data) => gridApi.setGridOption('rowData', data));
    
});

