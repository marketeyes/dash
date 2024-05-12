// 
// Grid API: Access to Grid API methods
let gridApi;

// Row Data Interface

// Grid Options: Contains all of the grid configurations
const gridOptions = {
  // Data to be displayed
  rowData: [],
  // Columns to be displayed (Should match rowData properties)
  columnDefs: [
    {
        field: 'stock',
        sortable: true,
        headerName: 'Stock',
        valueFormatter: function(params) {
          return "$" + params.value.toUpperCase();
        },
        maxWidth: 125,
        pinned: 'left',
        lockPinned: true,
        cellClass: 'lock-pinned'
    },
    {
        field: 'total_vol',
        sortable: true,
        headerName: 'Total Volume',
        valueFormatter: function(params) {
          return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        maxWidth: 165,
    },
    {
        field: 'avg_vol',
        sortable: true,
        headerName: 'Avg Volume (30D)',
        valueFormatter: function(params) {
          return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        maxWidth: 165,
    },
    {
        field: 'call_vol_pct',
        sortable: true,
        headerName: 'Call %',
        valueFormatter: function(params) {
          return params.value.toFixed(2) + "%";
        },
        cellRenderer: 'agAnimateShowChangeCellRenderer',
        maxWidth: 100,
    },
    {
        field: 'call_vol_pct_chng',
        sortable: true,
        headerName: '🟢CHNG',
        hide: false,
        valueFormatter: function(params) {
          return params.value > 0 ? "↑ " + params.value.toFixed(2) + "%" : "↓ " + params.value.toFixed(2) + "%";
        },
        cellStyle: function(params) {
          return params.value > 0 ? {'color': 'green'} : {'color': 'red'};
        },
        maxWidth: 155,
    },
    {
        field: 'put_vol_pct',
        sortable: true,
        headerName: 'Put %',
        valueFormatter: function(params) {
          return params.value.toFixed(2) + "%";
        },
        cellRenderer: 'agAnimateShowChangeCellRenderer',
        maxWidth: 100,
    },
    {
        field: 'put_vol_pct_chng',
        sortable: true,
        headerName: 'CHNG',
        hide: false,
        valueFormatter: function(params) {
          return params.value > 0 ? "↑ " + params.value.toFixed(2) + "%" : "↓ " + params.value.toFixed(2) + "%";
        },
        cellStyle: function(params) {
          return params.value > 0 ? {'color': 'green'} : {'color': 'red'};
        },
        maxWidth: 155,
    }
    ]
  ,
};

// Create Grid: Create new grid within the #myGrid div, using the Grid Options object
gridApi = agGrid.createGrid(document.querySelector("#volume_grid"), gridOptions);

// Fetch Remote Data
fetch("data/vol_cp.json")
  .then((response) => response.json())
  .then((data) => gridApi.setGridOption("rowData", data));