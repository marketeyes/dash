// Grid API: Access to Grid API methods
// let gridApi;


const FILE_PATH = "../data/contracts/all_cp.json"

// Rounding Function 
function round(num) {
    return +(Math.round(num + "e+2")  + "e-2");
}

function arrow_format(num){
  return num > 0 ? "↑ " + round(100 * num) + "%" : "↓ " + round(100 * num) + "%";
}

const grid_definitions = [
  {
      field: 'stock',
      sortable: true,
      headerName: 'Stock',
      valueFormatter: function(params) {
        return "$" + params.value.toUpperCase();
      },
      //maxWidth: 95,
      pinned: 'left',
      lockPinned: true,
      cellClass: 'lock-pinned'
  },
  { 
      headerName: "Volume", 
      children: [
                {
                    columnGroupShow: 'closed', 
                    field: 'total_vol',
                    sortable: true,
                    headerName: 'Total',
                    valueFormatter: function(params) {
                      return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    },
                    //maxWidth: 110,
                },
                {
                  columnGroupShow: 'closed', 
                    field: 'avg_vol',
                    sortable: true,
                    headerName: 'AvgVol(30D)',
                    valueFormatter: function(params) {
                      return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    },
                    //maxWidth: 110,
                },
                {
                  columnGroupShow: 'open', 
                  field:'call_vol',
                  sortable: true,
                  headerName: 'Calls',
                  valueFormatter: function(params) {
                    // return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " (" + params.node.data.call_vol_chng.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ")";
                    return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  },
                  // Highlight the cell green if call_vol_chng > 0 and red if call_vol_chng < 0
                  cellStyle: function(params) {
                    return params.node.data.call_vol_chng > 0 ? {'color': 'green'} : {'color': 'red'};
                  },
                },
                {
                  columnGroupShow: 'open', 
                  field: 'call_vol_chng',
                  sortable: true,
                  headerName: 'Call Vol Chng', 
                  valueFormatter: function(params) {
                    return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                  },
                  hide: true,
                },
                {
                  columnGroupShow: 'open', 
                  field:'put_vol',
                  sortable: true,
                  headerName: 'Puts',
                  valueFormatter: function(params) {
                    return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                  },
                  cellStyle: function(params) {
                    return params.node.data.put_vol_chng > 0 ? {'color': 'green'} : {'color': 'red'};
                  }
                },
                {
                  columnGroupShow: 'open', 
                  field: 'put_vol_chng',
                  sortable: true,
                  headerName: 'Put Vol Chng', 
                  valueFormatter: function(params) {
                    return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                  },
                  hide:true, 
                },
                {
                  columnGroupShow: 'open', 
                    field: 'call_vol_pct',
                    sortable: true,
                    headerName: 'Call %',
                    valueFormatter: function(params) {
                      p = round(100 * params.value) + "%" ;
                      g = round(100 * params.node.data.call_vol_pct_chng)
                      gF = g > 0 ? "↑ " + g + "%" : "↓ " + g + "%";
                      return p + " (" + gF + ")";
                    },
                    cellStyle: function(params) {
                      return params.node.data.call_vol_pct_chng > 0 ? {'color': 'green'} : {'color': 'red'};
                    }
                    //maxWidth: 100,
                },
                {
                  columnGroupShow: 'open', 
                    field: 'put_vol_pct',
                    sortable: true,
                    headerName: 'Put %',
                    valueFormatter: function(params) {
                      p = round(100 * params.value) + "%" ;
                      g = round(100 * params.node.data.put_vol_pct_chng)
                      gF = g > 0 ? "↑ " + g + "%" : "↓ " + g + "%";
                      return p + " (" + gF + ")";
                    },
                    cellStyle: function(params) {
                      return params.node.data.put_vol_pct_chng > 0 ? {'color': 'green'} : {'color': 'red'};
                    }
                    //maxWidth: 100,
                },
                {
                  columnGroupShow: 'open', 
                  field: 'call_vol_pct_chng',
                  sortable: true,
                  headerName: '🟢CHNG',
                  hide: true,
                  valueFormatter: function(params) {
                    return params.value > 0 ? "↑ " + round(100 * params.value) + "%" : "↓ " + round(100 * params.value) + "%";
                  },
                  cellStyle: function(params) {
                    return params.value > 0 ? {'color': 'green'} : {'color': 'red'};
                  },
                  //maxWidth: 100,
                },
                {
                  columnGroupShow: 'open', 
                    field: 'put_vol_pct_chng',
                    sortable: true,
                    headerName: '🔴CHNG',
                    hide: true,
                    valueFormatter: function(params) {
                        return params.value > 0 ? "↑ " +  round(100 * params.value) + "%" : "↓ " + round(100 * params.value) + "%";
                    },
                    cellStyle: function(params) {
                      return params.value > 0 ? {'color': 'green'} : {'color': 'red'};
                    },
                    //maxWidth: 100,
                },
            ]
  },
  {
    headerName: "Open Interest",
    children:[
          {
            columnGroupShow: 'closed', 
            field: 'total_oi',
            sortable: true,
            headerName: 'Total',
            valueFormatter: function(params) {
              return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            },
            filter: "agNumberColumnFilter",
            filterValueGetter: function(params) {
              return params.value; // Removed extra parenthesis
            },
            filterParams: {
              filterOptions: ['lessThan', 'greaterThan', 'inRange']
            },
            editable: true,
            //maxWidth: 110,
          },
          {
            columnGroupShow: 'closed', 
            field: 'avg_oi',
            sortable: true,
            headerName: 'AvgOI(30D)',
            valueFormatter: function(params) {
              return params.value !== null ? params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "-";
            },
            //maxWidth: 110,
            hide: false,
          },
          {
            columnGroupShow: 'open', 
            field: 'call_oi',
            sortable: true,
            headerName: 'Calls',
            valueFormatter: function(params) {
              // return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " (" + params.node.data.call_vol_chng.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ")";
              return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            },
            // Highlight the cell green if call_vol_chng > 0 and red if call_vol_chng < 0
            cellStyle: function(params) {
              return params.node.data.call_oi_chng > 0 ? {'color': 'green'} : {'color': 'red'};
            },
            //maxWidth: 120,
          },
          {
            columnGroupShow: 'open', 
            field: 'call_oi_chng',
            sortable: true,
            headerName: 'CallChng',
            valueFormatter: function(params) {
              return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            },
            hide:true, 
            //maxWidth: 120,
          },
          {
            columnGroupShow: 'open', 
            field: 'put_oi',
            sortable: true,
            headerName: 'Puts',
            valueFormatter: function(params) {
              // return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " (" + params.node.data.put_oi_chng.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ")";
              return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            },
            // Highlight the cell green if call_vol_chng > 0 and red if call_vol_chng < 0
            cellStyle: function(params) {
              return params.node.data.put_oi_chng > 0 ? {'color': 'green'} : {'color': 'red'};
            },
            //maxWidth: 110,
          },
          {
            columnGroupShow: 'open', 
            field: 'put_oi_chng',
            sortable: true,
            headerName: 'PutCHNG',
            valueFormatter: function(params) {
              return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            },
            hide:true, 
            //maxWidth: 120,
          },
          {
            columnGroupShow: 'open', 
            field: 'call_oi_pct',
            sortable: true,
            headerName: 'CallOI%',
            valueFormatter: function(params) {
              p = round(100 * params.value) + "%" ;
              g = round(100 * params.node.data.call_oi_pct_chng)
              gF = g > 0 ? "↑ " + g + "%" : "↓ " + g + "%";
              return p + " (" + gF + ")";
            },
            cellStyle: function(params) {
              return params.node.data.call_oi_pct_chng > 0 ? {'color': 'green'} : {'color': 'red'};
            },
            //maxWidth: 100,
            //maxWidth: 95,
          },
          {
            columnGroupShow: 'open', 
            field: 'put_oi_pct',
            sortable: true,
            headerName: 'PutOI%',
            valueFormatter: function(params) {
              return round(100 * params.value) + "%";
            },
            valueFormatter: function(params) {
              p = round(100 * params.value) + "%" ;
              g = round(100 * params.node.data.put_oi_pct_chng)
              gF = g > 0 ? "↑ " + g + "%" : "↓ " + g + "%";
              return p + " (" + gF + ")";
            },
            cellStyle: function(params) {
              return params.node.data.put_oi_pct_chng > 0 ? {'color': 'green'} : {'color': 'red'};
            },
            //maxWidth: 95,
          },
          {
            columnGroupShow: 'open', 
            field: 'call_oi_pct_chng',
            sortable: true,
            headerName: '🟢OICHNG',
            hide: false,
            valueFormatter: function(params) {
              return params.value > 0 ? "↑ " + round(100 * params.value) + "%" : "↓ " + round(100 * params.value) + "%";
            },
            cellStyle: function(params) {
              return params.value > 0 ? {'color': 'green'} : {'color': 'red'};
            },
            hide:true, 
            //maxWidth: 105,
          },
          {
            columnGroupShow: 'open', 
            field: 'put_oi_pct_chng',
            sortable: true,
            headerName: '🔴OICHNG',
            hide: false,
            valueFormatter: function(params) {
              return params.value > 0 ? "↑ " + round(100 * params.value) + "%" : "↓ " + round(100 * params.value) + "%";
            },
            cellStyle: function(params) {
              return params.value > 0 ? {'color': 'green'} : {'color': 'red'};
            },
            hide:true, 
            //maxWidth: 105,
          }
        ]},
]



