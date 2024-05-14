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


const gridOptionsEM = {
    rowData: [],
    columnDefs: columndefsEM,
};


em_grid = agGrid.createGrid(document.querySelector('#em_grid'), gridOptionsEM);

fetch('data/em.json')
    .then(response => response.json())
    .then((data) => em_grid.setGridOption('rowData', data));