// 
// Grid API: Access to Grid API methods
let gridApi;

// Rounding Function 
function round(num) {
    return +(Math.round(num + "e+2")  + "e-2");
}

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
            return round(100 * params.value) + "%";
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
          return params.value > 0 ? "↑ " + round(100 * params.value) + "%" : "↓ " + round(100 * params.value) + "%";
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
          return round(100 * params.value) + "%";
        },
        cellRenderer: 'agAnimateShowChangeCellRenderer',
        maxWidth: 100,
    },
    {
        field: 'put_vol_pct_chng',
        sortable: true,
        headerName: '🔴CHNG',
        hide: false,
        valueFormatter: function(params) {
            return params.value > 0 ? "↑ " +  round(100 * params.value) + "%" : "↓ " + round(100 * params.value) + "%";
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



// Return the stocks that have a higher total volume than the average volume
function getHighVolumeStocks() {
  // Get the rowData from the grid
  const rowData = gridApi.getGridOption("rowData");
  // Filter the rowData to only include stocks with a higher total volume than the average volume
  const highVolumeStocks = rowData.filter((stock) => stock.total_vol > 2 * stock.avg_vol);
  // Print the stocks to the object with id = stocks
    // return only the stock name; add $ and convert to uppercase
    const stockNames = highVolumeStocks.map(stock => "$" + stock.stock.toUpperCase());
    // document.getElementById("highvol").innerText = stockNames.join(", ");
    // Update the grid to show only the high volume stocks
    gridApi.setGridOption("rowData", highVolumeStocks);
    return stockNames;
}

function sortcallvol(){
    gridApi.applyColumnState({state: [{colId: 'call_vol_pct_chng',sort: 'desc',}],defaultState: { sort: null }});
}

function sortputvol(){
    gridApi.applyColumnState({state: [{colId: 'put_vol_pct_chng',sort: 'desc',}],defaultState: { sort: null }});
}

function resetVolume(){
    fetch("data/vol_cp.json")
        .then((response) => response.json())
        .then((data) => gridApi.setGridOption("rowData", data));
        // document.getElementById("resetvol").innerText = "";
}