// Grid Options: Contains all of the grid configurations
const gridOptions = {
  // Data to be displayed
  rowData: [],
  // Columns to be displayed (Should match rowData properties)
  columnDefs: grid_definitions,
  defaultColDef: {
    filter: true,
  },
  autoSizeStrategy: {
    type: 'fitCellContents'
  },
};

// Create Grid: Create new grid within the #myGrid div, using the Grid Options object
volGrid = agGrid.createGrid(document.querySelector("#volume_grid"), gridOptions);

// Fetch Remote Data
fetch(FILE_PATH)
.then((response) => response.json())
.then((data) => volGrid.setGridOption("rowData", data))
.then(() => volGrid.applyColumnState({state: [{colId: 'total_vol',sort: 'desc',}],defaultState: { sort: null }}));

// Return the stocks that have a higher total volume than the average volume
function getHighVolumeStocks() {
  // Get the rowData from the grid
  const rowData = volGrid.getGridOption("rowData");
  // Filter the rowData to only include stocks with a higher total volume than the average volume
  const highVolumeStocks = rowData.filter((stock) => stock.total_vol > 2 * stock.avg_vol);
  // Print the stocks to the object with id = stocks
    // return only the stock name; add $ and convert to uppercase
    const stockNames = highVolumeStocks.map(stock => "$" + stock.stock.toUpperCase());
    // document.getElementById("highvol").innerText = stockNames.join(", ");
    volGrid.setGridOption("rowData", highVolumeStocks);
    volGrid.applyColumnState({state: [{colId: 'total_vol',sort: 'desc',}],defaultState: { sort: null }});
    return stockNames;
}

function sortcallvol(){
    volGrid.applyColumnState({state: [{colId: 'call_vol_pct_chng',sort: 'desc',}],defaultState: { sort: null }});
}

function sortputvol(){
    volGrid.applyColumnState({state: [{colId: 'put_vol_pct_chng',sort: 'desc',}],defaultState: { sort: null }});
}
function getHighOpenInterestStocks(){
    const rowData = oiGrid.getGridOption("rowData");
    const highOIStocks = rowData.filter((stock) => stock.total_oi > 1.5 * stock.avg_oi);
    const stockNames = highOIStocks.map(stock => "$" + stock.stock.toUpperCase());
    volGrid.setGridOption("rowData", highOIStocks);
    // return stockNames;
}

function sortcalloi(){
    volGrid.applyColumnState({state: [{colId: 'call_oi_pct_chng',sort: 'desc',}],defaultState: { sort: null }});
}

function sortputoi(){
    volGrid.applyColumnState({state: [{colId: 'put_oi_pct_chng',sort: 'desc',}],defaultState: { sort: null }});
}

function resetVolume(){
  fetch(FILE_PATH)
      .then((response) => response.json())
      .then((data) => volGrid.setGridOption("rowData", data));
      // document.getElementById("resetvol").innerText = "";
}
